/**
 * Created by yousheng on 15/3/26.
 */
var pv = {
    pdatechart: function (es, start, end, intervals, indexs, type, fields, cb) {
        var fieldagg = {};
        fields.split(",").forEach(function (field) {
            fieldagg[field] = {
                "terms": {
                    "field": field
                }
            }
        })

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
                        "histogram": {
                            "field": "utime",
                            "interval": intervals,
                            "min_doc_count": 0
                        },
                        "aggs": fieldagg
                    }
                }
            }
        }

        es.search(request).then(function (body) {
                if (cb) {
                    cb(body)
                }
            }, function (err) {
                if (err) {
                    console.error(err)
                }
            }
        )
    }
}

module.exports = pv