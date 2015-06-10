var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    es = require('./servers/utils/es'),
    session = require('express-session'),
    cluster = require('cluster'),
    numCPUs = require('os').cpus().length,
    root = require('./routes/index'),
    api = require('./servers/apis/data'),
    configapi = require('./servers/apis/configapi'),
    app = express(),
    uuid = require('node-uuid'),
    auth = require('./routes/auth'),
    token = require('./routes/token'),
    redis_module = require("./servers/utils/redis"),
    RedisStore = require('connect-redis')(session),
    mongoose = require('./servers/utils/mongo'),
    daos = require('./servers/db/daos');


var env = "dev";
var config = require("./config.json");

var es_client = es.init(config.es);

var mongo = mongoose.init(config.mongo)
var redis_client = redis_module.init(config.redis);

//app.use(express.static('public'))
app.use(favicon(__dirname + '/public/img/favicon.ico'))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine("html", require('ejs').renderFile);

if (env == 'dev') {
    app.use(session({
        genid: function (req) {
            return uuid.v4();// use UUIDs for session IDs
        },
        store: new RedisStore({
            host: config.redis.host,
            port: config.redis.port,
            pass: config.redis.options.auth_pass,
            unref: false,
            db: 10
        }),
        resave: false,
        saveUninitialized: false,
        secret: 'huiyan sem'
    }));
} else {
    app.use(session({
        genid: function (req) {
            return uuid.v4();// use UUIDs for session IDs
        },
        store: new RedisStore({
            host: config.redis.host,
            port: config.redis.port,
            pass: config.redis.options.auth_pass,
            unref: false,
            db: 10
        }),
        resave: false,
        saveUninitialized: false,
        secret: 'huiyan production'
    }));
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


// 非测试环境加入认证
if (env == 'dev') {
    app.use(auth.auth)
}

// 登陆信息
app.use(function (req, res, next) {
    req.db = mongo;
    req.es = es_client;
    req.redisclient = redis_client;
    req.accountid = req.session.accountid;
    if (req.session.user) {
        res.cookie('uname', JSON.stringify(req.session.user.userName));
        res.cookie('uid', JSON.stringify(req.session.user.id));


        var promise = daos.findSync("sites_model", JSON.stringify({uid: req.session.user.id}), null, {});

        promise.then(function (docs) {
            var usites = [];

            if (docs.length > 0) {
                docs.forEach(function (item) {
                    var site = {};
                    site['site_id'] = item._id.toString();
                    site["site_name"] = item.site_name;
                    if (item.site_url == "www.best-ad.cn") {
                        site["type_id"] = 1;
                    } else if (item.site_url == "www.perfect-cn.cn") {
                        site["type_id"] = 2;
                    } else {
                        site["type_id"] = item.type_id;
                    }
                    //site["u_name"] = req.session.user.userName;
                    //site["bd_name"] = req.session.accountname;
                    usites.push(site);
                });

            } else {
                usites.push({
                    'site_id': -1,
                    'site_name': '<无>',
                    'type_id': -1
                })
            }

            res.cookie('usites', '' + JSON.stringify(usites) + '');
            next();
        })
    } else {
        next();
    }
})

app.use('/', root);

app.use('/api', api);

app.use('/config', configapi);

app.use('/token', token);

// catch 404 and forward to error handler
app.use(function (err, req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

if (process.argv.slice(3) == 'cluster') {
    if (cluster.isMaster) {
// Fork workers.
        for (var i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        //cluster.on('exit', function (worker, code, signal) {
        //    console.log('worker ' + worker.process.pid + ' died');
        //    cluster.fork().on('online', function () {
        //        console.log('new worker online.');
        //    });
        //});

    } else {
        app.listen(8000);
    }
} else {
    app.listen(8000);
}


module.exports = app;
