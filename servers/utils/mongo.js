var mongoose = require("mongoose")


var mongo_module = {
    init : function(config){
        mongoose.connect(config.host);
        var db = mongoose.connection;
        db.once('open',function(cb){
            console.log('db connection successed!')
        })
        return mongoose;
    }
}

module.exports = mongo_module;