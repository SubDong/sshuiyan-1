/**
 * Created by XiaoWei on 2015/6/24.
 * 可根据网站目录获取网页源文件
 */
var http = require('http');
//var dns = require("dns.js");
var util = require("util");
var cdApi = require('express').Router();
cdApi.get("/link", function (req, res, next) {
    var path = req.url.split("?")[1].split("=")[1];
    var option =path.split("/");
    if(option.length>1){
        var html = '';
        var options = {
            hostname: option[0],
            path: "/"+option[1]
        };
        http.get(options, function (re) {
            re.on('data', function (data) {
                html += data;
            }).on('end', function () {
                res.end(html);
                next();
            });
        }).on("error",function(e){
            res.end("error");
        });

    }else{
        res.end("error");
    }
});
module.exports = cdApi;


