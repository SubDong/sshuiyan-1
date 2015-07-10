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
    security = require('./servers/services/security'),
    cdApi=require('./servers/apis/test/crossDomain');


var env = "dev";
var config = require("./config_dev.json");

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
            db: config.redis.sessiondb
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
            db: config.redis.sessiondb
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
auth.init(config.app)
app.use(auth.auth)

// 登陆信息
app.use(function (req, res, next) {
    req.db = mongo;
    req.es = es_client;
    req.redisclient = redis_client;
    req.accountid = req.session.accountid;
    if (req.session.user) {
        security.login(req, res, next);
    } else {
        next();
    }
})

app.use('/', root);

app.use('/api', api);

app.use('/config', configapi);

app.use('/token', token);

app.use('/cdapi',cdApi);

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

if (config.app.mode == 'cluster') {
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
