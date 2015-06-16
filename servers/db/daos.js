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
        var instance = this.createinstance(schema, obj);
        instance.save(function (err, ins) {
            if (err)
                return console.error(err);
            cb(ins);
        });
    },
    remove: function (schema, obj, cb) {
        //console.log("remove 1");
        if (obj.uid) {
            return this.uiderror();
        }

        var instance = this.createmodel(schema);

        instance.remove(JSON.parse(obj), function (err, docs) {

            if (err)
                return console.error(err);
            cb()
        });
    },
    remove: function (schema, obj, cb) {
        if (obj.uid) {
            return this.uiderror();
        }
        var instance = this.createmodel(schema);
        instance.remove(JSON.parse(obj), function (err, docs) {
            if (err)
                return console.error(err);
            cb(docs)
        });
    },
    find: function (schema, qry, fields, options, cb) {
        if (qry.uid) {
            return this.uiderror();
        }
        var instance = this.createmodel(schema);
        instance.find(JSON.parse(qry), fields, options, cb);
    },
    findById: function (schema, qry, fields, options, cb) {
        if (qry._id) {
            return this.uiderror();
        }
        var instance = this.createmodel(schema);
        instance.findById(JSON.parse(qry), fields, options, cb);
    },
    findSync: function (schema, qry, fields, options, cb) {
        if (qry.uid) {
            return this.uiderror();
        }
        var instance = this.createmodel(schema);
        var promise = instance.find(JSON.parse(qry), fields, options).exec()

        return promise;

        //promise.then(cb(docs)).then(null, function (err) {
        //        assert.ok(err instanceof Error);
        //    }
        //);
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
        if (updates._id) {
            return this.uiderror();
        }
        var instance = this.createmodel(schema);
        instance.update(JSON.parse(qry), JSON.parse(updates), null, cb);
    },
    createmodel: function (schema) {
        try {
            var dbschema = mongodb.service().Schema(schemas[schema].schema);
            var Model = mongodb.service().model(schemas[schema].model_name, dbschema, schemas[schema].collection_name);
            return Model;
        } catch (err) {
            //console.log("Model " + schemas[schema].model_name + " has been created!Just need get it!");
            var Model = mongodb.service().model(schemas[schema].model_name);
            return Model;
        }
    },
    createinstance: function (schema, obj) {
        var Model = this.createmodel(schema);
        var instance = new Model(obj);
        return instance;
    }
}


module.exports = daos;