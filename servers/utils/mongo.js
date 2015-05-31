var mongoose = require("mongoose")


var mongo_module = {
    init: function (config) {
        mongoose.connect(config.url, {
            server: {
                socketOptions: {
                    keepAlive: 1
                }
            }
        });
        var db = mongoose.connection;
        db.once('open', function (cb) {
            console.log('db connection successed!')
        })
        return mongoose;
    },
    service: function () {
        return mongoose;
    }
}

module.exports = mongo_module;