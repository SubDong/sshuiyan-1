/**
 * Created by Administrator on 2015/7/14.
 */
var router = require('express').Router(),
    redis = require('../servers/utils/redis'),
    path = require('path'),
    fs = require('fs'),
    async = require('async');


router.get('/', function (req, resp) {
    var tid = req.query["tid"];
    console.log("tid"+tid)
    redis.service().get('tsj:'.concat(tid), function (err, sitejson) {
        var ref = req.header('Referer');
        //if (ref == undefined || ref == '') {
        //    resp.end();
        //    return;
        //}
        fs.readFile('./track/select.js', function (err, data) {
            resp.set('Content-Type', 'application/javascript')
            resp.set('Cache-Control', 'max-age=0,must-revalidate');
            resp.send("var select = " + data);
        })

    });
});

module.exports = router