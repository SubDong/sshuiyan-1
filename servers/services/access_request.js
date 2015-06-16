/**
 * Created by perfection on 2015-5-20.
 * @deprecated
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

/**
 * pv
 * @param result
 * @returns {{label: string, key: Array, quota: Array}}
 *
 * @deprecated
 */
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

/**
 * uv
 * @param result
 * @returns {{label: string, key: Array, quota: Array}}
 *
 * @deprecated
 */
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

/**
 * 入口页查询结果解析
 * @param result
 * @returns {{label: string, key: Array, quota: Array}}
 *
 * @deprecated
 */
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

/**
 *
 * @deprecated
 */
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
    exchangeSearch: function (es, indexs, type, pathUp, pathDown, address, callbackFn) {
        // TODO why not use switch case
        var checkAddress = function () {
            if (address == "null") {
                return {
                    "match_all": {}
                }
            } else {
                switch (pathDown) {
                    case "path1":
                        return {
                            "match": {
                                "path1": address
                            }
                        };
                    case "path2":
                        return {
                            "match": {
                                "path2": address
                            }
                        };
                    case "path3":
                        return {
                            "match": {
                                "path3": address
                            }
                        };
                    case "path4":
                        return {
                            "match": {
                                "path4": address
                            }
                        };
                    default :
                        return {
                            "match_all": {}
                        };


                }
            }
        };
        var request = {
            index: indexs,
            type: type,
            body: {
                "size": 0,
                "query": checkAddress(),
                "aggs": {
                    "pv_uv": {
                        "terms": {
                            "field": "_type"
                        },
                        "aggs": {
                            "path0": {
                                "terms": {
                                    "field": pathUp
                                },
                                "aggs": {
                                    "path1": {
                                        "terms": {
                                            "field": pathDown
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
                            }
                        }
                    }
                }
            }
        };
        es.search(request, function (error, response) {
            var data = [];
            var path1Data = [];
            if (response.status == 404) {
                callbackFn(response.error.split("[")[2].split("]")[0]);
            }
            if (response != undefined && response.aggregations != undefined) {
                var result = response.aggregations.pv_uv.buckets;
                for (var i = 0; i < result.length; i++) {
                    for (var c = 0; c < result[i].path0.buckets.length; c++) {
                        path1Data = [];
                        for (var k = 0; k < result[i].path0.buckets[c].path1.buckets.length; k++) {
                            path1Data.push({
                                "pv": result[i].path0.buckets[c].path1.buckets[k].pv.value,
                                "uv": result[i].path0.buckets[c].path1.buckets[k].uv.value,
                                "pathName": result[i].path0.buckets[c].path1.buckets[k].key,
                                "pathUp": pathDown,
                                "id": result[i].key,
                                "order_id": k
                            });
                        }
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
    // TODO 为什么不按照指标来进行统一处理
    trafficmapSearch: function (es, indexs, targetPathName, callbackFn) {
        var request = {
            index: indexs,
            type: null,
            body: {
                "size": 0,
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
                        }
                    },
                    "all_uv": {
                        "cardinality": {
                            "field": "tt"
                        }
                    },
                    "target_pv_uv": {
                        "filters": {
                            "filters": {
                                "data": {
                                    "term": {
                                        "loc": targetPathName
                                    }
                                },
                                "data1": {
                                    "bool": {
                                        "must": {
                                            "term": {
                                                "loc": targetPathName
                                            }
                                        },
                                        "must_not": {
                                            "term": {
                                                "rf": "-"
                                            }
                                        }
                                    }
                                },
                                "data2": {
                                    "term": {
                                        "rf": targetPathName
                                    }
                                }
                            }
                        },
                        "aggs": {
                            "pv": {
                                "value_count": {
                                    "field": "loc"
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

        es.search(request, function (error, response) {
            var data = [];
            var targetPathData = {};
            var out_siteData = {};
            var results = {};

            if (response.status == 404) {
                callbackFn(response.error.split("[")[2].split("]")[0]);
            }
            if (response != undefined && response.aggregations != undefined) {
                var result = response.aggregations;
                var mostOfResult = result.se_pv_uv.buckets;
                for (var i = 0; i < mostOfResult.length; i++) {
                    data.push({
                        "pathName": mostOfResult[i].key,
                        "pv": mostOfResult[i].pv.value,
                        "uv": ((Number(mostOfResult[i].uv.value) / Number(result.all_uv.value)) * 100).toFixed(2) + "%"
                    });
                }
                if (result.target_pv_uv.buckets.data1.pv.value == 0) {
                    targetPathData = {
                        pathname: targetPathName,
                        pv_proportion: "0%",
                        uv_proportion: "0%",
                        pv: result.target_pv_uv.buckets.data1.pv.value
                    }
                } else {
                    targetPathData = {
                        pathname: targetPathName,
                        pv_proportion: ((Number(result.target_pv_uv.buckets.data1.pv.value) / Number(result.target_pv_uv.buckets.data.pv.value)) * 100).toFixed(2) + "%",
                        uv_proportion: ((Number(result.target_pv_uv.buckets.data1.uv.value) / Number(result.target_pv_uv.buckets.data.uv.value)) * 100).toFixed(2) + "%",
                        pv: result.target_pv_uv.buckets.data1.pv.value
                    }
                }
                if (result.target_pv_uv.buckets.data.pv.value == 0) {
                    out_siteData = {
                        pv_proportion: "0%",
                        uv_proportion: "0%"
                    }
                } else {
                    out_siteData = {
                        pv_proportion: (((Number(result.target_pv_uv.buckets.data.pv.value) - Number(result.target_pv_uv.buckets.data2.pv.value)) / Number(result.target_pv_uv.buckets.data.pv.value)) * 100).toFixed(2) + "%",
                        uv_proportion: (((Number(result.target_pv_uv.buckets.data.uv.value) - Number(result.target_pv_uv.buckets.data2.uv.value)) / Number(result.target_pv_uv.buckets.data.uv.value)) * 100).toFixed(2) + "%"
                    }
                }

                results = {
                    data: data,
                    targetPathData: targetPathData,
                    out_siteData: out_siteData
                };
                callbackFn(results);
            } else
                callbackFn(results);
        });
    }

    ,
    // TODO 为什么不按照指标来进行统一处理
    offsitelinksSearch: function (es, indexs, targetPathName, callbackFn) {
        var request = {
            index: indexs,
            type: null,
            body: {
                "size": 0,
                "aggs": {
                    "all_pv": {
                        "filters": {
                            "filters": {
                                "data": {
                                    "term": {
                                        "loc": targetPathName
                                    }
                                }
                            }
                        },
                        "aggs": {
                            "pv": {
                                "value_count": {
                                    "field": "rf"
                                }
                            }
                        }
                    },
                    "in_pv": {
                        "filters": {
                            "filters": {
                                "data": {
                                    "bool": {
                                        "must": {
                                            "term": {
                                                "loc": targetPathName
                                            }
                                        }

                                    }
                                }
                            }
                        },
                        "aggs": {
                            "filtered_data": {
                                "terms": {
                                    "field": "dm"
                                },
                                "aggs": {
                                    "pv": {
                                        "value_count": {
                                            "field": "rf"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "out_pv": {
                        "filters": {
                            "filters": {
                                "data": {
                                    "bool": {
                                        "must": [
                                            {
                                                "range": {
                                                    "rf_type": {
                                                        "gt": "0",
                                                        "lt": "3"
                                                    }
                                                }
                                            },
                                            {
                                                "term": {
                                                    "rf": targetPathName
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        "aggs": {
                            "filtered_data": {
                                "terms": {
                                    "field": "loc"
                                },
                                "aggs": {
                                    "pv": {
                                        "value_count": {
                                            "field": "loc"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        es.search(request, function (error, response) {
            var data = [];//总结果
            var targetPathName_pv = [];//监控目标的pv
            var in_data = [];//进过其他页面跳入的监控目标页面的pv
            var out_data = [];//流经监控目标的pv
            var out_site = [];//离站占比
            if (response.status == 404) {
                callbackFn(response.error.split("[")[2].split("]")[0]);
            }
            if (response != undefined && response.aggregations != undefined) {
                var result = response.aggregations;
                targetPathName_pv.push({
                    "pathname": targetPathName,
                    "pv": result.all_pv.buckets.data.pv.value
                });
                var in_pv_sum = 0;
                for (var i = 0; i < result.in_pv.buckets.data.filtered_data.buckets.length; i++) {
                    in_pv_sum += Number(result.in_pv.buckets.data.filtered_data.buckets[i].pv.value);
                    in_data.push({
                        "pathname": result.in_pv.buckets.data.filtered_data.buckets[i].key,
                        "proportion": ((Number(result.in_pv.buckets.data.filtered_data.buckets[i].pv.value) / Number(result.all_pv.buckets.data.pv.value)) * 100).toFixed(2) + "%",
                        "pv": result.in_pv.buckets.data.filtered_data.buckets[i].pv.value
                    });
                }
                if (in_pv_sum < Number(targetPathName_pv[0].pv)) {
                    in_data.push({
                        "pathname": "直接输入网址",
                        "proportion": (Number(result.all_pv.buckets.data.pv.value) - in_pv_sum) / Number(result.all_pv.buckets.data.pv.value) + "%",
                        "pv": (Number(result.all_pv.buckets.data.pv.value) - in_pv_sum)
                    })
                }
                var out_pv_sum = 0;
                for (var i = 0; i < result.out_pv.buckets.data.filtered_data.buckets.length; i++) {
                    out_data.push({
                        "pathname": result.out_pv.buckets.data.filtered_data.buckets[i].key,
                        "proportion": ((Number(result.out_pv.buckets.data.filtered_data.buckets[i].pv.value) / Number(result.all_pv.buckets.data.pv.value)) * 100).toFixed(2) + "%",
                        "pv": result.out_pv.buckets.data.filtered_data.buckets[i].pv.value
                    });
                    out_pv_sum += Number(result.out_pv.buckets.data.filtered_data.buckets[i].pv.value);
                }

                if (out_pv_sum == 0) {
                    out_site.push({
                        "proportion": "100%"
                    });
                } else if (out_pv_sum == Number(result.all_pv.buckets.data.pv.value)) {
                    out_site.push({
                        "proportion": "0%"
                    });
                } else {
                    out_site.push({
                        "proportion": (((Number(result.all_pv.buckets.data.pv.value) - out_pv_sum) / Number(result.all_pv.buckets.data.pv.value)) * 100).toFixed(2) + "%"
                    });
                }

                data.push({
                    "targetPathName_pv": targetPathName_pv,
                    "in_data": in_data,
                    "out_data": out_data,
                    "out_site": out_site
                });
                callbackFn(data);

            } else
                callbackFn(data);
        });
    }
    ,
    modalInstanceSearch: function (es, type, callbackFn) {
        var request = {
            index: null,
            type: type,
            body: {
                "size": 0,
                "aggs": {
                    "monitorPath": {
                        "terms": {
                            "field": "loc"
                        }
                    }
                }
            }
        }
        es.search(request, function (error, response) {
            var data = [];
            if (response != undefined && response.aggregations != undefined) {
                var result = response.aggregations.monitorPath.buckets;
                for (var i = 0; i < result.length; i++) {
                    data.push({
                        monitorPath: result[i].key
                    });
                }
                callbackFn(data);
            } else
                callbackFn(data);
        });
    }

};
var requestBodyBoolForPathName = function (value) {
    var data = value.split(",");
    var requestSentence = [];
    for (var i = 0; i < data.length; i++) {
        requestSentence.push({
            term: {
                "loc": data[i]
            }
        });

    }
    return requestSentence;
}
var exchangeField = function (value) {
    if (value.indexOf(",") == -1) {
        return "loc";
    } else {
        return "_type";
    }
}
module.exports = access_request;