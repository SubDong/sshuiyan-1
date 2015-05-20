var redis = require('redis');


var redis_module = {

    init: function (config) {
        var client = redis.createClient(config.port, config.host,config.options);
        return client;
    }
}

module.exports = redis_module;
