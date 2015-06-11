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
    var config_redis = {
        mouse_ckick: false,
        site_pause: false
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
                // 参考 https://github.com/zerocoolys/sshuiyan/wiki/%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0%5Bredis-key-%E8%A7%84%E8%8C%83%5D
                var siteconfig = {
                    siteid: ins._id.toString(),
                    siteurl: temp.site_url
                }
                req.redisclient.multi().set("tt:".concat(temp.track_id), temp.type_id)//
                    .set("tsj:" + temp.track_id, siteconfig)
                    .set(temp.track_id + "|" + temp.site_url, config_redis)
                    .exec();
            });
            break;
        case "search":
            dao.find(schema_name, query['query'], null, {}, function (err, docs) {
                datautils.send(res, docs);
                // TODO 为什么要去差redis
            });
            break;
        case "update":
            //
            var update = query['updates'];
            dao.update(schema_name, query['query'], query['updates'], function (err, docs) {
                //track_id
                if (docs != null && docs.length == 1 && update.track_id != docs[0].track_id) {
                    req.redisclient.get(docs[0].track_id, function (error, redis_type_id) {
                        if (redis_type_id != null && redis_type_id != "")
                            req.redisclient.set(update.track_id, redis_type_id, function (err, reply) {//es
                            });
                    });
                    req.redisclient.get(docs[0].track_id | docs[0].site_url, function (error, redis_conf) {//
                        if (redis_conf != null)
                            req.redisclient.set(update.track_id + "|" + update.site_url, redis_conf, function (err, reply) {//閰嶇疆
                            });
                    });

                }
                datautils.send(res, docs);
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
            console.log("save")
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
                datautils.send(res, "remove");
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
api.get("/tc_conf", function (req, res) {
    var query = url.parse(req.url, true).query;
    req.redisclient.get(query['query'], function (error, redis_conf) {//
        datautils.send(res, redis_conf);
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