var express = require('express')
var url = require('url')
var date = require('../utils/date')
var resutil = require('../utils/responseutils')
var api = express.Router()

api.get('/charts', function (req, res) {
    var parsed = url.parse(req.url, true)
    var indexs = date.between(req, "access-")
    console.log(indexs);
    var type = parsed.query['type']

    if (!type) {
        type = 'pv'
    }
    var types = type.split(",")
    var searchbody = {
        "aggs": {},
        "size": 10
    }
    types.forEach(function (type) {
        if (type == 'pv') {
            searchbody = {
                "query": {
                    "match_all": {}
                },
                "aggs": {
                    "pv": {
                        "terms": {"field": "utime"}
                    }
                }
            }
            console.log(searchbody);
        } else {
            searchbody.aggs[type] = {
                "date_histogram": {
                    "field": "utime",
                    "interval": "1m"
                }
            }
        }
    })
    req.es.search({
        index: indexs.toString(),
        body: searchbody
    }).then(function (body) {
        console.log(body);
        var result = {}
        result['hits'] = body.hits
        var aggs = body.aggregations


        var lables = []

        types.forEach(function (type) {
            var values = []
            aggs[type].buckets.forEach(function (bucket) {
                values.push(bucket['doc_count'])
                if (lables.indexOf(bucket['key']) == -1) {
                    lables.push(date.formatTime(bucket['key']));
                }
            })
            result[type] = values
        })

        result['lables'] = lables
        res.write(JSON.stringify(result));
        res.end()
    }, function (err) {
        console.error(err);
        res.status(500);
        res.end();
    })

})

//api.get('/map', function (req, res) {
//    var parsed = url.parse(req.url, true);
//    var indexs = date.between(req, "access-");
//    var type = parsed.query['type'];
//    var types;
//    var searchbody = {
//        "aggs": {},
//        "size": 10
//    }
//    if (type.indexOf(",") > -1) {
//        types=type.split(",");
//        types.forEach(function(type){
//            searchbody.aggs[type]={
//                "histogram":{
//                    "field":"city",
//                    "interval":"day"
//                },
//                "aggs":{
//                    "revenue":{
//                        "sum":{
//                            "field":"city"
//                        }
//                    }
//                }
//            }
//        });
//    }else{
//        searchbody.aggs[type]={
//            "histogram":{
//                "field":"city",
//                "interval":"day"
//            },
//            "aggs":{
//                "revenue":{
//                    "sum":{
//                        "field":"city"
//                    }
//                }
//            }
//        }
//    }
//
//console.log(searchbody);
//    req.es.search({
//        index:indexs.toString(),
//        body:searchbody
//    },function(err,result){
//        res.json(result);
//        res.end();
//    });
//});

module.exports = api