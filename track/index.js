var router = require('express').Router(),
    redis = require('../servers/utils/redis'),
    path = require('path'),
    fs = require('fs'),
    async = require('async'),
    mongo = require('../servers/utils/mongo');


router.get('/', function (req, resp) {
    var tid = req.query["tid"];
    redis.service().get('tsj:'.concat(tid), function (err, sitejson) {
        sitejson = JSON.parse(sitejson);
        redis.service().get(sitejson.siteid + ':m:'.concat(sitejson.siteurl), function (err, moust) {
            redis.service().get('tt:'.concat(tid), function (err, typeid) {
                redis.service().get("t:" + sitejson.siteid, function (err, timejson) {
                    redis.service().get("p:" + sitejson.siteid, function (err, pvjson) {
                        moust = JSON.parse(moust);
                        timejson = JSON.parse(timejson);
                        pvjson = JSON.parse(pvjson);

                        sitejson = {}

                        if (err || sitejson == null) {
                            resp.end();
                            return;
                        }

                        var ref = req.header('Referer')

                        if (ref == undefined || ref == '') {
                            resp.end()
                            return;
                        } else {
                            ref = ref.slice(0, ref.indexOf('?'));

                            var config = {
                                "tid": typeid, //typeid
                                "domain": sitejson.siteurl,
                                "mouse": moust.mouse_ckick,
                                "open": sitejson.site_pause,   //是否启用
                                "timeOpen": timejson == null ? false : timejson.ttpause, //是否开起时长转化
                                "timeVal": timejson == null ? 30 : timejson.tttime,  //时长转化时间
                                "pageOpen": pvjson == null ? false : pvjson.pvpause,  //访问页数转化是否开起
                                "pageVal": pvjson == null ? 3 : pvjson.pvtimes ,  //访问页数值
                                "evt": []
                            }

                            var siteid = sitejson.siteid ? sitejson.siteid : "1";

                            var tasks = ['mouse', 'evt'];

                            async.eachSeries(tasks, function (item, cb) {
                                //console.log(item)
                                redis.service().get(siteid.concat(":", item, ":", ref), function (err, val) {
                                    if (val != null)
                                        config[item] = val[item];
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
                    })
                })
            })
        });
    });

})

function flush(config, resp) {
    fs.readFile('./track/t.js', function (err, data) {
        resp.set('Content-Type', 'application/javascript')
        resp.set('Cache-Control', 'max-age=0,must-revalidate');
        resp.send("var config = ".concat(JSON.stringify(config), ';', data));
    })

}


module.exports = router