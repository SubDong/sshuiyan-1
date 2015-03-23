var elasticsearch = require('elasticsearch')

var client = new elasticsearch.Client({
    host:'http://192.168.1.120:19200',
    log:'debug',
    sniffOnStart: true,
    sniffInterval: 30000,
    keepAlive: true
})

console.log('es connected!')

module.exports = client