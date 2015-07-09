/**
 * Created by weims on 2015/5/15.
 */

define(["../app", "../ZeroClipboard/ZeroClipboard-AMD"], function (app, ZeroClipboard) {
    'use strict';

    app.directive("calendar", function ($rootScope, requestService, $location) {
        var option = {
            restrict: "EA",
            template: "<div  role=\"group\" class=\"btn-group fl\"><button class=\"btn btn-default\" type=\"button\" ng-click=\"today()\" ng-hide=\"visible\" ng-class=\"{'current':todayClass,'disabled':todaySelect}\">今天</button>" +
            "<button class=\"btn btn-default\" type=\"button\" ng-click=\"yesterday()\" ng-class=\"{'current':yesterdayClass}\">昨天</button>" +
            "<button class=\"btn btn-default\" type=\"button\" ng-click=\"sevenDay()\" ng-hide=\"lastWeek\" ng-class=\"{'current':sevenDayClass}\">最近7天</button>" +
            "<button class=\"btn btn-default\" type=\"button\" ng-click=\"month()\" ng-hide=\"lastMonth\" ng-class=\"{'current':monthClass}\">最近30天</button>" +
            "<button id=\"reportrange\"  class=\"btn btn-default pull-right date-picker my_picker\" ng-click=\'timeclick()\' ng-hide=\"datechoice\" ng-class=\"{'current':timeClass}\" max=\"max\" ng-model=\"date\"> " +
            "<i class=\"glyphicon glyphicon-calendar fa fa-calendar\"></i><span></span></button>" +
            "</div>",
            replace: true,
            transclude: true,
            link: function (scope, element, attris, controller) {
                Custom.initCheckInfo();
                scope.$watch("opened", function () {
                    if (scope.todayClass) {
                        scope.today();
                    }else if (scope.sevenDayClass) {
                        scope.sevenDay();
                    }else if (scope.yesterdayClass) {
                        scope.yesterday();
                    }else if (scope.monthClass) {
                        scope.month();
                    }else if($location.url().split("?").length>1){
                        var param = $location.url().split("?")[1];
                        var isChart = $location.url().split("?")[0];
                        if(param != 1 && param != 2 && param != 3 && param != 4){
                            scope.timeClass = true;
                            var StartTimes = param.split("#")[0];
                            var EndTimes = param.split("#")[1];
                            var newParam = param.replace("#", "至");
                            var time = chartUtils.getTimeOffset(StartTimes, EndTimes);
                            $rootScope.start =time[0];
                            $rootScope.end = time[1];
                            $rootScope.tableTimeStart = time[0];
                            $rootScope.tableTimeEnd =time[1];
                            $('#reportrange span').html(newParam);
                            $('#reportrange').data('daterangepicker').setStartDate(StartTimes);
                            $('#reportrange').data('daterangepicker').setEndDate(EndTimes);
                            $rootScope.targetSearch();
                            scope.$broadcast("ssh_dateShow_options_time_change");
                            if(isChart == "/visitor/equipment"){
                                scope.charts.forEach(function (e) {
                                    var chart = echarts.init(document.getElementById(e.config.id));
                                    e.config.instance = chart;
                                });
                                //图表
                                requestService.refresh(scope.charts);
                            }
                            if(isChart == "/visitor/provincemap"){
                                scope.doSearch(time[0], time[1], $rootScope.userType);
                                scope.doSearchAreas(time[0], time[1], $rootScope.userType, scope.mapOrPieConfig);
                            }
                        }
                    }
                });
                scope.weekselected = true;
                scope.mothselected = true;
                scope.maxDate = new Date();
                var dateID=document.getElementById("choicetrange");
                if (scope.todayClass === true) {
                    dataPicker.picker("choicetrange", 0);
                }
                if (scope.yesterdayClass === true) {
                    dataPicker.picker("choicetrange", 0);
                }

                if (scope.sevenDayClass === true) {
                    dataPicker.picker("choicetrange", 6);
                }
                if (scope.monthClass === true) {
                    dataPicker.picker("choicetrange", 29);
                }
                scope.reset = function () {
                    scope.todayClass = false;
                    scope.yesterdayClass = false;
                    scope.sevenDayClass = false;
                    scope.monthClass = false;
                    scope.definClass = false;
                    scope.btnchecked = true;
                    scope.weekcheckClass = false;
                    scope.mothcheckClass = false;
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
                    scope.choiceClass = false;
                    scope.reset();
                    scope.lastDaySelect = true;
                    scope.lastWeekSelect = true;
                    scope.clearCompareSelect = true;
                    scope.todayClass = true;
                    scope.timeClass = false;
                    // table 参数配置
                    $rootScope.tableTimeStart = 0;
                    $rootScope.tableTimeEnd = 0;
                    $rootScope.keyFormat = "hour";
                    $rootScope.start = 0;
                    $rootScope.end = 0;
                    scope.reloadByCalendar("today");
                    $('#reportrange span').html(GetDateStr(0));
                    $('#reportrange').data('daterangepicker').setStartDate(GetDateStr(0));
                    $('#reportrange').data('daterangepicker').setEndDate(GetDateStr(0));
                    if(dateID){
                        $('#choicetrange span').html("与其他时间段对比");
                        $('#choicetrange').data('daterangepicker').setStartDate(GetDateStr(0));
                        $('#choicetrange').data('daterangepicker').setEndDate(GetDateStr(0));
                        if (scope.todayClass === true) {
                            dataPicker.picker("choicetrange", 0);
                        }
                    }
                };
                scope.yesterday = function () {
                    scope.isShowCalendar = false;
                    scope.hiddenSeven = false;
                    scope.todayCalendar = GetDateStr(-1);
                    scope.hourselect = false;
                    scope.dayselect = false;
                    scope.weekselected = true;
                    scope.mothselected = true;
                    scope.timeClass = false;
                    scope.choiceClass = false;
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
                    $('#reportrange').data('daterangepicker').setStartDate(GetDateStr(-1));
                    $('#reportrange').data('daterangepicker').setEndDate(GetDateStr(-1));
                    if(dateID){
                        $('#choicetrange span').html("与其他时间段对比");
                        $('#choicetrange').data('daterangepicker').setStartDate(GetDateStr(-1));
                        $('#choicetrange').data('daterangepicker').setEndDate(GetDateStr(-1));
                        if (scope.yesterdayClass === true) {
                            dataPicker.picker("choicetrange", 0);
                        }
                    }
                };
                scope.sevenDay = function () {
                    scope.isShowCalendar = false;
                    scope.hiddenSeven = true;//今日统计和昨日统计中，点击7、30天时隐藏对比
                    scope.todayCalendar = GetDateStr(-6);
                    scope.hourselect = false;
                    scope.dayselect = false;
                    scope.weekselected = true;
                    scope.mothselected = true;
                    scope.choiceClass = false;
                    scope.reset();
                    scope.sevenDayClass = true;
                    scope.timeClass = false;
                    $rootScope.tableTimeStart = -6;
                    $rootScope.tableTimeEnd = 0;
                    $rootScope.start = -6;
                    $rootScope.end = 0;
                    scope.reloadByCalendar("seven");
                    $('#reportrange span').html(GetDateStr(-6) + "至" + GetDateStr(0));
                    $('#reportrange').data('daterangepicker').setStartDate(GetDateStr(-6));
                    $('#reportrange').data('daterangepicker').setEndDate(GetDateStr(0));
                    if(dateID){
                        $('#choicetrange span').html("与其他时间段对比");
                        $('#choicetrange').data('daterangepicker').setStartDate(GetDateStr(-6));
                        $('#choicetrange').data('daterangepicker').setEndDate(GetDateStr(0));
                        if (scope.sevenDayClass === true) {
                            dataPicker.picker("choicetrange", 6);
                        }
                    }
                };
                scope.month = function () {
                    scope.isShowCalendar = false;
                    scope.hiddenSeven = true;
                    scope.hourselect = false;
                    scope.dayselect = false;
                    scope.weekselected = false;
                    scope.mothselected = true;
                    scope.choiceClass = false;
                    scope.reset();
                    scope.monthClass = true;
                    scope.timeClass = false;
                    $rootScope.tableTimeStart = -29;
                    $rootScope.tableTimeEnd = 0;
                    $rootScope.start = -29;
                    $rootScope.end = 0;
                    scope.reloadByCalendar("month");
                    $('#reportrange span').html(GetDateStr(-29) + "至" + GetDateStr(0));
                    $('#reportrange').data('daterangepicker').setStartDate(GetDateStr(-29));
                    $('#reportrange').data('daterangepicker').setEndDate(GetDateStr(0));
                    if(dateID){
                        $('#choicetrange span').html("与其他时间段对比");
                        $('#choicetrange').data('daterangepicker').setStartDate(GetDateStr(-29));
                        $('#choicetrange').data('daterangepicker').setEndDate(GetDateStr(0));
                        if (scope.monthClass === true) {
                            dataPicker.picker("choicetrange", 29);
                        }
                    }

                };
                scope.timeclick = function (ev, picker) {
                    var pickerTiemOne = 0;
                    scope.reset();
                    scope.isShowCalendar = false;
                    scope.hiddenSeven = true;
                    scope.timeClass = true;
                    if(dateID){
                        $('#choicetrange span').html("与其他时间段对比");
                        $('#choicetrange').data('daterangepicker').setStartDate(GetDateStr(0));
                        $('#choicetrange').data('daterangepicker').setEndDate(GetDateStr(0));
                        if (scope.timeClass === true) {
                            $('#reportrange').on('apply.daterangepicker', function (ev, picker) {
                                pickerTiemOne = chartUtils.getTimeOffset(picker.startDate.format('YYYY-MM-DD'), picker.endDate.format('YYYY-MM-DD'));
                            });
//                            $('#choicetrange').on('apply.daterangepicker', function (ev, picker) {
//                                var pickerTiemTow = chartUtils.getTimeOffset(picker.startDate.format('YYYY-MM-DD'), picker.endDate.format('YYYY-MM-DD'));
//                                var startTime = pickerTiemTow[0];
//                                var endTime = pickerTiemTow[0] + Math.abs(pickerTiemOne[1] - pickerTiemOne[0]);
//                                var dateTime = chartUtils.getSetOffTime(startTime, endTime);
//                                if(pickerTiemOne == 0){
//                                    $('#choicetrange span').html(dateTime[0]);
//                                }else{
//                                    $('#choicetrange span').html(dateTime[0] + "至" + dateTime[1]);
//                                }
//                                $('#choicetrange').data('daterangepicker').setStartDate(dateTime[0]);
//                                $('#choicetrange').data('daterangepicker').setEndDate(dateTime[1]);
//                            });
                        }
                    }
                }
                scope.compareReset = function () {
                    scope.choiceClass = false;
                }
                $rootScope.datePickerCompare = function (start, end, label) {
                    scope.choiceClass = true;
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
                    minDate: GetDateStr(-43),
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
                    $rootScope.startString = (start.format('YYYY-MM-DD') + ' 至 ' + end.format('YYYY-MM-DD'));
                    if (start.format('YYYY-MM-DD') == end.format('YYYY-MM-DD')) {
                        $('#reportrange span').html(start.format('YYYY-MM-DD'));
                        $rootScope.startString = (start.format('YYYY-MM-DD'));
                    }
                    else {
                        $('#reportrange span').html(start.format('YYYY-MM-DD') + '至' + end.format('YYYY-MM-DD'));
                    }
                    //$('#reportrange span').html(start.format('YYYY-MM-DD') + '至' + end.format('YYYY-MM-DD'));
                });

            }
        };
        return option;
    });
    app.directive("dateother", function ($rootScope) {
        var option = {
            restrict: "EA",
            template: "<div role=\"group\" class=\"btn-group fl\">" +
            "<button class=\"btn btn-default\" type=\"button\" ng-class=\"{'current':lastDayClass}\"  ng-show=\"dateshows\" >前一日</button>" +
            " <button class=\"btn btn-default\" type=\"button\" ng-class=\"{'current':lastWeekClass}\"   ng-show=\"dateshows\" >上周同期</button>" +
            "<button id=\"choicetrange\"  class=\"btn btn-default pull-right date-picker my_picker fl\" ng-click=\'choicedate()\' ng-class=\"{'current':choiceClass}\"  max=\"max\" ng-model=\"date\">" +
            "<i class=\"glyphicon glyphicon-calendar fa fa-calendar\"></i><span></span></button>" +
            "</div>",
            replace: true,
            //transclude: true,
            link: function (scope, element, attris, controller) {
                function GetDateStr(AddDayCount) {
                    var dd = new Date();
                    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
                    var y = dd.getFullYear();
                    var m = dd.getMonth() + 1;//获取当前月份的日期
                    var d = dd.getDate();
                    return y + "-" + m + "-" + d;
                }
                scope.choicedate = function(ev, picker) {
                    var pickerTiemOne = 0;
                    var startDate = $('#reportrange span').html().split("至")[0];
                    var endDate = $('#reportrange span').html().split("至")[1] == undefined ? startDate : $('#reportrange span').html().split("至")[1];
                    pickerTiemOne = startDate == endDate ? 0 : chartUtils.getTimeOffset(startDate, endDate);
                    $('#choicetrange').on('apply.daterangepicker', function (ev, picker) {
                        var pickerTiemTow = chartUtils.getTimeOffset(picker.startDate.format('YYYY-MM-DD'), picker.endDate.format('YYYY-MM-DD'));
                        var startTime = pickerTiemTow[0];
                        var endTime = pickerTiemTow[0] + Math.abs(pickerTiemOne[1] - pickerTiemOne[0]);
                        var dateTime = chartUtils.getSetOffTime(startTime, endTime);
                        if(pickerTiemOne == 0){
                            $('#choicetrange span').html(dateTime[0]);
                            $('#choicetrange').data('daterangepicker').setStartDate(dateTime[0]);
                            $('#choicetrange').data('daterangepicker').setEndDate(dateTime[0]);
                        }else{
                            $('#choicetrange span').html(dateTime[0] + "至" + dateTime[1]);
                            $('#choicetrange').data('daterangepicker').setStartDate(dateTime[0]);
                            $('#choicetrange').data('daterangepicker').setEndDate(dateTime[1]);
                        }
                    });
                };
                $('#choicetrange span').html("与其他时间段对比");
                $('#choicetrange').daterangepicker({
                        format: 'YYYY-MM-DD',
                        maxDate: GetDateStr(0),
                        minDate: GetDateStr(-43),
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
                    },
                    function (start, end, label) {
                        //if(){
                        $rootScope.datepickerClickTow(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'), label);
                        if (!$rootScope.datePickerCompare) {
                            $rootScope.datePickerCompare = function (a, b, c) {
                            }
                        } else {
                            $rootScope.datePickerCompare(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'), label);
                        }
                        /*if (start.format('YYYY-MM-DD') == end.format('YYYY-MM-DD')) {
                            $('#choicetrange span').html(start.format('YYYY-MM-DD'));
                        }else {
                            $('#choicetrange span').html(start.format('YYYY-MM-DD') + '至' + end.format('YYYY-MM-DD'));
                        }*/
                    });
            }
            //,
            //controller: function($scope, $element) {
            //    $scope.ctrl = !!$element.controller('ngModel');
            //}

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
    app.directive("refresh", function ($rootScope,$http, $location) {
        var option = {
            restrict: "EA",
            template: "<div class=\"right_refresh fr\"><button class=\"btn btn-default btn-Refresh fl\" ng-click=\"page_refresh()\"  type=\"button\"><span aria-hidden=\"true\" class=\"glyphicon glyphicon-refresh\"></span></button><button class=\"btn btn-default btn-Refresh fl\" type=\"button\" ng-show=\"send\" >发送</button><ui-select ng-model=\"export.selected\" ng-change='fileSave(export.selected)' theme=\"select2\" ng-hide=\"menu_select\" reset-search-input=\"false\" class=\"fl\"style=\"min-width: 90px;background-color: #fff;\"> <ui-select-match placeholder=\"下载\">{{$select.selected.name}} </ui-select-match> <ui-select-choices repeat=\"export in exportsaa\"> <span ng-bind-html=\"export.name\"></span></ui-select-choices></ui-select></div>",
            transclude: true,
            replace: true,
            link: function (scope) {
                $rootScope.export = {name: '导出CSV', value: 'csv'};
                $rootScope.exportsaa = [
                    {name: 'CSV', value: 'csv'},
                    {name: 'PDF（含图） ', value: 'pdf'}
                ];
                scope.flag = $location.path() != "/index";
                //导出功能
                scope.fileSave = function (obj) {
                    if (obj.value == "csv") {
                        var dataInfo = angular.copy($rootScope.gridApi2.grid.options.data);
                        var dataHeadInfo = angular.copy($rootScope.gridApi2.grid.options.columnDefs);
                        dataHeadInfo.forEach(function (item, i) {
                            if (item.field != undefined) {
                                dataInfo.forEach(function (dataItem, x) {
                                    dataInfo[x] = JSON.parse(JSON.stringify(dataItem).replace(item.field, item.displayName));
                                })
                            }
                        });
                        var repData = JSON.stringify(dataInfo).replace(/\%/g, "*");
                        $http({
                            method: 'GET',
                            url: '/api/downCSV/?dataInfo=' + repData,
                            headers: {
                                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                                'Content-type': 'text/csv; charset=utf-8'

                            }
                        }).success(function (data, status, headers, config) {
                            var hiddenElement = document.createElement('a');
                            var dateTime = new Date();
                            var dateString = dateTime.Format("yyyyMdhmsS");
                            hiddenElement.href = 'data:attachment/csv;charset=utf-8,' + encodeURI(data);
                            hiddenElement.target = '_blank';
                            hiddenElement.download = "down-" + dateString + ".csv";
                            hiddenElement.click();
                        })

                        /*if (scope.flag) {
                         $rootScope.gridApi2.exporter.csvExport("all", "visible", angular.element())
                         } else {
                         $rootScope.gridApi.exporter.csvExport("all", "visible", angular.element());
                         }*/
                    }
                    else {
                        if (scope.flag) {
                            $rootScope.gridApi2.exporter.pdfExport("all", "visible", angular.element());
                        } else {
                            $rootScope.gridApi2.exporter.pdfExport("all", "visible", angular.element());
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
            "<label>对比：</label>" +
            "<label><span class='checkbox specialCheckbox'></span><input class=\"select2-search\" name=\"compareRadio\" type=\"checkBox\" ng-click=\"compareLastDay()\"><span>前一日</span></label>&nbsp;&nbsp;&nbsp;&nbsp;" +
            "<label><span class='checkbox specialCheckbox'></span><input class=\"select2-search\" name=\"compareRadio\" type=\"checkBox\" ng-click=\"compareLastWeek()\"><span>上周同期</span></label>" +
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
    app.directive("gridpage", function ($rootScope) {
        var option = {
            restrict: "EA",
            template: "<div class=\"page\"><a ng-click=\"gridApi2.pagination.previousPage()\" ng-hide=\"gridApi2.pagination.getTotalPages()<=1\">上一页</a> <button type=\"button\" class=\"btn\"> {{ gridApi2.pagination.getPage() }}</button><a ng-click=\"gridApi2.pagination.nextPage()\" ng-hide=\"gridApi2.pagination.getTotalPages()<=1\">下一页 </a> <input type=\"text\" ng-model=\"page\" value=\"\"><span> /{{ gridApi2.pagination.getTotalPages() }}</span> <button type=\"button\" class=\"btn\" ng-click=\"pagego(gridApi2)\">跳转</button><span class='pageshow'>每页显示：</span> </div>",
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
                scope.ssh_seo_type = attris.semType;
                scope.filter = attris.filter;
                scope.ds_defaultQuotasOption = ["pv", "uv", "ip", "nuv", "outRate", "avgTime"];
                scope.ds_keyData = [];
                scope.ds_dateShowQuotasOption = scope.checkedArray ? scope.checkedArray : scope.ds_defaultQuotasOption;
                scope.setDefaultShowArray = function () {
                    var tempArray = [];
                    angular.forEach(scope.ds_dateShowQuotasOption, function (q_r) {
                        tempArray.push({"label": q_r, "value": 0, "cValue": 0, "count": 0, "cCount": 0});
                    });
                    scope.ds_keyData = [];
                    scope.dateShowArray = $rootScope.copy(tempArray);
                };
                // 刷新加载时设置默认指标
                scope.setDefaultShowArray();

                // 获取数据
                scope.loadDataShow = function () {
                    scope.setDefaultShowArray();
                    var esRequest = $http.get('/api/indextable/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field) + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&promotion=" + $rootScope.tableSwitch.promotionSearch + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType);
                    var seoQuotas = scope.getSEOQuotas();
                    if (seoQuotas.length > 0) {
                        var seoRequest = $http.get(SEM_API_URL + $rootScope.user + "/" + $rootScope.baiduAccount + "/" + scope.ssh_seo_type + "?startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd);
                    }
                    $q.all([esRequest, seoRequest]).then(function (final_result) {
                        scope.pushESData(final_result[0].data);
                        if (final_result[1] != undefined) {
                            scope.pushSEOData(final_result[1].data);
                        }
                    });
                };
                scope.loadCompareDataShow = function (startTime, endTime) {
                    var esRequest = $http.get('/api/indextable/?start=' + startTime + "&end=" + endTime + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field) + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&promotion=" + $rootScope.tableSwitch.promotionSearch + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType);
                    var seoQuotas = scope.getSEOQuotas();
                    if (seoQuotas.length > 0) {
                        var seoRequest = $http.get(SEM_API_URL + $rootScope.user + "/" + $rootScope.baiduAccount + "/" + scope.ssh_seo_type + "?startOffset=" + startTime + "&endOffset=" + endTime);
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
                    var _array = $rootScope.copy(scope.dateShowArray);
                    var _count = 0;
                    angular.forEach(result, function (r) {
                        var infoKey = r[$rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field];
                        if (scope.filter) {
                            if (infoKey != undefined && (infoKey == "-" || infoKey == "" || infoKey == "www" || infoKey == "null")) {
                                return false;
                            }
                        }
                        if (!flag) {
                            scope.ds_keyData.push(infoKey);
                        }
                        if (flag && scope.ds_keyData.targetIndexOf(infoKey) == -1) {
                            return false;
                        }
                        _count++;
                        angular.forEach(_array, function (obj) {
                            var temp = obj.label;
                            if (r[temp] == undefined) {
                                return false;
                            }
                            if (flag) {
                                if (obj.label == "avgTime") {
                                    var hour = Number(r[temp].split(":")[0]);
                                    var min = Number(r[temp].split(":")[1]);
                                    var sec = Number(r[temp].split(":")[2]);
                                    var count = (((hour * 60) * 60) + (min * 60) + sec);
                                    obj.cValue += count;
                                } else {
                                    obj.cValue += (r[temp].indexOf("%") != -1) ? Number(r[temp].substring(0, r[temp].indexOf("%"))) : Number(r[temp]);
                                }
                            } else {
                                if (obj.label == "avgTime") {
                                    var hour = Number(r[temp].split(":")[0]);
                                    var min = Number(r[temp].split(":")[1]);
                                    var sec = Number(r[temp].split(":")[2]);
                                    var count = (((hour * 60) * 60) + (min * 60) + sec);
                                    obj.value += count;
                                } else {
                                    obj.value += (r[temp].indexOf("%") != -1) ? Number(r[temp].substring(0, r[temp].indexOf("%"))) : Number(r[temp]);
                                }
                            }
                        });
                    });
                    // 设置_count
                    angular.forEach(_array, function (obj) {
                        if (flag) {
                            obj.cCount = _count;
                        } else {
                            obj.count = _count;
                        }
                    });

                    scope.dateShowArray = $rootScope.copy(_array);
                };
                scope.pushSEOData = function (result, flag) {
                    var _array = $rootScope.copy(scope.dateShowArray);
                    var _count = 0;
                    angular.forEach(result, function (r) {
                        var infoKey = r[$rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field];
                        if (scope.filter) {
                            if (infoKey != undefined && (infoKey == "-" || infoKey == "" || infoKey == "www" || infoKey == "null")) {
                                return false;
                            }
                        }
                        _count++;
                        angular.forEach(_array, function (obj) {
                            var temp = obj.label;
                            if (r[temp] == undefined) {
                                return false;
                            }
                            if (flag) {
                                obj.cValue += r[temp];
                            } else {
                                obj.value += r[temp];
                            }
                        });
                    });
                    // 设置_count
                    angular.forEach(_array, function (obj) {
                        if (flag) {
                            obj.cCount = _count;
                        } else {
                            obj.count = _count;
                        }
                    });

                    scope.dateShowArray = $rootScope.copy(_array);
                };

                // 对比
                scope.$on("ssh_load_compare_datashow", function (e, startTime, endTime) {
                    scope.isCompared = true;
                    angular.forEach(scope.dateShowArray, function (dsa) {
                        dsa.cValue = 0;
                    });
                    scope.loadCompareDataShow(startTime, endTime);
                });

                scope.$on("LoadDateShowDataFinish", function (e, msg) {
                    scope.isCompared = false;
                    scope.setDefaultShowArray();
                    scope.pushESData(msg);
                });

                scope.$on("LoadDateShowSEMDataFinish", function (e, msg) {
                    scope.DateNumber = true;
                    scope.DateLoading = true;
                    scope.isCompared = false;
                    scope.setDefaultShowArray();
                    scope.pushSEOData(msg);
                });
            }
        };
    });

    /**
     * Create by wms on 2015-04-22.合计信息显示
     */
    app.directive("sshTrendDateShow", function ($http, $rootScope, $q) {
        return {
            restrict: 'E',
            templateUrl: '../commons/date_show.html',
            link: function (scope, element, attris, controller) {
                // 初始化参数
                scope.isCompared = false;
                scope.dateShowArray = [];
                scope.ds_defaultQuotasOption = ["pv", "uv", "ip", "nuv", "outRate", "avgTime"];
                scope.ds_keyData = [];
                scope.ds_dateShowQuotasOption = scope.checkedArray ? scope.checkedArray : scope.ds_defaultQuotasOption;
                scope.setDefaultShowArray = function () {
                    var tempArray = [];
                    angular.forEach(scope.ds_dateShowQuotasOption, function (q_r) {
                        tempArray.push({"label": q_r, "value": 0, "cValue": 0, "count": 0, "cCount": 0});
                    });
                    scope.ds_keyData = [];
                    scope.dateShowArray = $rootScope.copy(tempArray);
                };
                scope.setDefaultShowArray();
                // 获取对比数据
                scope.loadCompareDataShow = function (startTime, endTime) {
                    var esRequest = $http.get('/api/indextable/?start=' + startTime + "&end=" + endTime + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field) + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&promotion=" + $rootScope.tableSwitch.promotionSearch + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType);
                    $q.all([esRequest]).then(function (final_result) {
                        // 初始化对比数据
                        scope.pushESData(final_result[0].data, true);
                    });
                };

                scope.pushESData = function (result, flag) {
                    var _array = $rootScope.copy(scope.dateShowArray);
                    if (Object.prototype.toString.call(result) === '[object Array]') {
                        var _count = 0;
                        angular.forEach(result, function (r) {
                            var infoKey = r[$rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field];
                            //if (infoKey != undefined && (infoKey == "-" || infoKey == "" || infoKey == "www" || infoKey == "null")) {
                            //    return false;
                            //}
                            if (infoKey == undefined) {
                                return false;
                            }
                            if (!flag) {
                                scope.ds_keyData.push(infoKey);
                            }
                            if (flag && scope.ds_keyData.targetIndexOf(infoKey) == -1) {
                                return false;
                            }
                            _count++;
                            angular.forEach(_array, function (obj) {
                                var temp = obj.label;
                                if (r[temp] == undefined) {
                                    return false;
                                }
                                if (flag) {
                                    if (obj.label == "avgTime") {
                                        var hour = Number(r[temp].split(":")[0]);
                                        var min = Number(r[temp].split(":")[1]);
                                        var sec = Number(r[temp].split(":")[2]);
                                        var count = (((hour * 60) * 60) + (min * 60) + sec);
                                        obj.cValue += count;
                                    } else {
                                        obj.cValue += (r[temp].indexOf("%") != -1) ? Number(r[temp].substring(0, r[temp].indexOf("%"))) : Number(r[temp]);
                                    }
                                } else {
                                    if (obj.label == "avgTime") {
                                        var hour = Number(r[temp].split(":")[0]);
                                        var min = Number(r[temp].split(":")[1]);
                                        var sec = Number(r[temp].split(":")[2]);
                                        var count = (((hour * 60) * 60) + (min * 60) + sec);
                                        obj.value += count;
                                    } else {
                                        obj.value += (r[temp].indexOf("%") != -1) ? Number(r[temp].substring(0, r[temp].indexOf("%"))) : Number(r[temp]);
                                    }
                                }
                            });
                        });
                        // 设置_count
                        angular.forEach(_array, function (obj) {
                            if (flag) {
                                obj.cCount = _count;
                            } else {
                                obj.count = _count;
                            }
                        });
                    } else {
                        var obj = JSON.parse(eval('(' + result + ')').toString()); //由JSON字符串转换为JSON对象
                        angular.forEach(obj, function (r) {
                            var dateShowObject = {};
                            dateShowObject.label = r.label;
                            var temp = 0;
                            var count = 0;
                            angular.forEach(r.quota, function (qo, _i) {
                                temp += Number(qo);
                                count++;
                            });
                            angular.forEach(_array, function (_array_r) {
                                if (_array_r.label == dateShowObject.label) {
                                    if (flag) {
                                        _array_r.cCount = count;
                                        _array_r.cValue = temp
                                    } else {
                                        _array_r.count = count;
                                        _array_r.value = temp
                                    }
                                }
                            });
                        });
                    }

                    scope.dateShowArray = $rootScope.copy(_array);
                };

                // 对比
                scope.$on("ssh_load_compare_datashow", function (e, startTime, endTime) {
                    scope.isCompared = true;
                    angular.forEach(scope.dateShowArray, function (dsa) {
                        dsa.cValue = 0;
                    });
                    scope.loadCompareDataShow(startTime, endTime);
                });

                scope.$on("LoadDateShowDataFinish", function (e, msg) {
                    scope.isCompared = false;
                    scope.setDefaultShowArray();
                    scope.pushESData(msg);
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
                scope.ds_l_a = ["freq", "baidu", "sougou", "haosou", "bing", "other"];
                scope.initDefaultShowArray = function () {
                    var t_a = [];
                    scope.ds_l_a.forEach(function (_r) {
                        t_a.push({"label": _r, "value": 0, "cValue": 0, "count": 0, "cCount": 0});
                    });
                    scope.dateShowArray = $rootScope.copy(t_a);
                };

                scope.initDefaultShowArray();

                scope.pushESData = function (data) {
                    var count = 0;
                    angular.forEach(data, function (r) {
                        var infokey = r.word;
                        if (infokey != undefined && (infokey == "-" || infokey == "" || infokey == "www" || infokey == "null" || infokey.length >= 40)) {
                            return;
                        }
                        count++;
                        angular.forEach(scope.dateShowArray, function (q_r) {
                            var temp = q_r.label;
                            q_r.value += temp != "freq" ? Number(r[temp].substring(0, r[temp].indexOf("%"))) : Number(r[temp]);
                            q_r.count = count;
                        });
                    });
                };

                scope.loadCompareDataShow = function (startTime, endTime) {
                    var semRequest = $http.get(SEM_API_URL + "search_word/" + $rootScope.userType
                    + "/?startOffset=" + startTime + "&endOffset=" + endTime);
                    var count = 0;
                    $q.all([semRequest]).then(function (final_result) {
                        angular.forEach(final_result[0].data, function (r) {
                            var infokey = r.word;
                            if (infokey != undefined && (infokey == "-" || infokey == "" || infokey == "www" || infokey == "null" || infokey.length >= 40)) {
                                return;
                            }
                            count++;
                            angular.forEach(scope.dateShowArray, function (q_r) {
                                var temp = q_r.label;
                                q_r.cValue += temp != "freq" ? Number(r[temp].substring(0, r[temp].indexOf("%"))) : Number(r[temp]);
                                q_r.cCount = count;
                            });
                        });
                    });
                };

                // 对比刷新
                scope.$on("ssh_load_compare_datashow", function (e, startTime, endTime) {
                    scope.isCompared = true;
                    // 初始化对比数据
                    angular.forEach(scope.dateShowArray, function (q_r) {
                        q_r.cValue = q_r.cCount = 0;
                    });
                    scope.loadCompareDataShow(startTime, endTime);
                });

                scope.$on("LoadDateShowDataFinish", function (e, msg) {
                    scope.isCompared = false;
                    scope.initDefaultShowArray();
                    scope.pushESData(msg);
                });
            }
        }
    });

    /**
     * Create by wms on 2015-07-08.合计信息显示ES请求通用
     */
    app.directive("sshESDateShow", function ($http, $rootScope, $q) {
        return {
            restrict: 'E',
            templateUrl: '../commons/date_show.html',
            link: function (scope, element, attris, controller) {
                // 初始化参数
                scope.isCompared = false;
                scope.dateShowArray = [];
                scope.ds_defaultQuotasOption = ["pv", "uv", "ip", "nuv", "outRate", "avgTime"];
                scope.ds_keyData = [];
                scope.ds_dateShowQuotasOption = scope.checkedArray ? scope.checkedArray : scope.ds_defaultQuotasOption;
                scope.setDefaultShowArray = function () {
                    var tempArray = [];
                    angular.forEach(scope.ds_dateShowQuotasOption, function (q_r) {
                        tempArray.push({"label": q_r, "value": 0, "cValue": 0, "count": 0, "cCount": 0});
                    });
                    scope.ds_keyData = [];
                    scope.dateShowArray = $rootScope.copy(tempArray);
                };
                scope.setDefaultShowArray();
                // 获取数据
                scope.loadDataShow = function () {
                    scope.DateNumber = false;
                    scope.DateLoading = false;
                    scope.setDefaultShowArray();
                    var esRequest = $http.get('/api/index_summary/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field) + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&promotion=" + $rootScope.tableSwitch.promotionSearch + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType);
                    $q.all([esRequest]).then(function (final_result) {
                        // 初始化对比数据
                        scope.pushESData(final_result[0].data);
                        scope.DateNumber = true;
                        scope.DateLoading = true;
                    });
                };
                // 获取对比数据
                scope.loadCompareDataShow = function (startTime, endTime) {
                    scope.DateNumbertwo = false;
                    scope.DateLoading = false;
                    var esRequest = $http.get('/api/index_summary/?start=' + startTime + "&end=" + endTime + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field) + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&promotion=" + $rootScope.tableSwitch.promotionSearch + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType);
                    $q.all([esRequest]).then(function (final_result) {
                        // 初始化对比数据
                        scope.pushESData(final_result[0].data, true);
                        scope.DateNumbertwo = true;
                        scope.DateLoading = true;
                    });
                };

                scope.pushESData = function (result, flag) {
                    var _array = $rootScope.copy(scope.dateShowArray);
                    if (Object.prototype.toString.call(result) === '[object Array]') {
                        var _count = 0;
                        angular.forEach(result, function (r) {
                            var infoKey = r[$rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field];
                            //if (infoKey != undefined && (infoKey == "-" || infoKey == "" || infoKey == "www" || infoKey == "null")) {
                            //    return false;
                            //}
                            if (infoKey == undefined) {
                                return false;
                            }
                            if (!flag) {
                                scope.ds_keyData.push(infoKey);
                            }
                            if (flag && scope.ds_keyData.targetIndexOf(infoKey) == -1) {
                                return false;
                            }
                            _count++;
                            angular.forEach(_array, function (obj) {
                                var temp = obj.label;
                                if (r[temp] == undefined) {
                                    return false;
                                }
                                if (flag) {
                                    if (obj.label == "avgTime") {
                                        var hour = Number(r[temp].split(":")[0]);
                                        var min = Number(r[temp].split(":")[1]);
                                        var sec = Number(r[temp].split(":")[2]);
                                        var count = (((hour * 60) * 60) + (min * 60) + sec);
                                        obj.cValue += count;
                                    } else {
                                        obj.cValue += (r[temp].indexOf("%") != -1) ? Number(r[temp].substring(0, r[temp].indexOf("%"))) : Number(r[temp]);
                                    }
                                } else {
                                    if (obj.label == "avgTime") {
                                        var hour = Number(r[temp].split(":")[0]);
                                        var min = Number(r[temp].split(":")[1]);
                                        var sec = Number(r[temp].split(":")[2]);
                                        var count = (((hour * 60) * 60) + (min * 60) + sec);
                                        obj.value += count;
                                    } else {
                                        obj.value += (r[temp].indexOf("%") != -1) ? Number(r[temp].substring(0, r[temp].indexOf("%"))) : Number(r[temp]);
                                    }
                                }
                            });
                        });
                        // 设置_count
                        angular.forEach(_array, function (obj) {
                            if (flag) {
                                obj.cCount = _count;
                            } else {
                                obj.count = _count;
                            }
                        });
                    } else {
                        var obj = JSON.parse(eval('(' + result + ')').toString()); //由JSON字符串转换为JSON对象
                        angular.forEach(obj, function (r) {
                            var dateShowObject = {};
                            dateShowObject.label = r.label;
                            var temp = 0;
                            var count = 0;
                            angular.forEach(r.quota, function (qo, _i) {
                                temp += Number(qo);
                                count++;
                            });
                            angular.forEach(_array, function (_array_r) {
                                if (_array_r.label == dateShowObject.label) {
                                    if (flag) {
                                        _array_r.cCount = count;
                                        _array_r.cValue = temp
                                    } else {
                                        _array_r.count = count;
                                        _array_r.value = temp
                                    }
                                }
                            });
                        });
                    }

                    scope.dateShowArray = $rootScope.copy(_array);
                };

                // 根据表格请求一次进行datashow请求一次
                scope.$on("ssh_dateShow_options_quotas_change", function (e, msg) {
                    scope.isCompared = false;
                    var temp = $rootScope.copy(msg);
                    if (temp.length > 0) {
                        scope.ds_dateShowQuotasOption = temp;
                    }
                    scope.loadDataShow();
                });
                scope.loadDataShow();

                // 对比
                scope.$on("ssh_load_compare_datashow", function (e, startTime, endTime) {
                    scope.isCompared = true;
                    angular.forEach(scope.dateShowArray, function (dsa) {
                        dsa.cValue = 0;
                    });
                    scope.loadCompareDataShow(startTime, endTime);
                });

            }
        };
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
                case "nuvRate":
                case "arrivedRate":
                case "baidu":
                case "sougou":
                case "haosou":
                case "bing":
                case "other":
                {
                    return count ? (value == 0 ? "0%" : (value / count).toFixed(2) + "%") : "0%";
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
                case "cpc":
                {
                    return value ? value.toFixed(2) : value;
                }
                case "impression":
                case "cpm":
                case "conversion":
                {
                    return count ? value : "0";
                }
                case "ctr":
                case "outRate":
                {
                    return count ? (value == 0 ? "0" : (value / count).toFixed(2) + "%") : "0";
                }
                case "avgPage":
                {
                    return count ? (value == 0 ? "0" : (value / count).toFixed(2)) : "0";
//                    return count ? (value / count).toFixed(2) : "0";
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
    app.directive("sshNoVisitor", function ($http, $rootScope, $q) {
        return {
            restrict: 'E',
            templateUrl: '../commons/no_visitor.html',
            scope: true,
            link: function (scope, element, attris, controller) {
                scope._type = attris.myScope;
                scope._ctValue = attris.myScope === "nv" ? "0" : "1";
                scope._ctText = attris.myScope === "nv" ? "新访客" : "老访客";
                scope.defaultObject = {
                    percent: "0%",
                    pv: 0,
                    uv: 0,
                    outRate: 0,
                    avgTime: "00:00:00",
                    avgPage: 0
                };
                // 读取基础数据
                scope.loadBaseData = function () {
                    scope.sumPv = 0;

                    $http({
                        method: 'GET',
                        url: '/api/indextable/?type=' + $rootScope.userType + '&start=' + $rootScope.tableTimeStart + '&end=' + $rootScope.tableTimeEnd + '&indic=pv,uv,outRate,avgTime,avgPage&dimension=ct&filerInfo=' + $rootScope.tableSwitch.tableFilter + "&promotion=" + $rootScope.tableSwitch.promotionSearch + "&formartInfo=" + $rootScope.tableFormat
                    }).success(function (data, status) {
                        angular.forEach(data, function (e) {
                            if (e.ct === scope._ctText) {
                                scope._visitor = e;
                            }
                            scope.sumPv += parseInt(e.pv);
                        });
                        if (!scope._visitor.ct) {
                            scope._visitor = $rootScope.copy(scope.defaultObject);
                            return;
                        }
                        if (scope.sumPv == 0) {
                            scope._visitor.percent = "0%";
                        } else if (scope._visitor.pv == 0) {
                            scope._visitor.percent = "100%";
                        } else {
                            scope._visitor.percent = (scope._visitor.pv * 100 / scope.sumPv).toFixed(2) + "%";
                        }
                        // 处理后台数据错误问题
                        if (scope._visitor.avgTime == "aN:aN:aN") {
                            scope._visitor.avgTime = "00:00:00";
                        }
                    }).error(function (error) {
                        console.log(error);
                    });
                };

                scope.loadData = function () {
                    // 访问来源网站
                    var fwlywzRequest = $http.get('/api/fwlywz/?type=' + $rootScope.userType + '&start=' + $rootScope.tableTimeStart + '&end=' + $rootScope.tableTimeEnd + '&indic=pv&ct=' + scope._ctValue);
                    // 访问入口页TOP5
                    var fwrkyRequest = $http.get('/api/indextable/?type=' + $rootScope.userType + '&start=' + $rootScope.tableTimeStart + '&end=' + $rootScope.tableTimeEnd + '&indic=vc&dimension=loc&filerInfo=[{"ct": ["' + scope._ctValue + '"]}]');
                    $q.all([fwlywzRequest, fwrkyRequest]).then(function (final_result) {
                        scope.fwlywzTop5 = final_result[0].data;
                        scope.fwrkyTop5 = final_result[1].data.length > 5 ? final_result[1].data.slice(0, 5) : final_result[1].data;
                    });
                };

                scope.initData = function () {
                    scope._visitor = $rootScope.copy(scope.defaultObject);
                    scope.fwlywzTop5 = [];
                    scope.fwrkyTop5 = [];
                    scope.loadBaseData();
                    scope.loadData();
                };

                scope.initData();
                scope.$on("ssh_refresh_charts", function (e, msg) {
                    scope.initData();
                });

                scope.$on("ssh_data_show_refresh", function (e) {
                    scope.initData();
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
    app.directive('sshAccordion', function ($rootScope, $location) {
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
                    if (e.sref == "#index" || e.sref == "#conf") {
                        expanders = [];
                    }
                    expanders.push(e);
                    if (e.sref == "webcountsite" || e.sref == "#ads/adsSource") {
                        $rootScope.$broadcast("expanderLoadFinish");
                    }
                }

                $rootScope.$on("expanderLoadFinish", function (e, n, o) {
                    var _path = $location.path();
                    var isIndex = function (a, b) {// 网站概览
                        return a == "/index" && b == "#index";
                    }

                    var isConf = function (a, b) {// 网站设置
                        return a == "/conf" && b == "#conf";
                    }
                    angular.forEach(expanders, function (e_r, index) {
                        if (isIndex(_path, e_r.sref) || isConf(_path, e_r.sref)) {
                            e_r.showText = true;
                            $rootScope.$broadcast("updateSelectRowIndex", index);
                            return;
                        }

                        if (e_r.sref == _path.substring(1, _path.substring(1).indexOf("/") + 1)) {
                            e_r.showText = true;
                            $rootScope.$broadcast("updateSelectRowIndex", index);
                        } else if (e_r.sref == _path.split("/")[2]) {
                            e_r.showText = true;
                            $rootScope.$broadcast("updateSelectRowIndex", index);
                        } else {
                            e_r.showText = false;
                        }
                    });
                });

            },
            link: function (scope) {
                scope.$on("updateSelectRowIndex", function (e, msg) {
                    scope.selectedRow = msg;
                });
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

    /**
     * 复制。
     */
    app.directive('sshClip', function ($rootScope, $timeout, ngDialog) {
        "use strict";
        return {
            restrict: 'EA',
            link: function (scope, element, attris, controller) {

                var clip = new ZeroClipboard(element[0]); // 新建一个对象

                clip.on('ready', function () {
                    $(element[0]).attr("title", "复制到剪贴板").tooltip();
                    this.on('aftercopy', function (event) {
                        $(element[0]).attr("title", "完成复制！").tooltip("fixTitle").tooltip("show");

                        //当timeout被定义时，它返回一个promise对象
                        var timer = $timeout(function () {
                            $(element[0]).attr("title", "复制到剪贴板").tooltip("fixTitle").tooltip("show");
                        }, 600);

                        //当DOM元素从页面中被移除时，AngularJS将会在scope中触发$destory事件。这让我们可以有机会来cancel任何潜在的定时器
                        scope.$on("$destroy", function (event) {
                            $timeout.cancel(timer);
                        });

                    });
                });

                clip.on('error', function (event) {
                    ZeroClipboard.destroy();
                });

                clip.on('mouseover', function (client, args) {
                    // console.log(clip);
                });

            }
        };
    });

    /**
     * 自定义URL验证
     */
    app.directive('sshUrl', function ($rootScope) {
        "use strict";
        return {
            require: "ngModel",
            link: function (scope, element, attr, ngModel) {
                if (ngModel) {
                    var strRegex = /^((https|HTTPS|http|HTTP|ftp|FTP|rtsp|RTSP|mms|MMS)?:\/\/)?(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]$)|([0-9a-zA-Z_!~*'()-]+\.)*([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z]\.[a-zA-Z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+\/?)$/;
                }

                var customerUrlCheck = function (value) {
                    var validity = ngModel.$isEmpty(value) || strRegex.test(value);
                    ngModel.$setValidity("sshUrl", validity);
                    return validity ? value : undefined;
                };
                ngModel.$formatters.push(customerUrlCheck);
                ngModel.$parsers.push(customerUrlCheck);
            }
        };
    });
});
