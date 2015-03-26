function esearch(es, start, end, intervals, indexs, type, cb) {

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
            "aggs": {
                "result": {
                    "date_histogram": {
                        "field": "utime",
                        "interval": intervals,
                        "min_doc_count": 0
                    }
                }
            }
        }
    }

    es.search(request).then(function (body) {
            if (cb) {
                cb(body)
            }
        }
    )
}