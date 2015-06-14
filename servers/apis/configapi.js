/**
 * Created by MrDeng on 2015/6/7.
 */
var express = require('express');
var url = require('url');
var date = require('../utils/date');
var datautils = require('../utils/datautils');

var initial = require('../services/visitors/initialData');
var map = require('../utils/map');
var api = express.Router();
var dao = require('../db/daos');
var schemas = require('../db/schemas');
var randstring = require('../utils/randstring');
var querystring = require('querystring');


// ================================= eventchnage_list ===============================
/**
 *事件转化目标
 */
api.get("/eventchnage_list", function (req, res) {
    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var schema_name = "event_change_model";//设置选择schemas Model名称
    switch (type) {
        case "save":
            var entity = query['entity'];
            var temp = JSON.parse(entity);
            dao.save(schema_name, temp, function (ins) {
                datautils.send(res, JSON.stringify(ins));
                if (ins != null) {
                    var qry = {//用户ID+站点ID+页面URL
                        uid: ins.uid,
                        root_url: ins.root_url,
                        event_page: ins.event_page
                    }
                    dao.find(schema_name, JSON.stringify(qry), null, {}, function (err, docs) {//查询所有配置
                        if (docs != null && docs.length > 0) {//存在配置
                            var confs = [];
                            docs.forEach(function (item) {
                                var event_config = {
                                    eid: item.event_id,//事件ID
                                    evttag: item.event_name,//事件名称
                                    evpage: item.event_page//事件页面
                                };
                                confs.push(event_config);
                            });
                            req.redisclient.multi().set(ins.root_url + ":e:" + ins.event_page, JSON.stringify(confs)).exec();
                        }
                    });
                }
            });
            break;
        case "search":
            dao.find(schema_name, query['query'], null, {}, function (err, docs) {
                datautils.send(res, docs);
            });
            break;
        case "update":
            var update = query['updates'];
            dao.update(schema_name, query['query'], query['updates'], function (err, up) {
                datautils.send(res, up);
                if (up.nModified > 0) {//有更新 刷新配置
                    dao.find(schema_name, query['query'], null, {}, function (err, sres) {//先获取一条 用这条的获取uid 和site_id
                        if (sres != null & sres.length > 0) {
                            var qry = {
                                uid: sres[0].uid,
                                root_url: sres[0].root_url,
                                event_page: sres[0].event_page
                            }
                            dao.find(schema_name, JSON.stringify(qry), null, {}, function (err, docs) {//查询所有配置
                                if (docs != null && docs.length > 0) {//存在配置
                                    var confs = [];
                                    docs.forEach(function (item) {
                                        var event_config = {
                                            eid: item.event_id,//事件ID
                                            evttag: item.event_name,//事件名称
                                            evpage: item.event_page//事件页面
                                        };
                                        confs.push(event_config);
                                    });
                                    req.redisclient.multi().set(sres[0].root_url + ":e:" + sres[0].event_page, JSON.stringify(confs)).exec();
                                }
                                datautils.send(res, docs);
                            });
                        }
                    });

                }
            });
            break;
        case "delete":
            var qry = query['query'];
            dao.remove(schema_name, qry, function (docs) {
                datautils.send(res, "success");
            });
            break;
        case "findById":
            var qry = query['query'];
            dao.findById(schema_name, query['query'], null, {}, function (err, docs) {
                datautils.send(res, docs);
            });
            break;
        default :
            break;
    }

});


// ================================= subdirectory_list ===============================
/**
 *子目录管理
 */
api.get("/subdirectory_list", function (req, res) {
    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var schema_name = "subdirectories_model";//设置选择schemas Model名称
    switch (type) {
        case "save":
            var entity = query['entity'];
            var temp = JSON.parse(entity);
            dao.save(schema_name, temp, function (ins) {
                datautils.send(res, JSON.stringify(ins));
            });
            break;
        case "search":
            dao.find(schema_name, query['query'], null, {}, function (err, docs) {
                datautils.send(res, docs);
            });
            break;
        case "update":
            var update = query['updates'];
            dao.update(schema_name, query['query'], query['updates'], function (err, docs) {
                datautils.send(res, docs);
            });
            break;
        case "delete":
            var qry = query['query'];
            dao.remove(schema_name, qry, function (docs) {
                datautils.send(res, "success");
            });
            break;
        case "findById":
            var qry = query['query'];
            dao.findById(schema_name, query['query'], null, {}, function (err, docs) {
                datautils.send(res, docs);
            });
            break;
        default :
            break;
    }

});
// ================================= Config  ===============================
/**
 * 网站列表管理
 */
api.get("/site_list", function (req, res) {

    //config 鼠标点击配置
    var config_mouse = {
        mouse_ckick: false,
    };
    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var schema_name = "sites_model";
    switch (type) {
        case "save":
            var entity = query['entity'];
            var temp = JSON.parse(entity);
            temp.type_id = randstring.rand_string();
            temp.track_id = randstring.rand_string();
            dao.save(schema_name, temp, function (ins) {
                datautils.send(res, JSON.stringify(ins));
                // 参考 https://github.com/zerocoolys/suiyan/wiki/%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0%5Bredis-key-%E8%A7%84%E8%8C%83%5D
                var siteconfig = {
                    siteid: ins._id.toString(),//站点ID 对应MongoDb _id
                    siteurl: temp.site_url,//站点URL
                    sitepause: ins.site_pause//站点暂停状态，false启用，true暂停
                }
                //默认存储时长转化和PV转化到Redis
                var time_config = {
                    ttpause: false,
                    tttime: 30
                }
                var pv_config = {
                    pvpause: false,
                    pvtimes: 3
                }
                req.redisclient.multi().set("typeid:".concat(temp.track_id), temp.type_id)//
                    .set("ts:" + temp.track_id, ins._id)//
                    .set("st:" + ins._id, temp.track_id)//
                    .set("tsj:" + temp.track_id, JSON.stringify(siteconfig))
                    .set(ins._id + ":mouse:" + ins.site_url, JSON.stringify(config_mouse))//目前无具体URL配置 暂时设置在站点上
                    .set("duration:" + ins.site_id, JSON.stringify(time_config))//站点级别设置
                    .set("visit:" + ins.site_id, JSON.stringify(pv_config)).exec();
            });
            break;
        case "search":
            dao.find(schema_name, query['query'], null, {}, function (err, up) {
                datautils.send(res, up);
                // TODO 为什么要去差redis
            });
            break;
        case "update":
            //
            var update = query['updates'];
            dao.update(schema_name, query['query'], query['updates'], function (err, up) {
                datautils.send(res, up);
                if (up.nModified > 0) {//有更新 刷新配置
                    dao.find(schema_name, query['query'], null, {}, function (err, docs) {
                        if (docs != null && docs.length > 0) {//站点更新时候只更新状态
                            var siteconfig = {
                                siteid: docs[0]._id.toString(),//站点ID 对应MongoDb _id
                                siteurl: docs[0].site_url,//站点URL
                                sitepause: docs[0].site_pause//站点暂停状态，false启用，true暂停
                            }
                            req.redisclient.multi()
                                .set("tsj:" + docs[0].track_id, JSON.stringify(siteconfig)).exec();
                        }
                    });
                }
            });
            break;
        case "delete":
            var qry = query['query'];
            dao.remove(schema_name, qry, function (docs) {
                if (docs != null) {
                }
                res.send("success");
            });
            break;
        default :
            break;
    }

});
/**
 * 原config配置设置 主要路由网站统计规则设置
 */
api.get("/conf", function (req, res) {
    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var index = query['index'];
    var schema_name = "";
    switch (index) {
        case "site_list":
            schema_name = "sites_model";
            break;
        case "0":
            schema_name = "siterules_model";
            break;
        case "5":
            schema_name = "converts_model";
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
            dao.update(schema_name, query['query'], query['updates'], function (err, docs) {
                datautils.send(res, docs);
            });
            break;
        case "delete":
            dao.remove(schema_name, query['query'], function () {
                datautils.send(res, "remove");
            });
            break;
        default :
            break;
    }

});
/**
 * 页面转化规则单独剥离 路由
 */
api.get("/page_conv", function (req, res) {

    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var schema_name = "page_conv_model";
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
            dao.update(schema_name, query['query'], query['updates'], function (err, docs) {
                datautils.send(res, docs);
            });
            break;
        case "delete":
            dao.remove(schema_name, query['query'], function () {
                datautils.send(res, "success");
            });
            break;
        default :
            break;
    }

});

/**
 * 时长转化规则单独剥离 路由
 * 包括PV转化
 */
api.get("/time_conv", function (req, res) {

    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var schema_name = "converts_model";
    switch (type) {
        case "save":
            var entity = JSON.parse(query['entity']);
            dao.save(schema_name, entity, function (ins) {
                datautils.send(res, JSON.stringify(ins));

                //存储时长转化和PV转化到Redsi
                var time_config = {
                    ttpause: ins.time_conv.status,
                    tttime: ins.time_conv.val
                }
                var pv_config = {
                    pvpause: ins.pv_conv.status,
                    pvtimes: ins.pv_conv.val
                }
                //通过site_id 去获取track_id
                req.redisclient.multi().set("duration:" + ins.site_id, JSON.stringify(time_config))//站点级别设置
                    .set("visit:" + ins.site_id, JSON.stringify(pv_config)).exec();
            });
            break;
        case "search":
            dao.find(schema_name, query['query'], null, {}, function (err, docs) {
                datautils.send(res, docs);
            });
            break;
        case "update":
            dao.update(schema_name, query['query'], query['updates'], function (err, up) {

                datautils.send(res, up);
                if (up.nModified > 0) {//有更新 刷新配置
                    dao.find(schema_name, query['query'], null, {}, function (err, docs) {
                        if (docs != null && docs.length > 0) {
                            //存储时长转化和PV转化到Redis
                            var time_config = {
                                ttpause: docs[0].time_conv.status,
                                tttime: docs[0].time_conv.val
                            }
                            var pv_config = {
                                pvpause: docs[0].pv_conv.status,
                                pvtimes: docs[0].pv_conv.val
                            }
                            //通过site_id 去获取track_id
                            req.redisclient.multi().set("duration:" + docs[0].site_id, JSON.stringify(time_config))//站点级别设置
                                .set("visit:" + docs[0].site_id, JSON.stringify(pv_config)).exec();
                        }
                    });
                }
            });
            break;
        case "delete":
            //先删除Redis 查询到要删除的数据
            dao.remove(schema_name, query['query'], function () {
                datautils.send(res, "success");
            });
            break;
        default :
            break;
    }

});

/**
 *Redis测试获取内容接口
 */
api.get("/tt_conf", function (req, res) {
    var query = url.parse(req.url, true).query;
    req.redisclient.get(query['query'], function (error, redis_type_id) {

        datautils.send(res, redis_type_id);
    });
});
/**
 *
 */
api.get("/redis", function (req, res) {
    var query = url.parse(req.url, true).query;
    req.redisclient.get(query['key'], function (error, redis_conf) {//

        //if(redis_conf!=null){
        //    try{
        //        datautils.send(res, JSON.parse(redis_conf));
        //    }catch(err){
        //        datautils.send(res, redis_conf);
        //    }
        //
        //}else{
        datautils.send(res, redis_conf);
        //}
    });
});

//================================adtrack-icepros==========================
//nodejs   路由处理
api.get("/adtrack", function (req, res) {
    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var index = query['index'];
    var schema_name = "adtrack_model";
    switch (type) {
        case "save":
            var entity = JSON.parse(query['entity']);
            var targetUrl = entity.targetUrl;
            var mediaPlatform = entity.mediaPlatform;
            var adTypes = entity.adTypes;
            var planName = entity.planName;
            var keywords = entity.keywords;
            var creative = entity.creative;
            var strUrl = "http://" + targetUrl
                + "?hmsr=" + mediaPlatform
                + "&_hmmd=" + adTypes
                + "&_hmpl=" + planName
                + "&_hmkw=" + keywords
                + "&_hmci=" + creative;
            entity.produceUrl = encodeURI(strUrl);

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
            dao.update(schema_name, query['query'], query['updates'], function (err, docs) {
                datautils.send(res, docs);
            });
            break;
        case "delete":
            dao.remove(schema_name, query['query'], function () {
                datautils.send(res, "remove");
            });
            break;
        default :
            break;
    }
});
module.exports = api;