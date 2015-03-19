var fmt = require('strftime')
var url = require('url')

var dateutils = {
    between: function (req, prefix) {
        var parsed = url.parse(req.url, true)

        var start = new Date(parsed.query['start'])
        var end = parsed.query['end']
        if (end) {
            end = new Date(end)
        } else {
            end = new Date()
        }


        var number = Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))

        var dates = [prefix + fmt("%F", start)]


        for (var i = 1; i <= number; i++) {
            start.setDate(start.getDate() + 1);
            dates.push(prefix + fmt("%F", start))
        }

        return dates;
    }
}

module.exports = dateutils
