var router = require('express').Router(),
    redis = require('../servers/utils/redis'),
    path = require('path'),
    fs = require('fs'),
    mongo = require('../servers/utils/mongo');


var errmsg = "id missing"

router.get('/', function (req, resp) {
    var tid = req.query.id

    redis.service().get(tid, function (err, siteid) {

        if (true) {

            var config = {
                "tid": tid,
                "mouse": false
            }

            var ref = req.header('Referer')

            redis.service().sismember("heat".concat(siteid, '|', ref), function (err, is) {
                if (!is)
                    config['mouse'] = true;

                resp.set('Content-Type', 'application/javascript')
                resp.set('Cache-Control', 'max-age=0,must-revalidate');

                fs.readFile('./track/t.js', function (err, data) {
                    resp.send("var config = ".concat(JSON.stringify(config), ';', data));
                })

            })
        } else {
            resp.end("error.");
        }
    });

    try {
        var conf = redis.service().get(req.query.id, function (err, reply) {

        })

    } catch (err) {
        resp.end(errmsg);
    }

})


module.exports = router