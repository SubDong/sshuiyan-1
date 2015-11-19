/**
 * Created by yousheng on 15/6/2.
 */
var app = require('express')(),
    path = require('path'),
    t = require('./track/index'),
    redis_module = require("./servers/utils/redis"),
    mongo = require("./servers/utils/mongo"),
    mongopool = require('./servers/utils/mongopool')

var config = require("./config.json")
redis_module.init(config.redis)
mongo.init(config.mongo)
app.use('/t.js', t)
mongopool.init(config.mongourls)
app.listen(8501)

