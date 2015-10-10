/**
 * Created by Administrator on 2015/9/29.
 */

var express = require('express');
var api = express.Router();
var http = require('http');
var url = require('url');
var datautils = require('../utils/datautils');

var bufferutils = require('../utils/bufferutils');


var options = {
    host: '192.168.1.103',
    port: '8083',
    path: '/escache/groupAnalytics/condition/1/day/7/user',
    method: 'GET',
    headers:{
        'accept': '*/*',
        'content-type': "application/json",
        'accept-encoding': 'gzip, deflate, sdch',
        'accept-language': 'zh-CN,zh;q=0.8',
        'cache-control':'no-cache',
        'connection': 'keep-alive'
    }
};


api.get("/querydata", function (req, res){
    var query = url.parse(req.url, true).query;
    var parameter = JSON.parse(query.query);
    options.path = "/escache/groupAnalytics/condition/1/" + parameter.scale+"/"+parameter.dateRange+"/"+parameter.indicator;
    console.log(options.path);

    var result;

    var remote_req = http.request(options, function (data) {

        var bufferHelper = new bufferutils();

        data.on('data',function (chunk) {

            bufferHelper.concat(chunk);
        });

        data.on('end',function (chunk) {
            var html = bufferHelper.toBuffer().toString();
            res.writeHead(200);
            res.end(html);
        });

    });
    remote_req.end();

});
module.exports = api;