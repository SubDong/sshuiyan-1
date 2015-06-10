var express = require('express'),
    auth = require('./auth');
// var controller = require('controllers')
var router = express.Router();

/* 所有html页面的router */
router.get('/*.html', function (req, res, next) {
    if (req.url != "/conf.html") {
        var url = req.url.substring(1);
        if (!url)
            url = "index";

        res.render((url.indexOf(".html")) > -1 ? url : url + ".html", {});
    } else {
        res.render("configindex.html", {});
    }

});

router.get("/logout", function (req, res, next) {
    console.log('logout')
    req.session.destroy(function (err) {
        if (err) {
            console.error(err);
        }
        //console.log('logout success.');
        res.redirect("/");
    });

})


router.get("/", function (req, res, next) {
    res.render("index.html", {});
});

module.exports = router;
