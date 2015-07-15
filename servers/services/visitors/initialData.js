/**
 * Created by SubDong on 2015/4/9.
 * 访客基础数据
 */
var Map = require("../../utils/map");
require("../../utils/dateFormat")();
var initial = {
    /**
     *  基础数据
     * @param es
     * @param index es文档
     * @param type ͳ统计js安装id
     */
    visitorMapBasic: function (es, index, type, callbackFn) {
        var request = {
            "index": index.toString(),
            "type": type,
            "body": {
                "query": {
                    "match_all": {}
                },
                "size": 0,
                "aggs": {
                    "pv": {
                        "value_count": {
                            "field": "loc"
                        }
                    },
                    "ip": {
                        "global": {},
                        "aggs": {
                            "value_count": {
                                "terms": {
                                    "field": "remote",
                                    "size": 0
                                }
                            }
                        }
                    },
                    "uv": {
                        "value_count": {
                            "field": "_ucv"
                        }
                    },
                    "jump": {
                        "filter": {
                            "script": {
                                "script": "doc[\"loc\"].values.size() == param1",
                                "params": {
                                    "param1": 1
                                }
                            }
                        }
                    },
                    "avgTime": {
                        "sum": {
                            "script": "sum_time = 0; tmp = 0; for (t in doc['utime'].values) { if (tmp > 0) { sum_time += (t - tmp) }; tmp = t}; sum_time"
                        }
                    }
                }
            }
        };
        es.search(request, function (err, response) {
            if (response != undefined) {
                var result = {};
                //平均访问时间
                var calAvgTime = response.aggregations.avgTime.value / response.aggregations.pv.value;
                //跳出率
                var jump;
                if (response.hits.total == 0)
                    jump = "0%";
                else
                    jump = (parseFloat(response.aggregations.jump.doc_count) / parseFloat(response.hits.total) * 100).toFixed(2) + "%";

                result["avgTime"] = new Date(calAvgTime).format("hh:mm:ss");
                result["jump"] = jump;
                result["pv"] = response.aggregations.pv.value;
                result["uv"] = response.aggregations.uv.value;
                var s = response.aggregations.ip.value_count.buckets;
                var map = new Map();
                for (var t = 0; t < s.length; t++) {
                    var d = s[t].key.substring(0, s[t].key.indexOf(":"));
                    if (!map.containsKey(d)) {
                        map.put(d, d);
                    }
                }
                result["ip"] = map.size();
                callbackFn(result)
            } else {
                console.log(err);
            }
        });
    },

    /**
     *
     * @param es
     * @param index
     * @param type
     * @param areas 地域分组
     * @param property  统计依据
     * @param callbackFn
     */
    chartData: function (es, index, type, areas, property, chartFilter, callbackFn) {
        var queryFilter = {"match_all": {}};
        if (chartFilter != 'null') {
            queryFilter = {
                'bool': {
                    'must': [
                        {
                            "terms": {
                                "region": [
                                    chartFilter
                                ]
                            }
                        }
                    ]
                }
            }
        } else {
            queryFilter = {"match_all": {}}
        }
        var mapRequest = {};
        if (property == 'ct') {
            mapRequest = {
                "index": index.toString(),
                "type": type,
                "body": {
                    "query": queryFilter,
                    "size": 0,
                    "aggs": {
                        "areas": {
                            "terms": {
                                "field": "region",
                                "order": {
                                    "data_count": "desc"
                                }
                            },
                            "aggs": {
                                "data_count": {
                                    "sum": {
                                        "script": "v1=0; if (doc['ct'].value == 0) { v1 +=1;};v1"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            mapRequest = {
                "index": index.toString(),
                "type": type,
                "body": {
                    "query": queryFilter,
                    "size": 0,
                    "aggs": {
                        "areas": {
                            "terms": {
                                "field": areas,
                                "order": {
                                    "data_count": "desc"
                                }
                            },
                            "aggs": {
                                "data_count": {
                                    "value_count": {
                                        "field": property
                                    }
                                }
                            }
                        }
                    }
                }
            };
        }
        es.search(mapRequest, function (err, response) {
            if (response != undefined) {
                callbackFn(response);
            } else {
                console.log(err)
            }
        });
    },

    /**
     *
     * @param es
     * @param index
     * @param type
     * @param areas
     * @param property
     * @param callbackFn
     */
    chartDataCommon: function (es, index, type, areas, property, callbackFn) {
        var value = {};
        property.forEach(function (item, i) {
            switch (item) {
                case "pv":
                    value[item] = {"value_count": {"field": "loc"}};
                    break;
                case "tt":
                    value[item] = {"value_count": {"field": "tt"}};
                    break;
                case "uv":
                    value[item] = {"value_count": {"field": "_ucv"}};
                    break;
                case "ct":
                    value[item] = {"sum": {"script": "v1=0; if (doc['ct'].value != 0) { v1 +=1;};v1"}};
                    break;
                case "ip":
                    value[item] = {"cardinality": {"field": "remote"}};
                    break;
                case "jump":
                    value["jumpTT"] = {"value_count": {"field": "tt"}};
                    value[item] = {
                        "filter": {
                            "script": {
                                "script": "doc['loc'].values.size() == param1",
                                "params": {"param1": 1}
                            }
                        }
                    };
                    break;
                case "avgTime":
                    value["avgPv"] = {"value_count": {"field": "loc"}};
                    value[item] = {"script": "sum_time = 0; tmp = 0; for (t in doc['utime'].values) { if (tmp > 0) { sum_time += (t - tmp) }; tmp = t}; sum_time"};
                    break;
            }
        });
        var request = {
            "index": index.toString(),
            "type": type,
            "body": {
                "query": {
                    "match_all": {}
                },
                "size": 0,
                "aggs": {
                    "areas": {
                        "terms": {
                            "field": areas
                        },
                        "aggs": value
                    }
                }
            }
        }
        es.search(request, function (err, response) {
            if (response != undefined) {
                callbackFn(response);
            } else {
                console.log(err)
            }
        });
    }
};
module.exports = initial;