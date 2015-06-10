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


// ================================= subdirectory_list ===============================
api.get("/subdirectory_list", function (req, res) {
    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var schema_name = "subdirectories_model";
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
            //������ɾ��
            var qry = query['query'];
            dao.remove(schema_name, qry, function (docs) {
                datautils.send(res, "success");
            });
            break;
        default :
            break;
    }

});


// ================================= Config  ===============================
api.get("/site_list", function (req, res) {

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
                //Redis存放副本
                req.redisclient.set(temp.track_id, temp.type_id, function (err, reply) {//es
                    //console.log(reply.toString() + " " + req.redisclient.get(temp.track_id, function (error, redis_res) {
                    //    }));
                });
                //var tempConfig = angular.copy(config_redis);//初始化时默认配置 网站新增逻辑上不会有配置
                req.redisclient.set(temp.track_id + "|" + temp.site_url, config_redis, function (err, reply) {//配置
                    //console.log(reply.toString() + " " + req.redisclient.get(temp.track_id + "|" + temp.site_url, function (error, redis_res) {
                    //    }));
                });
            });

            break;
        case "search":
            dao.find(schema_name, query['query'], null, {}, function (err, docs) {
                datautils.send(res, docs);
                docs.forEach(function (doc, i) {
                    req.redisclient.get(doc.type_id, function (error, redis_res) {
                    });
                });
            });
            break;
        case "update":
            //条件下更新
            var update = query['updates'];
            dao.update(schema_name, query['query'], query['updates'], function (err, docs) {
                //track_id更新情况下 更新Rides  只更新Key

                if (docs != null && docs.length == 1 && update.track_id != docs[0].track_id) {
                    req.redisclient.get(docs[0].track_id, function (error, redis_type_id) {
                        if (redis_type_id != null && redis_type_id != "")
                            req.redisclient.set(update.track_id, redis_type_id, function (err, reply) {//es
                                //console.log(reply.toString() + " " + req.redisclient.get(temp.track_id, function (error, redis_res) {
                                //    }));
                            });
                    });
                    req.redisclient.get(docs[0].track_id | docs[0].site_url, function (error, redis_conf) {//
                        if (redis_conf != null)
                            req.redisclient.set(update.track_id + "|" + update.site_url, redis_conf, function (err, reply) {//配置
                                //console.log(reply.toString() + " " + req.redisclient.get(temp.track_id + "|" + temp.site_url, function (error, redis_res) {
                                //    }));
                            });
                    });

                }
                datautils.send(res, docs);
            });
            break;
        case "delete":
            //条件下删除
            var qry = query['query'];
            dao.remove(schema_name, qry, function (docs) {
                if (docs != null) {
                    //    docs.forEach(function (doc, i) {
                    //删除Redis对应元素
                    //req.redisclient.remove(docs.track_id, function (error, redis_res) {
                    //    console.log(redis_res);
                    //});
                    //req.redisclient.remove(docs.track_id + "|*", function (error, redis_res) {//删除所有在track_id下的配置
                    //    console.log(redis_res);
                    //});
                    //});
                }

                res.send("success");
            });
            break;
        default :
            break;
    }

});
api.get("/conf", function (req, res) {

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
        default :
    }
    switch (type) {
        case "save":
            var entity = JSON.parse(query['entity']);
            dao.save(schema_name, entity, function (ins) {
                //更新Redis配置
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
                //更新Redis配置
                datautils.send(res, docs);
            });
            break;
        case "delete":
            //条件下删除
            dao.remove(schema_name, query['query'], function () {
                //更新Redis配置
                datautils.send(res, "remove");
            });
            break;
        default :
            break;
    }

});
api.get("/page_conv", function (req, res) {

    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var schema_name = "page_conv_model";
    switch (type) {
        case "save":
            var entity = JSON.parse(query['entity']);
            dao.save(schema_name, entity, function (ins) {
                //更新Redis配置
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
                //更新Redis配置
                datautils.send(res, docs);
            });
            break;
        case "delete":
            //条件下删除

            dao.remove(schema_name, query['query'], function () {
                //更新Redis配置
                datautils.send(res, "remove");
            });
            break;
        default :
            break;
    }

});
api.get("/page_conv", function (req, res) {

    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var schema_name = "page_conv_model";
    switch (type) {
        case "save":
            var entity = JSON.parse(query['entity']);
            dao.save(schema_name, entity, function (ins) {
                //更新Redis配置
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
                //更新Redis配置
                datautils.send(res, docs);
            });
            break;
        case "delete":
            //条件下删除

            dao.remove(schema_name, query['query'], function () {
                //更新Redis配置
                datautils.send(res, "remove");
            });
            break;
        default :
            break;
    }

});
/**
 * 获取track_id和type_id关系
 */
api.get("/tt_conf", function (req, res) {
    var query = url.parse(req.url, true).query;
    req.redisclient.get(query['query'], function (error, redis_type_id) {
        datautils.send(res, redis_type_id);
    });
});
/**
 * 获取track_id和config关系
 */
api.get("/tc_conf", function (req, res) {
    var query = url.parse(req.url, true).query;
    req.redisclient.get(query['query'], function (error, redis_conf) {//
        datautils.send(res, redis_conf);
    });
});
module.exports = api;