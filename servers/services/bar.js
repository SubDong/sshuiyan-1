/**
 * Created by XiaoWei on 2015/4/1.
 */
var bar = {
    pu: function (es, start, end, intervals, indexs, type, qtype, fields, cb) {
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
                    "pu": {
                        "global": {},
                        "aggs": {
                            "region": {
                                "terms": {
                                    "field": "region",
                                    "size": 10
                                }
                            }
                        }
                    }
                }
            }
        }
        es.search(request, function (err, esBody) {
            var data = {label: "暂无数据", data: []};
            if (esBody != undefined) {
                if (esBody.status == undefined) {
                    var result = esBody.aggregations;
                    var qData = result.pu;
                    if (qData.region != undefined) {
                        var region = qData.region;
                        var result_data = [];
                        region.buckets.forEach(function (e) {
                            var data = {};
                            data["name"] = e.key;
                            data["value"] = e.doc_count;
                            result_data.push(data);
                        });
                        var config={};
                        config["dataKey"]="name";
                        config["dataValue"]="value";
                        data["label"] = qtype;
                        data["data"] = result_data;
                        data["config"]=config;
                        if (cb)
                            cb(data)
                    } else {
                        if (cb)
                            cb(data)
                    }
                } else {
                    if (cb)
                        cb(data);
                }
            }
            else {
                if (cb)
                    cb(data);
                console.error(err);
            }

        });

    }
};
module.exports = bar;