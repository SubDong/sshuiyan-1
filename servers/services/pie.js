/**
 * Created by XiaoWei on 2015/3/31.
 */
var pie = {
    pieChart: function (es, start, end, indexs, type, field, func) {
        var searchBody = {
            "size": 0,
            "aggs": {
                "result": {
                    "terms": {
                        "field": field
                    }
                }
            }
        }
        var request = {
            "index": indexs,
            "type": type,
            "body": searchBody
        }
        es.search(request).then(function (body) {
            if (func)
                func(body);
        }, function (err) {
            if (err)
                console.log(err);
        });
    }
}
module.exports = pie;