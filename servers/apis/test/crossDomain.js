/**
 * Created by XiaoWei on 2015/6/24.
 * 可根据网站目录获取网页源文件
 */
var http = require('http');
var cdApi = require('express').Router();
cdApi.get("/link", function (res, req, next) {
    var html = '';
    var options = {
        hostname: 'www.best-ad.cn',
        path: '/seo.html'
    }
    http.get(options, function (re) {
        re.on('data', function (data) {
            html += data;
        }).on('end', function () {
            req.end(html);
            next();
        });
    });

});
module.exports = cdApi;


