var elasticsearch = require('elasticsearch')
//var pro = require('process')

var eshosts = process.argv.slice(2)
var client;

if (eshosts.length > 0) {

    var hosts = eshosts[0].split(",")

    client = new elasticsearch.Client({
        "hosts": hosts,
        sniffOnStart: false,
        sniffOnConnectionFault:false,
        keepAlive: true
    })

} else {
    client = new elasticsearch.Client({
        host: '182.92.227.79:19200',
        sniffOnStart: true,
        sniffInterval: 30000,
        keepAlive: true
    })
}



module.exports = client