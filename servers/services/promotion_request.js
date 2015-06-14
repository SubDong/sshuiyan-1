/**
 * Created by dolphineor on 2015-6-3.
 *
 * 此查询只针对百度推广模块
 */

var buildMustQuery = function (filters) {
    var mustQuery = [
        {
            "range": {
                "kwid": {
                    "gt": 0
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

    return mustQuery;
};

var vc_aggs = {
    "cardinality": {
        "field": "tt"
    }
};

var es_aggs = {
    // 浏览量
    "pv": {
        "pv_aggs": {
            "value_count": {
                "field": "loc"
            }
        }
    },
    // 访问次数
    "vc": {
        "vc_aggs": vc_aggs
    },
    // 跳出率
    "outRate": {
        "single_visitor_aggs": {
            "terms": {
                "field": "tt",
                "size": 0,
                "min_doc_count": 2
            }
        },
        "vc_aggs": vc_aggs
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
        "vc_aggs": vc_aggs
    },
    // 抵达率=访问次数/点击量
    "arrivedRate": {
        "vc_aggs": vc_aggs
    },
    // TODO 页面转化
    "pageConversion": {}
};

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

var vcFn = function (result) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var vc = result[i].vc_aggs.value;
        keyArr.push(result[i].key);
        quotaArr.push(vc);
    }

    return {
        "label": "vc",
        "key": keyArr,
        "quota": quotaArr
    };
};

var avgTimeFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var _tvt_aggs_result = result[i].tvt_aggs.buckets;
        var tvt = 0;
        if (_tvt_aggs_result.length > 0)
            tvt = parseInt(_tvt_aggs_result[0].max_aggs.value) - parseInt(_tvt_aggs_result[0].min_aggs.value);

        var vc = result[i].vc_aggs.value;
        keyArr.push(result[i].key);

        var avgTime = 0;
        if (vc > 0)
            avgTime = Math.ceil(parseFloat(tvt) / 1000 / parseFloat((vc)));

        quotaArr.push(avgTime);
    }

    return {
        "label": "avgTime",
        "key": keyArr,
        "quota": quotaArr
    };
};

var outRateFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var vc = result[i].vc_aggs.value;
        var svc = parseInt(vc) - result[i].single_visitor_aggs.buckets.length;
        keyArr.push(result[i].key);

        var outRate = 0;
        if (vc > 0)
            outRate = (parseFloat(svc) / parseFloat(vc) * 100).toFixed(2);

        quotaArr.push(outRate);
    }

    return {
        "label": "outRate",
        "key": keyArr,
        "quota": quotaArr
    };
};

var arrivedRateFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var vc = result[i].vc_aggs.value;
        keyArr.push(result[i].key);

        quotaArr.push(vc);
    }

    return {
        "label": "arrivedRate",
        "key": keyArr,
        "quota": quotaArr
    };
};

var pageConversionFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
    }

    return {
        "label": "pageConversion",
        "key": keyArr,
        "quota": quotaArr
    };
};


var buildRequest = function (indexes, type, quotas, dimension, filters) {
    var _aggs = {};

    quotas.forEach(function (quota) {
        for (var key in es_aggs[quota]) {
            _aggs[key] = es_aggs[quota][key];
        }
    });

    return {
        "index": indexes.toString(),
        "type": type,
        "body": {
            "filter": {
                "exists": {
                    "field": "kwid"
                }
            },
            "query": {
                "bool": {
                    "must": buildMustQuery(filters)
                }
            },
            "size": 0,
            "aggs": {
                "group_aggs": {
                    "terms": {
                        "field": dimension,
                        "size": 0
                    },
                    "aggs": _aggs
                }
            }
        }
    }
};


var promotion_request = {
    search: function (es, indexes, type, quotas, dimension, filters, callbackFn) {
        var request = buildRequest(indexes, type, quotas, dimension, filters);

        es.search(request, function (error, response) {
            var data = [];
            if (!response && !response.aggregations && !response.aggregations.group_aggs) {
                var result = response.aggregations.group_aggs.buckets;
                quotas.forEach(function (quota) {
                    switch (quota) {
                        case "pv":
                            data.push(pvFn(result));
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
                        case "arrivedRate":
                            data.push(arrivedRateFn(result));
                            break;
                        case "pageConversion":
                            data.push(pageConversionFn(result));
                            break;
                        default :
                            break;
                    }
                });

                callbackFn(data);
            } else {
                callbackFn(data);
            }
        });
    }
};

module.exports = promotion_request;