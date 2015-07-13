/**
 * Created by XiaoWei on 2015/6/24.
 * 可根据网站目录获取网页源文件
 */
var http = require('http');
var util = require("util");
var cdApi = require('express').Router();
cdApi.get("/link", function (req, res, next) {
    //获取输入的路径;
    var path = req.url.substring(11, req.url.length);
    var option =path.split("/");

    var isNoPort = option[0].indexOf(":");
    //主机 ip + port 解析
    if(isNoPort != -1){
        var splPort = option[0].split(":");
        if(option.length > 1){//大于１，说明主域名后跟着网页名称
            var html = '';
            var options = {
                hostname: splPort[0],
                port: splPort[1],
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

        }else{
            var html = '';
            var options = {
                hostname: splPort[0],
                port: splPort[1],
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
    } else {    //非 IP 输入解析
        if(option.length>1){    //大于１，说明主域名后跟着网页名称
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

        }else{      //输入值为主域名时自动进入主页
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
    }

});
module.exports = cdApi;


