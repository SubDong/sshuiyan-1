/**
 * Created by yousheng on 15/6/2.
 */
var app = require('express')(),
    path = require('path'),
    t = require('./track/index'),
    redis_module = require("./servers/utils/redis"),
    mongo = require("./servers/utils/mongo")
    ;


var config = require("./config.json")

redis_module.init(config.redis)
mongo.init(config.mongo)
app.use('/t.js',t)


app.listen(8001)

