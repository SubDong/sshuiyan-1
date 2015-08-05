var schemas = require('./schemas')
//var mongodb = require('../utils/mongo')
var mongodbs = require('../utils/mongopool')

var mongoose = require("mongoose")
/*
 schema : String  参考 schemas.js


 daos.findAll(null, "subpaths_model", function (err, docs) {
 if (err)
 return console.error(err);
 console.log(docs)
 })


 */

var daoutil = {
    find: function (schema, qry, fields, options, cb) {
        var conn = mongodbs.service(schemas[schema].module_name);
        var dbschema = conn.base.Schema(schemas[schema].schema);
        var model = conn.model(schemas[schema].model_name, dbschema, schemas[schema].collection_name);
        model.find({}, fields, options, cb);

    },
    createmodel: function (schema) {
        //var Model = mongodbs.service(schemas[schema].module_name).base.model(schemas[schema].model_name, dbschema, schemas[schema].collection_name);
        //if(Model!=undefined&&Model!=null){
        //    console.log("return")
        //    return Model;
        //}

        var db = mongoose.createConnection('localhost', 'test'); //创建一个数据库连接
        //var conn = mongodbs.service(schemas[schema].module_name)
        ////console.log(conn)
        //var Model = conn.model(schemas[schema].model_name, schemas[schema].schema);
        //console.log(Model)
        //var m = new Model();
        //return m;
        //try {
        //    var Model = mongodbs.service(schemas[schema].module_name).base.model(schemas[schema].model_name);
        //    return Model;
        //} catch (err) {
        //    console.log("Exception");
        //    console.log(err);
        //    var dbschema = mongodbs.service(schemas[schema].module_name).base.Schema(schemas[schema].schema);
        //    var Model = mongodbs.service(schemas[schema].module_name).base.model(schemas[schema].model_name, dbschema, schemas[schema].collection_name);
        //    return Model;
        //}
    },
    createinstance: function (schema, obj) {
        var Model = this.createmodel(schema);
        var instance = new Model(obj);
        return instance;
    }
}


module.exports = daoutil;