/**
 * Created by weims on 2015/5/15.
 */
define(["../app"], function (app) {
    'use strict';

    app.directive("calendar", function ($rootScope, requestService) {
        var option = {
            restrict: "EA",
            template: "<div  role=\"group\" class=\"btn-group fl\"><button class=\"btn btn-default\" type=\"button\" ng-click=\"today()\" ng-hide=\"visible\" ng-class=\"{'current':todayClass}\">今天</button>" +
            "<button class=\"btn btn-default\" type=\"button\" ng-click=\"yesterday()\" ng-class=\"{'current':yesterdayClass}\">昨天</button>" +
            "<button class=\"btn btn-default\" type=\"button\" ng-click=\"sevenDay()\" ng-class=\"{'current':sevenDayClass}\">最近7天</button>" +
            "<button class=\"btn btn-default\" type=\"button\" ng-click=\"month()\" ng-class=\"{'current':monthClass}\">最近30天</button>" +
            "<button id=\"reportrange\"  class=\"btn btn-default pull-right date-picker my_picker\" ng-click=\'timeclick()\' ng-show=\"datechoice\" ng-class=\"{'current':timeClass}\" max=\"max\" ng-model=\"date\"> " +
            "<i class=\"glyphicon glyphicon-calendar fa fa-calendar\"></i><span></span></button>" +
            "</div>",
            replace: true,
            transclude: true,
            link: function (scope, element, attris, controller) {
                Custom.initCheckInfo();
                scope.$watch("opened", function () {
                    /*    console.log();*/
                });
                scope.weekselected = true;
                scope.mothselected = true;
                scope.maxDate = new Date();
                scope.datechoice = true;
                scope.reset = function () {
                    scope.todayClass = false;
                    scope.yesterdayClass = false;
                    scope.sevenDayClass = false;
                    scope.monthClass = false;
                    scope.definClass = false;
                    scope.btnchecked = true;
                    scope.weekcheckClass = false;
                    scope.mothcheckClass = false;
                    scope.timeClass = false;
                    scope.lastDaySelect = false;
                    scope.lastWeekSelect = false;
                    scope.compareLastDayClass = false;
                    scope.compareLastWeekClass = false;
                    scope.clearCompareSelect = false;

                };
                scope.reloadByCalendar = function (type) {
                    console.info("info: now user click the " + type + " button");
                    $rootScope.$broadcast("ssh_refresh_charts");
                    $rootScope.$broadcast("ssh_dateShow_options_time_change", type);
                };
                scope.today = function () {
                    scope.hourselect = false;
                    scope.dayselect = false;
                    scope.weekselected = true;
                    scope.mothselected = true;
                    scope.reset();
                    scope.lastDaySelect = true;
                    scope.lastWeekSelect = true;
                    scope.clearCompareSelect = true;
                    scope.todayClass = true;
                    // table 参数配置
                    $rootScope.tableTimeStart = 0;
                    $rootScope.tableTimeEnd = 0;
                    $rootScope.keyFormat = "hour";
                    $rootScope.start = 0;
                    $rootScope.end = 0
                    scope.reloadByCalendar("today");
                    $('#reportrange span').html(GetDateStr(0));
                };
                scope.yesterday = function () {
                    scope.hourselect = false;
                    scope.dayselect = false;
                    scope.weekselected = true;
                    scope.mothselected = true;
                    scope.reset();
                    scope.lastDaySelect = true;
                    scope.lastWeekSelect = true;
                    scope.clearCompareSelect = true;
                    scope.yesterdayClass = true;
                    $rootScope.tableTimeStart = -1;
                    $rootScope.tableTimeEnd = -1;
                    $rootScope.start = -1;
                    $rootScope.end = -1;
                    scope.reloadByCalendar("yesterday");
                    $('#reportrange span').html(GetDateStr(-1));
                };
                scope.sevenDay = function () {
                    scope.hourselect = false;
                    scope.dayselect = false;
                    scope.weekselected = true;
                    scope.mothselected = true;
                    scope.reset();
                    scope.sevenDayClass = true;
                    $rootScope.tableTimeStart = -7;
                    $rootScope.tableTimeEnd = -1;
                    $rootScope.start = -7;
                    $rootScope.end = -1;
                    scope.reloadByCalendar("seven");
                    $('#reportrange span').html(GetDateStr(-7) + "至" + GetDateStr(0));
                };
                scope.month = function () {
                    scope.hourselect = false;
                    scope.dayselect = false;
                    scope.weekselected = false;
                    scope.mothselected = true;
                    scope.reset();
                    scope.monthClass = true;
                    $rootScope.tableTimeStart = -30;
                    $rootScope.tableTimeEnd = 0;
                    $rootScope.start = -30;
                    $rootScope.end = 0;
                    scope.reloadByCalendar("month");
                    $('#reportrange span').html(GetDateStr(-30) + "至" + GetDateStr(0));
                };
                scope.timeclick = function () {
                    scope.reset();
                    scope.timeClass = true;
                }
                scope.open = function ($event) {
                    scope.reset();
                    scope.definClass = true;
                    $event.preventDefault();
                    $event.stopPropagation();
                    scope.opened = true;
                    scope.isDisabled = false;
                };
                scope.checkopen = function ($event) {
                    scope.reset();
                    scope.definClass = false;
                    $event.preventDefault();
                    $event.stopPropagation();
                    scope.opens = true;
                };
                function GetDateStr(AddDayCount) {
                    var dd = new Date();
                    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
                    var y = dd.getFullYear();
                    var m = dd.getMonth() + 1;//获取当前月份的日期
                    var d = dd.getDate();
                    return y + "-" + m + "-" + d;
                }

                $('#reportrange span').html(GetDateStr(0));
                $('#reportrange').daterangepicker({
                    format: 'YYYY-MM-DD',
                    maxDate: GetDateStr(0),
                    showDropdowns: true,
                    showWeekNumbers: false,
                    timePicker: false,
                    //timePickerIncrement: 1,
                    timePicker12Hour: false,
                    opens: 'left',
                    drops: 'down',
                    timeZone: true,
                    buttonClasses: ['btn', 'btn-sm'],
                    applyClass: 'btn-primary',
                    cancelClass: 'btn-default',
                    separator: ' to '
                }, function (start, end, label) {
                    $rootScope.datepickerClick(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'), label);
                    $('#reportrange span').html(start.format('YYYY-MM-DD') + '至' + end.format('YYYY-MM-DD'));
                });
            }
        };
        return option;
    });
    app.directive("dateother", function ($rootScope) {
        var option = {
            restrict: "EA",
            template: "<div role=\"group\" class=\"btn-group fl\"><button id=\"choicetrange\"  class=\"btn btn-default pull-right date-picker my_picker fl\"   max=\"max\" ng-model=\"date\"> " +
            "<i class=\"glyphicon glyphicon-calendar fa fa-calendar\"></i><span>与其他时间段对比</span></button><button class=\"btn btn-default\" type=\"button\" ng-hide=\"dateshows\" >前一日</button> <button class=\"btn btn-default\" type=\"button\"  ng-hide=\"dateshows\" >上周同期</button></div>",
            replace: true,
            transclude: true,
            link: function (scope, element, attris, controller) {
                function GetDateStr(AddDayCount) {
                    var dd = new Date();
                    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
                    var y = dd.getFullYear();
                    var m = dd.getMonth() + 1;//获取当前月份的日期
                    var d = dd.getDate();
                    return y + "-" + m + "-" + d;
                }

                scope.dateshows = true;
                $('#choicetrange').daterangepicker({
                    format: 'YYYY-MM-DD',
                    maxDate: GetDateStr(0),
                    showDropdowns: true,
                    showWeekNumbers: false,
                    timePicker: false,
                    timePickerIncrement: 1,
                    timePicker12Hour: false,
                    opens: 'left',
                    drops: 'down',
                    timeZone: true,
                    buttonClasses: ['btn', 'btn-sm'],
                    applyClass: 'btn-primary',
                    cancelClass: 'btn-default',
                    separator: ' to '
                }, function (start, end, label) {
                    $rootScope.datepickerClickTow(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'), label);
                    $('#choicetrange span').html(start.format('YYYY-MM-DD') + '至' + end.format('YYYY-MM-DD'));
                });
            }
        };
        return option;
    });
    app.directive("dateweek", function () {
        var option = {
            restrict: "EA",
            template: " <div aria-label=\"First group\" role=\"group\" class=\"btn-group fl\">" +
            "<button class=\"btn btn-default current\"  ng-click=\"hourcheck()\" ng-class=\"{'current':hourcheckClass,'disabled':hourselect}\" type=\"button\">按时</button>" +
            "<button class=\"btn btn-default \" ng-click=\"daycheck()\" ng-class=\"{'current':dayClass,'disabled':dayselect}\" type=\"button\">按日</button>" +
            "<button class=\"btn btn-default\" ng-click=\"weekcheck()\" ng-class=\"{'current':weekcheckClass,'disabled':weekselected}\"type=\"button\">按周</button>" +
            "<button class=\"btn btn-default\" ng-click=\"mothcheck()\" ng-class=\"{'current':mothcheckClass,'disabled':mothselected}\"type=\"button\">按月</button></div>",
            replace: true,
            transclude: true
        };
        return option;
    });
    app.directive("refresh", function () {
        var option = {
            restrict: "EA",
            template: "<div class=\"right_refresh fr\"><button class=\"btn btn-default btn-Refresh fl\" type=\"button\"><span aria-hidden=\"true\" class=\"glyphicon glyphicon-refresh\"></span></button><ui-select ng-model=\"export.selected\" theme=\"selectize\" ng-show=\"menu_select\" class=\"fl\"style=\"width: 65px;\"> <ui-select-match placeholder=\"导出\">{{$select.selected.name}} </ui-select-match> <ui-select-choices repeat=\"export in exports\"> <span ng-bind-html=\"export.name\"></span></ui-select-choices></ui-select></div>",
            transclude: true
        }
        return option;
    });
    app.directive("compare", function () {
        return {
            restrict: "EA",
            template: "<div aria-label=\"First group\" role=\"group\" class=\"btn-group \">" +
            "<button class=\"btn btn-default\" type=\"button\" ng-click=\"compareLastDay()\" ng-class=\"{'current':compareLastDayClass,'disabled':!lastDaySelect}\">前一日</button>" +
            "<button class=\"btn btn-default\" type=\"button\" ng-click=\"compareLastWeek()\" ng-class=\"{'current':compareLastWeekClass,'disabled':!lastWeekSelect}\">上周同期</button>" +
            "<button class=\"btn btn-default\" type=\"button\" ng-click=\"restCompare()\" ng-class=\"{'disabled':!clearCompareSelect}\">取消对比</button>" +
            "</div>",
            transclude: true
        }
    });
    /*
     app.directive("views", function () {
     var option = {
     restrict: "EA",
     template: "<select ng-model=\"selected\" ng-options=\"m.id as m.when for m in view\" > <option value=\"\">浏览量</option></select>",
     transclude: true
     };
     return option;
     });
     */
    app.directive("page", function () {
        var option = {
            restrict: "EA",
            template: "<div aria-label=\"First group\" role=\"group\" class=\"btn-group fl\"><a ui-sref=\"entrancepage\" class=\"fl btn btn-default\" ui-sref-active=\"current\"> 指标概览</a><a ui-sref=\"entrancepage/1\" class=\"btn btn-default fl\" ui-sref-active=\"current\"> 流量分析</a><a ui-sref=\"entrancepage/2\" class=\"btn btn-default fl\" ui-sref-active=\"current\"> 新访客分析</a> <a ui-sref=\"entrancepage/3\" class=\"btn btn-default fl\" ui-sref-active=\"current\">吸引力分析</a> <a ui-sref=\"entrancepage/4\" class=\"btn btn-default fl\" ui-sref-active=\"current\">转化分析</a> </div>",
            transclude: true
        };
        return option;
    });
    app.directive("indexoverview", function () {
        var option = {
            restrict: "EA",
            template: "<div aria-label=\"First group\" role=\"group\" class=\"btn-group fl\"><a class=\"btn btn-default\"ui-sref=\"indexoverview\"  ui-sref-active=\"active\">指标概览</a><a class=\"btn btn-default\" ui-sref=\"indexoverview/1\" ui-sref-active=\"active\">页面价值分析</a><a class=\"btn btn-default\"ui-sref=\"indexoverview/2\" ui-sref-active=\"active\">入口页分析</a> <a class=\"btn btn-default\"ui-sref=\"indexoverview/3\" ui-sref-active=\"active\">退出页分析</a></div>",
            transclude: true
        };
        return option;
    });

//grid_page
    app.directive("gridpage", function () {
        var option = {
            restrict: "EA",
            template: "<div class=\"page\"><a ng-click=\"gridApi2.pagination.previousPage()\">上一页</a> <button type=\"button\" class=\"btn\"> {{ gridApi2.pagination.getPage() }}</button><a ng-click=\"gridApi2.pagination.nextPage()\">下一页 </a> <input type=\"text\" ng-model=\"page\" value=\"\"><span> /{{ gridApi2.pagination.getTotalPages() }}</span> <button type=\"button\" class=\"btn\" ng-click=\"pagego(gridApi2)\">跳转</button> </div>",
            transclude: true
        };
        return option;
    });


    /**
     * Create by wms on 2015-04-22.合计信息显示
     */
    app.directive("sshDateShow", function ($http, $rootScope, $q, SEM_API_URL) {
        return {
            restrict: 'E',
            templateUrl: '../commons/date_show.html',
            link: function (scope, element, attris, controller) {
                // 初始化参数
                scope.isCompared = false;
                scope.dateShowArray = [];
                scope.dateShowArray_base = [];
                scope.ssh_seo_type = attris.semType;
                scope.ds_start = scope.ds_end = 0;
                scope.ds_defaultQuotasOption = ["pv", "uv", "ip", "nuv", "outRate", "avgTime"];
                scope.ds_dateShowQuotasOption = scope.checkedArray ? scope.checkedArray : scope.ds_defaultQuotasOption;
                // 获取数据
                scope.loadDataShow = function () {
                    scope.dateShowArray = scope.dateShowArray_base = [];
                    var esRequest = $http.get("/api/summary?type=" + $rootScope.defaultType + "&dimension=" + scope.ds_dimension + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&quotas=" + scope.ds_dateShowQuotasOption + "&start=" + scope.ds_start + "&end=" + scope.ds_end);
                    var seoQuotas = scope.getSEOQuotas();
                    if (seoQuotas.length > 0) {
                        var stringQuotas = seoQuotas.toString().replace(/,/g, "-") + "-";
                        var seoRequest = $http.get(SEM_API_URL + "jiehun/baidu-bjjiehun2123585/" + scope.ssh_seo_type + "/" + stringQuotas + "?startOffset=" + scope.ds_start + "&endOffset=" + scope.ds_end);
                    }
                    $q.all([esRequest, seoRequest]).then(function (final_result) {
                        scope.pushESData(final_result[0].data);
                        if (final_result[1] != undefined) {
                            scope.pushSEOData(final_result[1].data);
                        }
                    });
                };
                scope.getSEOQuotas = function () {
                    var seoQuotas = [];
                    // 根据用户所选择的指标，判断是否具有SEO指标，如果存在SEO指标则构建该指标的对象并且存储该指标
                    angular.forEach(scope.ds_dateShowQuotasOption, function (e) {
                        switch (e) {
                            case "cost":
                            case "impression":
                            case "click":
                            case "ctr":
                            case "cpc":
                            case "cpm":
                            case "conversion":
                                seoQuotas.push(e);
                        }
                    });
                    return seoQuotas;
                };
                scope.pushESData = function (result) {
                    var obj = JSON.parse(eval('(' + result + ')').toString()); //由JSON字符串转换为JSON对象
                    angular.forEach(obj, function (r) {
                        var dateShowObject = {};
                        dateShowObject.label = r.label;
                        var temp = 0;
                        var count = 0;
                        angular.forEach(r.quota, function (qo) {
                            temp += Number(qo);
                            count++;
                        });
                        if (r.label === "outRate" || r.label === "nuvRate" || r.label === "arrivedRate") {
                            if (count === 0) {
                                dateShowObject.value = "--";
                            } else {
                                dateShowObject.value = (temp / count).toFixed(2) + "%";
                            }
                        } else if (r.label === "avgPage") {
                            if (count === 0) {
                                dateShowObject.value = "--";
                            } else {
                                dateShowObject.value = (temp / count).toFixed(2);
                            }
                        } else if (r.label === "avgTime") {
                            dateShowObject.value = MillisecondToDate(temp / count);
                        } else {
                            dateShowObject.value = temp;
                        }
                        scope.correctAndPushArray(dateShowObject);
                    });
                };
                scope.pushSEOData = function (result) {
                    var costObj, impressionObj, clickObj, ctrObj, cpcObj, cpmObj, conversionObj;
                    angular.forEach(scope.ds_dateShowQuotasOption, function (e) {
                        switch (e) {
                            case "cost":
                                costObj = {"label": e, "value": 0};
                                break;
                            case "impression":
                                impressionObj = {"label": e, "value": 0};
                                break;
                            case "click":
                                clickObj = {"label": e, "value": 0};
                                break;
                            case "ctr":
                                ctrObj = {"label": e, "value": 0};
                                break;
                            case "cpc":
                                cpcObj = {"label": e, "value": 0};
                                break;
                            case "cpm":
                                cpmObj = {"label": e, "value": 0};
                                break;
                            case "conversion":
                                conversionObj = {"label": e, "value": 0};
                                break;
                        }
                    });
                    // 对指标的值求和
                    function sumValue(obj, value) {
                        if (obj) {
                            obj.value += Number(value);
                        }
                    }

                    function calculateValue(obj, type) {
                        if (!obj) {
                            return;
                        }
                        if (type == "1") {// 直接获取值
                            obj.value = obj.value.toFixed(2);
                        }
                        if (type == "2") {// 保留2位小数
                            obj.value = obj.value.toFixed(2);
                        }
                        if (type == "3") {// 计算平均值
                            obj.value = count == 0 ? "--" : (cpcObj.value / count).toFixed(2);
                        }
                        scope.correctAndPushArray(obj);
                    }

                    var count = 0;
                    angular.forEach(result, function (r) {
                        count++;
                        sumValue(costObj, r.cost);
                        sumValue(impressionObj, r.impression);
                        sumValue(clickObj, r.click);
                        sumValue(ctrObj, r.ctr);
                        sumValue(cpcObj, r.cpc);
                        sumValue(cpmObj, r.cpm);
                        sumValue(conversionObj, r.conversion);
                    });
                    // 根据不同SEO指标的算法，进行指标对象值的计算
                    calculateValue(costObj, "2");
                    calculateValue(impressionObj, "2");
                    calculateValue(clickObj, "1");
                    calculateValue(ctrObj, "2");
                    calculateValue(cpcObj, "3");
                    calculateValue(cpmObj, "2");
                    calculateValue(conversionObj, "2");
                };
                // 特殊处理，保证指标显示顺序
                scope.correctAndPushArray = function (obj) {
                    var index = 0;
                    angular.forEach(scope.ds_dateShowQuotasOption, function (ds_r) {
                        if (ds_r == obj.label) {
                            scope.dateShowArray[index] = obj;
                            scope.dateShowArray_base[index] = obj;
                        }
                        index++;
                    });
                };
                // 改变时间参数
                scope.setDateShowTimeOption = function (type, cb) {
                    if (type === "today") {
                        scope.ds_start = scope.ds_end = 0;
                    } else if (type === "yesterday") {
                        scope.ds_start = scope.ds_end = -1;
                    } else if (type === "seven") {
                        scope.ds_start = -7;
                        scope.ds_end = -1;
                    } else if (type === "month") {
                        scope.ds_start = -30;
                        scope.ds_end = -1;
                    } else {
                        scope.ds_start = $rootScope.tableTimeStart;
                        scope.ds_end = $rootScope.tableTimeEnd;
                    }
                    if (cb) {
                        cb();
                    }
                };
                scope.setDateShowTimeOption(attris.type);
                // 第一种方式。通过用户点击时发出的事件进行监听，此方法需要在每个controller方法内部添加代码实现
                scope.$on("ssh_dateShow_options_time_change", function (e, msg) {
                    scope.setDateShowTimeOption(msg, scope.loadDataShow);
                });
                // 维度dimension
                scope.setDateShowDimensionOption = function (dimension) {
                    scope.ds_dimension = "period";
                    if (undefined != dimension) {
                        scope.ds_dimension = dimension;
                    }
                };
                scope.setDateShowDimensionOption(attris.dimension);
                // 指标
                scope.$on("ssh_dateShow_options_quotas_change", function (e, msg) {
                    var temp = angular.copy(msg);
                    if (temp.length > 0) {
                        scope.ds_dateShowQuotasOption = temp;
                    }
                    scope.dateShowArray = scope.dateShowArray_base = [];
                    scope.loadDataShow();
                });
                scope.loadDataShow();
                // 用于动态效果
                scope.$on("ssh_reload_datashow", function () {
                    var tempArray = [];
                    angular.forEach(scope.checkedArray, function (ca_r) {
                        tempArray.push({"label": ca_r, "value": ""});
                    });

                    angular.forEach(tempArray, function (ta_r) {
                        angular.forEach(scope.dateShowArray_base, function (ab_r) {
                            if (ta_r.label == ab_r.label) {
                                ta_r.value = ab_r.value;
                            }
                        });
                    });

                    scope.dateShowArray = angular.copy(tempArray);
                });
            }
        };
    });

    /**
     * 搜索引擎dateShow
     */
    app.directive("sshSEDateShow", function ($http, $rootScope, $q, SEM_API_URL) {
        return {
            restrict: 'E',
            templateUrl: '../commons/date_show.html',
            scope: 'true',
            link: function (scope, element, attris, controller) {
                scope.dateShowArray = [];
                scope.ds_start = scope.ds_end = 0;
                scope.loadDataShow = function () {
                    scope.dateShowArray = [
                        {
                            label: "freq",
                            value: 0
                        }, {
                            label: "baidu",
                            value: 0
                        }, {
                            label: "sougou",
                            value: 0
                        }, {
                            label: "haosou",
                            value: 0
                        }, {
                            label: "bing",
                            value: 0
                        }, {
                            label: "other",
                            value: 0
                        }
                    ];
                    var semRequest = $http.get(SEM_API_URL + "elasticsearch/" + $rootScope.defaultType
                    + "/?startOffset=" + scope.ds_start + "&endOffset=" + scope.ds_end);
                    $q.all([semRequest]).then(function (final_result) {
                        var count = 0;
                        angular.forEach(final_result[0].data, function (r) {
                            angular.forEach(scope.dateShowArray, function (q_r) {
                                var temp = q_r.label;
                                var value = r[temp];
                                q_r.value += temp != "freq" ? Number(r[temp].substring(0, r[temp].indexOf("%"))) : Number(r[temp]);
                            });
                            count++;
                        });
                        angular.forEach(scope.dateShowArray, function (r) {
                            if (r.label != "freq") {
                                r.value = (r.value / count).toFixed(2) + "%";
                            }
                        });
                    });
                };
                // 改变时间参数
                scope.setDateShowTimeOption = function (type, cb) {
                    if (type === "today") {
                        scope.ds_start = scope.ds_end = 0;
                    } else if (type === "yesterday") {
                        scope.ds_start = scope.ds_end = -1;
                    } else if (type === "seven") {
                        scope.ds_start = -7;
                        scope.ds_end = -1;
                    } else if (type === "month") {
                        scope.ds_start = -30;
                        scope.ds_end = -1;
                    } else {
                        scope.ds_start = $rootScope.tableTimeStart;
                        scope.ds_end = $rootScope.tableTimeEnd;
                    }
                    if (cb) {
                        scope.loadDataShow();
                    }
                };
                scope.setDateShowTimeOption(attris.type);
                scope.$on("ssh_dateShow_options_time_change", function (e, msg) {
                    scope.setDateShowTimeOption(msg, scope.loadDataShow);
                });
                scope.loadDataShow();
            }
        }
    });

    /**
     * 指标过滤器
     */
    app.filter("quotaFormat", function () {
        var quotaObject = {};
        quotaObject.pv = "浏览量(PV)";
        quotaObject.uv = "访客数(UV)";
        quotaObject.vc = "访问次数";
        quotaObject.outRate = "跳出率";
        quotaObject.ip = "IP数";
        quotaObject.nuv = "新访客数";
        quotaObject.nuvRate = "新访客比率";
        quotaObject.arrivedRate = "抵达率";
        quotaObject.pageConversion = "页面转化";
        quotaObject.eventConversion = "事件转化";
        quotaObject.avgTime = "平均访问时长";
        quotaObject.avgPage = "平均访问页数";
        quotaObject.cost = "消费";
        quotaObject.impression = "展现量";
        quotaObject.click = "点击量";
        quotaObject.ctr = "点击率";
        quotaObject.cpc = "平均点击价格";
        quotaObject.cpm = "千次展现消费";
        quotaObject.conversion = "转化";
        quotaObject.entrance = "入口页次数";
        quotaObject.contribution = "贡献浏览量";
        quotaObject.freq = "总搜索次数";
        quotaObject.baidu = "百度";
        quotaObject.sougou = "搜狗";
        quotaObject.haosou = "好搜";
        quotaObject.bing = "必应";
        quotaObject.other = "其他";
        return function (key) {
            if (quotaObject[key]) {
                return quotaObject[key];
            }
            return "错误的指标KEY";
        };
    });
    /**
     * 指标帮助字符过滤器
     */
    app.filter("quotaHelpFormat", function () {
        var quotaObject = {};
        quotaObject.pv = "即通常说的Page View(PV)，用户每打开一个网站页面就被记录1次。用户多次打开同一页面，浏览量值累计。";
        quotaObject.uv = "一天之内您网站的独立访客数(以Cookie为依据)，一天内同一访客多次访问您网站只计算1个访客。";
        quotaObject.vc = "访客在您网站上的会话(Session)次数，一次会话过程中可能浏览多个页面。如果访客连续30分钟没有新开和刷新页面，或者访客关闭了浏览器，则当访客下次访问您的网站时，访问次数加1。";
        quotaObject.outRate = "只浏览了一个页面便离开了网站的访问次数占总的访问次数的百分比。";
        quotaObject.ip = "一天之内您网站的独立访问ip数。";
        quotaObject.nuv = "一天的独立访客中，历史第一次访问您网站的访客数。";
        quotaObject.nuvRate = "新访客比率=新访客数/访客数。";
        quotaObject.arrivedRate = "抵达率";
        quotaObject.pageConversion = "页面转化";
        quotaObject.eventConversion = "事件转化";
        quotaObject.avgTime = "访客在一次访问中，平均打开网站的时长。即每次访问中，打开第一个页面到关闭最后一个页面的平均值，打开一个页面时计算打开关闭的时间差。";
        quotaObject.avgPage = "平均每次访问浏览的页面数量，平均访问页数=浏览量/访问次数。";
        quotaObject.cost = "消费";
        quotaObject.impression = "展现量";
        quotaObject.click = "点击量";
        quotaObject.ctr = "点击率";
        quotaObject.cpc = "平均点击价格";
        quotaObject.cpm = "千次展现消费";
        quotaObject.conversion = "转化";
        quotaObject.entrance = "作为访问会话的入口页面（也称着陆页面）的次数。";
        quotaObject.contribution = "贡献浏览量";
        quotaObject.freq = "访客点击搜索结果到达您网站的次数。";
        quotaObject.baidu = "来自搜索引擎百度的搜索次数占比";
        quotaObject.sougou = "来自搜索引擎搜狗的搜索次数占比";
        quotaObject.haosou = "来自搜索引擎好搜的搜索次数占比";
        quotaObject.bing = "来自搜索引擎必应的搜索次数占比";
        quotaObject.other = "来自其他搜索引擎的搜索次数占比";
        return function (key) {
            if (quotaObject[key]) {
                return quotaObject[key];
            }
            return "错误的指标KEY";
        };
    });
    /**
     * Create by wms on 2015-05-05.新老访客信息
     */
    app.directive("sshNoVisitor", function ($http, $rootScope) {
        return {
            restrict: 'E',
            templateUrl: '../commons/no_visitor.html',
            scope: true,
            link: function (scope, element, attris, controller) {
                scope._type = attris.myScope;
                scope._ctValue = attris.myScope === "nv" ? "0" : "1";
                scope._ctText = attris.myScope === "nv" ? "新访客" : "老访客";
                scope.defaultObject = {
                    percent: "0.00%",
                    pv: 0,
                    uv: 0,
                    outRate: 0,
                    avgTime: "--",
                    avgPage: 0
                };
                scope._visitor = angular.copy(scope.defaultObject);
                // 读取基础数据
                scope.loadBaseData = function () {
                    scope.sumPv = 0;
                    $http({
                        method: 'GET',
                        url: '/api/indextable/?type=' + $rootScope.ssh_es_type + '&start=' + $rootScope.tableTimeStart + '&end=' + $rootScope.tableTimeEnd + '&indic=pv,uv,outRate,avgTime,avgPage&dimension=ct'
                    }).success(function (data, status) {
                        angular.forEach(data, function (e) {
                            if (e.ct === scope._ctText) {
                                scope._visitor = e;
                            }
                            scope.sumPv += parseInt(e.pv);
                        });
                        if (scope.sumPv == 0) {
                            scope._visitor.percent = "0.00%";
                        } else if (scope._visitor.pv == 0) {
                            scope._visitor.percent = "100%";
                        } else {
                            scope._visitor.percent = (scope._visitor.pv * 100 / scope.sumPv).toFixed(2) + "%";
                        }
                    }).error(function (error) {
                        console.log(error);
                    });
                };
                scope.loadBaseData();
                scope.loadFwlywzData = function () {
                    $http({
                        method: 'GET',
                        url: '/api/fwlywz/?type=' + $rootScope.ssh_es_type + '&start=' + $rootScope.tableTimeStart + '&end=' + $rootScope.tableTimeEnd + '&indic=pv&ct=' + scope._ctValue
                    }).success(function (data, status) {
                        scope.fwlywzTop5 = data;
                    }).error(function (error) {
                        console.log(error);
                    });
                };
                scope.loadFwlywzData();
                // 访问入口页TOP5
                scope.loadFwrkyData = function () {
                    $http({
                        method: 'GET',
                        url: '/api/indextable/?type=' + $rootScope.ssh_es_type + '&start=' + $rootScope.tableTimeStart + '&end=' + $rootScope.tableTimeEnd + '&indic=vc&dimension=loc&filerInfo=[{"ct": ["' + scope._ctValue + '"]}]'
                    }).success(function (data, status) {
                        scope.fwrkyTop5 = data ? ((data.length > 5) ? data.slice(0, 5) : data) : [];
                    }).error(function (error) {
                        console.log(error);
                    });
                };
                scope.loadFwrkyData();
                scope.$on("ssh_refresh_charts", function (e, msg) {
                    scope._visitor = angular.copy(scope.defaultObject);
                    scope.fwlywzTop5 = [];
                    scope.fwrkyTop5 = [];
                    scope.loadBaseData();
                    scope.loadFwlywzData();
                    scope.loadFwrkyData();
                });
            }
        }

    });

    app.directive("sshyDefault", function () {
        return {
            restrict: 'A',
            link: function (scope, element, attris, controller) {
                scope.defaultCheck = function () {
                    scope.checkedArray.forEach(function (item, i) {
                        if (item == attris.defvalue) {
                            scope.classInfo = 'current';
                        }
                    });
                };

                scope.defaultCheck();

                scope.$watch(function () {
                    return scope.checkedArray;
                }, function () {
                    scope.defaultCheck();
                });
            }
        }
    });

    app.directive("searchDefault", function () {
        return {
            restrict: 'A',
            link: function (scope, element, attris, controller) {
                scope.checkedArray.forEach(function (item, i) {
                    if (item == attris.defvalue) {
                        scope.classInfo = 'current';
                    }
                })
            }
        }
    });

    /**
     * 手风琴。
     */
    app.directive('sshAccordion', function () {
        return {
            restrict: 'E',
            template: '<div ng-transclude></div>',
            replace: true,
            transclude: true,
            controller: function () {
                var expanders = [];
                // 收起控件组里面的其余控件
                this.gotOpended = function (selectedExpander) {
                    angular.forEach(expanders, function (e) {
                        if (selectedExpander != e) {
                            e.showText = false;
                        }
                    });
                }
                this.addExpander = function (e) {
                    expanders.push(e);
                }
            }
        }
    });
    /**
     * 手风琴内部组件。
     */
    app.directive('sshExpander', function ($location) {
        return {
            restrict: 'E',
            templateUrl: '../commons/expanderTemp.html',
            replace: true,
            transclude: true,
            require: '^?sshAccordion',
            scope: {
                title: '=etitle',
                icon: '=eicon',
                child: '=echildren',
                sref: '=esref',
                type: '=etype'
            },
            link: function (scope, element, attris, accordionController) {
                // 用于展开和收起导航条
                scope.showText = false;
                // 加入展开项到accordion控件组
                accordionController.addExpander(scope);
                // 展开或收起操作
                scope.toggleText = function () {
                    scope.showText = !scope.showText;
                    accordionController.gotOpended(scope);
                }
                if ($location.path().indexOf(scope.sref) != -1) {
                    scope.showText = true;
                }
                // 路径改变成功，重新获取当前的页面路径
                scope.$on("$locationChangeSuccess", function (e, n, o) {
                    scope.getSshPath();
                });
                // 获取参数path
                scope.getSshPath = function () {
                    var temp_path = $location.path();
                    // 百度推广-搜索推广，URL含有下划线。判断时需要取下划线之前的内容
                    var _index = temp_path.indexOf("/history");
                    if (_index != -1) {
                        temp_path = temp_path.substring(0, _index);
                    }
                    _index = temp_path.indexOf("_");
                    if (_index != -1) {
                        scope.sshPath = "#" + temp_path.substring(1, _index);
                    } else {
                        scope.sshPath = "#" + temp_path.substring(1);
                    }
                };
                scope.getSshPath();
            }
        };

    });

    /**
     * 系统默认指标。
     */
    app.directive('sshDefaultQuota', function ($rootScope, DefaultQuotaService) {
        "use strict";
        return {
            restrict: 'EA',
            link: function (scope, element, attris, controller) {
                var dq = attris.sshDefaultQuota;
                // 点击时。改变指标数组
                element[0].onclick = function () {
                    DefaultQuotaService.changeQuotaByType(dq);
                    scope.$apply(function () {
                    });
                };
            }
        };
    });
});
