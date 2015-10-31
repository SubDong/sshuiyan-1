

var http = require('http');
var config = require("../../config_dev.json");
var cache = config.cache;
var bufferutils = require('../utils/bufferutils');

var options = {
    host: cache.ip,
    port: cache.port,
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

var gacache = {

    search: function (type, scale, dateRange, indicator, callbackFn) {

        options.path = "/escache/groupAnalytics/condition/"+ type + "/" + scale+"/"+dateRange+"/"+indicator;

        var remote_req = http.request(options, function (data) {

            var bufferHelper = new bufferutils();

            data.on('data',function (chunk) {
                bufferHelper.concat(chunk);
            });

            data.on('end',function (chunk) {
                var html = bufferHelper.toBuffer().toString();
                callbackFn(html);
            });
        });
        remote_req.end();
    }

};
module.exports = gacache;