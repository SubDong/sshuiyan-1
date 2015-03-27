var express = require('express')
var url = require('url')
var date = require('../utils/date')
var uv = require('../services/uv')
var pv = require('../services/pv')
var resutil = require('../utils/responseutils')

var api = express.Router()

api.get('/charts', function (req, res) {
    var query = url.parse(req.url, true).query

    var type = query['type']
    var querytypes = []

    if (!type) {
        type = 'pv'
    }

    type = 'uv'

    var uvindexs = date.between(req, "visitor-")
    var pvindexs = date.between(req, "access-")

    querytypes = type.split(",")
    var start = Number(query['start'])
    var end = Number(query['end'])
    var inv = Number(query['int'])
    var interval = Math.ceil((end - start) / inv)
    var result = {}

    querytypes.forEach(function (qtype) {
        var qresult

        if (qtype == 'uv') {
            qb.udatechart(req.es, start, end, interval, uvindexs, 1, "tt", function (body) {
                console.log(body)
            })
        } else if (qtype == 'pv' || qtype == 'ip' || qtype == 'outnum' || qtype == 'outrate' || qtype == 'city' || qtype == 'province') {

        }

        result[qtype] = qresult;


    })

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