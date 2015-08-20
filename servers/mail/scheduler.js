/**
 * Created by xiaowei on 15-7-30.
 */
var later = require("later");
var daos = require('../db/daos'),
    mail = require("../mail/mail"),
    fs=require("file-system");
module.exports = function () {
    var everyDaySchedule = " ? * *";
    var weekMonSchedule = " ? * MON";
    var firstMonthSchedule = " 1 * ? *";
    later.date.localTime();
    daos.findSync('mail_rules_model', JSON.stringify({}), null, {}, function (err, docs) {
        if (docs.length) {
            docs.forEach(function (mailRule) {
                var cronSched = later.parse.cron("59 23 ? * *");
                var scheduleType = mailRule.schedule_rule;
                switch (scheduleType) {
                    case 0:
                        var str = mailRule.schedule_date.split(":");
                        var schedulerStr = str[1] + " " + str[0] + everyDaySchedule;
                        cronSched = later.parse.cron(schedulerStr);
                        break;
                    case 1:
                        var str = mailRule.schedule_date.split(":");
                        var schedulerStr = str[1] + " " + str[0] + weekMonSchedule;
                        cronSched = later.parse.cron(schedulerStr);
                        break;
                    case 2:
                        var str = mailRule.schedule_date.split(":");
                        var schedulerStr = str[1] + " " + str[0] + firstMonthSchedule;
                        cronSched = later.parse.cron(schedulerStr);
                        break;
                }

                var interval = later.setInterval(function () {
                    //var rule_index = mailRule.rule_url;
                    //var data=[{"时间":"00:00 - 00:59","浏览量(PV)":111,"访客数(UV)":97,"IP数":11,"跳出率":"31%","平均访问时长":"00:00:31"},{"时间":"01:00 - 01:59","浏览量(PV)":79,"访客数(UV)":77,"IP数":8,"跳出率":"38%","平均访问时长":"00:00:39"},{"时间":"02:00 - 02:59","浏览量(PV)":52,"访客数(UV)":46,"IP数":12,"跳出率":"56%","平均访问时长":"00:00:35"},{"时间":"03:00 - 03:59","浏览量(PV)":63,"访客数(UV)":59,"IP数":7,"跳出率":"40%","平均访问时长":"00:00:10"},{"时间":"04:00 - 04:59","浏览量(PV)":53,"访客数(UV)":49,"IP数":14,"跳出率":"51%","平均访问时长":"00:00:18"},{"时间":"05:00 - 05:59","浏览量(PV)":71,"访客数(UV)":64,"IP数":11,"跳出率":"38%","平均访问时长":"00:00:28"},{"时间":"06:00 - 06:59","浏览量(PV)":73,"访客数(UV)":73,"IP数":10,"跳出率":"53%","平均访问时长":"00:00:23"},{"时间":"07:00 - 07:59","浏览量(PV)":53,"访客数(UV)":52,"IP数":16,"跳出率":"59%","平均访问时长":"00:00:14"},{"时间":"08:00 - 08:59","浏览量(PV)":109,"访客数(UV)":99,"IP数":59,"跳出率":"84%","平均访问时长":"00:00:02"},{"时间":"09:00 - 09:59","浏览量(PV)":132,"访客数(UV)":130,"IP数":39,"跳出率":"72%","平均访问时长":"00:00:06"},{"时间":"10:00 - 10:59","浏览量(PV)":204,"访客数(UV)":175,"IP数":53,"跳出率":"69%","平均访问时长":"00:00:04"},{"时间":"11:00 - 11:59","浏览量(PV)":0,"访客数(UV)":0,"IP数":0,"跳出率":"0%","平均访问时长":"00:00:00"},{"时间":"12:00 - 12:59","浏览量(PV)":0,"访客数(UV)":0,"IP数":0,"跳出率":"0%","平均访问时长":"00:00:00"},{"时间":"13:00 - 13:59","浏览量(PV)":0,"访客数(UV)":0,"IP数":0,"跳出率":"0%","平均访问时长":"00:00:00"},{"时间":"14:00 - 14:59","浏览量(PV)":0,"访客数(UV)":0,"IP数":0,"跳出率":"0%","平均访问时长":"00:00:00"},{"时间":"15:00 - 15:59","浏览量(PV)":0,"访客数(UV)":0,"IP数":0,"跳出率":"0%","平均访问时长":"00:00:00"},{"时间":"16:00 - 16:59","浏览量(PV)":0,"访客数(UV)":0,"IP数":0,"跳出率":"0%","平均访问时长":"00:00:00"},{"时间":"17:00 - 17:59","浏览量(PV)":0,"访客数(UV)":0,"IP数":0,"跳出率":"0%","平均访问时长":"00:00:00"},{"时间":"18:00 - 18:59","浏览量(PV)":0,"访客数(UV)":0,"IP数":0,"跳出率":"0%","平均访问时长":"00:00:00"},{"时间":"19:00 - 19:59","浏览量(PV)":0,"访客数(UV)":0,"IP数":0,"跳出率":"0%","平均访问时长":"00:00:00"},{"时间":"20:00 - 20:59","浏览量(PV)":0,"访客数(UV)":0,"IP数":0,"跳出率":"0%","平均访问时长":"00:00:00"},{"时间":"21:00 - 21:59","浏览量(PV)":0,"访客数(UV)":0,"IP数":0,"跳出率":"0%","平均访问时长":"00:00:00"},{"时间":"22:00 - 22:59","浏览量(PV)":0,"访客数(UV)":0,"IP数":0,"跳出率":"0%","平均访问时长":"00:00:00"},{"时间":"23:00 - 23:59","浏览量(PV)":0,"访客数(UV)":0,"IP数":0,"跳出率":"0%","平均访问时长":"00:00:00"}]

                    var mailOptions = {
                        from: '百思慧眼<70285622@qq.com> ', // sender address
                        to: mailRule.mail_address.toString(), // list of receivers
                        subject: 'Hello', // Subject line
                        text: 'Hello world', // plaintext body
                        html: '<b>我是测试自动发送数据!</b>' // html body
                        //,attachments: [
                        //    {
                        //        filename: 'test.csv',
                        //        path: str
                        //    }
                        //]
                    };
                    mail.send(mailOptions, function (error, info) {
                        if (error) {
                            console.error(error);
                        } else {
                            console.log('Message sent: ' + info.response + "at " + new Date());
                        }
                    });


                }, cronSched);
            });
        }
    });
}