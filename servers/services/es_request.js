/**
 * Created by baizz on 2015-4-9.
 *
 * 该代码包含推广概况、推广方式、搜索推广的es查询请求
 */
var es_request = {
    survey: function (es, category, start, end, type, index, callbackFn) {
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
                    "single_uv_aggs": {
                        "filter": {
                            "script": {
                                "script": "doc['loc'].values.size() == param1",
                                "params": {
                                    "param1": 1
                                }
                            }
                        },
                        "aggs": {
                            "single_uv_count": {
                                "value_count": {
                                    "field": "loc"
                                }
                            }
                        }
                    },
                    "total_uv_count": {
                        "value_count": {
                            "field": "tt"
                        }
                    },
                    "total_pv_count": {
                        "value_count": {
                            "field": "loc"
                        }
                    },
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
                var _single_uv_count = aggs.single_uv_aggs.single_uv_count.value;
                var _total_uv_count = aggs.total_uv_count.value;
                var _total_pv_count = aggs.total_pv_count.value;
                var _total_visit_time = aggs.total_visit_time.value;
                //var _page_conv_count = aggs.page_conv_count.value;
                var _event_conv_count = aggs.event_conv_count.value;

                var outRate = "0%";
                var avgTime = "00:00:00";
                if (_total_uv_count > 0) {
                    outRate = (parseFloat(_single_uv_count) / parseFloat(_total_uv_count) * 100).toFixed(2) + "%";
                    avgTime = Math.ceil(parseFloat(_total_visit_time) / parseFloat((_total_uv_count)));
                    avgTime = new Date(avgTime).Format("hh:mm:ss");

                }
                result["pv"] = _total_pv_count;
                result["uv"] = _total_uv_count;
                //result["page_conv"] = _page_conv_count;
                result["event_conv"] = _event_conv_count;
                result["outRate"] = outRate;
                result["avgTime"] = avgTime;

                callbackFn(result);
            } else
                callbackFn(result);
        });
    }
};

module.exports = es_request;