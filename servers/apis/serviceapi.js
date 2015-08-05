/**
 * Created by Administrator on 2015/8/5.
 */
var express = require('express');
var url = require('url');
var date = require('../utils/date');
var datautils = require('../utils/datautils');
var daoutil = require('../db/daoutil');
var initial = require('../services/visitors/initialData');
var map = require('../utils/map');
var dao = require('../db/daos');
var schemas = require('../db/schemas');
var randstring = require('../utils/randstring');
var querystring = require('querystring');

//ǰ��ҵ��ģ��Mongo API
var serviceapi = express.Router();

serviceapi.get("/adgroup", function (req, res){
    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var schema_name = "adgroup_model";//����ѡ��schemas Model����
    switch (type) {
        case "search":
            dao.find(schema_name, query['query'], null, {}, function (err, docs) {
                datautils.send(res, docs);
            });
            break;
        default :
            break;
    }
});

serviceapi.get("/compaign", function (req, res){
    var query = url.parse(req.url, true).query;
    var type = query['type'];
    var schema_name = "compaign_model";//����ѡ��schemas Model����
    switch (type) {
        case "search":
            dao.find(schema_name, query['query'], null, {}, function (err, docs) {
                datautils.send(res, docs);
            });
            break;
        default :
            break;
    }
});
module.exports = serviceapi;