var express = require('express')
var url = require('url')
var date = require('../utils/date')
var resutil = require('../utils/responseutils')
var api = express.Router()

api.get('/time', function (req, res) {
    var parsed = url.parse(req.url, true)
    var indexs = date.between(req, "access-")
    var type = parsed.query['type']

    if (!type) {
        type = 'pv'
    }
    var types = type.split(",")

    var searchbody = {
        "aggs": {},
        "size": 0
    }


    types.forEach(function (type) {
        searchbody.aggs[type] = {
            "date_histogram": {
                "field": "utime",
                "interval": "1m"
            }
        }

    })

    req.es.search({
        index: indexs.toString(),
        type: 1,
        body: searchbody
    }).then(function (body) {

        var result = {}
        result['hits'] = body.hits
        var aggs = body.aggregations


        var lables = []

        types.forEach(function (type) {
            var values = []
            aggs[type].buckets.forEach(function (bucket) {
                values.push(bucket['doc_count'])
                if (lables.indexOf(bucket['key']) == -1) {
                    lables.push(bucket['key'])
                }
            })
            result[type] = values
        })

        result['lables'] = lables

        res.write(JSON.stringify(result));
        res.end()
    }, function (err) {
        console.error(err)
    })

})


module.exports = api