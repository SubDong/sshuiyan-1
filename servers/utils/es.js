var elasticsearch = require('elasticsearch')
//var pro = require('process')

var es_module = {
    init: function (config) {
        var client;

        client = new elasticsearch.Client(config)

        return client;
    }
}


module.exports = es_module