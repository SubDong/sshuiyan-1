/**
 * Created by xiaowei on 15-7-30.
 */
var later = require("later");
var daos = require('../db/daos'),
    mail = require("../mail/mail"),
    fs = require("file-system"),
    url = require('url'),
    es_request = require('../services/refactor_request'),
    changeList_request = require("../services/changeList_request"),
    date = require('../utils/date'),
    data_convert = require('../mail/data_convert'),
    csvApi = require('json-2-csv'),
    fs = require("file-system");
module.exports = function (req) {
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
                    var rule_index = mailRule.rule_url;
                    if (rule_index == "changelist") {// 来源变化榜
                        console.log("来源变化榜");
                        console.log(mailRule);
                        var start = mailRule["start"];
                        var end = mailRule["end"];
                        var contrastStart = mailRule["contrastStart"];
                        var contrastEnd = mailRule["contrastEnd"];
                        var startString = mailRule["startString"];
                        var contrastStartString = mailRule["contrastStartString"];
                        var indexString = [];
                        var contrastIndexString = [];
                        var time = [];
                        var contrastTime = [];

                        indexString = date.createIndexes(start, end, "access-");
                        time = date.getConvertTimeByNumber(start, end);

                        contrastIndexString = date.createIndexes(contrastStart, contrastEnd, "access-");
                        contrastTime = date.getConvertTimeByNumber(contrastStart, contrastEnd);

                        for (var i = 0; i < contrastIndexString.length; i++) {
                            indexString.push(contrastIndexString[i]);
                        }
                        for (var i = 0; i < contrastTime.length; i++) {
                            time.push(contrastTime[i]);
                        }
                        changeList_request.search(req.es, indexString, time, function (data) {
                            if (data) {
                                var subject = "附件中含有数据统计,请查收!";
                                var title = startString + "与" + contrastStartString + "来源变化榜数据报告!!!";
                                var result = data_convert.convertChangeListData(data, startString, contrastStartString);
                                csvApi.json2csv(result, function (err, csv) {
                                    var buffer = new Buffer(csv);
                                    var fileSuffix = new Date().getTime();
                                    fs.writeFile("servers/filetmp/" + fileSuffix + ".csv", buffer, function (error) {
                                        if (error) {
                                            console.error(error);
                                            return;
                                        } else {
                                            var mailOptions = {
                                                from: '百思慧眼<70285622@qq.com> ', // sender address
                                                to: mailRule.mail_address.toString(), // list of receivers
                                                subject: title, // Subject line
                                                text: 'Hello world', // plaintext body
                                                html: '<b>' + subject + '</b>',// html body
                                                attachments: [
                                                    {
                                                        filename: fileSuffix + '.csv',
                                                        path: "servers/filetmp/" + fileSuffix + ".csv"
                                                    }
                                                ]
                                            };
                                            mail.send(mailOptions, function (error, info) {
                                                if (error) {
                                                    console.error(error);
                                                } else {
                                                    console.log('Message sent: ' + info.response + "at " + new Date());
                                                    fs.exists('servers/filetmp/' + fileSuffix + '.csv', function (exists) {
                                                        if (exists) {
                                                            fs.unlinkSync('servers/filetmp/' + fileSuffix + '.csv');
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                });
                            } else {
                                console.log("Send mail failed:No data result!");
                            }
                        });
                    } else {
                        var timeOffset = [-1, -1];
                        var interval = 1;
                        var dimension = "period";
                        var filters = null;
                        var subject = "附件中含有今日数据统计,请查收!";
                        var title = "今日统计数据报告!";
                        switch (rule_index) {
                            case "yesterday":
                                timeOffset = [-1, -1];
                                subject = "附件中含有昨日数据,请查收!";
                                title = "昨日统计数据报告!";
                                break;
                            case "seven":
                                timeOffset = [-6, 0];
                                subject = "附件中含有最近7天数据,请查收!";
                                title = "近7天统计数据报告!";
                                break;
                            case "month":
                                timeOffset = [-29, 0];
                                subject = "附件中含有最近30天数据,请查收!";
                                title = "近30天统计数据报告!";
                                break;
                            case "source":
                                dimension = "rf_type";
                                title = "全部来源今日统计数据报告!";
                                break;
                            case "engine":
                                dimension = "se";
                                filters = [{"rf_type": ["2"]}];
                                title = "搜索引擎今日数据报告!";
                                break;
                            case "keyword":
                                dimension = "kw";
                                title = "搜索词今日数据报告!";
                                break;
                            case "ext":
                                dimension = "rf";
                                filters = [{"rf_type": ["3"]}];
                                title = "外部连接今日数据报告!";
                                break;
                            case "indexoverview":
                                dimension = "loc";
                                title = "受访页面今日数据报告!";
                                break;
                            case "entrancepage":
                                dimension = "loc";
                                title = "入口页面今日数据报告!";
                                break;
                            default :
                                break;
                        }
                        var indexes = date.createIndexes(timeOffset[0], timeOffset[1], "access-");//indexs
                        var period = date.period(timeOffset[0], timeOffset[1]);
                        var quotas = ["pv", "uv", "ip", "outRate", "avtTime", "vc", "nuv", "nuvRate", "avgTime", "avgPage"];
                        es_request.search(req.es, indexes, mailRule.type_id, quotas, dimension, [0], filters, period[0], period[1], interval, function (data) {
                            if (data.length) {
                                var result = data_convert.convertData(data, rule_index, dimension);
                                csvApi.json2csv(result, function (err, csv) {
                                    var buffer = new Buffer(csv);
                                    var fileSuffix = new Date().getTime();
                                    fs.writeFile("servers/filetmp/" + fileSuffix + ".csv", buffer, function (error) {
                                        if (error) {
                                            console.error(error);
                                            return;
                                        } else {
                                            var mailOptions = {
                                                from: '百思慧眼<70285622@qq.com> ', // sender address
                                                to: mailRule.mail_address.toString(), // list of receivers
                                                subject: title, // Subject line
                                                text: 'Hello world', // plaintext body
                                                html: '<b>' + subject + '</b>',// html body
                                                attachments: [
                                                    {
                                                        filename: fileSuffix + '.csv',
                                                        path: "servers/filetmp/" + fileSuffix + ".csv"
                                                    }
                                                ]
                                            };
                                            mail.send(mailOptions, function (error, info) {
                                                if (error) {
                                                    console.error(error);
                                                } else {
                                                    console.log('Message sent: ' + info.response + "at " + new Date());
                                                    fs.exists('servers/filetmp/' + fileSuffix + '.csv', function (exists) {
                                                        if (exists) {
                                                            fs.unlinkSync('servers/filetmp/' + fileSuffix + '.csv');
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                });
                            } else {
                                console.log("Send mail failed:No data result!");
                            }
                        });
                    }
                }, cronSched);
            });
        }
    });
}