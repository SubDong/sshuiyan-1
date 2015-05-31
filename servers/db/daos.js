var schemas = require('./schemas')
var mongodb = require('../utils/mongo')

/*
 schema : String  参考 schemas.js


 daos.findAll(null, "subpaths_model", function (err, docs) {
 if (err)
 return console.error(err);
 console.log(docs)
 })


 */

var daos = {
    uiderror: function () {
        console.error("uid is empty.");
    },
    save: function (schema, obj, cb) {

        var instance = this.createinstance(schema, obj)
        instance.save(function (err, ins) {
            if (err)
                return console.error(err);
            cb(ins);
        });
    },
    remove: function (schema, obj, cb) {
        if (obj.uid) {
            return this.uiderror();
        }
        var instance = this.createinstance(schema);

        instance.remove(function (err) {
            if (err)
                return console.error(err);
            cb()
        });
    },
    find: function (schema, qry, options, cb) {
        if (qry.uid) {
            return this.uiderror();
        }
        var instance = this.createmodel(schema);
        instance.find(query, null, options, cb);
    },
    count: function (schema, qry, options, cb) {
        if (qry.uid) {
            return this.uiderror();
        }
        var instance = this.createmodel(schema);
        instance.count(qry, null, options, cb);
    },

    findAll: function (uid, options, schema, cb) {
        if (uid) {
            return this.uiderror();
        }
        var instance = this.createmodel(schema);
        instance.find({
            uid: uid
        }, null, options, cb);
    },
    update: function (schema, qry, updates, cb) {
        if (qry.uid) {
            return this.uiderror();
        }
        var instance = this.createmodel(schema);
        instance.update(qry, updates, null, cb);
    },
    createmodel: function (schema) {
        var dbschema = mongodb.service().Schema(schemas[schema].schema);
        var Model = mongodb.service().model(schemas[schema].model_name, dbschema, schemas[schema].collection_name)
        return Model;
    },
    createinstance: function (schema, obj) {
        var Model = this.createmodel(schema);
        var instance = new Model(obj);
        return instance;
    }
}


module.exports = daos;