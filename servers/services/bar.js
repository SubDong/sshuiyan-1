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
        es.search(request).then(function (esBody) {
                var data = {};
                var result = esBody.aggregations;
                var qData = result["pu"];
                if (qData.region != undefined) {
                    var region = qData.region;
                    var result_data = [];
                    region.buckets.forEach(function (e) {
                        var data = {};
                        data["name"] = e.key;
                        data["value"] = e.doc_count;
                        result_data.push(data);
                    });
                    data["label"] = qtype;
                    data["data"] = result_data;
                    if (cb)
                        cb(data)
                } else {
                    if (cb)
                        cb(data)
                }
            }, function (err) {
                if (err) {
                    console.error(err)
                }
            }
        )

    }
};
module.exports = bar;