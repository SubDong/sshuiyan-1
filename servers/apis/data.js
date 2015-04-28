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
var map = require('../utils/map');

var api = express.Router();

api.get('/charts', function (req, res) {
    var query = url.parse(req.url, true).query, quotas = [], type = query['type'], dimension = query.dimension;
    if (type.indexOf(",") > -1)for (var i = 0; i < type.split(",").length; i++) {
        quotas.push(type.split(",")[i]);
    }
    else
        quotas.push(type);

    var start = Number(query['start']);//
    var end = Number(query['end']);//
    var indexes = date.createIndexes(start, end, "visitor-");

    var period = date.period(start, end);
    var interval = date.interval(start, end, Number(query['int']));
    es_request.search(req.es, indexes, 1, quotas, dimension, null, period[0], period[1], interval, function (result) {
        datautils.send(res, JSON.stringify(result));
    });

    //querytypes.forEach(function (qtype) {
    //    switch (qtype) {
    //        case "uv":
    //            line.uv(req.es, start, end, interval, uvindexs, 1, qtype, "tt", function (body) {
    //                datautils.send(res, body);
    //            });
    //            break;
    //        case "pv":
    //            line.pv(req.es, start, end, interval, pvindexs, 1, qtype, "loc", function (body) {
    //                datautils.send(res, body);
    //                //datautils.lineData(res, body, qtype);
    //            });
    //            break;
    //        case "ip":
    //            break;
    //        case "avgVisitTime"://平均访问时间
    //            line.calAvgVisitTime(req.es, start, end, interval, uvindexs, 1, qtype, "utime", function (result) {
    //                datautils.send(res, result);
    //                //console.log(JSON.stringify(result));
    //            });
    //            break;
    //        case "outRate"://跳出率
    //            line.calJumpRate(req.es, start, end, interval, uvindexs, 1, qtype, function (result) {
    //                datautils.send(res, result);
    //            });
    //            break;
    //        case "city":
    //            break;
    //        case "arrRate"://抵达率
    //            line.convertRate(req.es, start, end, interval, pvindexs, 1, qtype, "http://sem.best-ad.cn/index", function (result) {
    //                datautils.send(res, result);
    //            });
    //            break;
    //        case "arrCount"://访问次数
    //            line.arrCount(req.es, start, end, interval, pvindexs, 1, qtype, function (result) {
    //                datautils.send(res, result);
    //            });
    //            break;
    //        case "convertRate"://页面转化
    //            line.convertRate(req.es, start, end, interval, pvindexs, 1, qtype, "http://sem.best-ad.cn/login,http://sem.best-ad.cn/home", function (result) {
    //                datautils.send(res, result);
    //            });
    //            break;
    //        case "province":
    //            break;
    //        default :
    //            break;
    //    }
    //});
});
api.get('/map', function (req, res) {
    var query = url.parse(req.url, true).query;
    var quotas = [];
    var type = query['type'];
    var dimension = query.dimension;
    if (type.indexOf(",") > -1)for (var i = 0; i < type.split(",").length; i++) {
        quotas.push(type.split(",")[i]);
    }
    else
        quotas.push(type);

    var start = Number(query['start']);//0
    var end = Number(query['end']);
    var indexes = date.createIndexes(start, end, "visitor-");

    var period = date.period(start, end);
    var interval = date.interval(start, end, Number(query['int']));

    es_request.search(req.es, indexes, 1, quotas, dimension, null, period[0], period[1], interval, function (result) {
        datautils.send(res, JSON.stringify(result));
    });
});
api.get('/pie', function (req, res) {
    var query = url.parse(req.url, true).query;
    var quotas = [];
    var type = query['type'];
    var dimension = query.dimension;
    if (type.indexOf(",") > -1)for (var i = 0; i < type.split(",").length; i++) {
        quotas.push(type.split(",")[i]);
    }
    else
        quotas.push(type);

    var start = Number(query['start']);
    var end = Number(query['end']);
    var indexes = date.createIndexes(start, end, "visitor-");

    var period = date.period(start, end);
    var interval = date.interval(start, end, Number(query['int']));

    es_request.search(req.es, indexes, 1, quotas, dimension, null, period[0], period[1], interval, function (result) {
        datautils.send(res, JSON.stringify(result));
    });

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
    var _startTime = Number(query["start"]);//开始时间
    var _endTime = Number(query["end"]);//结束时间
    var _indic = query["indic"].split(",");//统计指标
    var _lati = query["dimension"];//统计纬度
    var _type = query["type"];
    var _filter = query["filerInfo"] != undefined?JSON.parse(query["filerInfo"]):query["filerInfo"];//过滤器
    var indexes = date.createIndexes(_startTime, _endTime, "visitor-");//indexs

    var period = date.period(_startTime, _endTime); //时间段
    var interval = date.interval(_startTime, _endTime); //时间分割
    es_request.search(req.es, indexes, _type, _indic, _lati, _filter, period[0], period[1], interval, function (data) {
        var result = [];
        var vidx = 0;
        var maps = {}
        var valueData = ["arrivedRate", "outRate", "nuvRate", "ct", "period","se", "pm", "rf"];
        data.forEach(function (info, x) {
            for (var i = 0; i < info.key.length; i++) {
                var infoKey = info.key[i];
                var obj = maps[infoKey];
                if (!obj) {
                    obj = {};
                    switch (_lati){
                        case "ct":
                            obj[_lati] = infoKey == 0?"新访客":"老访客";
                            break;
                        case "rf_type":
                            obj[_lati] = infoKey == 1?"直接访问":infoKey == 2?"搜索引擎":"外部链接";
                            break;
                        case "period":
                            obj[_lati] = infoKey.substring(infoKey.indexOf(" "),infoKey.length-3) + " - "+ infoKey.substring(infoKey.indexOf(" "),infoKey.length-5) +"59";
                            break;
                        case "se":
                            obj[_lati] = (infoKey == "-"?"直接访问":infoKey);
                            break;
                        case "pm":
                            obj[_lati] = (infoKey == 0?"计算机端":"移动端");
                            break;
                        case "rf":
                            obj[_lati] = (infoKey == "-"?"直接访问":infoKey);
                            break;
                        default :
                            obj[_lati] = infoKey;
                            break;
                    }
                }
                if(info.label == "avgTime"){
                    obj[info.label] = new Date(info.quota[i]).format("hh:mm:ss")
                }else{
                    obj[info.label] = info.quota[i] + (valueData.indexOf(info.label) != -1 ? "%" : "");
                }
                maps[infoKey] = obj;
            }
            vidx++;
        });
        for(var key in maps){
            result.push(maps[key]);
        }
        datautils.send(res, result);
    })
});


/**************************************************************/
//访客地图
api.get('/visitormap', function (req, res) {
    var query = url.parse(req.url, true).query;
    var _type = query['type'];
    var _startTime = Number(query['start']);
    var _endTime = Number(query['end']);
    var _quotas = query["quotas"].split(",");
    var indexes = date.createIndexes(_startTime, _endTime, "visitor-");//indexs
    var period = date.period(_startTime, _endTime); //时间段
    var interval = date.interval(_startTime, _endTime); //时间分割

    es_request.search(req.es, indexes, _type, _quotas, null, null, period[0], period[1], interval, function (data) {
        var result = {};
        data.forEach(function(item,i){
            result[item.label] =  item.label == "outRate"?item.quota[0]+"%":item.label =="avgTime"?new Date(item.quota[0]).format("hh:mm:ss"):item.quota[0];
        });
        datautils.send(res, result);
    })
});
//访客地图 图标
api.get('/provincemap', function (req, res) {
    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var _startTime = Number(query['start']);
    var _endTime = Number(query['end']);
    var areas = query['areas'];
    var property = query['property'];
    if (property == "ct") {
        var indexes = date.createIndexes(_startTime, _endTime, "visitor-");
    } else {
        var indexes = date.createIndexes(_startTime, _endTime, "visitor-");
    }
    initial.chartData(req.es, indexes, type, areas, property, function (data) {
        var result = {};
        var chart_data_array = new Array();
        var data_name = new Array();

        var areas = data.aggregations.areas.buckets;
        for (var i = 0; i < 10; i++) {
            if (areas[i] != undefined) {
                if (areas[i].key == "国外")continue;
                var chart_data = {};
                data_name.push(areas[i].key.replace("市", "").replace("省", ""));
                chart_data["name"] = areas[i].key.replace("市", "").replace("省", "");
                chart_data["value"] = areas[i].data_count.value;
                chart_data_array.push(chart_data);
            }
        }
        if (areas.length >= 10) {
            var chart_data = {};
            var other = 0;
            for (var a = 10; a < areas.length; a++) {
                other += areas[a].data_count.value
            }
            data_name.push("其他");
            chart_data["name"] = "其他";
            chart_data["value"] = other;
            chart_data_array.push(chart_data);
        }
        result["data_name"] = data_name;
        result["chart_data"] = chart_data_array;
        datautils.send(res, result);
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
        case "convertRate":
            break;
    }
});
/**
 * summary.by wms
 */
api.get("/summary", function (req, res) {
    var query = url.parse(req.url, true).query;
    var dimension = query['dimension'];
    var type = query['type'];
    var startOffset = Number(query['start']);
    var endOffset = Number(query['end']);
    var indexes = date.createIndexes(startOffset, endOffset, "visitor-");
    var quotas = query['quotas'];
    var period = date.period(startOffset, endOffset);
    var interval = date.interval(startOffset, endOffset);
    // 指标数组
    var quotasArray = quotas.split(",");
    es_request.search(req.es, indexes, type, quotasArray, dimension, null, period[0], period[1], interval, function (result) {
        datautils.send(res, JSON.stringify(result));
    });
});
module.exports = api;