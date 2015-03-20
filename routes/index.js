var express = require('express');
//var controller = require('controllers')
var router = express.Router();

/* GET home page. */
router.get('/*', function (req, res, next) {
    res.render(req.url.substring(1) + ".html", {});
});

module.exports = router;
