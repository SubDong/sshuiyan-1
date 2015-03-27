var express = require('express')
var url = require('url')
var date = require('../utils/date')
var uv = require('../services/uv')
var pv = require('../services/pv')
var resutil = require('../utils/responseutils')

var api = express.Router()

api.get('/charts', function (req, res) {
    var query = url.parse(req.url, true).query
    var querytypes = [];
    var type = query['type'];
    if (type.indexOf("," > -1))for (var i = 0; i < type.split(",").length; i++) {
        querytypes.push(type.split(",")[i]);
    } else querytypes.push(type);
    console.log(querytypes);

    var uvindexs = date.between(req, "visitor-")
    var pvindexs = date.between(req, "access-")

    var start = Number(query['start'])
    var end = Number(query['end'])
    var inv = Number(query['int'])
    var interval = Math.ceil((end - start) / inv)
    var finally_result = {};

    querytypes.forEach(function (qtype) {
        if (qtype == 'uv') {
            uv.udatechart(req.es, start, end, interval, uvindexs, 1, "tt",function(body){
                //var result = body.aggregations;
                //var pv = result.result;
                //var uv_Data = [];
                //pv.buckets.forEach(function (e) {
                //    var vo = {};
                //    vo["time"] = e.key;
                //    vo["value"] = e.doc_count;
                //    uv_Data.push(vo);
                //});
            });
            finally_result[qtype] = body;
        } else if (qtype == 'pv' || qtype == 'ip' || qtype == 'outnum' || qtype == 'outrate' || qtype == 'city' || qtype == 'province') {
            //finally_result[qtype]=....
        }
    });
    res.write(JSON.stringify(finally_result));
    res.end();
})

api.get('/map', function (req, res) {
    var query = url.parse(req.url, true).query;
    var indexs = date.between(req, "access-");
    var type = query['type'];
    var start = Number(query['start']);
    var end = Number(query['end']);
    if (type == "pv") {
        pv.mapChart(req.es, start, end, null, indexs, 1, null, function (body) {
            var result = body.aggregations;
            var region = result.pv.region;
            var data = {};
            var result_data = [];
            region.buckets.forEach(function (e) {
                var data = {};
                var name = e.key;
                if (name.indexOf("自治") > -1)data["name"] = name.slice(0, 2); else data["name"] = name.slice(0, -1);
                data["value"] = e.doc_count;
                result_data.push(data);
            });
            data["name"] = type;
            data["data"] = result_data;
            res.write(JSON.stringify(data));
            res.end();
        });
    } else if (type == "uv") {
        indexs = date.between(req, "visitor-");
        uv.mapChart(req.es, start, end, null, indexs, 1, null, function (body) {
            var result = body.aggregations;
            var region = result.uv.region;
            var data = {};
            var result_data = [];
            region.buckets.forEach(function (e) {
                var data = {};
                var name = e.key;
                if (name.indexOf("自治") > -1)data["name"] = name.slice(0, 2); else data["name"] = name.slice(0, -1);
                data["value"] = e.doc_count;
                result_data.push(data);
            });
            data["name"] = type;
            data["data"] = result_data;
            res.write(JSON.stringify(data));
            res.end();
        });
    }
});

module.exports = api;