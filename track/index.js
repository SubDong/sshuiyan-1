var router = require('express').Router(),
    redis = require('../servers/utils/redis'),
    path = require('path'),
    fs = require('fs'),
    async = require('async'),
    mongo = require('../servers/utils/mongo');


router.get('/', function (req, resp) {
    var tid = req.query.id

    redis.service().get('tsj:'.concat(tid), function (err, sitejson) {

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
                "tid": tid,
                "domain": sitejson.siteurl,
                "mouse": false,
                "evt": []
            }

            var siteid = sitejson.siteid ? sitejson.siteid : "1";

            var tasks = ['mouse', 'evt'];

            async.eachSeries(tasks, function (item, cb) {
                console.log(item)
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