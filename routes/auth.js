var ignore_url = /^\/token/

var auth = {


    auth: function (req, res, next) {
        if (!auth.ignore(req)) {
            var user = req.session.user;
            if (!user) {
                var url = req.header('host') + req.url;
                res.redirect("http://sem.best-ad.cn/login?url=" + url);
                return;
            }
        }
        next();
    },
    ignore: function (req) {

        return req.url.match(ignore_url);
    }


}


module.exports = auth