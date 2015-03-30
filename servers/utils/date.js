var fmt = require('strftime')
var url = require('url')

var dateutils = {
    between: function (req, prefix) {
        var parsed = url.parse(req.url, true)
        var start = this.fromTime(parsed.query['start'])

        var end
        if(parsed.query['end']){
            end = this.fromTime(parsed.query['end'])
        }else{
            end = new Date().getTime();
        }

        var number = Math.floor((end - start) / (24 * 60 * 60 * 1000))

        var dates = [prefix + fmt("%F", start)]


        for (var i = 1; i <= number; i++) {
            start.setDate(start.getDate() + 1);
            dates.push(prefix + fmt("%F", start))
        }

        return dates;
    },

    fromTime: function (time) {
        var date = new Date()
        date.setTime(time)
        return date
    },
    formatTime:function(time){
        return new Date(parseInt(time)).toLocaleTimeString();
    }
}

module.exports = dateutils
