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
    app = express(),
    uuid = require('node-uuid'),
    auth = require('./routes/auth'),
    token = require('./routes/token'),
    redis_module = require("./servers/utils/redis");

var env = process.argv.splice(2);
if (env === undefined || env) {
    env = "dev";
}
var config = require("./config_" + env + ".json");

var es_client = es.init(config.es);

var redis_client = redis_module.init(config.redis);

//app.use(express.static('public'))
app.use(favicon(__dirname + '/public/img/favicon.ico'))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine("html", require('ejs').renderFile);

app.use(session({
    genid: function (req) {
        return uuid.v4();// use UUIDs for session IDs
    },
    resave: false,
    saveUninitialized: false,
    secret: 'keyboard cat'
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    req.es = es_client;
    req.redisclient = redis_client;
    req.accountid = req.session.accountid
    next();
})


app.use(auth.auth)

app.use('/', root);

app.use('/api', api);

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
