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
                    /* var _path = $location.path();
                     if (_path == "/source/searchterm" || _path == "/visitor/equipment" || _path == "/visitor/provincemap") {
                     if (scope.todayClass) {
                     scope.today();
                     } else if (scope.sevenDayClass) {
                     scope.sevenDay();
                     } else if (scope.yesterdayClass) {
                     scope.yesterday();
                     } else if (scope.monthClass) {
                     scope.month();
                     } else if ($location.url().split("?").length > 1) {
                     var param = $location.url().split("?")[1];
                     var isChart = $location.url().split("?")[0];
                     if (param != 1 && param != 2 && param != 3 && param != 4) {
                     scope.timeClass = true;
                     var StartTimes = param.split("#")[0];
                     var EndTimes = param.split("#")[1];
                     var newParam = param.replace("#", "至");
                     var time = chartUtils.getTimeOffset(StartTimes, EndTimes);
                     $rootScope.start = time[0];
                     $rootScope.end = time[1];
                     $rootScope.tableTimeStart = time[0];
                     $rootScope.tableTimeEnd = time[1];
                     $('#reportrange span').html(newParam);
                     $('#reportrange').data('daterangepicker').setStartDate(StartTimes);
                     $('#reportrange').data('daterangepicker').setEndDate(EndTimes);
                     $rootScope.targetSearch();
                     scope.$broadcast("ssh_dateShow_options_time_change");
                     if (isChart == "/visitor/equipment") {
                     scope.charts.forEach(function (e) {
                     var chart = echarts.init(document.getElementById(e.config.id));
                     e.config.instance = chart;
                     });
                     //图表
                     requestService.refresh(scope.charts);
                     }
                     if (isChart == "/visitor/provincemap") {
                     scope.doSearch(time[0], time[1], $rootScope.userType);
                     scope.doSearchAreas(time[0], time[1], $rootScope.userType, scope.mapOrPieConfig);
                     }
                     }
                     }
                     }*/
                });
                scope.weekselected = true;
                scope.mothselected = true;
                scope.maxDate = new Date();
                var dateID = document.getElementById("choicetrange");
                if (scope.todayClass === true) {
                    $('#reportrange span').html(GetDateStr(0));
                    dataPicker.picker("choicetrange", 0);
                }
                if (scope.yesterdayClass === true) {
                    $('#reportrange span').html(GetDateStr(-1));
                    dataPicker.picker("choicetrange", 0);
                }

                if (scope.sevenDayClass === true) {
                    $('#reportrange span').html(GetDateStr(-6) + "至" + GetDateStr(0));
                    dataPicker.picker("choicetrange", 6);
                }
                if (scope.monthClass === true) {
                    $('#reportrange span').html(GetDateStr(-29) + "至" + GetDateStr(0));
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
                    if (dateID) {
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
                    scope.clickFirst = true;
                    scope.clickSecond = true;
                    scope.sevenFirst = false;
                    scope.sevenSecond = false;
                    scope.reloadByCalendar("yesterday");
                    $('#reportrange span').html(GetDateStr(-1));
                    $('#reportrange').data('daterangepicker').setStartDate(GetDateStr(-1));
                    $('#reportrange').data('daterangepicker').setEndDate(GetDateStr(-1));
                    if (dateID) {
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
                    scope.clickFirst = false;
                    scope.clickSecond = false;
                    scope.sevenFirst = true;
                    scope.sevenSecond = true;
                    $('#reportrange span').html(GetDateStr(-6) + "至" + GetDateStr(0));
                    $('#reportrange').data('daterangepicker').setStartDate(GetDateStr(-6));
                    $('#reportrange').data('daterangepicker').setEndDate(GetDateStr(0));
                    if (dateID) {
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
                    if (dateID) {
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
                    if (dateID) {
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
                    } else {
                        $('#reportrange span').html(start.format('YYYY-MM-DD') + '至' + end.format('YYYY-MM-DD'));
                    }
                });

                var _path = $location.path();
                if (_path == "/source/searchterm" || _path == "/visitor/equipment" || _path == "/visitor/provincemap") {
                    if (scope.todayClass) {
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
                    } else if (scope.sevenDayClass) {
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
                    } else if (scope.yesterdayClass) {
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
                    } else if (scope.monthClass) {
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
                    } else if ($location.url().split("?").length > 1) {
                        var param = $location.url().split("?")[1];
                        var isChart = $location.url().split("?")[0];
                        if (param != 1 && param != 2 && param != 3 && param != 4) {
                            scope.isShowCalendar = false;
                            scope.hiddenSeven = true;
                            scope.hourselect = false;
                            scope.dayselect = false;
                            scope.weekselected = false;
                            scope.mothselected = true;
                            scope.choiceClass = false;
                            scope.reset();
                            scope.monthClass = false;
                            scope.timeClass = true;
//                            $rootScope.tableTimeStart = -29;
//                            $rootScope.tableTimeEnd = 0;
//                            $rootScope.start = -29;
//                            $rootScope.end = 0;


                            scope.timeClass = true;
                            var StartTimes = param.split("#")[0];
                            var EndTimes = param.split("#")[1];
                            var newParam = param.replace("#", "至");
                            var time = chartUtils.getTimeOffset(StartTimes, EndTimes);
                            $rootScope.start = time[0];
                            $rootScope.end = time[1];
                            $rootScope.tableTimeStart = time[0];
                            $rootScope.tableTimeEnd = time[1];
                            $('#reportrange span').html(newParam);
                            $('#reportrange').data('daterangepicker').setStartDate(StartTimes);
                            $('#reportrange').data('daterangepicker').setEndDate(EndTimes);
//                            $rootScope.targetSearch();
//                            scope.$broadcast("ssh_dateShow_options_time_change");
//                            if (isChart == "/visitor/equipment") {
//                                scope.charts.forEach(function (e) {
//                                    var chart = echarts.init(document.getElementById(e.config.id));
//                                    e.config.instance = chart;
//                                });
//                                //图表
//                                requestService.refresh(scope.charts);
//                            }
//                            if (isChart == "/visitor/provincemap") {
//                                scope.doSearch(time[0], time[1], $rootScope.userType);
//                                scope.doSearchAreas(time[0], time[1], $rootScope.userType, scope.mapOrPieConfig);
//                            }
                        }
                    }
                }
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

                scope.choicedate = function (ev, picker) {
                    var pickerTiemOne = 0;
                    var startDate = $('#reportrange span').html().split("至")[0];
                    var endDate = $('#reportrange span').html().split("至")[1] == undefined ? startDate : $('#reportrange span').html().split("至")[1];
                    pickerTiemOne = startDate == endDate ? 0 : chartUtils.getTimeOffset(startDate, endDate);
                    $('#choicetrange').on('apply.daterangepicker', function (ev, picker) {
                        var pickerTiemTow = chartUtils.getTimeOffset(picker.startDate.format('YYYY-MM-DD'), picker.endDate.format('YYYY-MM-DD'));
                        var startTime = pickerTiemTow[0];
                        var endTime = pickerTiemTow[0] + Math.abs(pickerTiemOne[1] - pickerTiemOne[0]);
                        var dateTime = chartUtils.getSetOffTime(startTime, endTime);
                        if (pickerTiemOne == 0) {
                            $('#choicetrange span').html(dateTime[0]);
                            $('#choicetrange').data('daterangepicker').setStartDate(dateTime[0]);
                            $('#choicetrange').data('daterangepicker').setEndDate(dateTime[0]);
                        } else {
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
                        $rootScope.sshuiyanCompareStart = start.format('YYYY-MM-DD');
                        $rootScope.sshuiyanCompareEnd = end.format('YYYY-MM-DD');
                        $rootScope.sshuiyanCompareFlag = true;
                        $rootScope.datepickerClickTow(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'), label);
                        scope.datePickerCompare(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'), label);
                        //if (!$rootScope.datePickerCompare) {
                        //    $rootScope.datePickerCompare = function (a, b, c) {
                        //    }
                        //} else {
                        //    $rootScope.datePickerCompare(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'), label);
                        //}
                        /*if (start.format('YYYY-MM-DD') == end.format('YYYY-MM-DD')) {
                         scope.datePickerCompare(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'), label);
                         //if (!$rootScope.datePickerCompare) {
                         //    $rootScope.datePickerCompare = function (a, b, c) {
                         //    }
                         //} else {
                         //    $rootScope.datePickerCompare(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'), label);
                         //}
                         if (start.format('YYYY-MM-DD') == end.format('YYYY-MM-DD')) {
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

    app.directive("refresh", function ($rootScope, $http, $location, ngDialog) {
        var option = {
            restrict: "EA",
            template: "<div class=\"right_refresh fr\"><button class=\"btn btn-default btn-Refresh fl\" ng-click=\"page_refresh()\"  type=\"button\"><span aria-hidden=\"true\" class=\"glyphicon glyphicon-refresh\"></span></button><button data-ng-click='send()' class=\"btn btn-default btn-Refresh fl\" type=\"button\" ng-show=\"send\" >发送</button><ui-select ng-model=\"export.selected\" data-on-select='fileSave(export.selected)' theme=\"select2\" ng-hide=\"menu_select\" reset-search-input=\"false\" class=\"fl\"style=\"min-width: 90px;background-color: #fff;\"> <ui-select-match placeholder=\"下载\">{{$select.selected.name}} </ui-select-match> <ui-select-choices repeat=\"export in exportsaa\"> <span ng-bind-html=\"export.name\"></span></ui-select-choices></ui-select></div>",
            transclude: true,
            replace: true,
            link: function (scope) {
                $rootScope.export = {name: '导出CSV', value: 'csv'};
                $rootScope.exportsaa = [
                    {name: 'CSV', value: 'csv'},
                    {name: 'PDF（含图） ', value: 'pdf'}
                ];
                scope.send = function () {
                    scope.urlDialog = ngDialog.open({
                        template: '../conf/Dialog/transformAnalysis_send.html',
                        className: 'ngdialog-theme-default admin_ngdialog ',
                        scope: scope
                    });
                    if (scope.initMailData) { //根据不同页面加载该页面的邮件发送配置
                        scope.initMailData();
                    } else {
                        var ele = $("ul[name='sen_form']");
                        formUtils.rendererMailData(result, ele);
                    }
                }
                scope.mytime = {
                    time: new Date()
                }
                scope.hstep = 1;
                scope.mstep = 1;
                scope.options = {
                    hstep: [1, 2, 3],
                    mstep: [1]
                };

                scope.ismeridian = true;
                scope.sure = function () {
                    console.log(111);
                };


                scope.flag = $location.path() != "/index";
                //导出功能
                scope.fileSave = function (obj) {
                    if (obj.value == "csv") {
                        var dataInfo = angular.copy($rootScope.gridApi2.grid.options.data);
                        var dataHeadInfo = angular.copy($rootScope.gridApi2.grid.options.columnDefs);
                        if ($location.path().indexOf("changelist") != -1) {
                            var _dataInfo = [];
                            _dataInfo.push({
                                "站点名称": "站点首页",
                                "www.best-ad.cn": "best-ad.cn",
                                " ": "",
                                "  ": ""
                            });
                            _dataInfo.push({
                                "站点名称": "来源分析-来源升降榜(来路域名)(指标：pv)(" + $rootScope.startString + "对比" + $rootScope.contrastStartString + ")",
                                "www.best-ad.cn": "",
                                " ": "",
                                "  ": ""
                            });
                            _dataInfo.push({
                                "站点名称": "来路域名",
                                "www.best-ad.cn": $rootScope.startString,
                                " ": $rootScope.contrastStartString,
                                "  ": "变化情况"
                            });
                            //
                            var sum_pv = 0;
                            var contrast_sum_pv = 0;
                            dataInfo.forEach(function (d, count) {
                                var _tmp = {
                                    "站点名称": d["pathName"],
                                    "www.best-ad.cn": d["pv"],
                                    " ": d["contrastPv"],
                                    "  ": d["percentage"]
                                };
                                sum_pv += d["pv"];
                                contrast_sum_pv += d["contrastPv"];
                                _dataInfo.push(_tmp);
                            });
                            var percentage = sum_pv - contrast_sum_pv;
                            var _t_percentage = 0;
                            if (contrast_sum_pv == 0) {
                                _t_percentage = "(100%)";
                            } else {
                                _t_percentage = "(" + ((sum_pv - contrast_sum_pv) / contrast_sum_pv * 100) + "%)"
                            }
                            _dataInfo.push({
                                "站点名称": "全站统计",
                                "www.best-ad.cn": sum_pv,
                                " ": contrast_sum_pv,
                                "  ": percentage + _t_percentage
                            });
                            _dataInfo.push({
                                "站点名称": "Power by best-ad.cn",
                                "www.best-ad.cn": "",
                                " ": "",
                                "  ": ""
                            });
                            var repData = JSON.stringify(_dataInfo).replace(/\%/g, "*");
                        } else {
                            dataHeadInfo.forEach(function (item, i) {
                                if (item.field != undefined) {
                                    dataInfo.forEach(function (dataItem, x) {
                                        dataInfo[x] = JSON.parse(JSON.stringify(dataItem).replace(item.field, item.displayName));
                                    })
                                }
                            });
                            var repData = JSON.stringify(dataInfo).replace(/\%/g, "*");
                        }
                        $http({
                            method: 'POST',
                            url: '/api/downCSV/?dataInfo=' + repData,
                            headers: {
                                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                                'Content-type': 'text/csv; charset=utf-8'
                            }
                        }).success(function (data, status, headers, config) {
                            var hiddenElement = document.createElement('a');
                            var dateTime = new Date();
                            var dateString = dateTime.Format("yyyyMdhmsS");
                            hiddenElement.href = 'data:attachment/csv;charset=utf-8,\uFEFF' + encodeURI(data);
                            hiddenElement.target = '_blank';
                            hiddenElement.download = "down-" + dateString + ".csv";
                            hiddenElement.click();
                        })

                        /*if (scope.flag) {
                         $rootScope.gridApi2.exporter.csvExport("all", "visible", angular.element())
                         } else {
                         $rootScope.gridApi.exporter.csvExport("all", "visible", angular.element());
                         }*/
                    } else {
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
                            method: 'POST',
                            url: '/api/downPDF/?dataInfo=' + repData,
                            headers: {
                                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                                'Content-type': 'text/pdf; charset=utf-8'
                            }
                        }).success(function (data, status, headers, config) {
                            var hiddenElement = document.createElement('a');
                            var dateTime = new Date();
                            var dateString = dateTime.Format("yyyyMdhmsS");
                            hiddenElement.href = "output.pdf";
                            hiddenElement.target = '_blank';
                            hiddenElement.download = "down-" + dateString + ".pdf";
                            hiddenElement.click();
                        })
                        //if (scope.flag) {
                        //    $rootScope.gridApi2.exporter.pdfExport("all", "visible", angular.element());
                        //} else {
                        //    $rootScope.gridApi2.exporter.pdfExport("all", "visible", angular.element());
                        //}

                    }
                }
            }
        }
        return option;
    });
    app.directive("refreshexchange", function ($rootScope, $http, $location, ngDialog) {
        var option = {
            restrict: "EA",
            template: "<div class=\"right_refresh fr right_refresh_exchange \"><button class=\"btn btn-default btn-Refresh fl\" ng-click=\"page_refresh()\"  type=\"button\"><span aria-hidden=\"true\" class=\"glyphicon glyphicon-refresh\"></span></button></div>",
            transclude: true,
            replace: true
        };
        return option;
    });
    app.directive("compare", function () {
        return {
            restrict: "EA",
            template: "<div ng-hide='hiddenSeven' id='cm'>" +
            "<label>对比：</label>" +
            "<label><input  name=\"compareRadio\" type=\"checkbox\" ng-click=\"compareLastDay()\" value='lday' index='0' /><span>前一日</span></label>&nbsp;&nbsp;&nbsp;&nbsp;" +
            "<label><input  name=\"compareRadio\" type=\"checkbox\" ng-click=\"compareLastWeek()\" value='lweek' index='1' /><span>上周同期</span></label>" +
//            "<input class=\"styled\" type=\"checkbox\" ng-click=\"restCompare()\">取消对比" +
            "</div>",
            transclude: true,
            link: function (scope, ele, attr) {
                //$(ele).hide();
                var checkBox = $(ele).find("input[type='checkbox']");
                checkBox.each(function (i, o) {
                    $(o).addClass("styled");
                    var span = $("<span class=\"checkbox\"></span>");
                    span.insertBefore($(o));
                });

                var checked = [];
                $("input[name='compareRadio']").change(function () {
                    var index = Number($(this).attr('index'));
                    var _this = $(this);
                    checked = [];
                    if (_this.prop('checked')) {
                        var exist = true;
                        checked.forEach(function (item) {
                            if (index == item) {
                                exist = false;
                            }
                        });
                        if (exist) {
                            checked.push(index);
                        }
                    }
                    checkBox.each(function (i, o) {
                        $(o).prev("span").css("background-position", "0px 0px");
                        $(o).prop('checked', false);
                    });
                    checked.forEach(function (c) {
                        $(checkBox[c]).prev("span").css("background-position", "0px -51px");
                        $(checkBox[c]).prop('checked', true);
                    });

                    //checkBox.each(function (i, o) {
                    //});
                    //var row = Number($(this).attr("index"));
                    //var a = checked.indexOf(row);
                    //var checks = $("input[name='compareRadio']");
                    //if (a != -1) {
                    //    checked.slice(a, 1);
                    //} else {
                    //    if (checked.length > 0) {
                    //        var _shift = checked.shift();
                    //        $(checks[_shift]).prev("span").css("background-position", "0px 0px");
                    //        checked.push(row);
                    //    } else {
                    //        checked.push(row);
                    //    }
                    //}
                    //checkBox.each(function (i, o) {
                    //    $(o).prev("span").css("background-position", "0px 0px");
                    //    $(o).prop("checked", false);
                    //});
                    //var position = ["0px -77px", "0px -51px"];
                    //checked.forEach(function (c) {
                    //    $(checkBox[c]).prop("checked", true);
                    //});

                    //var customCheck = [];
                    //checks.each(function (i, check) {
                    //    if ($(check).prop("checked")) {
                    //        var c = Number($(check).attr("index"));
                    //        customCheck.push(c);
                    //    }
                    //});
                    //console.log(customCheck);
                    //checked.forEach(function (c, i) {
                    //    switch (i) {
                    //        case 0:
                    //            $(checkBox[c]).prev("span").css("background-position", "0px -77px");
                    //            break;
                    //        case 1:
                    //            $(checkBox[c]).prev("span").css("background-position", "0px -51px");
                    //            break;
                    //    }
                    //});
                    scope.checkBoxCompare(checked);
                });
            }
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
            templateUrl: './grid_page/grid_page_qiantai.html',
            transclude: true,
            link: function (scope) {
                scope.gridpages = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            }
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
//                scope.setDefaultShowArray();

                // 获取数据
                scope.loadDataShow = function () {
                    scope.DateNumber = false;
                    scope.DateLoading = false;
                    scope.setDefaultShowArray();
                    var esRequest = $http.get('/api/index_summary/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field) + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&promotion=" + $rootScope.tableSwitch.promotionSearch + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType);
                    var seoQuotas = scope.getSEOQuotas();
                    if (seoQuotas.length > 0) {
                        var seoRequest = $http.get(SEM_API_URL + "/sem/report/" + scope.ssh_seo_type + "?a=" + $rootScope.user + "&b=" + $rootScope.baiduAccount + "&device=-1&startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd);
                    }
                    $q.all([esRequest, seoRequest]).then(function (final_result) {
                        scope.pushESData(final_result[0].data);
                        if (final_result[1] != undefined) {
                            scope.pushSEOData(final_result[1].data);
                        }
                        scope.DateNumber = true;
                        scope.DateLoading = true;
                    });
                };
                scope.loadCompareDataShow = function (startTime, endTime) {
                    scope.DateNumber = false;
                    scope.DateLoading = false;
                    var esRequest = $http.get('/api/index_summary/?start=' + startTime + "&end=" + endTime + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field) + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&promotion=" + $rootScope.tableSwitch.promotionSearch + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType);
                    var seoQuotas = scope.getSEOQuotas();
                    if (seoQuotas.length > 0) {
                        var seoRequest = $http.get(SEM_API_URL + "/sem/report/" + scope.ssh_seo_type + "?a=" + $rootScope.user + "&b=" + $rootScope.baiduAccount + "&device=-1&?startOffset=" + startTime + "&endOffset=" + endTime);
                    }
                    $q.all([esRequest, seoRequest]).then(function (final_result) {
                        // 初始化对比数据
                        scope.pushESData(final_result[0].data, true);
                        if (final_result[1] != undefined) {
                            scope.pushSEOData(final_result[1].data, true);
                        }
                        scope.DateNumber = true;
                        scope.DateLoading = true;
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
                    // 判断是不是sem指标
                    function isSeoLabel(_label) {
                        switch (_label) {
                            case "cost":
                            case "impression":
                            case "click":
                            case "ctr":
                            case "cpc":
                            case "cpm":
                            case "conversion":
                                return true;
                        }
                        return false;
                    }

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

                scope.$on("ssh_dateShow_options_quotas_change", function (e, msg) {
                    scope.isCompared = false;
                    var temp = $rootScope.copy(msg);
                    if (temp.length > 0) {
                        scope.ds_dateShowQuotasOption = temp;
                    }
                    scope.loadDataShow();
                });

                scope.loadDataShow();
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
                    scope.DateNumber = false;
                    scope.DateLoading = false;
                    scope.isCompared = true;
                    // 初始化对比数据
                    angular.forEach(scope.dateShowArray, function (q_r) {
                        q_r.cValue = q_r.cCount = 0;
                    });
                    scope.loadCompareDataShow(startTime, endTime);
                    scope.DateNumber = true;
                    scope.DateLoading = true;
                });

                scope.$on("LoadDateShowDataFinish", function (e, msg) {
                    scope.DateNumber = false;
                    scope.DateLoading = false;
                    scope.isCompared = false;
                    scope.initDefaultShowArray();
                    scope.pushESData(msg);
                    scope.DateNumber = true;
                    scope.DateLoading = true;
                });
            }
        }
    });

    /**
     * Create by wms on 2015-07-08.合计信息显示ES请求通用
     */
    app.directive("sshESDateShow", function ($http, $rootScope, $q, $location) {
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
                        tempArray.push({"label": q_r, "value": "--", "cValue": "", "count": 0, "cCount": 0});
                    });
                    scope.ds_keyData = [];
                    scope.dateShowArray = $rootScope.copy(tempArray);
                };
                // scope.setDefaultShowArray();
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
                                var _key = r.key[_i];
                                if (_key != undefined && (_key == "-" || _key == "" || _key == "www" || _key == "null")) {
                                    return false;
                                }
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
                    percent: "--",
                    pv: "--",
                    uv: "--",
                    outRate: "--",
                    avgTime: "--",
                    avgPage: "--"
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
                    var fwrkyRequest = $http.get('/api/indextable/?type=' + $rootScope.userType + '&start=' + $rootScope.tableTimeStart + '&end=' + $rootScope.tableTimeEnd + '&indic=vc&dimension=loc&filerInfo=[{"ct": ["' + scope._ctValue + '"]},{"entrance":[1]}]');
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
                        //console.log(_path);
                        if (_path == "/transform/pageTransform") {
                            $rootScope.$broadcast("updateSelectRowIndex", 7);
                        }

                        if (isIndex(_path, e_r.sref) || isConf(_path, e_r.sref)) {
                            e_r.showText = true;
                            $rootScope.$broadcast("updateSelectRowIndex", index);
                            return;
                        }
                        if (_path == "/transform/transformAnalysis") {
                            $rootScope.$broadcast("updateSelectRowIndex", 7);
                        }
                        if (e_r.sref == _path.substring(1, _path.substring(1).indexOf("/") + 1)) {

                            e_r.showText = true;
                            $rootScope.$broadcast("updateSelectRowIndex", index);
                        }

                        else if (e_r.sref == _path.split("/")[2]) {
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

    /**
     * 指定广告追踪 来源 指标显示指令 by icepros
     */
    app.directive("sshEsAdsSourceShow", function ($http, $rootScope, $q) {
        return {
            restrict: 'E',
            templateUrl: '../commons/date_show.html',
            link: function (scope, element, attris, controller) {
                // 初始化参数 默认不比较数据
                scope.isCompared = false;
                // 展现统计指标数据数组
                scope.dateShowArray = [];
                // 默认指标
                scope.ds_defaultQuotasOption = ["pv", "uv", "ip", "outRate", "avgTime"];
                // 自定义指标
                scope.ds_dateShowQuotasOption = scope.checkedArray ? scope.checkedArray : scope.ds_defaultQuotasOption;
                // 默认统计指标值
                scope.setDefaultShowArray = function () {
                    var tempArray = [];
                    angular.forEach(scope.ds_dateShowQuotasOption, function (quota) {
                        tempArray.push({"label": quota, "value": 0, "cValue": 0, "count": 0, "cCount": 0});
                    });
                    scope.dateShowArray = $rootScope.copy(tempArray);
                };
                // 根据请求的 URL 获取数据
                scope.loadDataShow = function () {
                    scope.DateNumber = false;
                    scope.DateLoading = false;
                    scope.setDefaultShowArray();
                    var esRequest = $http.get('/api/adsSource/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&quotas=" + $rootScope.checkedArray + "&dimension=" + $rootScope.tableSwitch.latitude.field + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType);
                    $q.all([esRequest]).then(function (finalResult) {
                        // 初始化对比数据
                        scope.pushESData(finalResult[0].data);
                        scope.DateNumber = true;
                        scope.DateLoading = true;
                    });
                };
                // 根据 选择的日期进行 URL 传参 获取对比的数据
                scope.loadCompareDataShow = function (startTime, endTime) {
                    scope.DateNumbertwo = false;
                    scope.DateLoading = false;
                    var esRequest = $http.get('/api/adsSource/?start=' + startTime + "&end=" + endTime + "&quotas=" + $rootScope.checkedArray + "&dimension=" + $rootScope.tableSwitch.latitude.field + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType);
                    $q.all([esRequest]).then(function (finalResult) {
                        // 初始化对比数据
                        scope.pushESData(finalResult[0].data, true);
                        scope.DateNumbertwo = true;
                        scope.DateLoading = true;
                    });
                };
                // 把 es 返回的数据以对象的方式存到 dateShowArray 数组中
                scope.pushESData = function (result, flag) {
                    var _array = $rootScope.copy(scope.dateShowArray);
                    angular.forEach(result, function (r) {
                        var dateShowObject = {};
                        dateShowObject.label = r.label;
                        var temp = 0;
                        var count = 0;
                        angular.forEach(r.quota, function (qo) {
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

                    scope.dateShowArray = $rootScope.copy(_array);
                }

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
        }
    });

    /**
     * 指定广告追踪 媒介 指标显示指令 by icepros
     */
    app.directive("sshEsAdsMediumShow", function ($http, $rootScope, $q) {
        return {
            restrict: 'E',
            templateUrl: '../commons/date_show.html',
            link: function (scope, element, attris, controller) {
                // 初始化参数 默认不比较数据
                scope.isCompared = false;
                // 展现统计指标数据数组
                scope.dateShowArray = [];
                // 默认指标
                scope.ds_defaultQuotasOption = ["pv", "uv", "ip", "outRate", "avgTime"];
                // 自定义指标
                scope.ds_dateShowQuotasOption = scope.checkedArray ? scope.checkedArray : scope.ds_defaultQuotasOption;
                // 默认统计指标值
                scope.setDefaultShowArray = function () {
                    var tempArray = [];
                    angular.forEach(scope.ds_dateShowQuotasOption, function (quota) {
                        tempArray.push({"label": quota, "value": 0, "cValue": 0, "count": 0, "cCount": 0});
                    });
                    scope.dateShowArray = $rootScope.copy(tempArray);
                };
                // 根据请求的 URL 获取数据
                scope.loadDataShow = function () {
                    scope.DateNumber = false;
                    scope.DateLoading = false;
                    scope.setDefaultShowArray();
                    var esRequest = $http.get('/api/adsMedium/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&quotas=" + $rootScope.checkedArray + "&dimension=" + $rootScope.tableSwitch.latitude.field + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType);
                    $q.all([esRequest]).then(function (finalResult) {
                        // 初始化对比数据
                        scope.pushESData(finalResult[0].data);
                        scope.DateNumber = true;
                        scope.DateLoading = true;
                    });
                };
                // 根据 选择的日期进行 URL 传参 获取对比的数据
                scope.loadCompareDataShow = function (startTime, endTime) {
                    scope.DateNumbertwo = false;
                    scope.DateLoading = false;
                    var esRequest = $http.get('/api/adsMedium/?start=' + startTime + "&end=" + endTime + "&quotas=" + $rootScope.checkedArray + "&dimension=" + $rootScope.tableSwitch.latitude.field + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType);
                    $q.all([esRequest]).then(function (finalResult) {
                        // 初始化对比数据
                        scope.pushESData(finalResult[0].data, true);
                        scope.DateNumbertwo = true;
                        scope.DateLoading = true;
                    });
                };
                // 把 es 返回的数据以对象的方式存到 dateShowArray 数组中
                scope.pushESData = function (result, flag) {
                    var _array = $rootScope.copy(scope.dateShowArray);
                    angular.forEach(result, function (r) {
                        var dateShowObject = {};
                        dateShowObject.label = r.label;
                        var temp = 0;
                        var count = 0;
                        angular.forEach(r.quota, function (qo) {
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

                    scope.dateShowArray = $rootScope.copy(_array);
                }

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
        }
    });

    /**
     * 指定广告追踪 计划 指标显示指令 by icepros
     */
    app.directive("sshEsAdsPlanShow", function ($http, $rootScope, $q) {
        return {
            restrict: 'E',
            templateUrl: '../commons/date_show.html',
            link: function (scope, element, attris, controller) {
                // 初始化参数 默认不比较数据
                scope.isCompared = false;
                // 展现统计指标数据数组
                scope.dateShowArray = [];
                // 默认指标
                scope.ds_defaultQuotasOption = ["pv", "uv", "ip", "outRate", "avgTime"];
                // 自定义指标
                scope.ds_dateShowQuotasOption = scope.checkedArray ? scope.checkedArray : scope.ds_defaultQuotasOption;
                // 默认统计指标值
                scope.setDefaultShowArray = function () {
                    var tempArray = [];
                    angular.forEach(scope.ds_dateShowQuotasOption, function (quota) {
                        tempArray.push({"label": quota, "value": 0, "cValue": 0, "count": 0, "cCount": 0});
                    });
                    scope.dateShowArray = $rootScope.copy(tempArray);
                };
                // 根据请求的 URL 获取数据
                scope.loadDataShow = function () {
                    scope.DateNumber = false;
                    scope.DateLoading = false;
                    scope.setDefaultShowArray();
                    var esRequest = $http.get('/api/adsPlan/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&quotas=" + $rootScope.checkedArray + "&dimension=" + $rootScope.tableSwitch.latitude.field + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType);
                    $q.all([esRequest]).then(function (finalResult) {
                        // 初始化对比数据
                        scope.pushESData(finalResult[0].data);
                        scope.DateNumber = true;
                        scope.DateLoading = true;
                    });
                };
                // 根据 选择的日期进行 URL 传参 获取对比的数据
                scope.loadCompareDataShow = function (startTime, endTime) {
                    scope.DateNumbertwo = false;
                    scope.DateLoading = false;
                    var esRequest = $http.get('/api/adsPlan/?start=' + startTime + "&end=" + endTime + "&quotas=" + $rootScope.checkedArray + "&dimension=" + $rootScope.tableSwitch.latitude.field + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType);
                    $q.all([esRequest]).then(function (finalResult) {
                        // 初始化对比数据
                        scope.pushESData(finalResult[0].data, true);
                        scope.DateNumbertwo = true;
                        scope.DateLoading = true;
                    });
                };
                // 把 es 返回的数据以对象的方式存到 dateShowArray 数组中
                scope.pushESData = function (result, flag) {
                    var _array = $rootScope.copy(scope.dateShowArray);
                    angular.forEach(result, function (r) {
                        var dateShowObject = {};
                        dateShowObject.label = r.label;
                        var temp = 0;
                        var count = 0;
                        angular.forEach(r.quota, function (qo) {
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

                    scope.dateShowArray = $rootScope.copy(_array);
                }

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
        }
    });

    /**
     * 指定广告追踪 关键词 指标显示指令 by icepros
     */
    app.directive("sshEsAdsKeywordShow", function ($http, $rootScope, $q) {
        return {
            restrict: 'E',
            templateUrl: '../commons/date_show.html',
            link: function (scope, element, attris, controller) {
                // 初始化参数 默认不比较数据
                scope.isCompared = false;
                // 展现统计指标数据数组
                scope.dateShowArray = [];
                // 默认指标
                scope.ds_defaultQuotasOption = ["pv", "uv", "ip", "outRate", "avgTime"];
                // 自定义指标
                scope.ds_dateShowQuotasOption = scope.checkedArray ? scope.checkedArray : scope.ds_defaultQuotasOption;
                // 默认统计指标值
                scope.setDefaultShowArray = function () {
                    var tempArray = [];
                    angular.forEach(scope.ds_dateShowQuotasOption, function (quota) {
                        tempArray.push({"label": quota, "value": 0, "cValue": 0, "count": 0, "cCount": 0});
                    });
                    scope.dateShowArray = $rootScope.copy(tempArray);
                };
                // 根据请求的 URL 获取数据
                scope.loadDataShow = function () {
                    scope.DateNumber = false;
                    scope.DateLoading = false;
                    scope.setDefaultShowArray();
                    var esRequest = $http.get('/api/adsKeyWord/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&quotas=" + $rootScope.checkedArray + "&dimension=" + $rootScope.tableSwitch.latitude.field + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType);
                    $q.all([esRequest]).then(function (finalResult) {
                        // 初始化对比数据
                        scope.pushESData(finalResult[0].data);
                        scope.DateNumber = true;
                        scope.DateLoading = true;
                    });
                };
                // 根据 选择的日期进行 URL 传参 获取对比的数据
                scope.loadCompareDataShow = function (startTime, endTime) {
                    scope.DateNumbertwo = false;
                    scope.DateLoading = false;
                    var esRequest = $http.get('/api/adsKeyWord/?start=' + startTime + "&end=" + endTime + "&quotas=" + $rootScope.checkedArray + "&dimension=" + $rootScope.tableSwitch.latitude.field + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType);
                    $q.all([esRequest]).then(function (finalResult) {
                        // 初始化对比数据
                        scope.pushESData(finalResult[0].data, true);
                        scope.DateNumbertwo = true;
                        scope.DateLoading = true;
                    });
                };
                // 把 es 返回的数据以对象的方式存到 dateShowArray 数组中
                scope.pushESData = function (result, flag) {
                    var _array = $rootScope.copy(scope.dateShowArray);
                    angular.forEach(result, function (r) {
                        var dateShowObject = {};
                        dateShowObject.label = r.label;
                        var temp = 0;
                        var count = 0;
                        angular.forEach(r.quota, function (qo) {
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

                    scope.dateShowArray = $rootScope.copy(_array);
                }

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
        }
    });

    /**
     * 指定广告追踪 创意 指标显示指令 by icepros
     */
    app.directive("sshEsAdsCreativeShow", function ($http, $rootScope, $q) {
        return {
            restrict: 'E',
            templateUrl: '../commons/date_show.html',
            link: function (scope, element, attris, controller) {
                // 初始化参数 默认不比较数据
                scope.isCompared = false;
                // 展现统计指标数据数组
                scope.dateShowArray = [];
                // 默认指标
                scope.ds_defaultQuotasOption = ["pv", "uv", "ip", "outRate", "avgTime"];
                // 自定义指标
                scope.ds_dateShowQuotasOption = scope.checkedArray ? scope.checkedArray : scope.ds_defaultQuotasOption;
                // 默认统计指标值
                scope.setDefaultShowArray = function () {
                    var tempArray = [];
                    angular.forEach(scope.ds_dateShowQuotasOption, function (quota) {
                        tempArray.push({"label": quota, "value": 0, "cValue": 0, "count": 0, "cCount": 0});
                    });
                    scope.dateShowArray = $rootScope.copy(tempArray);
                };
                // 根据请求的 URL 获取数据
                scope.loadDataShow = function () {
                    scope.DateNumber = false;
                    scope.DateLoading = false;
                    scope.setDefaultShowArray();
                    var esRequest = $http.get('/api/adsCreative/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&quotas=" + $rootScope.checkedArray + "&dimension=" + $rootScope.tableSwitch.latitude.field + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType);
                    $q.all([esRequest]).then(function (finalResult) {
                        // 初始化对比数据
                        scope.pushESData(finalResult[0].data);
                        scope.DateNumber = true;
                        scope.DateLoading = true;
                    });
                };
                // 根据 选择的日期进行 URL 传参 获取对比的数据
                scope.loadCompareDataShow = function (startTime, endTime) {
                    scope.DateNumbertwo = false;
                    scope.DateLoading = false;
                    var esRequest = $http.get('/api/adsCreative/?start=' + startTime + "&end=" + endTime + "&quotas=" + $rootScope.checkedArray + "&dimension=" + $rootScope.tableSwitch.latitude.field + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&formartInfo=" + $rootScope.tableFormat + "&type=" + $rootScope.userType);
                    $q.all([esRequest]).then(function (finalResult) {
                        // 初始化对比数据
                        scope.pushESData(finalResult[0].data, true);
                        scope.DateNumbertwo = true;
                        scope.DateLoading = true;
                    });
                };
                // 把 es 返回的数据以对象的方式存到 dateShowArray 数组中
                scope.pushESData = function (result, flag) {
                    var _array = $rootScope.copy(scope.dateShowArray);
                    angular.forEach(result, function (r) {
                        var dateShowObject = {};
                        dateShowObject.label = r.label;
                        var temp = 0;
                        var count = 0;
                        angular.forEach(r.quota, function (qo) {
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

                    scope.dateShowArray = $rootScope.copy(_array);
                }

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
        }
    });

    app.directive("sshDateShowPage", function ($rootScope) {
        return {
            restrict: 'E',
            templateUrl: '../commons/date_show.html',
            link: function (scope, element, attris, controller) {
                // 初始化参数
                scope.isCompared = false;
                scope.dateShowArray = [];
                scope.ssh_seo_type = attris.semType;
                scope.filter = attris.filter;
                scope.ds_defaultQuotasOption = ["pv", "uv", "ip", "conversions", "vc", "crate"];
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
                scope.load = function (isCompared, data) {
                    console.log(scope.isCompared);
                    //scope.isCompared = true;
                    //var i = 0;
                    //angular.forEach(scope.dateShowArray, function (dsa) {
                    //    dsa.cValue = i++;
                    //    dsa.cCount = i++;
                    //});
                    //scope.dateShowArray = $rootScope.copy(scope.dateShowArray);
                    scope.pushESData(data, true);
                };
                scope.pushESData = function (result, flag) {
                    var _array = $rootScope.copy(scope.dateShowArray);
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
                    scope.dateShowArray = $rootScope.copy(_array);
                };
            }
        };
    });

    app.directive('getReferrerData', function () {

        return {
            restrict: 'C',
            replace: true,
            transclude: true,
            scope: {
                myDataOne: '@myDataOne',
                myDataTwo: '@myDataTwo'
            },
            template: '<div ng-switch on="myDataTwo">' +
            '<div ng-switch-when="直接访问" style="line-height:30px; display:block; padding:0 10px;white-space: nowrap;}">{{myDataTwo}}</div>' +
            '<a ng-switch-default href="{{myDataOne}}" title="{{myDataOne}}" target="_blank" style="color:#0965b8;line-height:30px; display:block; padding:0 10px;white-space: nowrap;text-overflow:ellipsis; overflow:hidden;}">{{myDataTwo}}</a>' +
            '</div>'
        }

    });

    app.directive('getExternalLinks', function () {

        return {
            restrict: 'C',
            replace: true,
            transclude: true,
            scope: {
                myDataOne: '@myDataOne',
                myDataTwo: "@myDataTwo"
            },
            template: '<div ng-switch on="myDataOne">' +
            '<div ng-switch-default style="line-height:30px; display:block; padding:0 10px;white-space: nowrap;}">{{myDataTwo}}</div>' +
            '<a ng-switch-when="links" href="{{myDataTwo}}" target="_blank" style="color:#0965b8;line-height:30px; display:block; padding:0 10px;white-space: nowrap;text-overflow:ellipsis; overflow:hidden;}">{{myDataTwo}}</a>' +
            '</div>'
        }

    });
});
