/**
 * Created by baizz on 2015-04-09.
 *
 * ES查询接口
 */

require('../utils/dateFormat')();

var buildQuery = function (filter, start, end) {

    var mustQuery = [{
        "range": {
            "utime": {
                "gte": start,
                "lte": end
            }
        }
    }];

    if (filter != null) {
        mustQuery.push({
            "terms": filter
        })
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
                "script": "c = 0; if (doc['ct'].value == 0) { c =1 }; c"
            }
        }
    },
    // 新访客比率
    "nuvRate": {
        "new_visitor_aggs": {
            "sum": {
                "script": "c = 0; if (doc['ct'].value == 0) { c =1 }; c"
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
    // TODO 抵达率
    "arrivedRate": {},
    // TODO 页面转化
    "pageConversion": {},
    // TODO 事件转化
    "eventConversion": {},
    // TODO 忠诚度
    "loyalty": {}
};

var buildRequest = function (index, type, quota, filter, start, end, interval) {
    return {
        "index": index,
        "type": type,
        "body": {
            "query": buildQuery(filter, start, end),
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
                    "aggs": es_aggs[quota]
                }
            }
        }
    };
};

var pvFn = function (result) {
    var timeArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var pv = result[i].pv_aggs.value;
        var dateStr = result[i].key_as_string + "";
        Array.prototype.push.call(timeArr, dateStr);
        Array.prototype.push.call(quotaArr, pv);
    }

    return {
        "label": "pv",
        "time": timeArr,
        "quota": quotaArr
    };
};

var uvFn = function (result) {
    var timeArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var uv = result[i].uv_aggs.value;
        var dateStr = result[i].key_as_string + "";
        timeArr.push(dateStr);
        quotaArr.push(uv);
    }

    return {
        "label": "uv",
        "time": timeArr,
        "quota": quotaArr
    };
};

var vcFn = function (result) {
    var timeArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var vc = result[i].vc_aggs.value;
        var dateStr = result[i].key_as_string + "";
        timeArr.push(dateStr);
        quotaArr.push(vc);
    }

    return {
        "label": "vc",
        "time": timeArr,
        "quota": quotaArr
    };
};

var avgTimeFn = function (result) {
    var timeArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var tvt = result[i].tvt_aggs.value;
        var vc = result[i].vc_aggs.value;
        var dateStr = result[i].key_as_string + "";
        timeArr.push(dateStr);

        var avgTime = 0;
        if (vc > 0) {
            avgTime = Math.ceil(parseFloat(tvt) / parseFloat((vc)));
        }
        quotaArr.push(avgTime);
    }

    return {
        "label": "avgTime",
        "time": timeArr,
        "quota": quotaArr
    };
};

var outRateFn = function (result) {
    var timeArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var svc = result[i].single_visitor_aggs.svc_aggs.value;
        var vc = result[i].vc_aggs.value;
        var dateStr = result[i].key_as_string + "";
        timeArr.push(dateStr);

        var outRate = 0;
        if (vc > 0)
            outRate = (parseFloat(svc) / parseFloat(vc) * 100).toFixed(2);
        quotaArr.push(outRate);
    }

    return {
        "label": "outRate",
        "time": timeArr,
        "quota": quotaArr
    };
};

var arrivedRateFn = function (result) {
    return {
        "label": "arrivedRate",
        "time": [],
        "quota": []
    };
};

var pageConversionFn = function (result) {
    return {
        "label": "pageConversion",
        "time": [],
        "quota": []
    };
};

var eventConversionFn = function (result) {
    return {
        "label": "eventConversion",
        "time": [],
        "quota": []
    };
};

var es_request = {
    survey: function (es, category, start, end, type, index, callbackFn) {  // 推广概况数据
        var request = {
            "index": index.toString(),
            "type": type,
            "body": {
                "query": {
                    "range": {
                        "utime": {
                            "gte": start,
                            "lte": end
                        }
                    }
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

                callbackFn(result);
            } else
                callbackFn(result);
        });
    },
    search: function (es, index, type, quota, filter, start, end, interval, callbackFn) {
        var request = buildRequest(index, type, quota, filter, start, end, interval);

        function getQuotaName() {
            return quota;
        }

        es.search(request, function (error, response) {
            var data = {};
            if (response != undefined) {
                var result = response.aggregations.result.buckets;
                switch (getQuotaName()) {
                    case "pv":
                        data = pvFn(result);
                        break;
                    case "uv":
                        data = uvFn(result);
                        break;
                    case "vc":
                        data = vcFn(result);
                        break;
                    case "avgTime":
                        data = avgTimeFn(result);
                        break;
                    case "outRate":
                        data = outRateFn(result);
                        break;
                    case "arrivedRate":
                        data = arrivedRateFn(result);
                        break;
                    case "pageConversion":
                        data = pageConversionFn(result);
                        break;
                    case "eventConversion":
                        data = eventConversionFn(result);
                        break;
                    default :
                        break;
                }
                callbackFn(data);
            } else
                callbackFn(data);
        });
    }
};

module.exports = es_request;