/**
 * Created by dolphineor on 2015-5-20.
 */

var buildQuery = function (filters, start, end) {
    var mustQuery = [
        {
            "range": {
                "utime": {
                    "gte": start,
                    "lte": end,
                    "time_zone": "+8:00"
                }
            }
        }
    ];

    if (filters != null) {
        filters.forEach(function (filter) {
            mustQuery.push({
                "terms": filter
            });
        });
    }

    return {
        "bool": {
            "must": mustQuery
        }
    }
};

// pv
var pvFn = function (result) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var pv = result[i].pv_aggs.value;
        Array.prototype.push.call(keyArr, result[i].key);
        Array.prototype.push.call(quotaArr, pv);
    }

    return {
        "label": "pv",
        "key": keyArr,
        "quota": quotaArr
    };
};

// uv
var uvFn = function (result) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var uv = result[i].uv_aggs.value;
        keyArr.push(result[i].key);
        quotaArr.push(uv);
    }

    return {
        "label": "uv",
        "key": keyArr,
        "quota": quotaArr
    };
};

// 入口页查询结果解析
var entranceFn = function (result) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var uv = result[i].entrance_aggs.value;
        keyArr.push(result[i].key);
        quotaArr.push(uv);
    }

    return {
        "label": "entrance",
        "key": keyArr,
        "quota": quotaArr
    };
};

// 目前查询仅适用于页面分析模块中受访页面的入口页
var access_request = {
    search: function (es, indexes, type, quotas, dimension, filters, start, end, callbackFn) {
        var request = {
            "index": indexes,
            "type": type,
            "body": {
                "query": buildQuery(filters),
                "size": 0,
                "aggs": {
                    "url_group": {
                        "terms": {
                            "field": "loc"
                        },
                        "aggs": {
                            "pv_aggs": {
                                "sum": {
                                    "script": "1"
                                }
                            },
                            "uv_aggs": {
                                "cardinality": {
                                    "field": "tt"
                                }
                            },
                            "entrance_aggs": {
                                "sum": {
                                    "script": "e = 0; if (doc['entrance'].value == 1) {e = 1}; e"
                                }
                            }
                        }
                    }
                }
            }
        };


        es.search(request, function (error, response) {
            var data = [];
            if (response != undefined && response.aggregations != undefined) {
                var result = response.aggregations.url_group.buckets;

                quotas.forEach(function (quota) {
                    switch (quota) {
                        case "pv":
                            data.push(pvFn(result));
                            break;
                        case "uv":
                            data.push(uvFn(result));
                            break;
                        case "entrance":
                            data.push(entranceFn(result));
                            break;
                        default :
                            break;
                    }
                });

                callbackFn(data);
            } else
                callbackFn(data);
        });
    },
    //exchangeSearch: function (es, indexs, type, callbackFn) {
    //    var request = {
    //        "index": indexs,
    //        "type": type,
    //        "body": {
    //            "size": 0,
    //            "aggs": {
    //                "aggs_pv": {
    //                    "terms": {
    //                        "field": "_type"
    //                    },
    //                    "aggs": {
    //                        "pv": {
    //                            "sum": {
    //                                "script": "1"
    //                            }
    //                        }
    //                    }
    //                },
    //                "uv": {
    //                    "cardinality": {
    //                        "field": "tt"
    //                    }
    //                }
    //            }
    //        }
    //    }
    //    es.search(request, function (error, response) {
    //        var data = [];
    //        if (response != undefined && response.aggregations != undefined) {
    //            var result = response.aggregations;
    //            data.push({"pv": result.aggs_pv.buckets[0].pv.value, "uv": result.uv.value});
    //            callbackFn(data);
    //        } else
    //            callbackFn(data);
    //    });
    //},
    exchangeSearch: function (es, indexs, type, callbackFn) {
        var request = {
            index: indexs,
            type: type,
            body: {
                "size": 0,
                "aggs": {
                    "pv_uv": {
                        "terms": {
                            "field": "_type"
                        },
                        "aggs": {
                            "path0": {
                                "terms": {
                                    "field": "path0"
                                },
                                "aggs": {
                                    "path1": {
                                        "terms": {
                                            "field": "path1"
                                        },
                                        "aggs": {
                                            "path2": {
                                                "terms": {
                                                    "field": "path2"
                                                },
                                                "aggs": {
                                                    "pv": {
                                                        "sum": {
                                                            "script": "1"
                                                        }
                                                    },
                                                    "uv": {
                                                        "cardinality": {
                                                            "field": "tt"
                                                        }
                                                    }
                                                }
                                            },
                                            "pv": {
                                                "sum": {
                                                    "script": "1"
                                                }
                                            },
                                            "uv": {
                                                "cardinality": {
                                                    "field": "tt"
                                                }
                                            }
                                        }
                                    },
                                    "pv": {
                                        "sum": {
                                            "script": "1"
                                        }
                                    },
                                    "uv": {
                                        "cardinality": {
                                            "field": "tt"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        es.search(request, function (error, response) {
            var data = [];
            var path1Data = [];
            if (response != undefined && response.aggregations != undefined) {
                var result = response.aggregations.pv_uv.buckets;
                for (var i = 0; i < result.length; i++) {
                    for (var c = 0; c < result[i].path0.buckets.length; c++) {
                        path1Data = [];
                        for (var k = 0; k < result[i].path0.buckets[c].path1.buckets.length; k++) {
                            path1Data.push({
                                "pv": result[i].path0.buckets[c].path1.buckets[k].pv.value,
                                "uv": result[i].path0.buckets[c].path1.buckets[k].uv.value,
                                "pathName": result[i].path0.buckets[c].path1.buckets[k].key
                            });
                        }
                        console.log("pv:" + result[i].key);
                        data.push({
                            "pv": result[i].path0.buckets[c].pv.value,
                            "uv": result[i].path0.buckets[c].pv.value,
                            "pathName": result[i].path0.buckets[c].key,
                            "path1": path1Data,
                            "id": result[i].key
                        });
                    }

                }
                callbackFn(data);
            } else
                callbackFn(data);
        });
    },
    trafficmapSearch: function (es, indexs, callbackFn) {
        var request = {
            index:indexs,
            type:null,
            body:{
                "aggs": {
                    "se_pv_uv": {
                        "terms": {
                            "field": "se"
                        },
                        "aggs": {
                            "pv": {
                                "sum": {
                                    "script": "1"
                                }
                            },
                            "uv": {
                                "cardinality": {
                                    "field": "tt"
                                }
                            }
                            //"test": {
                            //    "terms": {
                            //        "script": ""
                            //    }
                            //}
                        }
                    },
                    "all_uv": {
                        "cardinality": {
                            "field": "tt"
                        }
                    }
                }
            }
        }
        es.search(request, function (error, response) {
            var data = [];
            var path1Data = [];
            if (response != undefined && response.aggregations != undefined) {
                var result = response.aggregations;
                var mostOfResult = result.se_pv_uv.buckets;
                for(var i = 0;i<mostOfResult.length;i++){
                    data.push({"pathName":mostOfResult[i].key,"pv":mostOfResult[i].pv.value,"uv":((Number(mostOfResult[i].uv.value)/Number(result.all_uv.value))*100).toFixed(2)+"%"});
                }
                callbackFn(data);
            } else
                callbackFn(data);
        });
    }

};
var exchangeField = function (value) {
    if (value.indexOf(",") == -1) {
        return "loc";
    } else {
        return "_type";
    }
}
module.exports = access_request;