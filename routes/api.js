var express = require('express')
var url = require('url')
var date = require('../utils/date')
var api = express.Router()

api.get('/v/time', function (req, res) {

    var parsed = url.parse(req.url, true)
    var indexs = date.between(req, "access-")

    var type = parsed.query['type']

    if(!type){
        type = 'pv'
    }

    req.es.search({
        index: indexs,
        type: req.accountid,
        query:{

        }
    })
})


module.exports = api