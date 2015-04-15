/**
 * Created by baizz on 2015-4-9.
 *
 * 该代码包含推广概况、推广方式、搜索推广的es查询请求
 */
//var extendedDate = require('../utils/dateFormat.js')();

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
                                "value_count": {
                                    "field": "tt"
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
                        "value_count": {
                            "field": "tt"
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
                var avgTime = "00:00:00";
                if (_total_uv_count > 0) {
                    outRate = (parseFloat(_single_visitor_count) / parseFloat(_total_visitor_count) * 100).toFixed(2) + "%";
                    avgTime = Math.ceil(parseFloat(_total_visit_time) / parseFloat((_total_visitor_count)));
                    avgTime = new Date(avgTime).Format("hh:mm:ss");

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
    pv: function (es, index, type, start, end, interval, callbackFn) {  // 浏览量(PV)
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
                    "result": {
                        "date_histogram": {
                            "field": "utime",
                            "interval": interval / 1000 + "s",
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
                            "pv": {
                                "value_count": {
                                    "field": "loc"
                                }
                            }
                        }
                    }
                }
            }
        };

        es.search(request, function (error, response) {
            var result = {
                "label": "pv",
                "time": [],
                "quota": []
            };
            if (response != undefined) {
                var results = response.aggregations.result.buckets;
                for (var i = 0, l = results.length; i < l; i++) {
                    var pv = results[i].pv.value;
                    //var dateStr = new Date(parseInt(results[i].key)).Format("yyyy-MM-dd hh:mm:ss");
                    var dateStr = (results[i].key_as_string + "").replace("T", " ").replace("00:00.000Z", "00:00:00");
                    result.time.push(dateStr);
                    result.quota.push(pv);
                }
                callbackFn(result);
            } else
                callbackFn(result);
        });
    },
    uv: function (es, index, type, start, end, interval, callbackFn) {  // 访客数(UV)
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
                    "result": {
                        "date_histogram": {
                            "field": "utime",
                            "interval": interval / 1000 + "s",
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
                            "uv": {
                                "cardinality": {
                                    "field": "_ucv"
                                }
                            }
                        }
                    }
                }
            }
        };

        es.search(request, function (error, response) {
            var result = {
                "label": "uv",
                "time": [],
                "quota": []
            };
            if (response != undefined) {
                var results = response.aggregations.result.buckets;
                for (var i = 0, l = results.length; i < l; i++) {
                    var uv = results[i].uv.value;
                    var dateStr = (results[i].key_as_string + "").replace("T", " ").replace("00:00.000Z", "00:00:00");
                    result.time.push(dateStr);
                    result.quota.push(uv);
                }
                callbackFn(result);
            } else
                callbackFn(result);
        });
    },
    vc: function (es, index, type, start, end, interval, callbackFn) {  // 访问次数
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
                    "result": {
                        "date_histogram": {
                            "field": "utime",
                            "interval": interval / 1000 + "s",
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
                            "vc": {
                                "value_count": {
                                    "field": "tt"
                                }
                            }
                        }
                    }
                }
            }
        };

        es.search(request, function (error, response) {
            var result = {
                "label": "vc",
                "time": [],
                "quota": []
            };
            if (response != undefined) {
                var results = response.aggregations.result.buckets;
                for (var i = 0, l = results.length; i < l; i++) {
                    var vc = results[i].vc.value;
                    var dateStr = (results[i].key_as_string + "").replace("T", " ").replace("00:00.000Z", "00:00:00");
                    result.time.push(dateStr);
                    result.quota.push(vc);
                }
                callbackFn(result);
            } else
                callbackFn(result);
        });
    },
    outRate: function (es, index, type, start, end, interval, callbackFn) {  // 跳出率
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
                    "result": {
                        "date_histogram": {
                            "field": "utime",
                            "interval": interval / 1000 + "s",
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
                                    "svc": {
                                        "value_count": {
                                            "field": "tt"
                                        }
                                    }
                                }
                            },
                            "vc": {
                                "value_count": {
                                    "field": "tt"
                                }
                            }
                        }
                    }
                }
            }
        };

        es.search(request, function (error, response) {
            var result = {
                "label": "outRate",
                "time": [],
                "quota": []
            };
            if (response != undefined) {
                var results = response.aggregations.result.buckets;
                for (var i = 0, l = results.length; i < l; i++) {
                    var svc = results[i].vc.value;
                    var vc = results[i].single_visitor_aggs.svc.value;
                    var dateStr = (results[i].key_as_string + "").replace("T", " ").replace("00:00.000Z", "00:00:00");
                    result.time.push(dateStr);

                    var outRate = "0%";
                    if (vc > 0)
                        outRate = (parseFloat(svc) / parseFloat(vc) * 100).toFixed(2) + "%";
                    result.quota.push(outRate);
                }
                callbackFn(result);
            } else
                callbackFn(result);
        });
    },
    avgTime: function (es, index, type, start, end, interval, callbackFn) {  // 平均访问时长
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
                    "result": {
                        "date_histogram": {
                            "field": "utime",
                            "interval": interval / 1000 + "s",
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
                            "tvt": {
                                "sum": {
                                    "script": "sum_time = 0; tmp = 0; for (t in doc['utime'].values) { if (tmp > 0) { sum_time += (t - tmp) }; tmp = t}; sum_time"
                                }
                            },
                            "vc": {
                                "value_count": {
                                    "field": "tt"
                                }
                            }
                        }
                    }
                }
            }
        };

        es.search(request, function (error, response) {
            var result = {
                "label": "avgTime",
                "time": [],
                "quota": []
            };
            if (response != undefined) {
                var results = response.aggregations.result.buckets;
                for (var i = 0, l = results.length; i < l; i++) {
                    var tvt = results[i].tvt.value;
                    var vc = results[i].vc.value;
                    var dateStr = (results[i].key_as_string + "").replace("T", " ").replace("00:00.000Z", "00:00:00");
                    result.time.push(dateStr);

                    var avgTime = "00:00:00";
                    if (vc > 0) {
                        avgTime = Math.ceil(parseFloat(tvt) / parseFloat((vc)));
                        avgTime = new Date(avgTime).Format("hh:mm:ss");
                    }
                    result.quota.push(avgTime);
                }
                callbackFn(result);
            } else
                callbackFn(result);
        });
    },
    pageConversion: function (es, index, type, start, end, interval, callbackFn) {  // 页面转化
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
                    "result": {
                        "date_histogram": {
                            "field": "utime",
                            "interval": interval / 1000 + "s",
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
                        "aggs": {}
                    }
                }
            }
        };

    },
    eventConversion: function (es, index, type, start, end, interval, callbackFn) {  // 事件转化
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
                    "result": {
                        "date_histogram": {
                            "field": "utime",
                            "interval": interval / 1000 + "s",
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
                        "aggs": {}
                    }
                }
            }
        };

    },
    arrivedRate: function (es, index, type, start, end, interval, callbackFn) {  // 抵达率
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
                    "result": {
                        "date_histogram": {
                            "field": "utime",
                            "interval": interval / 1000 + "s",
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
                        "aggs": {}
                    }
                }
            }
        };

    }
};

module.exports = es_request;