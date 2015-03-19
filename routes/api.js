var express = require('express')
var url = require('url')
var date = require('../utils/date')
var api = express.Router()

api.get('/v/time', function (req, res) {

    console.log(date.between(req, "access-"))


    req.es.search({
        //index:
    })
})


module.exports = api