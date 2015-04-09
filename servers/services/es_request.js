/**
 * Created by baizz on 2015-4-9.
 *
 * 该代码包含推广概况、推广方式、搜索推广的es查询请求
 */
var es_request = {
    // 计算今日和昨日的跳出率
    calOutRate: function (es, start, end, category, type, index, callbackFn) {
        var single_uv_request = {
            "index": index.toString(),
            "type": type,
            "body": {
                "query": {
                    "filtered": {
                        "query": {
                            "range": {
                                "utime": {
                                    "gte": start,
                                    "lte": end
                                }
                            }
                        },
                        "filter": {
                            "script": {
                                "script": "doc[\"loc\"].values.size() == param1",
                                "params": {
                                    "param1": 1
                                }
                            }
                        }
                    }
                },
                "size": 0,
                "aggs": {
                    "single_uv_count": {
                        "value_count": {
                            "field": "loc"
                        }
                    }
                }
            }
        };

        var total_uv_request = {
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
                    "total_uv_count": {
                        "value_count": {
                            "field": "tt"
                        }
                    }
                }
            }
        };

        var single_uv_result = null;

        function getSingleUVResult() {
            return single_uv_result;
        }

        function getCategory() {
            return category;
        }

        es.search(single_uv_request, function (error, response) {
            if (response != undefined)
                single_uv_result = response.aggregations.single_uv_count;
            else
                console.error(error);

        });

        es.search(total_uv_request, function (error, response) {
            var result = {"category": getCategory(), "label": "outRate", "data": "0%"};
            if (response != undefined) {
                var total_uv_result = response.aggregations.total_uv_count;
                var single_uv_result = getSingleUVResult();

                if (single_uv_result != null && total_uv_result != null) {
                    if (total_uv_result.value > 0)
                        result["data"] = (parseFloat(single_uv_result.value) / parseFloat(total_uv_result.value) * 100).toFixed(2) + "%";
                    callbackFn(result);
                } else
                    callbackFn(result);
            } else
                callbackFn(result);
        });
    },
    calAvgTime: function (es, start, end, category, type, index, callbackFn) {
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
                    "total_time": {
                        "sum": {
                            "script": "sum_time = 0; tmp = 0; for (t in doc[utime].values) { if (tmp > 0) { sum_time += (t - tmp) }; tmp = t}; sum_time"
                        }
                    }
                }
            }
        };

        function getCategory() {
            return category;
        }

        es.search(request, function (error, response) {
            var result = {"category": getCategory(), "label": "avgTime", "data": "0%"};
            if (response != undefined) {
                result["data"] = response.aggregations.total_time.value;
                callbackFn(result);
            } else
                callbackFn(result);
        });
    },
    totalVisitTime: function (es, start, end, category, type, index, callbackFn) {
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
                    "total_time": {
                        "sum": {
                            "script": "sum_time = 0; tmp = 0; for (t in doc[utime].values) { if (tmp > 0) { sum_time += (t - tmp) }; tmp = t}; sum_time"
                        }
                    }
                }
            }
        };

        function getCategory() {
            return category;
        }

        es.search(request, function (error, response) {
            var result = {"category": getCategory(), "label": "totalVisitTime", "data": "0"};
            if (response != undefined) {
                result["data"] = response.aggregations.total_time.value;
                callbackFn(result);

            } else
                callbackFn(result);
        });
    },
    pu: function (es, start, end, category, field, type, index, callbackFn) {
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
                    "pu": {
                        "value_count": {
                            "field": field
                        }
                    }
                }
            }
        };

        function getCategory() {
            return category;
        }

        es.search(request, function (error, response) {
            var result = {"category": getCategory(), "label": "pu", "data": "0"};
            if (response != undefined) {
                result["data"] = response.aggregations.pu.value;
                callbackFn(result);
            }
            else
                callbackFn(result);

        });
    },
    singleUV: function (es, start, end, category, type, index, callbackFn) {
        var single_uv_request = {
            "index": index.toString(),
            "type": type,
            "body": {
                "query": {
                    "filtered": {
                        "query": {
                            "range": {
                                "utime": {
                                    "gte": start,
                                    "lte": end
                                }
                            }
                        },
                        "filter": {
                            "script": {
                                "script": "doc[\"loc\"].values.size() == param1",
                                "params": {
                                    "param1": 1
                                }
                            }
                        }
                    }
                },
                "size": 0,
                "aggs": {
                    "single_uv_count": {
                        "value_count": {
                            "field": "loc"
                        }
                    }
                }
            }
        };

        function getCategory() {
            return category;
        }

        es.search(single_uv_request, function (error, response) {
            var result = {"category": getCategory(), "label": "pu", "data": "0"};
            if (response != undefined) {
                result["data"] = response.aggregations.single_uv_count;
                callbackFn(result);
            } else
                callbackFn(result);

        });
    }
};

module.exports = es_request;