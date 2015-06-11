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
            //锟斤拷锟斤拷锟斤拷删锟斤拷
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


                //Redis瀛樻斁鍓湰
                // 参考 https://github.com/zerocoolys/sshuiyan/wiki/%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0%5Bredis-key-%E8%A7%84%E8%8C%83%5D
                var siteconfig = {
                    siteid: ins._id.toString(),
                    siteurl: temp.site_url
                }

                req.redisclient.multi().set("tt:".concat(temp.track_id), temp.type_id)
                    .set("tsj:" + temp.track_id, siteconfig)
                    .set(temp.track_id + "|" + temp.site_url, config_redis)
                    .exec();
            });

            break;
        case "search":
            dao.find(schema_name, query['query'], null, {}, function (err, docs) {
                datautils.send(res, docs);
                // TODO 为什么要去差redis
                docs.forEach(function (doc, i) {
                    req.redisclient.get(doc.type_id, function (error, redis_res) {
                    });
                });
            });
            break;
        case "update":
            //鏉′欢涓嬫洿鏂�
            var update = query['updates'];
            dao.update(schema_name, query['query'], query['updates'], function (err, docs) {
                //track_id鏇存柊鎯呭喌涓� 鏇存柊Rides  鍙洿鏂癒ey

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
                            req.redisclient.set(update.track_id + "|" + update.site_url, redis_conf, function (err, reply) {//閰嶇疆
                                //console.log(reply.toString() + " " + req.redisclient.get(temp.track_id + "|" + temp.site_url, function (error, redis_res) {
                                //    }));
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
                    //    docs.forEach(function (doc, i) {
                    //鍒犻櫎Redis瀵瑰簲鍏冪礌
                    //req.redisclient.remove(docs.track_id, function (error, redis_res) {
                    //    console.log(redis_res);
                    //});
                    //req.redisclient.remove(docs.track_id + "|*", function (error, redis_res) {//鍒犻櫎鎵�鏈夊湪track_id涓嬬殑閰嶇疆
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
        case "site_list"://缃戠珯鍒楄〃
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
                //鏇存柊Redis閰嶇疆
                datautils.send(res, JSON.stringify(ins));
            });
            break;
        case "search":
            dao.find(schema_name, query['query'], null, {}, function (err, docs) {
                datautils.send(res, docs);
            });
            break;
        case "update":
            //鏉′欢涓嬫洿鏂�
            dao.update(schema_name, query['query'], query['updates'], function (err, docs) {
                //鏇存柊Redis閰嶇疆
                datautils.send(res, docs);
            });
            break;
        case "delete":
            //鏉′欢涓嬪垹闄�
            dao.remove(schema_name, query['query'], function () {
                //鏇存柊Redis閰嶇疆
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
                //鏇存柊Redis閰嶇疆
                datautils.send(res, JSON.stringify(ins));
            });
            break;
        case "search":
            dao.find(schema_name, query['query'], null, {}, function (err, docs) {
                datautils.send(res, docs);
            });
            break;
        case "update":
            //鏉′欢涓嬫洿鏂�
            dao.update(schema_name, query['query'], query['updates'], function (err, docs) {
                //鏇存柊Redis閰嶇疆
                datautils.send(res, docs);
            });
            break;
        case "delete":
            //鏉′欢涓嬪垹闄�

            dao.remove(schema_name, query['query'], function () {
                //鏇存柊Redis閰嶇疆
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
                //鏇存柊Redis閰嶇疆
                datautils.send(res, JSON.stringify(ins));
            });
            break;
        case "search":
            dao.find(schema_name, query['query'], null, {}, function (err, docs) {
                datautils.send(res, docs);
            });
            break;
        case "update":
            //鏉′欢涓嬫洿鏂�
            dao.update(schema_name, query['query'], query['updates'], function (err, docs) {
                //鏇存柊Redis閰嶇疆
                datautils.send(res, docs);
            });
            break;
        case "delete":
            //鏉′欢涓嬪垹闄�

            dao.remove(schema_name, query['query'], function () {
                //鏇存柊Redis閰嶇疆
                datautils.send(res, "remove");
            });
            break;
        default :
            break;
    }

});
/**
 * 鑾峰彇track_id鍜宼ype_id鍏崇郴
 */
api.get("/tt_conf", function (req, res) {
    var query = url.parse(req.url, true).query;
    req.redisclient.get(query['query'], function (error, redis_type_id) {
        datautils.send(res, redis_type_id);
    });
});
/**
 * 鑾峰彇track_id鍜宑onfig鍏崇郴
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