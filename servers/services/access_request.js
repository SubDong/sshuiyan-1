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
    }
};

module.exports = access_request;