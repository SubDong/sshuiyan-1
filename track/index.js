var router = require('express').Router(),
    redis = require('../servers/utils/redis'),
    path = require('path'),
    fs = require('fs'),
    async = require('async'),
    mongo = require('../servers/utils/mongo');
config_request = require('../servers/services/config_request');


router.get('/', function (req, resp) {
    console.log("ref=" + req.header('Referer'))
    var tid = req.query["tid"];
    redis.service().get('tsj:'.concat(tid), function (err, sitejson) {
        var ref = req.header('Referer');
        //判断redis是否存在sitejson
        if (err || sitejson == null) {
            //初始化reids
            async.waterfall([
                function (cb) {
                    config_request.refreshSiteRedis(redis.service(), tid, function (err, item) {
                        cb(err, item)
                    })
                },
                function (reds, cb1) {
                    config_request.refreshPageTileRedis(redis.service(), tid, ref);
                    cb1(err, reds)
                },
                function (res1, cb2) {
                    config_request.refreshEventRedis(redis.service(), tid, ref);
                    cb2(err, res1)
                }
            ], function (err, result) {
                if (err || result == null) {
                    resp.end();
                    return;
                }
                var json = result["tsj:" + tid];
                getData(req, resp, tid, json);
            });
        } else {
            getData(req, resp, tid, sitejson);
        }
    });
});
router.get('/select', function (req, resp) {
    var tid = req.query["tid"];
    console.log("tid="+tid);
    redis.service().get('tsj:'.concat(tid), function (err, sitejson) {
        var ref = req.header('Referer');
        //判断redis是否存在sitejson
        if (err || sitejson == null) {
            //初始化reids
            async.waterfall([
                function (cb) {
                    config_request.refreshSiteRedis(redis.service(), tid, function (err, item) {
                        cb(err, item)
                    })
                },
                function (reds, cb1) {
                    config_request.refreshPageTileRedis(redis.service(), tid, ref);
                    cb1(err, reds)
                },
                function (res1, cb2) {
                    config_request.refreshEventRedis(redis.service(), tid, ref);
                    cb2(err, res1)
                }
            ], function (err, result) {
                if (err || result == null) {
                    resp.end();
                    return;
                }
                var json = result["tsj:" + tid];
                getData(req, resp, tid, json);
            });
        } else {
            if (ref != null && ref.indexOf(JSON.parse(sitejson).siteurl) > -1) {//ref来源是站点下网站
                fs.readFile('./track/select.js', function (err, data) {
                    resp.set('Content-Type', 'application/javascript')
                    resp.set('Cache-Control', 'max-age=0,must-revalidate');
                    resp.send("var select = " + data);
                })
            }
        }
    });
});
/**
 * 统计js 数据初始化
 * @param req
 * @param resp
 * @param tid trackID
 * @param sitejson JSON数据
 */
function getData(req, resp, tid, sitejson) {
    sitejson = JSON.parse(sitejson);
    var ref = req.header('Referer');
    if (ref == undefined || ref == '') {
        resp.end();
        return;
    } else {
        ref = ref.slice(0, ref.indexOf('?'));
        var config = {
            "trackid": tid,
            "domain": sitejson.siteurl,
            "open": sitejson.sitepause   //是否启用
        }
        var siteid = sitejson.siteid ? sitejson.siteid : "1";
        /**
         * 取值说明
         * mouse 是否开起 热力图鼠标点击数据获取
         * duration 是否开起 时长转化数据获取
         * visit 是否开起 访客访问页数转化数据获取
         * @type {string[]}
         */
        var tasks = ['mouse', 'duration', 'visit', 'evt'];
        async.eachSeries(tasks, function (item, cb) {
            var url = (item == "mouse" ? siteid.concat(":", item, ":", ref) : item.concat(":", siteid));
            redis.service().get(url, function (err, val) {
                if (val != null) {
                    try {
                        config[item] = JSON.parse(val);
                    } catch (e) {
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
}
function flush(config, resp) {
    fs.readFile('./track/t.js', function (err, data) {
        resp.set('Content-Type', 'application/javascript')
        resp.set('Cache-Control', 'max-age=0,must-revalidate');
        resp.send("var config = ".concat(JSON.stringify(config), ';', data));
    })

}

function flushAddEvent(config, resp) {
    fs.readFile('./track/select.js', function (err, data) {
        resp.set('Content-Type', 'application/javascript')
        resp.set('Cache-Control', 'max-age=0,must-revalidate');
        resp.send("var select = ".concat(JSON.stringify(config), ';', data));
    })

}

module.exports = router