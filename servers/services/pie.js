/**
 * Created by XiaoWei on 2015/3/31.
 */
var pie = {
    on: function (es, start, end, indexs, type, qtype, func) {
        var searchBody = {
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
                    "terms": {
                        "field": "pm"
                    }
                }
            }
        }
        var request = {
            "index": indexs,
            "type": type,
            "body": searchBody
        }
        es.search(request, function (err, esBody) {
            var result_data = {label: "暂无数据", data: []};
            if (esBody) {
                if (esBody.status == undefined) {
                    var data = [];
                    var name_data = [];
                    var result = esBody.aggregations;
                    var qData = result["result"];
                    if (qData.buckets.length > 0) {
                        qData.buckets.forEach(function (e) {
                            var tmp_data = {};
                            var pm = e.key == 0 ? "PC" : "移动";
                            tmp_data["name"] = pm;
                            name_data.push(pm);
                            tmp_data["value"] = e.doc_count;
                            data.push(tmp_data);
                        });
                        var config = {};
                        config["dataKey"] = "name";
                        config["dataValue"] = "value";
                        result_data["label"] = name_data;
                        result_data["data"] = data;
                        result_data["config"] = config;
                        if (func)
                            func(result_data);
                    } else {
                        if (func)
                            func(result_data);
                    }
                } else {
                    if (func)
                        func(result_data);
                }
            } else {
                func(result_data);
            }
        });
    },
    comeForm: function (es, start, end, indexs, type, fb) {
        var searchBody = {
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
                    "filters": {
                        "filters": {
                            "zj": {
                                "term": {
                                    "rf_type": 1
                                }
                            },
                            "yq": {
                                "term": {
                                    "rf_type": 2
                                }
                            },
                            "ot": {
                                "term": {
                                    "rf_type": 3
                                }
                            }
                        }
                    }
                }
            }
        };
        var request = {
            "index": indexs,
            "type": type,
            "body": searchBody
        }
        es.search(request, function (err, esBody) {
            var result_data = {label: ["直接访问", "搜索引擎", "外部链接"], data: []};
            if (esBody) {
                if (esBody.status == undefined) {
                    var result = esBody.aggregations.result;
                    var bucket = result.buckets;
                    var data=[];
                    var zj={};
                    zj["name"]="直接访问";
                    zj["value"]=bucket.zj.doc_count;
                    data.push(zj);
                    var yq={};
                    yq["name"]="搜索引擎";
                    yq["value"]=bucket.yq.doc_count;
                    data.push(yq);
                    var ot={};
                    ot["name"]="外部链接";
                    ot["value"]=bucket.ot.doc_count;
                    data.push(ot);
                    result_data["label"] = ["外部链接", "搜索引擎", "直接访问"];
                    result_data["data"] = data;
                    fb(result_data);
                } else {
                    fb(result_data);
                }
            } else {
                fb(result_data);
            }
        });
    },
    arrCount: function (es, start, end, indexs, type, fb) {

    }
}
module.exports = pie;