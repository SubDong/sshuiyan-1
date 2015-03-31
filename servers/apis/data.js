var express = require('express');
var url = require('url');
var date = require('../utils/date');
var uv = require('../services/uv');
var pv = require('../services/pv');
var resutil = require('../utils/responseutils');
var datautils = require('../utils/datautils');

var api = express.Router();

api.get('/charts', function (req, res) {
    var query = url.parse(req.url, true).query;
    var querytypes = [];
    var type = query['type'];

    if (type.indexOf(",") > -1)for (var i = 0; i < type.split(",").length; i++) {
        querytypes.push(type.split(",")[i]);
    } else querytypes.push(type);
    var uvindexs = date.between(req, "visitor-")
    var pvindexs = date.between(req, "access-")

    var start = Number(query['start']);
    var end = Number(query['end']);
    var inv = Number(query['int']);
    var interval = Math.ceil((end - start) / inv);
    var finally_result = {};

    querytypes.forEach(function (qtype) {
        if (qtype == 'uv') {
            uv.udatechart(req.es, start, end, interval, uvindexs, 1, "tt", function (body) {
                datautils.chartData(res, body, qtype);
            });
        } else if (qtype == 'pv' || qtype == 'ip' || qtype == 'outnum' || qtype == 'outrate' || qtype == 'city' || qtype == 'province') {
            //finally_result[qtype]=....
            pv.pdatechart(req.es, start, end, interval, pvindexs, 1, "utime", function (body) {
                datautils.chartData(res, body, qtype);
            });
        }
    });
})
api.get('/map', function (req, res) {
    var query = url.parse(req.url, true).query;
    var indexs = date.between(req, "access-");
    var type = query['type'];
    var start = Number(query['start']);
    var end = Number(query['end']);
    switch (type) {
        case "pv":
            pv.barChart(req.es, start, end, null, indexs, 1, null, function (body) {
                datautils.mapData(res, body, type);
            });
            break;
        case "uv":
            indexs = date.between(req, "visitor-");
            uv.barChart(req.es, start, end, null, indexs, 1, null, function (body) {
                datautils.mapData(res, body, type);
            });
            break;
    }
});

module.exports = api;