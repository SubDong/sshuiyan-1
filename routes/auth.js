var ignore_url = /^\/token/

var redirect = "http://sem.best-ad.cn/login?url=";

var auth = {
    init: function (config) {
        redirect = config.auth_url;
    },
    auth: function (req, res, next) {
        if (!auth.ignore(req)) {
            var user = req.session.user;
            if (!user) {
                var url = req.header('host');
                res.redirect(redirect + url);
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