var express = require('express');
var url = require('url');
var date = require('../utils/date');
var dateFormat = require('../utils/dateFormat')();
var resutil = require('../utils/responseutils');
var datautils = require('../utils/datautils');
var es_request = require('../services/refactor_request');
var access_request = require('../services/access_request');
var promotion_request = require('../services/promotion_request');
var initial = require('../services/visitors/initialData');
var map = require('../utils/map');
var api = express.Router();
var dao = require('../db/daos');
var schemas = require('../db/schemas');
var csvApi = require('json-2-csv');
var iconv = require('iconv-lite');
var uuid = require("node-uuid");
var async = require("async");
//var es_position = require('../services/es_position');
var changeList_request = require("../services/changeList_request");
var transform = require("../services/transform-request");
var heaturl_request = require("../services/heaturl_request");
var ad_request = require("../services/ad_request");

api.get('/charts', function (req, res) {
    var query = url.parse(req.url, true).query, quotas = [], type = query['type'], dimension = query.dimension, filter = null, topN = [], userType = query.userType;
    var filter_f = query.filter;
    var topN_f = query.topN == undefined ? null : query.topN;
    if (topN_f) {
        topN = topN_f.split(",");
    } else {
        topN.push(0);
    }
    if (filter_f) {
        filter = JSON.parse(filter_f);
    }
    if (type.indexOf(",") > -1)for (var i = 0; i < type.split(",").length; i++) {
        quotas.push(type.split(",")[i]);
    }
    else
        quotas.push(type);
    var start = Number(query['start']);//
    var end = Number(query['end']);//
    var indexes = date.createIndexes(start, end, "access-");

    var period = date.period(start, end);
    var interval = 1;
    if (Number(query['int'])) {
        if (Number(query['int']) == 1) {
            interval = 1;
        } else if (Number(query['int']) == -1) {
            if (Number(query['int']) == -1 && dimension == "period") {
                interval = 2;
            } else {
                interval = date.interval(start, end, Number(query['int']));
            }
        } else {
            interval = Number(query['int']);
        }
    }
    else {
        if ((end - start) == 0) {
            interval = 3600000;
        } else {
            interval = 86400000;
        }
        //interval = date.interval(start, end, Number(query['int']));
    }

    if (!userType) {
        userType = 1;
    }
    if (dimension == "one") {
        interval = null;
        dimension = null;
    }
    es_request.search(req.es, indexes, userType, quotas, dimension, topN, filter, period[0], period[1], interval, function (result) {
        datautils.send(res, JSON.stringify(result));
    });
});
api.get('/halfhour', function (req, res) {
    var query = url.parse(req.url, true).query, quotas = [], type = query['type'], topN = [], userType = query.userType;
    var start = Number(query['start']);//
    var end = Number(query['end']);//
    var indexes = date.createIndexes(start, end, "access-");
    var topN_f = query.topN == undefined ? null : query.topN
    if (topN_f) {
        topN = topN_f.split(",");
    } else {
        topN.push(0);
    }
    if (type.indexOf(",") > -1)for (var i = 0; i < type.split(",").length; i++) {
        quotas.push(type.split(",")[i]);
    }
    else {
        quotas.push(type);
    }
    if (!userType) {
        userType = 1;
    }
    //es_request.search(req.es, indexes, userType, quotas, null, topN, null, 1436749200000, 1436751000000, 0, function (result) {
    //    datautils.send(res, JSON.stringify(result));
    //});
    es_request.search(req.es, indexes, userType, quotas, null, topN, null, new Date().getTime() - 1800000, new Date().getTime(), 0, function (result) {
        datautils.send(res, JSON.stringify(result));
    });
});
api.get('/map', function (req, res) {
    var query = url.parse(req.url, true).query, quotas = [], type = query['type'], dimension = query.dimension, topN = [], userType = query.userType;
    var topN_f = query.topN == undefined ? null : query.topN
    if (topN_f) {
        topN = topN_f.split(",");
    } else {
        topN.push(0)
    }
    var filter = query.filter == undefined ? null : JSON.parse(query.filter);
    if (type.indexOf(",") > -1)for (var i = 0; i < type.split(",").length; i++) {
        quotas.push(type.split(",")[i]);
    }
    else {
        quotas.push(type);
    }
    if (!userType) {
        userType = 1;
    }
    var start = Number(query['start']);//0
    var end = Number(query['end']);
    var indexes = date.createIndexes(start, end, "access-");

    var period = date.period(start, end);
    var interval = date.interval(start, end, Number(query['int']));
    es_request.search(req.es, indexes, userType, quotas, dimension, topN, filter, period[0], period[1], interval, function (result) {
        datautils.send(res, JSON.stringify(result));
    });
});
api.get('/pie', function (req, res) {
    var query = url.parse(req.url, true).query;
    var quotas = [];
    var type = query['type'];
    var dimension = query.dimension;
    var topN = [];
    var topN_f = query.topN == undefined ? null : query.topN;
    var userType = query.userType;
    if (topN_f) {
        topN = topN_f.split(",");
    } else {
        topN.push(0)
    }
    if (type.indexOf(",") > -1)for (var i = 0; i < type.split(",").length; i++) {
        quotas.push(type.split(",")[i]);
    }
    else {
        quotas.push(type);
    }
    if (!userType) {
        userType = 1;
    }
    var start = Number(query['start']);
    var end = Number(query['end']);
    var indexes = date.createIndexes(start, end, "access-");

    var period = date.period(start, end);
    var interval = date.interval(start, end, Number(query['int']));

    es_request.search(req.es, indexes, userType, quotas, dimension, topN, null, period[0], period[1], interval, function (result) {
        datautils.send(res, JSON.stringify(result));
    });

});

// ================================= baizz ================================
// 推广概况
api.get('/survey/1', function (req, res) {
    var query = url.parse(req.url, true).query;

    var type = query['type'];
    var startOffset = Number(query['start']);
    var endOffset = Number(query['end']);
    var indexes = date.createIndexes(startOffset, endOffset, "access-");

    // 指标数组
    var quotas = ["pv", "vc", "pageConversion", "outRate", "avgTime", "eventConversion", "arrivedRate"];

    promotion_request.search(req.es, indexes, type, quotas, null, null, function (result) {
        datautils.send(res, result);
    });
    /* {
     var period = date.period(startOffset, endOffset);
     var interval = date.interval(startOffset, endOffset);

     es_request.search(req.es, indexes, type, quotas, "period", [0], null, period[0], period[1], interval, function (result) {
     datautils.send(res, JSON.stringify(result));
     });
     }*/

});

// device query
api.get('/survey/2', function (req, res) {
    var query = url.parse(req.url, true).query;

    var type = query['type'];
    var startOffset = Number(query['start']);
    var endOffset = Number(query['end']);
    var indexes = date.createIndexes(startOffset, endOffset, "access-");
    var filters = JSON.parse(query['filter']);

    // 指标数组
    var quotas = ["pv", "vc", "pageConversion", "outRate", "avgTime", "arrivedRate"];

    promotion_request.search(req.es, indexes, type, quotas, null, filters, function (result) {
        datautils.send(res, result);
    });

});

// region query
api.get('/survey/3', function (req, res) {
    var query = url.parse(req.url, true).query;

    var type = query['type'];
    var startOffset = Number(query['start']);
    var endOffset = Number(query['end']);
    var indexes = date.createIndexes(startOffset, endOffset, "access-");

    // 指标数组
    var quotas = ["pv", "vc", "pageConversion", "outRate", "avgTime", "arrivedRate"];

    promotion_request.search(req.es, indexes, type, quotas, "region", null, function (result) {
        datautils.send(res, result);
    });

});
// 推广方式

// 搜索推广
// ========================================================================

// ================================= SubDong ================================
/*********************自定义指标通用*************************/
api.get('/indextable', function (req, res) {
    var query = url.parse(req.url, true).query;
    var _promotion = query["promotion"];
    var _startTime = Number(query["start"]);//开始时间
    var _endTime = Number(query["end"]);//结束时间query
    var _indic = query["indic"].split(",");//统计指标
    var _lati = query["dimension"] == "null" ? null : query["dimension"];//统计纬度
    if (_lati == "kwsid") _lati = "kw:cid:agid:kwid";
    var _type = query["type"];
    var _formartInfo = query["formartInfo"];

    var _filter = query["filerInfo"] != null && query["filerInfo"] != 'null' ? JSON.parse(query["filerInfo"]) : query["filerInfo"] == 'null' ? null : query["filerInfo"];//过滤器
    var indexes = date.createIndexes(_startTime, _endTime, "access-");//indexs

    var popFlag = query["popup"];

    var period = date.period(_startTime, _endTime); //时间段
    var interval = _promotion == "undefined" || _promotion == "ssc" || _promotion == undefined ? date.interval(_startTime, _endTime) : null; //时间分割
    var formartInterval = (_formartInfo == "hour" ? 1 : _formartInfo == "week" ? 604800000 : _formartInfo == "month" ? 2592000000 : _formartInfo == "day" ? 86400000 : interval);
    es_request.search(req.es, indexes, _type, _indic, _lati, [0], _filter, _promotion == "undefined" || _promotion == undefined ? period[0] : null, _promotion == "undefined" || _promotion == undefined ? period[1] : null, formartInterval, function (data) {
        if (_formartInfo != "hour") {
            var result = [];
            var vidx = 0;
            var dimensionInfo;
            var infoKey;
            var maps = {};
            var valueData = ["arrivedRate", "outRate", "nuvRate", "ct", "period", "se", "pm", "rf", "ja", "ck", "isp"];
            try {
                data.forEach(function (info, x) {
                    for (var i = 0; i < info.key.length; i++) {
                        if (info.key[i] != undefined && info.key[i] + "".split(",").length > 1) {
                            infoKey = info.key[i] + "".split(",")[0]
                        } else {
                            infoKey = info.key[i]
                        }
                        if (popFlag != 1) {
                            if (_lati == "rf" && _filter != null && _filter[0]["rf_type"][0] && infoKey == "-") continue
                            if (_promotion == "ssc" || _lati == "kw") {
                                if (infoKey != undefined && (infoKey == "-" || infoKey == "" || infoKey == "www" || infoKey == "null" || infoKey.length >= 40)) continue;
                            }
                        }
                        var infoKey = info.key[i];
                        var obj = maps[infoKey];
                        if (!obj) {
                            obj = {};
                            if (_lati != null && _lati.split(":").length > 1) {
                                dimensionInfo = _lati.split(":")[0]
                            } else {
                                dimensionInfo = _lati
                            }
                            switch (dimensionInfo) {
                                case "ct":
                                    obj[dimensionInfo] = infoKey == 0 ? "新访客" : "老访客";
                                    break;
                                case "rf_type":
                                    obj[dimensionInfo] = infoKey == 1 ? "直接访问" : infoKey == 2 ? "搜索引擎" : "外部链接";
                                    break;
                                case "period":
                                    var dateFormat = new Date(infoKey).format("yyyy-MM-dd hh:mm:ss");
                                    if (_formartInfo == "day") {
                                        obj[dimensionInfo] = dateFormat.substring(0, 10);
                                    } else if (_formartInfo == "week") {
                                        obj[dimensionInfo] = dateFormat.substring(0, 10);
                                    } else if (_formartInfo == "month") {
                                        obj[dimensionInfo] = dateFormat.substring(0, 7);
                                    } else {
                                        obj[dimensionInfo] = dateFormat.substring(dateFormat.indexOf(" "), dateFormat.length - 3) + " - " + dateFormat.substring(dateFormat.indexOf(" "), dateFormat.length - 5) + "59";
                                    }
                                    break;
                                case "se":
                                    obj[dimensionInfo] = (infoKey == "-" ? "直接访问" : infoKey);
                                    break;
                                case "pm":
                                    obj[dimensionInfo] = (infoKey == 0 ? "计算机端" : "移动端");
                                    break;
                                case "rf":
                                    obj[dimensionInfo] = (infoKey == "-" ? "直接访问" : infoKey);
                                    break;
                                case "ja":
                                    obj[dimensionInfo] = (infoKey == "1" ? "支持" : "不支持");
                                    break;
                                case "ck":
                                    obj[dimensionInfo] = (infoKey == "1" ? "支持" : "不支持");
                                    break;
                                case "isp":
                                    obj[dimensionInfo] = (infoKey == "-" ? "其他" : infoKey);
                                    break;
                                case "dm":
                                    obj[dimensionInfo] = (infoKey == "-" ? "直接访问" : infoKey);
                                    break;
                                default :
                                    obj[dimensionInfo] = infoKey;
                                    break;
                            }
                        }
                        if (info.label == "avgTime") {
                            obj[info.label] = new Date(info.quota[i]).format("hh:mm:ss")
                        } else {
                            obj[info.label] = info.quota[i] + (valueData.indexOf(info.label) != -1 ? "%" : "");
                        }
                        maps[infoKey] = obj;
                    }
                    vidx++;
                });
                for (var key in maps) {
                    if (key != null) {
                        result.push(maps[key]);
                    }
                }
            } catch (e) {
                console.error(e.stack);
            }
            datautils.send(res, result);
        } else {
            datautils.send(res, JSON.stringify(data));
        }

    })
});

/**
 * 实时访问 HTML数据
 */
api.get('/realTimeHtml', function (req, res) {
    var query = url.parse(req.url, true).query;
    var _type = query["type"];
    var _filters = query["filerInfo"] != null && query["filerInfo"] != 'null' ? JSON.parse(query["filerInfo"]) : query["filerInfo"] == 'null' ? null : query["filerInfo"];//过滤器;
    var indexes = date.createIndexes(0, 0, "access-");
    es_request.realTimeSearch(req.es, indexes, _type, _filters, function (data) {
        data.forEach(function (item, i) {

            es_request.search(req.es, indexes, _type, ["vc"], null, [0], [{"vid": item._source != undefined ? [item._source.vid] : "1"}], null, null, null, function (datainfo) {
                var returnData = "";
                try {
                    var utimeHtml = "";
                    var vtimeHtml = "";
                    var urlHtml = "";
                    item._source.utime.forEach(function (utime, i) {
                        var newDate = new Date(utime).toString();
                        utimeHtml = utimeHtml + "<li><span>" + newDate.substring(newDate.indexOf(":") - 3, newDate.indexOf("G") - 1);
                        +"</span></li>"
                    });
                    item.record.forEach(function (vtime, i) {
                        vtimeHtml = vtimeHtml + "<li><span>" + vtime.vtime + "</span></li>";
                        urlHtml = urlHtml + "<li><span><a href='" + vtime.loc + "' target='_blank'>" + vtime.loc + "</a></span></li>"
                    });
                    var classInfo;
                    item._source.os.indexOf("Windows") != -1 ? classInfo = "windows" : "";
                    item._source.os.indexOf("mac") != -1 ? classInfo = "mac" : "";
                    item._source.os.indexOf("liunx") != -1 ? classInfo = "liunx" : "";
                    var result = "<div class='trendbox'>" +
                        "<div class='trend_top'><div class='trend_left'><div class='left_top'><div class='trend_img'><img class=" + classInfo + "></div><div class='trend_text'>" +
                        "<ul><li>操作系统：<span>" + item._source.os + "</span></li><li>网络服务商：<span>" + item._source.isp + "</span></li><li>屏幕分辨率：<span>" + item._source.sr + "</span></li>" +
                        "<li>屏幕颜色:<span>" + item._source.sc + "</span></li></ul></div></div><div class='left_under'><div class='trend_img'><img src='../images/google.png'></div><div class='trend_text'>" +
                        "<ul><li>浏览器：<span>" + item._source.br + "</span></li><li>Flash版本：<span>" + item._source.fl + "</span></li><li>是否支持Cookie：<span>" + (item._source.ck == '1' ? " 支持" : " 不支持" ) + "</span></li>" +
                        "<li>是否支持JAVA:<span>" + (item._source.ja == "0" ? " 支持" : " 不支持") + "</span></li></ul></div></div></div><div class='trend_right'>" +
                        "<ul><li>访问类型：<span>" + (item._source.ct == 0 ? " 新访客" : " 老访客") + "</span></li>" +
                        "<li>当天访问频次：<span>" + datainfo[0].quota[0] + "</span></li>" +
                        "<li>上一次访问时间：<span>" + (item.last != "首次访问" ? new Date(parseInt(item.last)).LocalFormat("yyyy-MM-dd hh:mm:ss") : item.last) + "</span></li>" +
                        "<li>本次来路:<span>" + (item._source.se == "-" ? " 直接访问" : "<a href='" + item._source.rf + "' target='_blank'>" + item._source.se + "( 搜索词:" + item._source.kw + ")</a>") + "</span></li>" +
                        "<li>入口页面：<span><a href='" + item._source.loc[0] + "' target='_blank'>" + item._source.loc[0] + "</a></span></li>" +
                        "<li>最后停留在:<span><a href='" + item._source.loc[item._source.loc.length - 1] + "' target='_blank'>" + item._source.loc[item._source.loc.length - 1] + "</a></span></li></ul>" +
                        "</div></div><div class='trendunder'><b>访问路径：</b>" +
                        "<ul><li>打开时间</li>" + utimeHtml + "</ul>" +
                        "<ul><li>停留时长</li>" + vtimeHtml + "</ul>" +
                        "<ul><li>页面地址</li>" + urlHtml + "</ul></div></div>";
                    returnData = {"htmlData": result};
                } catch (e) {
                    console.error(e.stack);
                    returnData = {"htmlData": "<div class='trendbox'>暂无数据</div>"};
                }
                datautils.send(res, returnData);
            });
        });
    });
});

/**************************************************************/
//访客地图
api.get('/visitormap', function (req, res) {
    var query = url.parse(req.url, true).query;
    var _type = query['type'];
    var _startTime = Number(query['start']);
    var _endTime = Number(query['end']);
    var _quotas = query["quotas"].split(",");
    var indexes = date.createIndexes(_startTime, _endTime, "access-");//indexs
    var period = date.period(_startTime, _endTime); //时间段
    var interval = date.interval(_startTime, _endTime); //时间分割

    es_request.search(req.es, indexes, _type, _quotas, null, [0], null, period[0], period[1], interval, function (data) {
        var result = {};
        data.forEach(function (item, i) {
            result[item.label] = item.label == "outRate" ? item.quota[0] + "%" : item.label == "avgTime" ? new Date(item.quota[0]).format("hh:mm:ss") : item.quota[0];
        });
        datautils.send(res, result);
    })
});
//首页设备环境图表

//访客地图 图标
api.get('/provincemap', function (req, res) {
    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var _startTime = Number(query['start']);
    var _endTime = Number(query['end']);
    var areas = query['areas'];
    var property = query['property'];
    var chartFilter = query['chartFilter'];
    if (property == "ct") {
        var indexes = date.createIndexes(_startTime, _endTime, "access-");
    } else {
        var indexes = date.createIndexes(_startTime, _endTime, "access-");
    }
    initial.chartData(req.es, indexes, type, areas, property, chartFilter, function (data) {
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

//csv下载功能
api.get("/downCSV", function (req, res) {
    var query = url.parse(req.url, true).query;
    var dataInfo = query['dataInfo'].replace(/\*/g, "%");
    var jsonData = JSON.parse(dataInfo);
    csvApi.json2csv(jsonData, function (err, csv) {
        if (err) throw err;
        var buffer = new Buffer(csv);
        //需要转换字符集
        var uid = uuid.v1();
        var str = iconv.encode(buffer, 'utf-8');
        res.send(str);
    });
});

/**
 * summary.by wms
 */
api.get("/index_summary", function (req, res) {
    var query = url.parse(req.url, true).query;
    var dimension = query['dimension'] == "null" ? null : query['dimension'];
    if (dimension == "period") {
        dimension = null;
    }
    var type = query['type'];
    var startOffset = Number(query['start']);
    var endOffset = Number(query['end']);
    var indexes = date.createIndexes(startOffset, endOffset, "access-");
    var quotas = query['indic'];
    var period = date.period(startOffset, endOffset);
    var _filter = query["filerInfo"] != null && query["filerInfo"] != 'null' ? JSON.parse(query["filerInfo"]) : query["filerInfo"] == 'null' ? null : query["filerInfo"];//过滤器
    // 指标数组
    var quotasArray = quotas.split(",");
    es_request.search(req.es, indexes, type, quotasArray, dimension, [0], _filter, period[0], period[1], -1, function (result) {
        datautils.send(res, JSON.stringify(result));
    });
});
/**
 * 访问来源网站TOP5.by wms
 */
api.get("/fwlywz", function (req, res) {
    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var ct = query['ct'];
    var startOffset = Number(query['start']);
    var endOffset = Number(query['end']);
    var indexes = date.createIndexes(startOffset, endOffset, "access-");
    es_request.top5visit(req.es, indexes, type, ct, function (result) {//es, indexes, type, ct, callbackFn
        datautils.send(res, result);
    });
});
api.get("/exchange", function (req, res) {
    var ParameterString = req.url.split("?");//获取url的？号以后的字符串
    var Parameters = ParameterString[1].split(",");
    var start = Parameters[0].split("=")[1];
    var end = Parameters[1].split("=")[1];
    var type = Parameters[2].split("=")[1];
    type = type.replace(/;/g, ",");//由于穿过的数据是以;分号隔开的，所以替换成逗号
    var indexString = [];
    //start与end传过时间偏移量或者时间，调用creatIndexs()或createIndexsByTime()方法，把access-与时间拼接起来组成索引值
    if (start.substring(1, start.length).match("-") != null && end.substring(1, start.length).match("-") != null) {
        indexString = date.createIndexsByTime(start, end, "access-");
    } else {
        indexString = date.createIndexes(start, end, "access-");
    }
    var pathUp = "path0";
    var pathDown = "path1";
    pathUp = Parameters[3].split("=")[1];
    pathDown = Parameters[4].split("=")[1];
    var address = Parameters[5].split("=")[1];
    access_request.exchangeSearch(req.es, indexString, type, pathUp, pathDown, address, function (result) {
        datautils.send(res, result);
    });
});

api.get("/heatmap", function (req, res) {
    var query = url.parse(req.url, true).query;
    var _type = query['type'];
    var _startTime = Number(query['start']);
    var _endTime = Number(query['end']);
    var indexes = date.createIndexes(_startTime, _endTime, "access-");//indexs
    //es_position.search(req.es, indexes, _type, function (result) {
    //    datautils.send(res, result);
    //});
});

/**
 * 跨域访问-获取热力图-明细数据
 */
api.get("/getHeatUrlDetailData", function (req, res) {

    var query = url.parse(req.url, true).query;


    var _type = req.session.type;
    var _rf = req.session.rf;
    var _startTime = req.session.startTime;
    ;
    var _endTime = req.session.endTime;
    var _sourceUrl = query['sourceUrl'];
    var indexes = date.createIndexes(_startTime, _endTime, "access-");//indexs


    heaturl_request.searchDetail(req.es, indexes, _type, _rf, function (result) {

        res.write("disposeDetailDataCallback(" + JSON.stringify(result) + ");");
        res.end();
    });

});

/**
 * 跨域访问-获取热力图-表头数据
 */
api.get("/getHeatUrlHeaderData", function (req, res) {

    var _type = req.session.type;
    var _rf = req.session.rf;
    var _startTime = req.session.startTime;
    ;
    var _endTime = req.session.endTime;

    var indexes = date.createIndexes(_startTime, _endTime, "access-");//indexs

    heaturl_request.searchHeaderData(req.es, indexes, _type, _rf, function (result) {

        res.write("disposeHeaderDataCallback(" + JSON.stringify(result) + ");");
        res.end();
    });
});

/**
 * 热力图首页
 */
api.get("/heaturl", function (req, res) {

    var query = url.parse(req.url, true).query;
    var _type = query['type'];
    var _rf = query['rf'];
    var _startTime = Number(query['start']);
    var _endTime = Number(query['end']);

    req.session.startTime = _startTime;
    req.session.endTime = _endTime;
    req.session.type = _type;
    req.session.rf = _rf;

    var indexes = date.createIndexes(_startTime, _endTime, "access-");
    heaturl_request.searchHeaderData(req.es, indexes, _type, _rf, function (result) {

        console.log(result);
        datautils.send(res, result);
    });

});

// ================================= Config  ===============================
api.get("/config", function (req, res) {

    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var index = query['index'];
    var schema_name = "";
    switch (index) {
        case "site_list"://网站列表
            schema_name = "sites_model";
            break;
        case "0":
            schema_name = "siterules_model";
            break;
        case "5":
            schema_name = "converts_model";
            break;
        case "subdirectoryList"://子目录管理
            schema_name = "subdirectories_model";
            break;
        default :
    }
    switch (type) {
        case "save":
            var entity = JSON.parse(query['entity']);
            dao.save(schema_name, entity, function (ins) {
                datautils.send(res, JSON.stringify(ins));
            });
            break;
        case "search":
            dao.find(schema_name, query['query'], null, {}, function (err, docs) {
                datautils.send(res, docs);
            });
            break;
        case "update":
            //条件下更新
            dao.update(schema_name, query['query'], query['updates'], function (err, docs) {
                datautils.send(res, docs);
            });
            break;
        case "delete":
            //条件下删除
            dao.remove(schema_name, query['query'], function () {
                datautils.send(res, "remove");
            });
            break;
        default :
            break;
    }

});
api.get("/trafficmap", function (req, res) {
    var parameterString = req.url.split("?");//获取url的？号以后的字符串

    var parameters = parameterString[1].split(",");

    var start = parameters[0].split("=")[1];
    var end = parameters[1].split("=")[1];
    var targetPathName = parameters[2].split("=")[1];

    var indexString = [];
    //start与end传过时间偏移量或者时间，调用creatIndexs()或createIndexsByTime()方法，把access-与时间拼接起来组成索引值
    if (start.substring(1, start.length).match("-") != null && end.substring(1, start.length).match("-") != null) {
        indexString = date.createIndexsByTime(start, end, "access-");
    } else {
        indexString = date.createIndexes(start, end, "access-");
    }
    access_request.trafficmapSearch(req.es, indexString, targetPathName, function (result) {
        datautils.send(res, result);

    });
});
api.get("/offsitelinks", function (req, res) {
    var parameterString = req.url.split("?");//获取url的？号以后的字符串

    var parameters = parameterString[1].split(",");

    var start = parameters[0].split("=")[1];
    var end = parameters[1].split("=")[1];
    var indexString = [];
    //start与end传过时间偏移量或者时间，调用creatIndexs()或createIndexsByTime()方法，把access-与时间拼接起来组成索引值
    if (start.substring(1, start.length).match("-") != null && end.substring(1, start.length).match("-") != null) {
        indexString = date.createIndexsByTime(start, end, "access-");
    } else {
        indexString = date.createIndexes(start, end, "access-");
    }
    var pathName = parameters[2].split("=")[1];
    access_request.offsitelinksSearch(req.es, indexString, pathName, function (result) {
        datautils.send(res, result);

    });
});
// ================================= Config  ==============================
api.get("/modalInstance", function (req, res) {
    var parameterString = req.url.split("?");//获取url的？号以后的字符串
    var type = parameterString[1].split("=")[1];
    access_request.modalInstanceSearch(req.es, type, function (result) {
        datautils.send(res, result);
    });
});
// ================================= changeList  ==============================
api.get("/changeList", function (req, res) {
    var parameters = req.url.split("?")[1].split(",");
    var start = parameters[0].split("=")[1];
    var end = parameters[1].split("=")[1];
    var contrastStart = parameters[2].split("=")[1];
    var contrastEnd = parameters[3].split("=")[1];
    var indexString = [];
    var contrastIndexString = [];
    var time = [];
    var contrastTime = [];
    if (start.substring(1, start.length).match("-") != null && end.substring(1, start.length).match("-") != null) {
        indexString = date.createIndexsByTime(start, end, "access-");
        time = date.getConvertTimeByTime(start, end);
    } else {
        indexString = date.createIndexes(start, end, "access-");
        time = date.getConvertTimeByNumber(start, end);
    }
    if (contrastStart.substring(1, start.length).match("-") != null && contrastEnd.substring(1, start.length).match("-") != null) {
        contrastIndexString = date.createIndexsByTime(contrastStart, contrastEnd, "access-");
        contrastTime = date.getConvertTimeByTime(contrastStart, contrastEnd);
    } else {
        contrastIndexString = date.createIndexes(contrastStart, contrastEnd, "access-");
        contrastTime = date.getConvertTimeByNumber(contrastStart, contrastEnd);
    }
    for (var i = 0; i < contrastIndexString.length; i++) {
        indexString.push(contrastIndexString[i]);
    }
    for (var i = 0; i < contrastTime.length; i++) {
        time.push(contrastTime[i]);
    }
    changeList_request.search(req.es, indexString, time, function (result) {
        datautils.send(res, result);
    });
});
//==================================== transform ===============================================
api.get("/transform/transformAnalysis", function (req, res) {
    var parameters = req.url.split("?")[1].split("&");
    var start = parameters[0].split("=")[1];
    var end = parameters[1].split("=")[1];
    var action = parameters[2].split("=")[1];
    var type = parameters[3].split("=")[1];
    var searchType = parameters[4].split("=")[1];
    var indexString = [];
    var time = [];
    var queryOptions = [];
    if (start.substring(1, start.length).match("-") != null && end.substring(1, start.length).match("-") != null) {
        indexString = date.createIndexsByTime(start, end, "access-");
        time = date.getConvertTimeByTime(start, end);
    } else {
        indexString = date.createIndexes(start, end, "access-");
        time = date.getConvertTimeByNumber(start, end);
    }
    if (searchType == "initAll") {
        queryOptions = parameters[5].split("=")[1];
        var querys = [];
        var query = queryOptions.split(",");
        for (var i = 0; i < query.length; i++) {
            querys.push(queryOptions.split(",")[i]);
        }
        transform.search(req.es, indexString, type, action, querys, function (result) {
            datautils.send(res, result);
        })
    } else if (searchType == "dataTable") {
        var showType = parameters[5].split("=")[1];
        queryOptions = parameters[6].split("=")[1];
        var querys = [];
        for (var i = 0; i < queryOptions.split(",").length; i++) {
            querys.push(queryOptions.split(",")[i]);
        }
        transform.searchByShowTypeAndQueryOption(req.es, indexString, type, action, showType, querys, function (result) {
            datautils.send(res, result);
        });
    } else if (searchType == "table") {
        queryOptions = parameters[5].split("=")[1];
        var querys = [];
        var query = queryOptions.split(",");
        for (var i = 0; i < query.length; i++) {
            querys.push(queryOptions.split(",")[i]);
        }
        transform.SearchPromotion(req.es, indexString, type, action, querys, function (result) {
            datautils.send(res, result);
        });
    } else if (searchType = "contrastData") {
        var showType = parameters[5].split("=")[1];
        queryOptions = parameters[6].split("=")[1];
        var contrastStart = parameters[7].split("=")[1];
        var contrastEnd = parameters[8].split("=")[1];
        var contrast_indexString = [];
        if (contrastStart.substring(1, start.length).match("-") != null && contrastEnd.substring(1, start.length).match("-") != null) {
            contrast_indexString = date.createIndexsByTime(contrastStart, contrastEnd, "access-");
            time = date.getConvertTimeByTime(contrastStart, contrastEnd);
        } else {
            contrast_indexString = date.createIndexes(contrastStart, contrastEnd, "access-");
            time = date.getConvertTimeByNumber(contrastStart, contrastEnd);
        }
        transform.SearchContrast(req.es, indexString, contrast_indexString, type, action, showType, queryOptions, function (result) {
            datautils.send(res, result);
        });
    } else {
        var query = "";
        query = parameters[5].split("=")[1];
        var querys = [];
        query = query.substring(1, query.length - 1);
        var queryString = {};
        if (query != "") {
            for (var i = 0; i < query.split(",").length; i++) {
                queryString = {};
                queryString[query.split(",")[i].split(":")[0]] = query.split(",")[i].split(":")[1];
                querys.push(queryString);
            }
        }
        var aggString = parameters[6].split("=")[1];
        var aggs = [];
        for (var i = 0; i < aggString.split(",").length; i++) {
            aggs.push(aggString.split(",")[i]);
        }
        transform.searchAdvancedData(req.es, indexString, type, action, querys, aggs, function (result) {
            datautils.send(res, result);
        });
    }

});
//==================================== ad_track by icepros ===============================================
/**
 * adsSource
 */
api.get("/adsSource", function(req, res){
    var queryUrl = url.parse(req.url, true).query;                      //URL请求对象
    var type = queryUrl['type'];                                        //类型
    var startTime = Number(queryUrl['start']);                          //开始时间
    var endTime = Number(queryUrl['end']);                              //结束时间
    var quotas = queryUrl["quotas"].split(",");                         //指标
    var dimension = queryUrl["dimension"];                              //维度
    var filters = queryUrl["filters"];                                  //过滤字段
    var indexes = date.createIndexes(startTime, endTime, "access-");    //索引
    var period = date.period(startTime, endTime);                       //时间轴维度
    var interval = date.interval(startTime, endTime);                   //时间分割

    es_request.search(req.es, indexes, type, quotas, dimension, [0], filters, period[0], period[1], interval, function (data) {
        /*var result = {};
         data.forEach(function (item, i) {
            result[item.label] = item.label == "outRate" ? item.quota[0] + "%" : item.label == "avgTime" ? new Date(item.quota[0]).format("hh:mm:ss") : item.quota[0];
        });*/
        datautils.send(res, data);
    })
});
/**
 * adsMedium
 */
api.get("/adsMedium", function(req, res){
    var queryUrl = url.parse(req.url, true).query;                      //URL请求对象
    var type = queryUrl['type'];                                        //类型
    var startTime = Number(queryUrl['start']);                          //开始时间
    var endTime = Number(queryUrl['end']);                              //结束时间
    var quotas = queryUrl["quotas"].split(",");                         //指标
    var dimension = queryUrl["dimension"];                              //维度
    var filters = queryUrl["filters"];                                  //过滤字段
    var indexes = date.createIndexes(startTime, endTime, "access-");    //索引
    var period = date.period(startTime, endTime);                       //时间轴维度
    var interval = date.interval(startTime, endTime);                   //时间分割

    es_request.search(req.es, indexes, type, quotas, dimension, [0], filters, period[0], period[1], interval, function (data) {
        datautils.send(res, data);
    })
});
/**
 * adsPlan
 */
api.get("/adsPlan", function(req, res){
    var queryUrl = url.parse(req.url, true).query;                      //URL请求对象
    var type = queryUrl['type'];                                        //类型
    var startTime = Number(queryUrl['start']);                          //开始时间
    var endTime = Number(queryUrl['end']);                              //结束时间
    var quotas = queryUrl["quotas"].split(",");                         //指标
    var dimension = queryUrl["dimension"];                              //维度
    var filters = queryUrl["filters"];                                  //过滤字段
    var indexes = date.createIndexes(startTime, endTime, "access-");    //索引
    var period = date.period(startTime, endTime);                       //时间轴维度
    var interval = date.interval(startTime, endTime);                   //时间分割

    es_request.search(req.es, indexes, type, quotas, dimension, [0], filters, period[0], period[1], interval, function (data) {
        datautils.send(res, data);
    })
});
/**
 * adsKeyWord
 */
api.get("/adsKeyWord", function(req, res){
    var queryUrl = url.parse(req.url, true).query;                      //URL请求对象
    var type = queryUrl['type'];                                        //类型
    var startTime = Number(queryUrl['start']);                          //开始时间
    var endTime = Number(queryUrl['end']);                              //结束时间
    var quotas = queryUrl["quotas"].split(",");                         //指标
    var dimension = queryUrl["dimension"];                              //维度
    var filters = queryUrl["filters"];                                  //过滤字段
    var indexes = date.createIndexes(startTime, endTime, "access-");    //索引
    var period = date.period(startTime, endTime);                       //时间轴维度
    var interval = date.interval(startTime, endTime);                   //时间分割

    es_request.search(req.es, indexes, type, quotas, dimension, [0], filters, period[0], period[1], interval, function (data) {
        datautils.send(res, data);
    })
});
/**
 * adsCreative
 */
api.get("/adsCreative", function(req, res){
    var queryUrl = url.parse(req.url, true).query;                      //URL请求对象
    var type = queryUrl['type'];                                        //类型
    var startTime = Number(queryUrl['start']);                          //开始时间
    var endTime = Number(queryUrl['end']);                              //结束时间
    var quotas = queryUrl["quotas"].split(",");                         //指标
    var dimension = queryUrl["dimension"];                              //维度
    var filters = queryUrl["filters"];                                  //过滤字段
    var indexes = date.createIndexes(startTime, endTime, "access-");    //索引
    var period = date.period(startTime, endTime);                       //时间轴维度
    var interval = date.interval(startTime, endTime);                   //时间分割

    es_request.search(req.es, indexes, type, quotas, dimension, [0], filters, period[0], period[1], interval, function (data) {
        datautils.send(res, data);
    })
});
module.exports = api;