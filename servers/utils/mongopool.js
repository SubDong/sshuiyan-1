var mongoose = require("mongoose")

var conn;
var moduledbconf = {};
/**
 * 具体数据库连接
 * @type {{}}
 */
var connPool={};
var mongo_pool = {

    init: function (config) {
        if(config!=undefined&&config!=null&&config.urls!=undefined){
            for(var index in config.urls){
                var conn = mongoose.createConnection(config.urls[index].url); //创建一个数据库连接
                conn.on('error',console.error.bind(console,'连接错误:'));
                conn.once('open',function(){
                    //一次打开记录
                    //console.log("连接 "+config.urls[index].url+config.urls[index].db)
                });
                console.log("连接 "+config.urls[index].url+config.urls[index].db)
                var conndb = conn.useDb(config.urls[index].db)
                for(var i in config.urls[index].module_names){
                    connPool[config.urls[index].module_names[i]] = conndb;
                }
            }
        }
        return connPool;
    },
    service: function (dburl) {
        return mongoose;
    },
    /**
     * 传入业务模块名称  返回mongo连接 如果不存在返回null
     * @param module
     * @returns {{}|*}
     */
    service: function (module_name) {
        return connPool[module_name];
    }
}

module.exports = mongo_pool;