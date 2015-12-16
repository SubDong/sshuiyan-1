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
    gacache = require('../services/gacache_request'),
    date = require('../utils/date'),
    data_convert = require('../mail/data_convert'),
    csvApi = require('json-2-csv'),
    fs = require("file-system");

var mailIntervalIds = [];

var getScaleName = function (scale) {
    switch (scale) {
        case "day":
            return "天";
            break;
        case "day":
            return "周";
            break;
        case "month":
            return "月";
            break;
        default :
            return "天";
    }
}


module.exports = function (req) {
    var everyDaySchedule = " ? * *";
    var weekMonSchedule = " ? * MON";
    var firstMonthSchedule = " 1 * ? *";
    later.date.localTime();
    daos.findSync('mail_rules_model', JSON.stringify({}), null, {}, function (err, docs) {
        if (mailIntervalIds && mailIntervalIds.length > 0) {
            mailIntervalIds.forEach(function (mailIntervalId) {
                mailIntervalId.clear();
            });
            mailIntervalIds = [];
        }
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
                        var start = mailRule["start"];
                        var end = mailRule["end"];
                        var contrastStart = mailRule["contrastStart"];
                        var contrastEnd = mailRule["contrastEnd"];
                        var startString = mailRule["startString"];
                        var contrastStartString = mailRule["contrastStartString"];
                        var typeId = mailRule["type_id"];
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
                        changeList_request.search(req.es, indexString, time, typeId, null, function (data) {
                            if (data && data["pv"]) {
                                var subject = "附件中含有数据统计,请查收!";
                                var title = startString + "与" + contrastStartString + "来源变化榜数据报告";
                                var result = data_convert.convertChangeListData(data, startString, contrastStartString);
                                csvApi.json2csv(result, function (err, csv) {
                                    //var buffer = new Buffer(csv);
                                    //需要转换字符集
                                    var fileSuffix = new Date().getTime();
                                    fs.writeFile("servers/filetmp/" + fileSuffix + ".csv", csv, function (error) {
                                        if (error) {
                                            console.error(error);
                                            return;
                                        } else {
                                            var mailOptions = {
                                                from: '百思慧眼< sshuiyanhost@126.com >', // sender address
                                                to: mailRule.mail_address.toString(), // list of receivers
                                                subject: title, // Subject line
                                                text: 'Hello world', // plaintext body
                                                html: '<b>' + subject + '</b>',// html body
                                                attachments: [
                                                    {
                                                        filename: fileSuffix + '.txt',
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
                    } else if (rule_index == "groupAnalysis") { //同类群组分析
                        var typeId = mailRule["type_id"];
                        var scale = mailRule["scale"];
                        var dateRange = mailRule["dateRange"];
                        var indicator = mailRule["indicator"];
                        var scaleName = getScaleName(scale);
                        gacache.search(typeId, scale, dateRange, indicator, function (data) {

                            if (data) {
                                var subject = "附件中含有数据统计,请查收!";
                                var title = "同类群组数据报告----规模" + scaleName + ",日期范围" + dateRange;
                                var tableCSV = [];
                                var trsData = JSON.parse(data).gaResultTrData;
                                trsData.forEach(function (trData, trIndex, array) {
                                    var trCsv = '{"日期":"' + trData.code + '","第0' + scaleName + '":"' + trData.data + '",';
                                    var tdsData = trData.gaResultTdDatas;
                                    for (var i = 0; i < trsData[0].gaResultTdDatas.length; i++) {
                                        var tdData = tdsData[i];

                                        if (tdData != null && tdData != undefined && tdData != "") {
                                            var day = i + 1;
                                            trCsv += '"第' + day + scaleName + '":"' + tdData.data + '",'
                                        } else {
                                            var day = i + 1;
                                            trCsv += '"第' + day + scaleName + '":"",'
                                        }
                                        if (i == trsData[0].gaResultTdDatas.length - 1) {
                                            trCsv = trCsv.substr(0, trCsv.length - 1);
                                            trCsv += '}';
                                        }
                                    }
                                    tableCSV.push(JSON.parse(trCsv));
                                    trCsv = "";
                                });
                                var result = JSON.stringify(tableCSV).replace(/\%/g, "*");
                                result = JSON.parse(result);
                                csvApi.json2csv(result, function (err, csv) {
                                    var buffer = new Buffer(csv);
                                    var fileSuffix = new Date().getTime();
                                    fs.writeFile("servers/filetmp/" + fileSuffix + ".csv", buffer, function (error) {
                                        if (error) {
                                            console.error(error);
                                            return;
                                        } else {
                                            var mailOptions = {
                                                from: '百思慧眼< sshuiyanhost@126.com >', // sender address
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
                    } else if (rule_index == "transformAnalysis") {// 事件转化
                        var subject = "附件中含有事件转化数据,请查收!";
                        var title = "转化分析-事件转化数据报告!";
                        var data = mailRule["result_data"];
                        var dataHead = mailRule["result_head_data"];
                        if (data.length) {
                            var result = data_convert.convertSjzhData(data, dataHead);
                            csvApi.json2csv(result, function (err, csv) {
                                var buffer = new Buffer(csv);
                                var fileSuffix = new Date().getTime();
                                fs.writeFile("servers/filetmp/" + fileSuffix + ".csv", buffer, function (error) {
                                    if (error) {
                                        console.error(error);
                                        return;
                                    } else {
                                        var mailOptions = {
                                            from: '百思慧眼< sshuiyanhost@126.com >', // sender address
                                            to: mailRule.mail_address.toString(), // list of receivers
                                            subject: title, // Subject line
                                            text: 'Hello world', // plaintext body
                                            html: '<b>' + subject + '</b>',// html body
                                            attachments: [
                                                {
                                                    filename: fileSuffix + '.txt',
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
                    } else if (rule_index == "pageTransform") {// 页面转化
                        var subject = "附件中含有页面转化数据,请查收!";
                        var title = "转化分析-页面转化数据报告!";
                        var data = mailRule["result_data"];
                        var dataHead = mailRule["result_head_data"];
                        if (data) {
                            var result = data_convert.convertSjzhData(data, dataHead);
                            csvApi.json2csv(result, function (err, csv) {
                                var buffer = new Buffer(csv);
                                var fileSuffix = new Date().getTime();
                                fs.writeFile("servers/filetmp/" + fileSuffix + ".csv", buffer, function (error) {
                                    if (error) {
                                        console.error(error);
                                        return;
                                    } else {
                                        var mailOptions = {
                                            from: '百思慧眼< sshuiyanhost@126.com >', // sender address
                                            to: mailRule.mail_address.toString(), // list of receivers
                                            subject: title, // Subject line
                                            text: 'Hello world', // plaintext body
                                            html: '<b>' + subject + '</b>',// html body
                                            attachments: [
                                                {
                                                    filename: fileSuffix + '.txt',
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
                    }  else if (rule_index == "history") {// 历史记录。
                        var subject = "附件中含有历史记录数据,请查收!";
                        var title = "历史记录-数据报告!";
                        var data = mailRule["result_data"];
                        var dataHead = mailRule["result_head_data"];
                        if (data) {
                            var result = data_convert.convertSjzhData(data, dataHead);
                            csvApi.json2csv(result, function (err, csv) {
                                var buffer = new Buffer(csv);
                                var fileSuffix = new Date().getTime();
                                fs.writeFile("servers/filetmp/" + fileSuffix + ".csv", buffer, function (error) {
                                    if (error) {
                                        console.error(error);
                                        return;
                                    } else {
                                        var mailOptions = {
                                            from: '百思慧眼< sshuiyanhost@126.com >', // sender address
                                            to: mailRule.mail_address.toString(), // list of receivers
                                            subject: title, // Subject line
                                            text: 'Hello world', // plaintext body
                                            html: '<b>' + subject + '</b>',// html body
                                            attachments: [
                                                {
                                                    filename: fileSuffix + '.txt',
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
                    } else { //默认
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
                            case "provincemap":
                                dimension = "region";
                                subject = "附件中含有访客地图数据,请查收!";
                                title = "访客地图今日数据报告!";
                                timeOffset[0] = 0;
                                timeOffset[1] = 0;
                                interval = 3600000;
                                break;
                            case "equipment":
                                dimension = "pm";
                                subject = "附件中含有设备环境数据,请查收!";
                                title = "网络设备类型今日数据报告!";
                                timeOffset[0] = 0;
                                timeOffset[1] = 0;
                                interval = 3600000;
                                break;

                            case "novisitors":
                                dimension = "ct";
                                subject = "附件中含有新老访客数据,请查收!";
                                title = "新老访客今日数据报告!";
                                timeOffset[0] = 0;
                                timeOffset[1] = 0;
                                interval = 3600000;
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
                                                from: '百思慧眼< sshuiyanhost@126.com >', // sender address
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
                // 存储定时任务
                mailIntervalIds.push(interval);
            });
        }
    });
}