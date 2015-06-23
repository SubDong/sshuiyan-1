/**
 * Created by XiaoWei on 2015/6/13.
 */
var daos = require('../db/daos'),
    dateutils = require('../utils/date');
var security = {
    login: function (req, res, next) {
        res.cookie('uname', JSON.stringify(req.session.user.userName), {maxAge: 60*60});
        res.cookie('uid', JSON.stringify(req.session.user.id), {maxAge: 60*60});
        var promise = daos.findSync("sites_model", JSON.stringify({uid: req.session.user.id}), null, {});

        promise.then(function (docs) {
            var usites = [];

            if (docs.length > 0) {
                docs.forEach(function (item) {
                    var site = {};
                    site['site_id'] = item._id.toString();
                    site["site_name"] = item.site_name;
                    if (item.is_top)
                        site["site_top"] = 1;
                    else
                        site["site_top"] = 0;

                    site["type_id"] = item.type_id;
                    site["site_url"] = item.site_url;
                    if (!!req.session.user.baiduAccounts && req.session.user.baiduAccounts.length > 0)
                        site["bd_name"] = req.session.user.baiduAccounts[0].baiduUserName;

                    usites.push(site);
                });
            } else {
                usites.push({
                    'site_id': -1,
                    'site_name': '<无>',
                    'type_id': -1,
                    'site_top': 1
                })
            }
            usites.sort(dateutils.by('site_top'));
            res.cookie('usites', '' + JSON.stringify(usites) + '', {maxAge: 60*60});
            next();
        });
    }
}
module.exports = security;