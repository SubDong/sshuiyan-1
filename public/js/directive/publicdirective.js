/**
 * Created by weims on 2015/5/15.
 */
define(["../app"], function (app) {
    'use strict';

    app.directive("calendar", function ($rootScope, requestService) {
        var option = {
            restrict: "EA",
            template: "<div  role=\"group\" class=\"btn-group fl\"><button class=\"btn btn-default\" type=\"button\" ng-click=\"today()\" ng-hide=\"visible\" ng-class=\"{'current':todayClass,'disabled':todaySelect}\">今天</button>" +
            "<button class=\"btn btn-default\" type=\"button\" ng-click=\"yesterday()\" ng-class=\"{'current':yesterdayClass}\">昨天</button>" +
            "<button class=\"btn btn-default\" type=\"button\" ng-click=\"sevenDay()\" ng-class=\"{'current':sevenDayClass}\">最近7天</button>" +
            "<button class=\"btn btn-default\" type=\"button\" ng-click=\"month()\" ng-class=\"{'current':monthClass}\">最近30天</button>" +
            "<button id=\"reportrange\"  class=\"btn btn-default pull-right date-picker my_picker\" ng-click=\'timeclick()\' ng-hide=\"datechoice\" ng-class=\"{'current':timeClass}\" max=\"max\" ng-model=\"date\"> " +
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
                    //console.info("info: now user click the " + type + " button");
                    $rootScope.$broadcast("ssh_refresh_charts");
                    $rootScope.$broadcast("ssh_dateShow_options_time_change", type);
                };
                scope.today = function () {
                    scope.isShowCalendar = false;
                    scope.hiddenSeven = false;
                    scope.todayCalendar = GetDateStr(0);
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
                    scope.isShowCalendar = false;
                    scope.hiddenSeven = false;
                    scope.todayCalendar = GetDateStr(-1);
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
                    scope.isShowCalendar = false;
                    scope.hiddenSeven = true;//今日统计和昨日统计中，点击7、30天时隐藏对比
                    scope.todayCalendar = GetDateStr(-6);
                    scope.hourselect = false;
                    scope.dayselect = false;
                    scope.weekselected = true;
                    scope.mothselected = true;
                    scope.reset();
                    scope.sevenDayClass = true;
                    $rootScope.tableTimeStart = -6;
                    $rootScope.tableTimeEnd = 0;
                    $rootScope.start = -6;
                    $rootScope.end = 0;
                    scope.reloadByCalendar("seven");
                    $('#reportrange span').html(GetDateStr(-6) + "至" + GetDateStr(0));
                };
                scope.month = function () {
                    scope.isShowCalendar = false;
                    scope.hiddenSeven = true;
                    scope.hourselect = false;
                    scope.dayselect = false;
                    scope.weekselected = false;
                    scope.mothselected = true;
                    scope.reset();
                    scope.monthClass = true;
                    $rootScope.tableTimeStart = -29;
                    $rootScope.tableTimeEnd = 0;
                    $rootScope.start = -29;
                    $rootScope.end = 0;
                    scope.reloadByCalendar("month");
                    $('#reportrange span').html(GetDateStr(-29) + "至" + GetDateStr(0));
                };
                scope.timeclick = function () {
                    scope.isShowCalendar = false;
                    scope.hiddenSeven = true;
                    scope.reset();
                    scope.timeClass = true;
                    $('#reportrange span').html(GetDateStr(0))
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
                    $rootScope.startString = (start.format('YYYY-MM-DD') + ' 至 ' + end.format('YYYY-MM-DD'))
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
                    $rootScope.datePickerCompare(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'), label);
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
    app.directive("refresh", function ($rootScope, requestService, $location) {
        var option = {
            restrict: "EA",
            template: "<div class=\"right_refresh fr\"><button class=\"btn btn-default btn-Refresh fl\" ng-click=\"page_refresh()\"  type=\"button\"><span aria-hidden=\"true\" class=\"glyphicon glyphicon-refresh\"></span></button><ui-select ng-model=\"export.selected\"   ng-change='fileSave(export.selected)' theme=\"select2\" ng-hide=\"menu_select\" reset-search-input=\"false\" class=\"fl\"style=\"min-width: 90px;background-color: #fff;\"> <ui-select-match placeholder=\"保存\">{{$select.selected.name}} </ui-select-match> <ui-select-choices repeat=\"export in exportsaa\"> <span ng-bind-html=\"export.name\"></span></ui-select-choices></ui-select></div>",
            transclude: true,
            replace: true,
            link: function (scope) {
                $rootScope.export = {name: '导出CSV', value: 'csv'};
                $rootScope.exportsaa = [
                    {name: 'CSV', value: 'csv'},
                    {name: 'PDF（含图） ', value: 'pdf'}
                ];
                scope.flag = $location.path() != "/index"
                //导出功能
                scope.fileSave = function (obj) {
                    if (obj.value == "csv") {
                        if (scope.flag) {
                            $rootScope.gridApi2.exporter.csvExport("all", "visible", angular.element())
                        } else {
                            $rootScope.gridApi.exporter.csvExport("all", "visible", angular.element());
                        }
                    }
                    else {
                        if (scope.flag) {
                            $rootScope.gridApi2.exporter.pdfExport("all", "visible", angular.element());
                        } else {
                            $rootScope.gridApi.exporter.pdfExport("all", "visible", angular.element());
                        }

                    }
                }
            }
        }
        return option;
    });
    app.directive("compare", function () {
        return {
            restrict: "EA",
            template: "<div ng-hide='hiddenSeven'>" +
            "<label>对比：</label><label><span class='checkbox specialCheckbox'></span><input class=\"select2-search\" type=\"radio\" ng-click=\"compareLastDay()\"><span>前一日</span></label>&nbsp;&nbsp;&nbsp;&nbsp;" +
            "<label><span class='checkbox specialCheckbox'></span><input class=\"select2-search\" type=\"radio\" ng-click=\"compareLastWeek()\"><span>上周同期</span></label>" +
//            "<input class=\"styled\" type=\"checkbox\" ng-click=\"restCompare()\">取消对比" +
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
                //scope.dateShowArray_base = [];
                scope.ssh_seo_type = attris.semType;
                //scope.ds_start = scope.ds_end = 0;
                scope.ds_defaultQuotasOption = ["pv", "uv", "ip", "nuv", "outRate", "avgTime"];
                scope.ds_keyData = [];
                scope.ds_dateShowQuotasOption = scope.checkedArray ? scope.checkedArray : scope.ds_defaultQuotasOption;
                scope.setDefaultShowArray = function () {
                    var tempArray = [];
                    angular.forEach(scope.ds_dateShowQuotasOption, function (q_r) {
                        tempArray.push({"label": q_r, "value": "", "cValue": ""});
                    });
                    scope.dateShowArray = angular.copy(tempArray);
                };
                // 数组方法
                scope.inArray = function (array, e) {
                    var flag = false;
                    array.forEach(function (a_r) {
                        if (a_r == e || scope.ds_dimension == "period") {
                            flag = true;
                        }
                    });
                    return flag;
                };
                // 获取数据
                scope.loadDataShow = function () {
                    scope.setDefaultShowArray();
                    //scope.dateShowArray = scope.dateShowArray_base = [];
                    var esRequest = $http.get("/api/summary?type=" + $rootScope.userType + "&dimension=" + scope.ds_dimension + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&quotas=" + scope.ds_dateShowQuotasOption + "&start=" + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd);
                    var seoQuotas = scope.getSEOQuotas();
                    if (seoQuotas.length > 0) {
                        var stringQuotas = seoQuotas.toString().replace(/,/g, "-") + "-";
                        var seoRequest = $http.get(SEM_API_URL + $rootScope.user + "/" + $rootScope.baiduAccount + "/" + scope.ssh_seo_type + "/" + stringQuotas + "?startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd);
                    }
                    $q.all([esRequest, seoRequest]).then(function (final_result) {
                        scope.pushESData(final_result[0].data);
                        if (final_result[1] != undefined) {
                            scope.pushSEOData(final_result[1].data);
                        }
                    });
                };
                scope.loadCompareDataShow = function (startTime, endTime) {
                    var esRequest = $http.get("/api/summary?type=" + $rootScope.userType + "&dimension=" + scope.ds_dimension + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&quotas=" + scope.ds_dateShowQuotasOption + "&start=" + startTime + "&end=" + endTime);
                    var seoQuotas = scope.getSEOQuotas();
                    if (seoQuotas.length > 0) {
                        var stringQuotas = seoQuotas.toString().replace(/,/g, "-") + "-";
                        var seoRequest = $http.get(SEM_API_URL + $rootScope.user + "/" + $rootScope.baiduAccount + "/" + scope.ssh_seo_type + "/" + stringQuotas + "?startOffset=" + startTime + "&endOffset=" + endTime);
                    }
                    $q.all([esRequest, seoRequest]).then(function (final_result) {
                        // 初始化对比数据
                        scope.pushESData(final_result[0].data, true);
                        if (final_result[1] != undefined) {
                            scope.pushSEOData(final_result[1].data, true);
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
                scope.pushESData = function (result, flag) {
                    var obj = JSON.parse(eval('(' + result + ')').toString()); //由JSON字符串转换为JSON对象
                    if (!obj && !flag) {
                        scope.ds_keyData = angular.copy(obj[0]["key"]);
                    }
                    angular.forEach(obj, function (r) {
                        var dateShowObject = {};
                        dateShowObject.label = r.label;
                        var temp = 0;
                        var count = 0;
                        angular.forEach(r.quota, function (qo, _i) {
                            var infoKey = r.key[_i];
                            if (infoKey != undefined && (infoKey == "-" || infoKey == "" || infoKey == "www" || infoKey == "null" || infoKey == "国外" || infoKey.length >= 30)) {
                                return false;
                            }
                            if (flag) {
                                if (scope.inArray(scope.ds_keyData, infoKey)) {// 对比的时候处理原始数据中不存在的对比数据参数
                                    temp += Number(qo);
                                    count++;
                                }
                            } else {
                                temp += Number(qo);
                                count++;
                            }
                        });
                        dateShowObject.value = temp;
                        dateShowObject.count = count;
                        if (flag) {
                            scope.pushCompareArray(dateShowObject);
                        } else {
                            scope.correctAndPushArray(dateShowObject);
                        }
                    });
                };
                scope.pushSEOData = function (result, flag) {
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

                    function calculateValue(obj, type, count) {
                        if (!obj) {
                            return;
                        }
                        obj.count = count;
                        if (flag) {
                            scope.pushCompareArray(obj);
                        } else {
                            scope.correctAndPushArray(obj);
                        }
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
                    calculateValue(costObj, "2", count);
                    calculateValue(impressionObj, "2", count);
                    calculateValue(clickObj, "1", count);
                    calculateValue(ctrObj, "2", count);
                    calculateValue(cpcObj, "3", count);
                    calculateValue(cpmObj, "2", count);
                    calculateValue(conversionObj, "2", count);
                };
                // 特殊处理，保证指标显示顺序
                scope.correctAndPushArray = function (obj) {
                    var index = 0;
                    angular.forEach(scope.ds_dateShowQuotasOption, function (ds_r) {
                        if (ds_r == obj.label) {
                            scope.dateShowArray[index] = obj;
                            //scope.dateShowArray_base[index] = obj;
                        }
                        index++;
                    });
                };
                // 添加比较值
                scope.pushCompareArray = function (obj) {
                    angular.forEach(scope.dateShowArray, function (ds_r) {
                        if (ds_r.label == obj.label) {
                            ds_r.cValue = obj.value;
                        }
                    });
                    //angular.forEach(scope.dateShowArray_base, function (dsb_r) {
                    //    if (dsb_r.label == obj.label) {
                    //        dsb_r.cValue = obj.value;
                    //    }
                    //});
                };
                // 改变时间参数
                scope.setDateShowTimeOption = function (type, cb) {
                    scope.isCompared = false;
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
                    scope.isCompared = false;
                    //scope.dateShowArray = scope.dateShowArray_base = [];
                    scope.loadDataShow();
                });
                scope.loadDataShow();
                //// 用于动态效果
                //scope.$on("ssh_reload_datashow", function () {
                //    var tempArray = [];
                //    angular.forEach(scope.checkedArray, function (ca_r) {
                //        tempArray.push({"label": ca_r, "value": "", "cValue": ""});
                //    });
                //
                //    angular.forEach(tempArray, function (ta_r) {
                //        angular.forEach(scope.dateShowArray_base, function (ab_r) {
                //            if (ta_r.label == ab_r.label) {
                //                ta_r.value = ab_r.value;
                //                ta_r.cValue = ab_r.cValue;
                //            }
                //        });
                //    });
                //
                //    scope.dateShowArray = angular.copy(tempArray);
                //});
                // 对比
                scope.$on("ssh_load_compare_datashow", function (e, startTime, endTime) {
                    scope.isCompared = true;
                    scope.loadCompareDataShow(startTime, endTime);
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
                scope.isCompared = false;
                scope.dateShowArray = [];
                scope.defaultDataShowArray = [{
                    label: "freq",
                    value: 0,
                    count: 0
                }, {
                    label: "baidu",
                    value: 0,
                    count: 0
                }, {
                    label: "sougou",
                    value: 0,
                    count: 0
                }, {
                    label: "haosou",
                    value: 0,
                    count: 0
                }, {
                    label: "bing",
                    value: 0,
                    count: 0
                }, {
                    label: "other",
                    value: 0,
                    count: 0
                }];
                scope.loadDataShow = function () {
                    scope.dateShowArray = angular.copy(scope.defaultDataShowArray);
                    var semRequest = $http.get(SEM_API_URL + "elasticsearch/" + $rootScope.userType
                    + "/?startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd);
                    $q.all([semRequest]).then(function (final_result) {
                        angular.forEach(final_result[0].data, function (r) {
                            angular.forEach(scope.dateShowArray, function (q_r) {
                                var temp = q_r.label;
                                var value = r[temp];
                                q_r.value += temp != "freq" ? Number(r[temp].substring(0, r[temp].indexOf("%"))) : Number(r[temp]);
                                q_r.count = final_result[0].data.length;
                            });
                        });
                    });
                };
                scope.loadCompareDataShow = function (startTime, endTime) {
                    var semRequest = $http.get(SEM_API_URL + "elasticsearch/" + $rootScope.userType
                    + "/?startOffset=" + startTime + "&endOffset=" + endTime);
                    $q.all([semRequest]).then(function (final_result) {
                        // 初始化对比数据
                        angular.forEach(scope.dateShowArray, function (q_r) {
                            q_r.cValue = 0;
                        });
                        angular.forEach(final_result[0].data, function (r) {
                            angular.forEach(scope.dateShowArray, function (q_r) {
                                var temp = q_r.label;
                                var value = r[temp];
                                q_r.cValue += temp != "freq" ? Number(r[temp].substring(0, r[temp].indexOf("%"))) : Number(r[temp]);
                                q_r.count = final_result[0].data.length;
                            });
                        });
                    });
                };
                // 改变时间参数
                scope.setDateShowTimeOption = function (type, cb) {
                    scope.isCompared = false;
                    if (cb) {
                        cb();
                    }
                };
                scope.setDateShowTimeOption(attris.type);
                scope.$on("ssh_dateShow_options_time_change", function (e, msg) {
                    scope.setDateShowTimeOption(msg, scope.loadDataShow);
                });
                scope.loadDataShow();

                // 对比
                scope.$on("ssh_load_compare_datashow", function (e, startTime, endTime) {
                    scope.isCompared = true;
                    scope.loadCompareDataShow(startTime, endTime);
                });
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
            return quotaObject[key] || "未定义的指标KEY";
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
            return quotaObject[key] || "未定义的指标KEY";
        };
    });

    /**
     * 指标显示数据计算器
     */
    app.filter("quotaDataFormat", function () {
        return function (value, label, count) {
            switch (label) {
                case "outRate":
                case "nuvRate":
                case "arrivedRate":
                case "baidu":
                case "sougou":
                case "haosou":
                case "bing":
                case "other":
                {
                    return count ? (value / count).toFixed(2) + "%" : "--";
                }
                case "avgTime":
                {
                    return MillisecondToDate(value / count);
                }
                case "freq":
                {
                    return count ? value : "0";
                }
                case "cost":
                case "impression":
                case "ctr":
                case "cpm":
                case "conversion":
                {
                    return count ? value.toFixed(2) : "0";
                }
                case "avgPage":
                case "cpc":
                {
                    return count ? (value / count).toFixed(2) : "0.00";
                }
                default :
                {
                    return value ? value + "" : "0";
                }
            }
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
                        if (!scope._visitor.ct) {
                            scope._visitor = angular.copy(scope.defaultObject);
                            return;
                        }
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
