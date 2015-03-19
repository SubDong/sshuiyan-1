var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {

    req.es.ping({
        requestTimeout: 1000,
        hello: 'elasticsearch'
    }, function (err) {
        if (err)
            console.error(err)
        else
            console.log('All is well')
    })
    res.render('index', {title: 'Express'});
});

module.exports = router;
