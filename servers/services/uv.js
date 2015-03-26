var date = require('../utils/date')
var es = require('../utils/es')

module.exports = function uv(req) {

    var indexs = date.between(req, 'visitor-')


    searchbody = {
        "query": {
            "match_all": {}
        },
        "aggs": {
            "uv": {
                "terms": {"field": "utime"}
            }
        }
    }
}