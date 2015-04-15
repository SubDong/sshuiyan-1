/**
 * Created by baizz on 2015-4-1.
 *
 * ======================================== 跳出率 ========================================
 * key: millisecond
 * rate: 跳出率
 *
 * 返回的数据格式: [{"key":1427853600000,"rate":"100.00%"},{"key":1427857200000,"rate":"33.33%"}]
 *
 *
 * ====================================== 平均访问时长 ======================================
 * key: millisecond
 * time: 平均访问时长
 *
 * 返回的数据格式: [{"key":1427860800000,"time":"4829840"},{"key":1427864400000,"time":"4799125"}]
 */
var date = require('../utils/date');
var line = {
    calJumpRate: function (es, start, end, intervals, index, type, qtype, callbackFn) {
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
                    "result": {
                        "date_histogram": {
                            "field": "utime",
                            "interval": intervals,
                            "time_zone": "+08:00",
                            "order": {
                                "_key": "asc"
                            },
                            "min_doc_count": 0,
                            "extended_bounds": {
                                "min": start,
                                "max": end
                            }
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
                    "result": {
                        "date_histogram": {
                            "field": "utime",
                            "interval": intervals,
                            "time_zone": "+08:00",
                            "order": {"_key": "asc"},
                            "min_doc_count": 0,
                            "extended_bounds": {
                                "min": start,
                                "max": end
                            }
                        },
                        "aggs": {
                            "tuv": {
                                "value_count": {
                                    "field": "tt"
                                }
                            }
                        }
                    }
                }
            }
        };

        var single_uv_result = null;

        function getSingleUVResult() {
            return single_uv_result;
        }

        es.search(single_uv_request, function (error, response) {
            var result_data = {label: "暂无数据", data: []};
            if (error)
                return;

            if (response != undefined) {
                if (response.status == undefined)
                    single_uv_result = response.aggregations.result.buckets;
                else
                    console.error(error);
            }

        });

        es.search(total_uv_request, function (error, response) {
            var result_data = {label: "暂无数据", data: []};
            if (response) {
                if (response.status == undefined) {
                    var total_uv_result = response.aggregations.result.buckets;
                    var single_uv_result = getSingleUVResult();
                    if (single_uv_result != null && total_uv_result != null) {
                        var result = [];
                        for (var i = 0, l = total_uv_result.length; i < l; i++) {
                            var obj = {};
                            if (total_uv_result[i].tuv.value === 0) {
                                if (intervals.indexOf("day") > -1)obj["time"] = date.formatDate(total_uv_result[i].key); else obj["time"] = date.formatTime(total_uv_result[i].key);
                                obj["value"] = 0;
                                result.push(obj);
                            } else {
                                if (intervals.indexOf("day") > -1)obj["time"] = date.formatDate(total_uv_result[i].key); else obj["time"] = date.formatTime(total_uv_result[i].key);
                                obj["value"] = parseFloat(single_uv_result[i].doc_count) / parseFloat(total_uv_result[i].tuv.value) * 100;
                                result.push(obj);
                            }
                        }
                        var config = {};
                        config["dataKey"] = "time";
                        config["dataValue"] = "value";
                        result_data["label"] = qtype;
                        result_data["data"] = result;
                        result_data["format"] = "outRate";
                        result_data["config"] = config;
                        callbackFn(result_data);
                    }
                }
                else {
                    callbackFn(result_data);
                }
            } else {
                callbackFn(result_data);
            }

        });

    },
    calAvgVisitTime: function (es, start, end, intervals, index, type, qtype, field, callbackFn) {
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
                            "field": field,
                            "interval": intervals,
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
                                    "script": "sum_time = 0; tmp = 0; for (t in doc[\"" + field + "\"].values) { if (tmp > 0) { sum_time += (t - tmp) }; tmp = t}; sum_time"
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
            var result_data = {label: "暂无数据", data: []};
            if (response) {
                if (response.status == undefined) {
                    var result = [];
                    response.aggregations.result.buckets.forEach(function (hit) {
                        var obj = {};
                        if (intervals.indexOf("day") > -1)obj["time"] = date.formatDate(hit.key); else obj["time"] = date.formatTime(hit.key);
                        if (hit.vc.value != 0) obj["value"] = parseInt(hit.tvt.value /(hit.vc.value*1000)); else obj["value"] = hit.tvt.value;
                        result.push(obj);
                    });
                    var config = {};
                    config["dataKey"] = "time";
                    config["dataValue"] = "value";
                    result_data["label"] = qtype;
                    result_data["data"] = result;
                    result_data["format"] = "avgTime";
                    result_data["config"] = config;
                    callbackFn(result_data);
                } else {
                    callbackFn(result_data);
                }
            } else {
                callbackFn(result_data);
            }
        });
    },
    pv: function (es, start, end, intervals, indexs, type, qtype, field, cb) {//pv，uv
        var aggsflag = {
            "pu": {
                "value_count": {
                    "field": field
                }
            }
        }
        var request = {
            "index": indexs.toString(),
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
                            "interval": intervals,
                            "time_zone": "+08:00",
                            "order": {"_key": "asc"},
                            "min_doc_count": 0,
                            "extended_bounds": {
                                "min": start,
                                "max": end
                            }
                        },
                        "aggs": aggsflag
                    }
                }
            }
        };

        es.search(request, function (error, response) {
            var resultData = {label: "暂无数据", data: []};
            if (response) {
                if (response.status == undefined) {
                    var result = response.aggregations;
                    if (result != undefined) {
                        var pv = result.result;
                        var uv_Data = [];
                        pv.buckets.forEach(function (e) {
                            var vo = {};
                            if (intervals.indexOf("day") > -1)vo["time"] = date.formatDate(e.key); else vo["time"] = date.formatTime(e.key);
                            vo["value"] = e["pu"].value;
                            uv_Data.push(vo);
                        });
                        var config = {};
                        config["dataKey"] = "time";
                        config["dataValue"] = "value";
                        resultData["label"] = qtype;
                        resultData["data"] = uv_Data;
                        resultData["config"] = config;
                        if (cb)
                            cb(resultData);
                    } else {
                        if (cb)
                            cb(resultData);
                    }
                } else {
                    if (cb)
                        cb(resultData);
                }
            }
            else {
                if (cb)
                    cb(resultData);
                console.error(error);
            }
        });
    },
    uv: function (es, start, end, intervals, indexs, type, qtype, field, cb) {
        var request = {
            "index": indexs.toString(),
            "type": type,
            "body": {
                "size": 0,
                "query": {
                    "range": {
                        "utime": {
                            "gte": start,
                            "lte": end
                        }
                    }
                },
                "aggs": {
                    "result": {
                        "date_histogram": {
                            "field": "utime",
                            "interval": intervals,
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

        es.search(request, function (err, esBody) {
            var resultData = {label: "暂无数据", data: []};
            if (esBody) {
                if (esBody.status == undefined) {
                    var result = esBody.aggregations;
                    if (result != undefined) {
                        var pv = result.result;
                        var uv_Data = [];
                        pv.buckets.forEach(function (e) {
                            var vo = {};
                            if (intervals.indexOf("day") > -1)  vo["time"] = date.formatDate(e.key); else vo["time"] = date.formatTime(e.key);
                            vo["value"] = e["uv"].value;
                            uv_Data.push(vo);
                        });
                        var config = {};
                        config["dataKey"] = "time";
                        config["dataValue"] = "value";
                        resultData["label"] = qtype;
                        resultData["data"] = uv_Data;
                        resultData["config"] = config;
                        cb(resultData);
                    } else cb(resultData);
                } else cb(resultData);
            } else cb(resultData);
        });
    },
    convertRate: function (es, start, end, intervals, index, type, qtype, urls, cb) {
        var should = [], convertUrl, term = {}, item = {};
        if (urls.indexOf("," > -1)) {
            convertUrl = urls.split(",");
            for (var i = 0; i < urls.split(",").length; i++) {
                item["loc"] = convertUrl[i];
                term["term"] = item;
                should.push(term);
            }
        } else {
            item["loc"] = urls;
            term["term"] = item;
            should.push(term);
        }

        var request = {
            "index": index,
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
                    "convertRate": {
                        "filters": {
                            "filters": {
                                "convert": {
                                    "bool": {
                                        "should": should
                                    }
                                }
                            }
                        },
                        "aggs": {
                            "result": {
                                "date_histogram": {
                                    "field": "utime",
                                    "interval": intervals,
                                    "time_zone": "+08:00",
                                    "order": {
                                        "_key": "asc"
                                    },
                                    "min_doc_count": 0,
                                    "extended_bounds": {
                                        "min": start,
                                        "max": end
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        es.search(request, function (err, esBody) {
            var result_data = {label: "暂无数据", data: []};
            if (esBody) {
                if (esBody.status == undefined) {
                    var aggs = esBody.aggregations;
                    var convert = aggs.convertRate.buckets.convert.result.buckets;
                    var data = [];
                    convert.forEach(function (e) {
                        var vo = {};
                        if (intervals.indexOf("day") > -1)  vo["time"] = date.formatDate(e.key); else vo["time"] = date.formatTime(e.key);
                        vo["value"] = e.doc_count;
                        data.push(vo);
                    });
                    var config = {};
                    config["dataKey"] = "time";
                    config["dataValue"] = "value";
                    result_data["label"] = qtype;
                    result_data["data"] = data;
                    result_data["config"] = config;
                    if (cb)
                        cb(result_data);
                } else {
                    if (cb)
                        cb(result_data)
                }
            } else
                cb(result_data);
        });

    }
};

module.exports = line;
