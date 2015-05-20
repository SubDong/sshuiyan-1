var elasticsearch = require('elasticsearch')
//var pro = require('process')

var es_module = {
    init: function (config) {
        var client;

        var hosts = config.hosts;

        client = new elasticsearch.Client({
            "hosts": hosts,
            sniffOnStart: false,
            sniffOnConnectionFault: false,
            keepAlive: true
        })

        return client;
    }
}


module.exports = es_module