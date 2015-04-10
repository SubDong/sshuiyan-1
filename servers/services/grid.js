/**
 * Created by XiaoWei on 2015/4/3.
 */
var grid = {
    default: function (es, indexs, type, field, func) {
        var searchBody = {
            "size": 0,
            "aggs": {
                "result": {
                    "terms": {
                        "field": "kw",
                        "size":10
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
                var result_data = {};
                if (esBody != undefined) {
                    if (esBody.status == undefined) {
                        var result = esBody.aggregations;
                        var qData = result.result;
                        var tmp_data = [];
                        qData.buckets.forEach(function (e) {
                            var data = {};
                            if (e.key != "-") {
                                data['name'] = e.key;
                                data["value"] = e.doc_count;
                                tmp_data.push(data);
                            }
                        });
                        var config={};
                        config["dataKey"]="name";
                        config["dataValue"]="value";
                        result_data["label"] = "搜索词";
                        result_data["data"] = tmp_data;
                        result_data["config"]=config
                        func(result_data);
                    } else {
                        func(result_data);
                    }
                } else {
                    func(result_data);
                    console.log(err);
                }
            }
        );
    },
    uv: function () {
    }
}
module.exports = grid;