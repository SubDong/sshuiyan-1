

var heaturl_request = {
    searchHeaderData: function (es, indexes, type, rf ,callbackFn) {
        //声明 请求参数 变量
        var request = null;
        request = {
            "index": indexes,
            "type": type,
            "body": {
                "size": 0,
                "aggs": {
                    "link_hits": {
                        "filters": {
                            "filters": {
                                "data": {
                                    "term": {
                                        "rf": "http://www.best-ad.cn/"
                                    }
                                }
                            }
                        },
                        "aggs": {
                            "link_hits": {
                                "terms": {
                                    "field": "loc"
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
                    },
                    "hits": {
                        "filters": {
                            "filters": {
                                "data": {
                                    "term": {
                                        "rf": "http://www.best-ad.cn/"
                                    }
                                }
                            }
                        },
                        "aggs": {
                            "hits": {
                                "value_count": {
                                    "field": "loc"
                                }
                            }
                        }
                    },
                    "pv": {
                        "filters": {
                            "filters": {
                                "data": {
                                    "term": {
                                        "loc": "http://www.best-ad.cn/"
                                    }
                                }
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
            var data = [];
            try {
                var result = response.aggregations;

                callbackFn(result);
            } catch (err) {
                console.error(err.stack);
            }

        });
    }
};
module.exports = heaturl_request;