var redis = require('redis');

var client;

var redis_module = {

    init: function (config) {
        client = redis.createClient(config.port, config.host, config.options);
        return client;
    },
    service: function () {
        return client;
    }
}

module.exports = redis_module;
