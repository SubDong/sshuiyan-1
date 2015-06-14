var router = require('express').Router(),
    redis = require('../servers/utils/redis'),
    path = require('path'),
    fs = require('fs'),
    async = require('async'),
    mongo = require('../servers/utils/mongo');


router.get('/', function (req, resp) {
    var tid = req.query["tid"];
    redis.service().get('tsj:'.concat(tid), function (err, sitejson) {
        if (err || sitejson == null) {
            resp.end();
            return;
        }
        sitejson = JSON.parse(sitejson);
        var ref = req.header('Referer');
        if (ref == undefined || ref == '') {
            resp.end();
            return;
        } else {
            ref = ref.slice(0, ref.indexOf('?'));
            var config = {
                "domain": sitejson.siteurl,
                "open": sitejson.sitepause   //是否启用
            }
            var siteid = sitejson.siteid ? sitejson.siteid : "1";
            var tasks = ['typeid', 'mouse', 'duration', 'visit', 'evt'];
            async.eachSeries(tasks, function (item, cb) {
                var url = (item == "typeid" ? item.concat(":",tid) : item == "mouse" ? siteid.concat(":", item, ":", ref) : item.concat(":",siteid));
                redis.service().get(url, function (err, val) {
                    if (val != null) {
                        try{
                            config[item] = JSON.parse(val);
                        } catch (e){
                            config[item] = val;
                        }
                    }
                    cb();
                })
            }, function (err) {
                if (err) {
                    resp.end();
                } else {
                    flush(config, resp);
                }
            })
        }
    });
});

function flush(config, resp) {
    fs.readFile('./track/t.js', function (err, data) {
        resp.set('Content-Type', 'application/javascript')
        resp.set('Cache-Control', 'max-age=0,must-revalidate');
        resp.send("var config = ".concat(JSON.stringify(config), ';', data));
    })

}


module.exports = router