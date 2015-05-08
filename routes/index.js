var express = require('express');
// var controller = require('controllers')
var router = express.Router();

/* 所有html页面的router */
router.get('/*.html', function (req, res, next) {
    var session = req.session
    if (session) {
        console.log(session.id);
    }

    var url = req.url.substring(1);
    if (!url)
        url = "index";

    res.render((url.indexOf(".html")) > -1 ? url : url + ".html", {});
});

router.get("/", function (req, res, next) {
    res.render("index.html", {});
});

module.exports = router;
