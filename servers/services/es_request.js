/**
 * Created by baizz on 2015-04-09.
 *
 * ES查询接口
 * quotas: 指标
 * dimension: 维度
 * filters: 过滤器
 */

require('../utils/dateFormat')();

var buildQuery = function (filters) {

    var mustQuery = [];

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

var es_aggs = {
    // 浏览量
    "pv": {
        "pv_aggs": {
            "sum": {
                "script": "c=0; c+=doc['loc'].values.size(); c"
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
        "vc_aggs": {
            "sum": {
                "script": "1"
            }
        }
    },
    // 跳出率
    "outRate": {
        "single_visitor_aggs": {
            "filter": {
                "script": {
                    "script": "doc['loc'].values.size() == param1",
                    "params": {
                        "param1": 1
                    }
                }
            },
            "aggs": {
                "svc_aggs": {
                    "sum": {
                        "script": "1"
                    }
                }
            }
        },
        "vc_aggs": {
            "sum": {
                "script": "1"
            }
        }
    },
    // 平均访问时长
    "avgTime": {
        "tvt_aggs": {
            "sum": {
                "script": "sum_time = 0; len = doc['utime'].values.size() - 1; if (len > 0) { sum_time = doc['utime'].values[len] - doc['utime'].values[0] }; sum_time"
            }
        },
        "vc_aggs": {
            "sum": {
                "script": "1"
            }
        }
    },
    // 新访客数
    "nuv": {
        "new_visitor_aggs": {
            "sum": {
                "script": "c = 0; if (doc['ct'].value == 0) { c = 1 }; c"
            }
        }
    },
    // 新访客比率
    "nuvRate": {
        "new_visitor_aggs": {
            "sum": {
                "script": "c = 0; if (doc['ct'].value == 0) { c = 1 }; c"
            }
        },
        "uv_aggs": {
            "cardinality": {
                "field": "_ucv"
            }
        }
    },
    // 平均访问页数
    "avgPage": {
        "pv_aggs": {
            "value_count": {
                "field": "loc"
            }
        },
        "vc_aggs": {
            "sum": {
                "script": "1"
            }
        }
    },
    // IP数
    "ip": {
        "ip_aggs": {
            "cardinality": {
                "field": "remote"
            }
        }
    },
    // 抵达率=访问次数/点击量
    "arrivedRate": {
        "vc_aggs": {
            "sum": {
                "script": "1"
            }
        }
    },
    // TODO 页面转化
    "pageConversion": {},
    // TODO 事件转化
    "eventConversion": {}
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
                                        "interval": "1s",
                                        "pre_zone": "+8:00",
                                        "post_zone": "+8:00",
                                        "order": {
                                            "_key": "asc"
                                        }
                                    }, "aggs": _aggs
                                }
                            }
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
                                    "script": "doc['loc'].values.size() > param1",
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
                            //"time_zone": "+08:00",    // pre_zone, post_zone are replaced by time_zone in 1.5.0.
                            "pre_zone": "+08:00",
                            "post_zone": "+08:00",
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
                                    "field": dimensionArr[1]
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
                                //"time_zone": "+08:00",    // pre_zone, post_zone are replaced by time_zone in 1.5.0.
                                "pre_zone": "+08:00",
                                "post_zone": "+08:00",
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
                            "date_histogram": {
                                "field": "utime",
                                "interval": interval / 1000 + "s",
                                "format": "yyyy-MM-dd HH:mm:ss",
                                //"time_zone": "+08:00",    // pre_zone, post_zone are replaced by time_zone in 1.5.0.
                                "pre_zone": "+08:00",
                                "post_zone": "+08:00",
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
    } else {
        return {
            "index": indexes.toString(),
            "type": type,
            "body": {
                "query": buildQuery(filters),
                "size": 0,
                "aggs": {
                    "result": {
                        "terms": {
                            "field": dimension//,
                            //"order": {
                            //    "_key": "asc"
                            //}
                        },
                        "aggs": _aggs
                    }
                }
            }
        };
    }

};

var pvFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var pv = result[i].pv_aggs.value;
        if (dimension == "period") {
            var dateStr = result[i].key_as_string + "";
            Array.prototype.push.call(keyArr, dateStr);
        } else
            Array.prototype.push.call(keyArr, result[i].key);

        Array.prototype.push.call(quotaArr, pv);
    }

    return {
        "label": "pv",
        "key": keyArr,
        "quota": quotaArr
    };
};

var uvFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var uv = result[i].uv_aggs.value;
        if (dimension == "period") {
            var dateStr = result[i].key_as_string + "";
            keyArr.push(dateStr);
        } else
            keyArr.push(result[i].key);

        quotaArr.push(uv);
    }

    return {
        "label": "uv",
        "key": keyArr,
        "quota": quotaArr
    };
};

var vcFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var vc = result[i].vc_aggs.value;
        if (dimension == "period") {
            var dateStr = result[i].key_as_string + "";
            keyArr.push(dateStr);
        } else
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
        var tvt = result[i].tvt_aggs.value;
        var vc = result[i].vc_aggs.value;
        if (dimension == "period") {
            var dateStr = result[i].key_as_string + "";
            keyArr.push(dateStr);
        } else
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
        var svc = result[i].single_visitor_aggs.svc_aggs.value;
        var vc = result[i].vc_aggs.value;
        if (dimension == "period") {
            var dateStr = result[i].key_as_string + "";
            keyArr.push(dateStr);
        } else
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

var nuvFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var nuv = result[i].new_visitor_aggs.value;
        if (dimension == "period") {
            var dateStr = result[i].key_as_string + "";
            keyArr.push(dateStr);
        } else
            keyArr.push(result[i].key);

        quotaArr.push(nuv);
    }

    return {
        "label": "nuv",
        "key": keyArr,
        "quota": quotaArr
    };
};

var nuvRateFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var nuv = result[i].new_visitor_aggs.value;
        var uv = result[i].uv_aggs.value;
        if (dimension == "period") {
            var dateStr = result[i].key_as_string + "";
            keyArr.push(dateStr);
        } else
            keyArr.push(result[i].key);

        var nuvRate = 0;
        if (uv > 0)
            nuvRate = (parseFloat(nuv) / parseFloat(uv) * 100).toFixed(2);

        quotaArr.push(nuvRate);
    }

    return {
        "label": "nuvRate",
        "key": keyArr,
        "quota": quotaArr
    };
};

var ipFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var ip_count = result[i].ip_aggs.value;
        if (dimension == "period") {
            var dateStr = result[i].key_as_string + "";
            keyArr.push(dateStr);
        } else
            keyArr.push(result[i].key);

        quotaArr.push(ip_count);
    }

    return {
        "label": "ip",
        "key": keyArr,
        "quota": quotaArr
    };
};

var avgPageFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var pv = result[i].pv_aggs.value;
        var uv = result[i].vc_aggs.value;
        if (dimension == "period") {
            var dateStr = result[i].key_as_string + "";
            keyArr.push(dateStr);
        } else
            keyArr.push(result[i].key);

        var avgPage = 0;
        if (uv > 0)
            avgPage = (parseFloat(pv) / parseFloat(uv)).toFixed(2);

        quotaArr.push(avgPage);
    }

    return {
        "label": "avgPage",
        "key": keyArr,
        "quota": quotaArr
    };
};

var arrivedRateFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var vc = result[i].vc_aggs.value;
        if (dimension == "period") {
            var dateStr = result[i].key_as_string + "";
            keyArr.push(dateStr);
        } else
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

var eventConversionFn = function (result, dimension) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
    }

    return {
        "label": "eventConversion",
        "key": keyArr,
        "quota": quotaArr
    };
};

var es_request = {
    survey: function (es, category, type, index, callbackFn) {  // 推广概况数据
        var request = {
            "index": index,
            "type": type,
            "body": {
                "query": {
                    "match_all": {}
                },
                "size": 0,
                "aggs": {
                    "single_visitor_aggs": {
                        "filter": {
                            "script": {
                                "script": "doc['loc'].values.size() == param1",
                                "params": {
                                    "param1": 1
                                }
                            }
                        },
                        "aggs": {
                            "single_visitor_count": {
                                "sum": {
                                    "script": "1"
                                }
                            }
                        }
                    },
                    "total_uv_count": {
                        "cardinality": {
                            "field": "_ucv"
                        }
                    },
                    "total_visitor_count": {
                        "sum": {
                            "script": "1"
                        }
                    },
                    //"total_pv_count": {
                    //    "value_count": {
                    //        "field": "loc"
                    //    }
                    //},
                    "total_visit_time": {
                        "sum": {
                            "script": "sum_time = 0; tmp = 0; for (t in doc['utime'].values) { if (tmp > 0) { sum_time += (t - tmp) }; tmp = t}; sum_time"
                        }
                    },
                    //"page_conv_count": {
                    //    "sum": {
                    //        "script": {
                    //            "script": "sum_pcc = 0; for (l in doc['loc'].values) { for (page in target_pages) { if (l == page) { sum_pcc += 1 }}}; sum_pcc",
                    //            "params": {
                    //                "target_pages": target_pages
                    //            }
                    //        }
                    //    }
                    //},
                    "event_conv_count": {
                        "value_count": {
                            "field": "et"
                        }
                    }
                }
            }
        };

        function getCategory() {
            return category;
        }

        es.search(request, function (error, response) {
            var result = {
                "category": getCategory(),
                "pv": "0",
                "uv": "0",
                "page_conv": "0",
                "event_conv": "0",
                "outRate": "",
                "avgTime": ""
            };
            if (response != undefined) {
                var aggs = response.aggregations;
                var _single_visitor_count = aggs.single_visitor_aggs.single_visitor_count.value;
                var _total_uv_count = aggs.total_uv_count.value;
                var _total_visitor_count = aggs.total_visitor_count.value;
                //var _total_pv_count = aggs.total_pv_count.value;
                var _total_visit_time = aggs.total_visit_time.value;
                //var _page_conv_count = aggs.page_conv_count.value;
                var _event_conv_count = aggs.event_conv_count.value;

                var outRate = "0%";
                var avgTime = "00:00";
                if (_total_uv_count > 0) {
                    outRate = (parseFloat(_single_visitor_count) / parseFloat(_total_visitor_count) * 100).toFixed(2) + "%";
                    avgTime = Math.ceil(parseFloat(_total_visit_time) / parseFloat((_total_visitor_count)));
                    avgTime = new Date(avgTime).format("hh:mm:ss");

                }
                //result["pv"] = _total_pv_count;
                result["uv"] = _total_uv_count;
                //result["page_conv"] = _page_conv_count;
                result["event_conv"] = _event_conv_count;
                result["outRate"] = outRate;
                result["avgTime"] = avgTime;

                callbackFn([result]);
            } else
                callbackFn([]);
        });
    },
    search: function (es, indexes, type, quotas, dimension, filters, start, end, interval, callbackFn) {
        var request = buildRequest(indexes, type, quotas, dimension, filters, start, end, interval);

        function getQuotas() {
            return quotas;
        }

        function getDimension() {
            return dimension;
        }

        es.search(request, function (error, response) {
            var data = [];
            if (response != undefined) {
                var result = response.aggregations.result.buckets;

                if (!result) {
                    result = [];
                    result.push(response.aggregations.result);
                }
                if (getDimension() == null && interval == 0) {
                    callbackFn(result);
                } else {
                    if (getDimension() != null && getDimension().split(",").length > 1) {
                        callbackFn(result);
                    } else {
                        getQuotas().forEach(function (quota) {
                            switch (quota) {
                                case "pv":
                                    data.push(pvFn(result, getDimension()));
                                    break;
                                case "uv":
                                    data.push(uvFn(result, getDimension()));
                                    break;
                                case "vc":
                                    data.push(vcFn(result, getDimension()));
                                    break;
                                case "avgTime":
                                    data.push(avgTimeFn(result, getDimension()));
                                    break;
                                case "outRate":
                                    data.push(outRateFn(result, getDimension()));
                                    break;
                                case "arrivedRate":
                                    data.push(arrivedRateFn(result, getDimension()));
                                    break;
                                case "avgPage":
                                    data.push(avgPageFn(result, getDimension()));
                                    break;
                                case "pageConversion":
                                    data.push(pageConversionFn(result, getDimension()));
                                    break;
                                case "eventConversion":
                                    data.push(eventConversionFn(result, getDimension()));
                                    break;
                                case "ip":
                                    data.push(ipFn(result, getDimension()));
                                    break;
                                case "nuv":
                                    data.push(nuvFn(result, getDimension()));
                                    break;
                                case "nuvRate":
                                    data.push(nuvRateFn(result, getDimension));
                                    break;
                                default :
                                    break;
                            }
                        });
                        callbackFn(data);
                    }
                }
            } else
                callbackFn(data);
        });
    },
    realTimeSearch: function (es, index, type, callbackFn) {
        var request = {
            "index": index,
            "type": type,
            "body": {
                "query": {
                    "match_all": {}
                }
            }
        };
    },
    top5visit: function (es, indexes, type, ct, callbackFn) {
        var request = {
            "index": indexes.toString(),
            "type": type,
            "body": {
                "query": {
                    "bool": {
                        "must": {
                            "term": {
                                "ct": ct
                            }
                        }
                    }
                },
                "size": 0,
                "aggs": {
                    "direct_result": {
                        "filter": {
                            "script": {
                                "script": "doc['rf_type'].value == param1",
                                "params": {
                                    "param1": 1
                                }
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
                            "script": {
                                "script": "doc['rf_type'].value == 2"
                            }
                        },
                        "aggs": {
                            "se_aggs": {
                                "terms": {
                                    "field": "se"
                                }
                            }
                        }
                    },
                    "other_result": {
                        "filter": {
                            "script": {
                                "script": "doc['rf_type'].value == 3"
                            }
                        },
                        "aggs": {
                            "chain_aggs": {
                                "terms": {
                                    "field": "rf"
                                }
                            }
                        }
                    }
                }
            }
        };

        es.search(request, function (error, response) {
            if (response != undefined) {
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