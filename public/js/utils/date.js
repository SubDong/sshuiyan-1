/**
 * Created by yousheng on 15/3/24.
 */

function today_start() {
    return start(new Date())
}

function today_end() {
    return end(new Date())
}

function yesterday_end() {
    return end(yesterday())
}
function yesterday_start() {
    return start(yesterday())
}
function lastWeek_start() {
    return start(lastSevenDays());
}
function lastWeek_end() {
    return end(new Date());
}
function lastMonth_start() {
    return start(lastThirtyDays());
}
function lastMonth_end() {
    return end(new Date());
}

function yesterday() {
    var date = new Date()
    date.setDate(date.getDate() - 1)
    return date
}

function lastSevenDays() {
    var date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
}
function lastThirtyDays() {
    var date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
}

function start(date) {
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
}

function end(date) {
    date.setHours(23)
    date.setMinutes(59)
    date.setSeconds(59)
    date.setMilliseconds(999)
    return date
}

function date_split(start, end, interval) {
    var buckets = []
    for (var i = start.getTime(); i <= end.getTime(); i += interval) {
        buckets.push(new Date(i))
    }

    if (buckets[buckets.length - 1] < end.getTime()) {
        buckets.push(new Date(end.getTime()))
    }

    return buckets
}

var b = date_split(yesterday_start(), today_end(), 2 * 60 * 60 * 1000)