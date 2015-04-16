var express = require('express');
var url = require('url');
var date = require('../utils/date');
var dateFormat = require('../utils/dateFormat');
var pie = require('../services/pie');
var line = require('../services/line');
var bar = require('../services/bar');
var grid = require('../services/grid');
var resutil = require('../utils/responseutils');
var datautils = require('../utils/datautils');
var es_request = require('../services/es_request');
var initial = require('../services/visitors/initialData');

var api = express.Router();

api.get('/charts', function (req, res) {
    var query = url.parse(req.url, true).query;
    var querytypes = [];
    var type = query['type'];

    if (type.indexOf(",") > -1)for (var i = 0; i < type.split(",").length; i++) {
        querytypes.push(type.split(",")[i]);
    }
    else
        querytypes.push(type);

    var uvindexs = date.between(req, "visitor-");
    var pvindexs = date.between(req, "access-");

    var start = Number(query['start']);
    var end = Number(query['end']);
    var inv = Number(query['int']);
    var interval = Math.ceil((end - start) / inv);
    if (interval >= 86400000) interval = "day"; else interval = interval / 1000 + "s";
    querytypes.forEach(function (qtype) {
        switch (qtype) {
            case "uv":
                line.uv(req.es, start, end, interval, uvindexs, 1, qtype, "tt", function (body) {
                    datautils.send(res, body);
                });
                break;
            case "pv":
                line.pv(req.es, start, end, interval, pvindexs, 1, qtype, "loc", function (body) {
                    datautils.send(res, body);
                    //datautils.lineData(res, body, qtype);
                });
                break;
            case "ip":
                break;
            case "avgVisitTime":
                line.calAvgVisitTime(req.es, start, end, interval, uvindexs, 1, qtype, "utime", function (result) {
                    datautils.send(res, result);
                    //console.log(JSON.stringify(result));
                });
                break;
            case "outRate":
                line.calJumpRate(req.es, start, end, interval, uvindexs, 1, qtype, function (result) {
                    datautils.send(res, result);
                });
                break;
            case "city":
                break;
            case "arrRate":
                line.convertRate(req.es, start, end, interval, pvindexs, 1, qtype, "http://sem.best-ad.cn/index", function (result) {
                    datautils.send(res, result);
                });
                break;
            case "convertRate":
                line.convertRate(req.es, start, end, interval, pvindexs, 1, qtype, "http://sem.best-ad.cn/login,http://sem.best-ad.cn/home", function (result) {
                    datautils.send(res, result);
                });
                break;
            case "province":
                break;
            default :
                break;
        }
    });
});
api.get('/map', function (req, res) {
    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var start = Number(query['start']);
    var end = Number(query['end']);
    switch (type) {
        case "pv":
            var indexs = date.between(req, "access-");
            bar.pu(req.es, start, end, null, indexs, 1, type, null, function (body) {
                datautils.send(res, body);
            });
            break;
        case "uv":
            var indexs = date.between(req, "visitor-");
            bar.pu(req.es, start, end, null, indexs, 1, type, null, function (body) {
                datautils.send(res, body);
            });
            break;
    }
});
api.get('/pie', function (req, res) {
    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var field = query['field'];
    var start = Number(query['start']);
    var end = Number(query['end']);
    switch (type) {
        case "pv":
            var indexs = date.between(req, "access-");
            pie.on(req.es, start, end, indexs, 1, type, function (body) {
                datautils.send(res, body);
            })
            break;
        case "uv":
            var indexs = date.between(req, "visitor-");
            pie.on(req.es, start, end, indexs, 1, type, function (body) {
                datautils.send(res, body);
            })
            break;
    }
});
api.get('/grid', function (req, res) {
    var query = url.parse(req.url, true).query;
    var type = query['type'], start = Number(query['start']), end = Number(query['end']);

    switch (type) {
        case "pv":
            var indexs = date.between(req, "access-");
            grid.default(req.es, indexs, 1, "kw", function (body) {
                datautils.send(res, body);
            });
            break;
        case "uv":
            var indexs = date.between(req, "visitor-");
            grid.default(req.es, indexs, 1, "kw", function (body) {
                datautils.send(res, body);
            });
            break;
        default :
            var indexs = date.between(req, "access-");
            grid.default(req.es, indexs, 1, "kw", function (body) {
                datautils.send(res, body);
            });
            break;
    }
});

// ================================= baizz ================================
// 推广概况
api.get('/survey', function (req, res) {
    var query = url.parse(req.url, true).query;

    var type = query['type'];
    var qtype = query['qtype'];
    var start = Number(query['start']);
    var end = Number(query['end']);
    var indexes = date.between(req, "visitor-");


    if (qtype == 0) {
        es_request.survey(req.es, query['c'], start, end, type, indexes[0], function (result) {
            datautils.send(res, JSON.stringify(result));
        });
    } else {
        var inv = Number(query['int']);
        var interval = Math.ceil((end - start) / inv);

        switch (qtype) {
            case "pv":
                es_request.pv(req.es, indexes[0], type, start, end, interval, function (result) {
                    datautils.send(res, JSON.stringify(result));
                });
                break;
            case "uv":
                es_request.uv(req.es, indexes[0], type, start, end, interval, function (result) {
                    datautils.send(res, JSON.stringify(result));
                });
                break;
            case "vc":
                es_request.vc(req.es, indexes[0], type, start, end, interval, function (result) {
                    datautils.send(res, JSON.stringify(result));
                });
                break;
            case "outRate":
                es_request.outRate(req.es, indexes[0], type, start, end, interval, function (result) {
                    datautils.send(res, JSON.stringify(result));
                });
                break;
            case "avgTime":
                es_request.avgTime(req.es, indexes[0], type, start, end, interval, function (result) {
                    datautils.send(res, JSON.stringify(result));
                });
                break;
            case "pageConversion":
                es_request.pageConversion(req.es, indexes[0], type, start, end, interval, function (result) {
                    datautils.send(res, JSON.stringify(result));
                });
                break;
            case "eventConversion":
                es_request.eventConversion(req.es, indexes[0], type, start, end, interval, function (result) {
                    datautils.send(res, JSON.stringify(result));
                });
                break;
            case "arrivedRate":
                es_request.arrivedRate(req.es, indexes[0], type, start, end, interval, function (result) {
                    datautils.send(res, JSON.stringify(result));
                });
                break;
            default :
                break;
        }
    }

});
// 推广方式

// 搜索推广
// ========================================================================

// ================================= SubDong ================================
//访客地图
api.get('/visitormap', function (req, res) {
    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var start = Number(query['start']);
    var end = Number(query['end']);
    var indexes = date.between(req, "visitor-");
    initial.visitorMapBasic(req.es, indexes, type, function (data) {
        datautils.send(res, JSON.stringify(data));
    })
});
//访客地图
api.get('/provincemap', function (req, res) {
    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var start = Number(query['start']);
    var end = Number(query['end']);
    var areas = query['areas'];
    var property = query['property'];
    if(property == "ct"){
        var indexes = date.between(req, "access-");
    }else{
        var indexes = date.between(req, "visitor-");
    }
    initial.chartData(req.es,indexes,type,areas,property,function (data){
        datautils.send(res,data);
    })
});

// ================================XiaoWei=====================================
api.get("/vapie", function (req, res) {
    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var start = Number(query['start']);
    var end = Number(query['end']);
    switch (type) {
        case "pv":
            var indexs = date.between(req, "access-");
            pie.comeForm(req.es, start, end, indexs, 1, function (body) {
                datautils.send(res, body);
            });
            break;
        case "uv":
            var indexs = date.between(req, "access-");
            pie.uv(req.es, start, end, indexs, 1, function (body) {
                datautils.send(res, body);
            });
            break;
        case "arrCount":
            var indexs = date.between(req, "visitor-");
            pie.comeForm(req.es, start, end, indexs, 1, function (body) {
                datautils.send(res, body);
            });
            break;
    }
});
module.exports = api;