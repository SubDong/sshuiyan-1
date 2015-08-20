/**
 * Created by xiaowei on 15-8-19.
 */

var es_request = require('../services/refactor_request'),
date = require('../utils/date');
var mailData = {
    getData: function (req, mailRule) {
        var url = mailRule.schedule_rule;
        var typeId = mailRule.typeId;
        var result = [];

        if (mailRule) {
            var indexes = date.createIndexes(-1, -1, "access-");//indexs
            var period = date.period(-1, -1);
            switch (mailRule.rule_url) {
            }
            es_request.search(req.es, indexes, type, quotas, dimension, [0], null, period[0], period[1], 1, function (data) {

            });
            if (fn) {
                fn(result);
            }
        }
    }
}

module.exports = mailData;