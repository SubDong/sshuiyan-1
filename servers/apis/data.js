var express = require('express');
var url = require('url');
var date = require('../utils/date');
var dateFormat = require('../utils/dateFormat')();
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
    var startOffset = Number(query['start']);
    var endOffset = Number(query['end']);
    var indexes = date.createIndexes(startOffset, endOffset, "visitor-");

    // 指标数组
    var quotas = [];
    quotas.push(qtype);


    if (qtype == 0) {
        es_request.survey(req.es, query['c'], type, indexes[0], function (result) {
            datautils.send(res, JSON.stringify(result));
        });
    } else {
        var period = date.period(startOffset, endOffset);
        var interval = date.interval(startOffset, endOffset);

        es_request.search(req.es, indexes, type, quotas, "period", null, period[0], period[1], interval, function (result) {
            datautils.send(res, JSON.stringify(result));
        });
    }

});
// 推广方式

// 搜索推广
// ========================================================================

// ================================= SubDong ================================
/*********************自定义指标通用*************************/
api.get('/indextable', function (req, res) {
    var query = url.parse(req.url, true).query;
    var _indic = query["indic"].split(",");
    var _lati = query["lati"];
    var _startTime = Number(query["start"]);
    var _endTime = Number(query["end"]);
    var _type = query["type"];
    var indexes = date.between(req, "visitor-");
    initial.chartDataCommon(req.es, indexes, _type ,_lati, _indic, function (data) {
        data = data.aggregations.areas.buckets;
        var result = [];

        var coumArray = new Array();
        data.forEach(function(item,i){
            var _obj = {};
            _obj[_lati] = item.key;
            _indic.forEach(function(items,i){
                if(items == "jump"){
                    _obj[items] = (parseFloat(item["jumpTT"].value) == 0?"0%":((parseFloat(item[items].doc_count)/parseFloat(item["jumpTT"].value))* 100).toFixed(2) +"%");
                }else{
                    _obj[items]  = item[items].value;
                }

            });
            result.push(_obj);
        });
        datautils.send(res, result);
    })
});


/**************************************************************/
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
//访客地图 图标
api.get('/provincemap', function (req, res) {
    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var start = Number(query['start']);
    var end = Number(query['end']);
    var areas = query['areas'];
    var property = query['property'];
    if (property == "ct") {
        var indexes = date.between(req, "access-");
    } else {
        var indexes = date.between(req, "visitor-");
    }
    initial.chartData(req.es,indexes,type,areas,property,function (data){
        var result = {};
        var chart_data_array = new Array();
        var data_name = new Array();

        var areas = data.aggregations.areas.buckets;
        for(var i = 0 ; i < 10; i++){
            if(areas[i] != undefined){
                if(areas[i].key == "国外")continue;
                var chart_data = {};
                data_name.push(areas[i].key.replace("市","").replace("省",""));
                chart_data["name"] = areas[i].key.replace("市","").replace("省","");
                chart_data["value"] = areas[i].data_count.value;
                chart_data_array.push(chart_data);
            }
        }
        if(areas.length >=10){
            var chart_data = {};
            var other = 0;
            for(var a = 10 ; a < areas.length; a++){
                other+= areas[a].data_count.value
            }
            data_name.push("其他");
            chart_data["name"] = "其他";
            chart_data["value"] = other;
            chart_data_array.push(chart_data);
        }
        result["data_name"] = data_name;
        result["chart_data"] = chart_data_array;
        datautils.send(res,result);
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
/**
 * summary.by wms
 */
api.get("/summary", function (req, res) {
    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var startOffset = Number(query['start']);
    var endOffset = Number(query['end']);
    var indexes = date.createIndexes(startOffset, endOffset, "visitor-");
    var quotas = query['quotas'];
    var period = date.period(startOffset, endOffset);
    var interval = date.interval(startOffset, endOffset);
    // 指标数组
    var quotasArray = quotas.split(",");
    es_request.search(req.es, indexes, type, quotasArray, "period", null, period[0], period[1], interval, function (result) {
        datautils.send(res, JSON.stringify(result));
    });
});
module.exports = api;