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
    var date = new Date();
    date.setDate(date.getDate() - 1);
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
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date
}

function end(date) {
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    date.setMilliseconds(999);
    return date
}

function date_split(start, end, interval) {
    var buckets = [];
    for (var i = start.getTime(); i <= end.getTime(); i += interval) {
        buckets.push(new Date(i))
    }

    if (buckets[buckets.length - 1] < end.getTime()) {
        buckets.push(new Date(end.getTime()))
    }

    return buckets
}

var b = date_split(yesterday_start(), today_end(), 2 * 60 * 60 * 1000);


// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2014-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2014-7-2 8:9:4.18
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};