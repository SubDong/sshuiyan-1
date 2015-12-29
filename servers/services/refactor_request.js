/**
 * Created by dolphineor on 2015-6-4.
 *
 * refactor, elasticsearch query migrate to access.
 */
var cacheutils = require('../utils/cacheutils');

var _new_visitor_aggs = {
    "filter": {
        "term": {
            "ct": 0
        }
    },
    "aggs": {
        "new_visitor_aggs": {
            "cardinality": {
                "field": "_ucv"
            }
        }
    }
};

var _vc_aggs = {
    //"aggs": {
    //    "vc_aggs": {
            "cardinality": {
                "field": "tt"
            }
        //}
    //}
};

var es_aggs = {
    // 浏览量
    "pv": {
        "pv_aggs": {
            "value_count": {
                "field": "_type"
            }
        }
    },
    // 贡献浏览量
    "contribution": {
        "cpv_aggs": {
            "filter": {
                "term": {
                    "entrance": "1"
                }
            },
            "aggs": {
                "cpv_aggs": {
                    "value_count": {
                        "field": "entrance"
                    }
                }
            }
        }
    },
    // 访客数
    "uv": {
        "uv_aggs": {
            "cardinality": {
                "field": "_ucv"
            }
        }
    },
    // 访问次数
    "vc": {
        "vc_aggs": _vc_aggs
    },
    // 跳出率
    "outRate": {
        "single_visitor_aggs": {
            "filter": {
                "term": {
                    "entrance": "1"
                }
            },
            "aggs": {
                "single_visitor_aggs": {
                    "terms": {
                        "field": "tt",
                        "size": 0,
                        "min_doc_count": 2
                    }
                }
            }
        },
        "vc_aggs": _vc_aggs
    },
    "svc": {
        "single_visitor_aggs": {
            "filter": {
                "term": {
                    "entrance": "1"
                }
            },
            "aggs": {
                "single_visitor_aggs": {
                    "terms": {
                        "field": "tt",
                        "size": 0,
                        "min_doc_count": 2
                    }
                }
            }
        },
        "vc_aggs": _vc_aggs
    },
    // 平均访问时长
    "avgTime": {
        "tvt_aggs": {
            "terms": {
                "field": "tt",
                "size": 0
            },
            "aggs": {
                "min_aggs": {
                    "min": {
                        "field": "utime"
                    }
                },
                "max_aggs": {
                    "max": {
                        "field": "utime"
                    }
                }
            }
        },
        "vc_aggs": _vc_aggs
    },
    // 新访客数
    "nuv": {
        "new_visitor_aggs": _new_visitor_aggs
    },
    // 新访客比率
    "nuvRate": {
        "new_visitor_aggs": _new_visitor_aggs,
        "uv_aggs": {
            "cardinality": {
                "field": "tt"
            }
        }
    },
    // 平均访问页数
    "avgPage": {
        "pv_aggs": {
            "value_count": {
                "field": "_type"
            }
        },
        "vc_aggs": _vc_aggs
    },
    // IP数
    "ip": {
        "ip_aggs": {
            "filter": {
                "term": {
                    "ip_dupli": 1
                }
            },
            "aggs": {
                "ip_aggs1": {
                    "value_count": {
                        "field": "remote"
                    }
                }
            }
        }
    },
    // 抵达率=访问次数/点击量
    "arrivedRate": {
        "vc_aggs": _vc_aggs
    },
    // 转化次数
    "conversions": {},
    "entrance": {
        "entrance": {
            "filter": {
                "term": {
                    "entrance": "1"
                }
            }
        }
    },
    // TODO 页面转化
    "pageConversion": {},
    // TODO 事件转化
    "eventConversion": {}
};

var buildMustQuery = function (filters) {
    var mustQuery = [];

    if (filters != null) {
        filters.forEach(function (filter) {
            if(filter["loc"]!=undefined){//bug #832改成模糊查询
                var value = filter["loc"];
                mustQuery.push({
                    "wildcard": {
                        "loc": "*"+JSON.stringify(value[0]).replace(/\"/g,"")+"*"
                    }
                });
            }else{

                if (JSON.stringify(filter) == "{\"entrance\":\"entrancetrue\"}") {
                    mustQuery.push({
                        "term": {
                            "entrance": 1
                        }
                    });
                } else {
                    mustQuery.push({
                        "terms": filter
                    });
                }

            }
        });
    }

    return mustQuery;
};

var buildQuery = function (filters) {
    return {
        "bool": {
            "must": buildMustQuery(filters)
        }
    }
};


var buildRequest = function (indexes, type, quotas, dimension, filters, start, end, interval) {
    var _aggs = {};

    quotas.forEach(function (quota) {
        for (var key in es_aggs[quota]) {
            _aggs[key] = es_aggs[quota][key];
        }
    });

    if (dimension == null) {
        if (interval == 0)  // 此时统计三十分钟以内的数据
            return {
                "index": indexes.toString(),
                "type": type,
                "body": {
                    "query": buildQuery(filters),
                    "size": 0,
                    "aggs": {
                        "result": {
                            "filter": {
                                "range": {
                                    "utime": {"gte": start, "lte": end}
                                }
                            },
                            "aggs": {
                                "result": {
                                    "date_histogram": {
                                        "field": "utime",
                                        "interval": "1m",
                                        "time_zone": "+08:00",
                                        "order": {
                                            "_key": "asc"
                                        },
                                        "min_doc_count": 0,
                                        "extended_bounds": {
                                            "min": start,
                                            "max": end
                                        }
                                    }, "aggs": _aggs
                                }
                            }
                        }
                    }
                }
            };
        else if (interval == -1) //  summary趋向分析按日
            return {
                "index": indexes.toString(),
                "type": type,
                "body": {
                    "query": buildQuery(filters),
                    "size": 0,
                    "aggs": {
                        "result": {
                            "date_histogram": {
                                "field": "utime",
                                "interval": "1d",
                                "format": "yyyy-MM-dd HH:mm:ss",
                                "time_zone": "+08:00",
                                "order": {
                                    "_key": "asc"
                                },
                                "min_doc_count": 0,
                                "extended_bounds": {
                                    "min": start,
                                    "max": end
                                }
                            },
                            "aggs": _aggs
                        }
                    }
                }
            };
        else
            return {
                "index": indexes.toString(),
                "type": type,
                "body": {
                    "query": buildQuery(filters),
                    "size": 0,
                    "aggs": {
                        "result": {
                            "filter": {
                                "script": {
                                    "script": "_source.loc.size() > param1",
                                    "params": {
                                        "param1": 0
                                    }
                                }
                            },
                            "aggs": _aggs
                        }
                    }
                }
            };
    }

    if (dimension.split(",").length > 1) {  // 多维度统计
        var dimensionArr = dimension.split(",");
        return {
            "index": indexes.toString(),
            "type": type,
            "body": {
                "query": buildQuery(filters),
                "size": 0,
                "aggs": {
                    "result": {
                        "date_histogram": {
                            "field": "utime",
                            "interval": interval / 1000 + "s",
                            "format": "yyyy-MM-dd HH:mm:ss",
                            "time_zone": "+08:00",
                            "order": {
                                "_key": "asc"
                            },
                            "min_doc_count": 0,
                            "extended_bounds": {
                                "min": start,
                                "max": end
                            }
                        },
                        "aggs": {
                            "dimension": {
                                "terms": {
                                    "field": dimensionArr[1],
                                    "size": 0
                                },
                                "aggs": _aggs
                            }
                        }
                    }
                }
            }
        };
    }

    if (dimension == "period") {
        if (interval == 1)  // 按小时统计数据
            return {
                "index": indexes.toString(),
                "type": type,
                "body": {
                    "query": buildQuery(filters),
                    "size": 0,
                    "aggs": {
                        "result": {
                            "date_histogram": {
                                "field": "utime",
                                "interval": interval + "h",
                                "format": "HH",
                                "time_zone": "+08:00",
                                "order": {
                                    "_key": "asc"
                                },
                                "min_doc_count": 0,
                                "extended_bounds": {
                                    "min": start,
                                    "max": end
                                }
                            },
                            "aggs": _aggs
                        }
                    }
                }
            };
        else {
            var inter = interval / 1000 + "s";
            if (interval == 604800000) {
                inter = "1w";
            } else if (interval == 2592000000) {
                inter = "1M";
            } else if (interval == 2) {
                inter = "1d";
            }
            return {
                "index": indexes.toString(),
                "type": type,
                "body": {
                    "query": buildQuery(filters),
                    "size": 0,
                    "aggs": {
                        "result": {
                            "date_histogram": {
                                "field": "utime",
                                "interval": inter,
                                "format": "yyyy-MM-dd HH:mm:ss",
                                "time_zone": "+08:00",
                                "order": {
                                    "_key": "asc"
                                },
                                "min_doc_count": 0,
                                "extended_bounds": {
                                    "min": start,
                                    "max": end
                                }
                            },
                            "aggs": _aggs
                        }
                    }
                }
            };
        }
    } else {
        var dimensionScript = "";
        if (dimension.split(":").length > 1) {
            var _arr = dimension.split(":");
            for (var i = 0, l = _arr.length; i < l; i++) {
                if (i === l - 1) {
                    //dimensionScript += ("doc[\'" + _arr[i] + "\'].value");
                    dimensionScript += _arr[i];
                } else {
                    //dimensionScript += ("doc[\'" + _arr[i] + "\'].value+\'," + "\'+");
                    dimensionScript += _arr[i];
                }
            }
        } else {
            //dimensionScript = ("doc[\'" + dimension + "\'].value");
            dimensionScript = dimension;
        }

        if (dimensionScript == "doc['rf_type'].value") {
            return {
                "index": indexes.toString(),
                "type": type,
                "body": {
                    "query": buildQuery(filters),
                    "size": 0,
                    "aggs": {
                        "result": {
                            "terms": {
                                "field": 'rf_type',
                                "size": 0
                            },
                            "aggs": _aggs
                        }
                    }
                }
            }
        }

        return {
            "index": indexes.toString(),
            "type": type,
            "body": {
                "query": buildQuery(filters),
                "size": 0,
                "aggs": {
                    "result": {
                        "terms": {
                            //"script": dimensionScript,
                            "field": dimensionScript,
                            "size": 0
                        },
                        "aggs": _aggs
                    }
                }
            }
        };
    }
};

var pvFn = function (result) {
    var keyArr = [];
    var keyAsStringArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        Array.prototype.push.call(keyArr, result[i].key);
        //Array.prototype.push.call(keyArr, result[i].key_as_string);
        Array.prototype.push.call(quotaArr, result[i].pv_aggs.value);
    }

    return {
        "label": "pv",
        "key": keyArr,
        //"key_as_string": keyAsStringArr,
        "quota": quotaArr
    };
};

var contributionFn = function (result) {
    var keyArr = [];
    var keyAsStringArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        Array.prototype.push.call(keyArr, result[i].key);
        Array.prototype.push.call(keyAsStringArr, result[i].key_as_string);
        Array.prototype.push.call(quotaArr, result[i].cpv_aggs.cpv_aggs.value);
    }

    return {
        "label": "contribution",
        "key": keyArr,
        "key_as_string": keyAsStringArr,
        "quota": quotaArr
    };
};

var uvFn = function (result) {
    var keyArr = [];
    var keyAsStringArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        keyArr.push(result[i].key);
        keyAsStringArr.push(result[i].key_as_string);
        quotaArr.push(result[i].uv_aggs.value);
    }

    return {
        "label": "uv",
        "key": keyArr,
        "key_as_string": keyAsStringArr,
        "quota": quotaArr
    };
};

var vcFn = function (result) {
    var keyArr = [];
    var keyAsStringArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var vc = result[i].vc_aggs.value;
        keyArr.push(result[i].key);
        keyAsStringArr.push(result[i].key_as_string);
        quotaArr.push(vc);
    }

    return {
        "label": "vc",
        "key": keyArr,
        "key_as_string": keyAsStringArr,
        "quota": quotaArr
    };
};

var avgTimeFn = function (result) {
    var keyArr = [];
    var keyAsStringArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var _tvt_aggs_result = result[i].tvt_aggs.buckets;
        var tvt = 0;
        if (_tvt_aggs_result.length > 0) {
            tvt = parseInt(_tvt_aggs_result[0].max_aggs.value) - parseInt(_tvt_aggs_result[0].min_aggs.value);
        }
        var vc = result[i].vc_aggs.value;
        keyArr.push(result[i].key);
        keyAsStringArr.push(result[i].key_as_string);
        var avgTime = 0;
        if (vc > 0) {
            avgTime = Math.ceil(parseFloat(tvt) / 1000 / parseFloat((vc)));
        }
        quotaArr.push(avgTime);
    }

    return {
        "label": "avgTime",
        "key": keyArr,
        "key_as_string": keyAsStringArr,
        "quota": quotaArr
    };
};

var outRateFn = function (result) {
    var keyArr = [];
    var keyAsStringArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var vc = result[i].vc_aggs.value;
        var svc = parseInt(vc) - result[i].single_visitor_aggs.single_visitor_aggs.buckets.length;
        keyArr.push(result[i].key);
        keyAsStringArr.push(result[i].key_as_string);

        var outRate = 0;
        if (vc > 0) {
            outRate = (parseFloat(svc) / parseFloat(vc) * 100).toFixed(2);
        } else {
            outRate = "0.00"
        }
        quotaArr.push(outRate);
    }
    return {
        "label": "outRate",
        "key": keyArr,
        "key_as_string": keyAsStringArr,
        "quota": quotaArr
    };
};

var svcFn = function (result) {
    var keyArr = [];
    var keyAsStringArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var vc = result[i].vc_aggs.value;
        var svc = parseInt(vc) - result[i].single_visitor_aggs.single_visitor_aggs.buckets.length;
        keyArr.push(result[i].key);
        keyAsStringArr.push(result[i].key_as_string);
        quotaArr.push(svc);
    }
    return {
        "label": "svc",
        "key": keyArr,
        "key_as_string": keyAsStringArr,
        "quota": quotaArr
    };
}

var nuvFn = function (result) {
    var keyArr = [];
    var keyAsStringArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var o_nuv = result[i].new_visitor_aggs.new_visitor_aggs.value;
        keyArr.push(result[i].key);
        keyAsStringArr.push(result[i].key_as_string);
        quotaArr.push(o_nuv);
    }

    return {
        "label": "nuv",
        "key": keyArr,
        "key_as_string": keyAsStringArr,
        "quota": quotaArr
    };
};

var nuvRateFn = function (result) {
    var keyArr = [];
    var keyAsStringArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var o_nuv = result[i].new_visitor_aggs.new_visitor_aggs.value;
        var uv = result[i].uv_aggs.value;
        keyArr.push(result[i].key);
        keyAsStringArr.push(result[i].key_as_string);

        var nuvRate = 0;
        if (uv > 0) {
            nuvRate = (parseFloat(o_nuv) / parseFloat(uv) * 100).toFixed(2);
        } else {
            nuvRate = "0.00";
        }

        quotaArr.push(nuvRate);
    }

    return {
        "label": "nuvRate",
        "key": keyArr,
        "key_as_string": keyAsStringArr,
        "quota": quotaArr
    };
};

var entranceFn = function (result) {
    var keyArr = [];
    var keyAsStringArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var entrance_count = result[i].entrance["doc_count"];
        keyArr.push(result[i].key);
        keyAsStringArr.push(result[i].key_as_string);

        quotaArr.push(entrance_count);
    }

    return {
        "label": "entrance",
        "key": keyArr,
        "key_as_string": keyAsStringArr,
        "quota": quotaArr
    };
};

var ipFn = function (result) {
    var keyArr = [];
    var keyAsStringArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var ip_count = result[i].ip_aggs.ip_aggs1.value;
        keyArr.push(result[i].key);
        keyAsStringArr.push(result[i].key_as_string);

        quotaArr.push(ip_count);
    }

    return {
        "label": "ip",
        "key": keyArr,
        "key_as_string": keyAsStringArr,
        "quota": quotaArr
    };
};

var avgPageFn = function (result) {
    var keyArr = [];
    var keyAsStringArr = [];
    var quotaArr = [];
    for (var i = 0, l = result.length; i < l; i++) {
        var pv = result[i].pv_aggs.value;
        var uv = result[i].vc_aggs.value;
        keyArr.push(result[i].key);
        keyAsStringArr.push(result[i].key_as_string);
        var avgPage = 0;
        if (uv > 0) {
            avgPage = (parseFloat(pv) / parseFloat(uv)).toFixed(2);
        }
        quotaArr.push(avgPage);
    }

    return {
        "label": "avgPage",
        "key": keyArr,
        "key_as_string": keyAsStringArr,
        "quota": quotaArr
    };
};

var arrivedRateFn = function (result) {
    var keyArr = [];
    var keyAsStringArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var vc = result[i].vc_aggs.value;
        keyArr.push(result[i].key);
        keyAsStringArr.push(result[i].key_as_string);

        quotaArr.push(vc);
    }

    return {
        "label": "arrivedRate",
        "key": keyArr,
        "key_as_string": keyAsStringArr,
        "quota": quotaArr
    };
};

var conversionsFn = function (result) {
    var keyArr = [];
    var keyAsStringArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var doc_count = result[i].doc_count;
        keyArr.push(result[i].key);
        keyAsStringArr.push(result[i].key_as_string);

        quotaArr.push(doc_count);
    }

    return {
        "label": "conversions",
        "key": keyArr,
        "key_as_string": keyAsStringArr,
        "quota": quotaArr
    };
};

var eventConversionFn = function (result) {
    var keyArr = [];
    var keyAsStringArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
    }

    return {
        "label": "eventConversion",
        "key": keyArr,
        "key_as_string": keyAsStringArr,
        "quota": quotaArr
    };
};


var pageConversionFn = function (result) {
    var keyArr = [];
    var keyAsStringArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
    }

    return {
        "label": "pageConversion",
        "key": keyArr,
        "key_as_string": keyAsStringArr,
        "quota": quotaArr
    };
};

var es_request = {
    search: function (es, indexes, type, quotas, dimension, topN, filters, start, end, interval, callbackFn) {
        var request = null;
        var _aggs = null;
        switch (topN[0]) {
            case "-1":  // circle topN, 适用于单一指标
                var mustQuery = buildMustQuery(filters);
                mustQuery.push({
                    "range": {
                        "utime": {
                            "from": start, "to": end
                        }
                    }
                });

                for (var key in es_aggs[quotas[0]]) {
                    _aggs = {
                        "top_hit": es_aggs[quotas[0]][key]
                    };
                }

                request = {
                    "index": indexes,
                    "type": type,
                    "body": {
                        "query": {
                            "bool": {
                                "must": mustQuery
                            }
                        },
                        "size": 0,
                        "aggs": {
                            "result": {
                                "terms": {
                                    "field": dimension,
                                    "order": {
                                        "top_hit": "desc"
                                    },
                                    "size": topN[1]
                                },
                                "aggs": _aggs
                            }
                        }
                    }
                };
                request.body.aggs["all_uv"] = {
                    "cardinality": {
                        "field": "_ucv"
                    }
                }
                break;
            case "-2":  // period topN, 适用于单一指标, 结果由调用者处理
                for (var _key in es_aggs[quotas[0]]) {
                    _aggs = {
                        "top_hit": es_aggs[quotas[0]][_key]
                    };
                }
                request = {
                    "index": indexes,
                    "type": type,
                    "body": {
                        "query": buildQuery(filters),
                        "size": 0,
                        "aggs": {
                            "result": {
                                "date_histogram": {
                                    "field": "utime",
                                    "interval": interval / 1000 + "s",
                                    "format": "yyyy-MM-dd HH:mm:ss",
                                    "time_zone": "+08:00",
                                    "order": {
                                        "_key": "asc"
                                    },
                                    "min_doc_count": 0,
                                    "extended_bounds": {
                                        "min": start,
                                        "max": end
                                    }
                                },
                                "aggs": {
                                    "dimension": {
                                        "terms": {
                                            "field": dimension.split(",")[1],
                                            "order": {
                                                "top_hit": "desc"
                                            },
                                            "size": topN[1]
                                        },
                                        "aggs": _aggs
                                    }
                                }
                            }
                        }
                    }
                };
                request.body.aggs.result.aggs["all_uv"] = {
                    "cardinality": {
                        "field": "_ucv"
                    }
                }
                break;
            default :
                request = buildRequest(indexes, type, quotas, dimension, filters, start, end, interval);
                request.body.aggs["all_uv"] = {
                    "cardinality": {
                        "field": "_ucv"
                    }
                }
                break;
        }

        //var cacheKey = cacheutils.fixCacheKey(request);
        //console.log("********************refactor request*********************")
        //console.log(JSON.stringify(request))
        es.search(request, function (error, response) {
            var data = [];
            if (response != undefined && response.aggregations != undefined && response.aggregations.result != undefined) {
                var result = response.aggregations.result.buckets;

                if (!result) {
                    result = [];
                    result.push(response.aggregations.result);
                }
                if (dimension == null && interval == 0) {
                    callbackFn(result);
                } else {
                    if (dimension != null && dimension.split(",").length > 1) {
                        callbackFn(result);
                    } else {
                        quotas.forEach(function (quota) {
                            switch (quota) {
                                case "pv":
                                    data.push(pvFn(result));
                                    break;
                                case "contribution":
                                    data.push(contributionFn(result));
                                    break;
                                case "uv":
                                    var tempuv = uvFn(result)
                                    tempuv["all_uv"] = response.aggregations.all_uv.value
                                    data.push(tempuv);
                                    break;
                                case "vc":
                                    data.push(vcFn(result));
                                    break;
                                case "avgTime":
                                    data.push(avgTimeFn(result));
                                    break;
                                case "outRate":
                                    data.push(outRateFn(result));
                                    break;
                                case "svc":
                                    data.push(svcFn(result));
                                    break;
                                case "arrivedRate":
                                    data.push(arrivedRateFn(result));
                                    break;
                                case "avgPage":
                                    data.push(avgPageFn(result));
                                    break;
                                case "conversions":
                                    data.push(conversionsFn(result));
                                    break;
                                case "pageConversion" :
                                    data.push(pageConversionFn(result));
                                    break;
                                case "eventConversion":
                                    data.push(eventConversionFn(result));
                                    break;
                                case "ip":
                                    data.push(ipFn(result));
                                    break;
                                case "nuv":
                                    data.push(nuvFn(result));
                                    break;
                                case "nuvRate":
                                    data.push(nuvRateFn(result));
                                    break;
                                case "entrance":
                                    data.push(entranceFn(result));
                                    break;
                                default :
                                    break;
                            }
                        });
                        callbackFn(data);
                    }
                }
            } else {
                callbackFn(data);
            }
        });
    },
    // 获取近30分钟的访问数据
    realTimeSearch: function (es, index, type, filters, callbackFn) {
        var endTime = new Date().getTime();
        var startTime = endTime - 1800000;

        var mustQuery = [{
            "range": {
                "utime": {
                    "from": startTime, "to": endTime
                }
            }
        }];

        if (filters != null) {
            filters.forEach(function (filter) {
                mustQuery.push({
                    "terms": filter
                });
            });
        }

        var request = {
            "index": index,
            "type": type,
            "body": {
                "query": {
                    "match_all": {}
                },
                "sort": {
                    "utime": {
                        "order": "asc"
                    }
                },
                "size": 1000000,
                "aggs": {
                    "vc_aggs": {
                        "terms": {
                            "field": "tt",
                            "size": 0
                        },
                        "aggs": {
                            "utime_aggs": {
                                "terms": {
                                    "script": "doc['utime'].value + ',' + doc['loc'].value",
                                    "size": 0,
                                    "order": {
                                        "_term": "desc"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        es.search(request, function (error, response) {
            if (response != undefined && response.aggregations != undefined && response.aggregations.vc_aggs != undefined) {
                var hits = response.aggregations.vc_aggs.buckets;
                hits.forEach(function (item) {
                    var locUtimeArr = item.utime_aggs.buckets;
                    var record = [];

                    for (var i = 0, l = locUtimeArr.length - 1; i <= l; i++) {
                        var obj = {};
                        var tmpArr = locUtimeArr[i].key.split(",");
                        if (i == l) {
                            obj["loc"] = tmpArr[1];
                            obj["vtime"] = "-";
                            record.push(obj);
                        } else {
                            obj["loc"] = tmpArr[1];
                            obj["vtime"] = new Date(parseInt(tmpArr[0]) - parseInt(locUtimeArr[i + 1].key.split(",")[0])).format("hh:mm:ss");
                            record.push(obj);
                        }
                    }

                    item["record"] = record;
                });

                if (hits.length === 1) {
                    // 计算上一次的访问时间
                    es.search({
                        "index": index,
                        "type": type,
                        "body": {
                            "query": {
                                "bool": {
                                    "must": buildMustQuery([
                                        {"vid": [hits[0]._source.vid]}
                                    ])
                                }
                            },
                            "size": 0,
                            "aggs": {
                                "result": {
                                    "terms": {
                                        "script": "doc['utime'].value",
                                        "size": 0,
                                        "order": {
                                            "_term": "desc"
                                        }
                                    }
                                }
                            }
                        }
                    }, function (error, response) {
                        if (response != undefined && response.aggregations != undefined) {
                            var resultArr = response.aggregations.result.buckets;
                            if (resultArr.length == 1)
                                hits[0]["last"] = "首次访问";
                            else {
                                var curr = hits[0]._source.utime[0];
                                for (var i = 0, l = resultArr.length; i < l; i++) {
                                    if (curr == resultArr[i].key) {
                                        if (i + 1 == l)
                                            hits[0]["last"] = "首次访问";
                                        else
                                            hits[0]["last"] = resultArr[i + 1].key;

                                        break;
                                    }
                                }
                            }
                        }

                        callbackFn(hits);
                    });
                } else {
                    callbackFn(hits);
                }
            } else
                callbackFn([]);
        });
    },
    top5visit: function (es, indexes, type, ct, filters, callbackFn) {
        var mustQuery = [];
        mustQuery.push({
            "term": {
                "ct": ct
            }
        });
        if (filters != null) {
            filters.forEach(function (filter) {
                if (JSON.stringify(filter) == "{\"entrance\":\"entrancetrue\"}") {
                    mustQuery.push({
                        "term": {
                            "entrance": 1
                        }
                    });
                } else {
                    mustQuery.push({
                        "terms": filter
                    });
                }
            });
        }
        var request = {
            "index": indexes.toString(),
            "type": type,
            "body": {
                "query": {
                    "bool": {
                        "must": mustQuery// 加入filters
                    }
                },
                "size": 0,
                "aggs": {
                    "direct_result": {
                        "filter": {
                            "term": {
                                "rf_type": "1"
                            }
                        },
                        "aggs": {
                            "direct_aggs": {
                                "value_count": {
                                    "field": "rf"
                                }
                            }
                        }
                    },
                    "se_result": {
                        "filter": {
                            "term": {
                                "rf_type": "2"
                            }
                        },
                        "aggs": {
                            "se_aggs": {
                                "terms": {
                                    "field": "se",
                                    "size": 0
                                }
                            }
                        }
                    },
                    "other_result": {
                        "filter": {
                            "term": {
                                "rf_type": "3"
                            }
                        },
                        "aggs": {
                            "chain_aggs": {
                                "terms": {
                                    "field": "dm",
                                    "size": 0
                                }
                            }
                        }
                    }
                }
            }
        };

        es.search(request, function (error, response) {
            if (response != undefined && response.aggregations != undefined) {
                var aggs_results = response.aggregations;
                var results = [];
                var directObj = {};
                directObj["key"] = "直接访问";
                directObj["count"] = aggs_results.direct_result.direct_aggs.value;

                results.push(directObj);
                aggs_results.se_result.se_aggs.buckets.forEach(function (item, index) {
                    var obj = {};
                    obj["key"] = item.key;
                    obj["count"] = item.doc_count;
                    results.push(obj);
                });

                aggs_results.other_result.chain_aggs.buckets.forEach(function (item, index) {
                    var obj = {};
                    obj["key"] = item.key;
                    obj["count"] = item.doc_count;
                    results.push(obj);
                });

                results.sort(function (o1, o2) {
                    return o2["count"] - o1["count"]
                });

                if (results.length > 5)
                    callbackFn(results.slice(0, 5));
                else
                    callbackFn(results);

            }
        });
    }
};

module.exports = es_request;