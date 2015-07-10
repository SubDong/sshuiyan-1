/**
 * Created by XiaoWei on 2015/6/24.
 * 可根据网站目录获取网页源文件
 */
var http = require('http');
var util = require("util");
var cdApi = require('express').Router();
cdApi.get("/link", function (req, res, next) {
    //路径解析;
    var path = req.url.substring(11, req.url.length);
    //var path = req.url.split("?")[1].split("=")[1];
    var option =path.split("/");

    if(option.length>1){//大于１，说明主域名后跟着网页名称
        var html = '';
        var options = {
            hostname: option[0],
            path: path.substring(option[0].length,path.length)
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

    }else{//输入值为主域名时自动进入主页
        var html = '';
        var options = {
            hostname: option[0],
            path: "/"
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
    }
});
module.exports = cdApi;


