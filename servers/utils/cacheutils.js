/**
 * Created by hydm on 2015/8/4.
 */
var crypto = require('crypto');
var redis = require('../utils/redis');

var cacheutils = {
    fixCacheKey: function (cacheValue) {
        var hmac = crypto.createHmac('sha1', "hydm");
        var cacheValue = JSON.stringify(cacheValue);
        hmac.update(cacheValue);
        var cacheKey = hmac.digest("hex");
        console.log(redis.service().set(cacheKey, cacheValue, redis.print));
        return cacheKey;
    }
}

module.exports = cacheutils;