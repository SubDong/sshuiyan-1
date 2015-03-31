var elasticsearch = require('elasticsearch')
//var pro = require('process')

var eshosts = process.argv.slice(2)
var client = new elasticsearch.Client({
    host:'http://192.168.1.120:19200',
    log:'debug',
    sniffOnStart: true,
    sniffInterval: 30000,
    keepAlive: true
})



module.exports = client