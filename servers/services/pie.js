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
            if (esBody != undefined) {
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
                        var config={};
                        config["dataKey"]="name";
                        config["dataValue"]="value";
                        result_data["label"] = name_data;
                        result_data["data"] = data;
                        result_data["config"]=config;
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
    }
}
module.exports = pie;