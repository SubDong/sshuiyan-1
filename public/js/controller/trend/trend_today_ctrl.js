/**
 * Created by john on 2015/4/1.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('trend_today_ctrl', function ($scope, $q, $rootScope, $http, requestService, messageService, areaService, uiGridConstants) {
        $scope.todayClass = true;
        $scope.hourcheckClass = true;
        $scope.lastDaySelect = true;
        $scope.lastWeekSelect = true;
        $scope.clearCompareSelect = true;
        $scope.souce.selected = {"name": "全部"};
        $scope.city.selected = {"name": "全部"};
        $scope.browser.selected = {"name": "全部"};
//        高级搜索提示
        $scope.sourceSearch = "";
        $scope.terminalSearch = "";
        $scope.areaSearch = "";
//        取消显示的高级搜索的条件
        $scope.removeSourceSearch = function(obj){
            $scope.souce.selected = {"name": "全部"};
            $rootScope.$broadcast("loadAllSource");
            obj.sourceSearch = "";
        }
        $scope.removeTerminalSearch = function(obj) {
            $rootScope.$broadcast("loadAllTerminal");
            obj.sourceSearch = "";
        }

        $scope.removeAreaSearch = function(obj) {
            $scope.city.selected = {"name": "全部"};
            $rootScope.$broadcast("loadAllArea");
            obj.areaSearch = "";
        }

        $scope.reset = function () {
            $scope.todayClass = false;
            $scope.yesterdayClass = false;
            $scope.sevenDayClass = false;
            $scope.monthClass = false;
            $scope.definClass = false;
            $scope.hourcheckClass = false;
            $scope.hourselect = true;
        };
        /*    $scope.hourcheck= function(){
         $scope.dayClass=false;
         $scope.hourcheckClass=true;
         }
         $scope.daycheck= function(){
         $scope.dayClass=true;
         $scope.hourcheckClass=false;
         }*/
        //table配置
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        $rootScope.tableFormat = "hour";
        //配置默认指标
        $rootScope.checkedArray = ["pv", "uv", "ip", "outRate", "avgTime"];
        $rootScope.gridArray = [
            {
                name: "xl",
                displayName: "",
                cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                maxWidth: 10,
                enableSorting: false
            },
            {
                name: "时间",
                displayName: "时间",
                field: "period",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                sort: {
                    direction: uiGridConstants.ASC,
                    priority: 0
                }
            },
            {
                name: "浏览量(PV)",
                displayName: "浏览量(PV)",
                field: "pv",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "访客数(UV)",
                displayName: "访客数(UV)",
                field: "uv",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "IP数",
                displayName: "IP数",
                field: "ip",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "跳出率",
                displayName: "跳出率",
                field: "outRate",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "平均访问时长",
                displayName: "平均访问时长",
                field: "avgTime",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            }
        ];
        $rootScope.tableSwitch = {
            latitude: {name: "日期", displayName: "日期", field: "period"},
            tableFilter: null,
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 0,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: false,
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false //是否清空指标array
        };
        //
        $scope.dt = new Date();
        $scope.onLegendClickListener = function (radio, chartObj, chartConfig, checkedVal) {
            if ($scope.charts[0].config.compare) {
                var time = $rootScope.start;
                if ($scope.compareType == 2) {
                    time = $rootScope.start - 7;
                }
                $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
                var todayData = $http.get("api/charts?type=" + checkedVal + "&dimension=period&start=" + time + "&end=" + time + "&userType=" + $rootScope.userType + "&int=" + $rootScope.interval);
                var lastDayData = $http.get("api/charts?type=" + checkedVal + "&dimension=period&start=" + (time - 1) + "&end=" + ( time - 1) + "&userType=" + $rootScope.userType + "&int=" + $rootScope.interval);
                $q.all([todayData, lastDayData]).then(function (res) {
                    var dateStamp = chartUtils.getDateStamp(time);
                    var final_result = chartUtils.compareTo(res, dateStamp);
                    $scope.charts[0].config.noFormat = "none";
                    $scope.charts[0].config.compare = true;
                    cf.renderChart(final_result, $scope.charts[0].config);
                });
            } else {
                if ($scope.compareType) {
                    var times = [$rootScope.start, $rootScope.end];
                    $scope.compare(times, checkedVal);
                } else {
                    clear.lineChart($scope.charts[0].config, checkedVal);
                    $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
                    $scope.charts[0].types = checkedVal;
                    var chartarray = [$scope.charts[0]];
                    requestService.refresh(chartarray);
                }
            }
        }
        $scope.todayFormat = function (data, config, e) {
            if ($rootScope.interval == 1) {
                var final_result = chartUtils.getByHourByDayData(data);
                config["noFormat"] = "noFormat";
                config["keyFormat"] = "none";
                config["chartType"] = "line";//图表类型
                cf.renderChart(final_result, config);
            } else {
                var json = JSON.parse(eval("(" + data + ")").toString());
                if (json.length) {
                    if (json[0].key.length == 1) {
                        config["noFormat"] = "noFormat";
                        chartUtils.getXType(config, $rootScope.interval);
                        config["chartType"] = "bar";//图表类型
                        config["bGap"] = true;//图表类型
                        chartUtils.noFormatConvertLabel(json);
                        cf.renderChart(json, config);
                    } else if ($rootScope.interval == -1 && $rootScope.start >= -1) {
                        config["keyFormat"] = "none";
                        config["noFormat"] = "noFormat";
                        config["bGap"] = true;//图表类型
                        chartUtils.getXType(config, $rootScope.interval, $rootScope.start);
                        var final_result = chartUtils.getDataByDay(data);
                        cf.renderChart(final_result, config);
                    } else {
                        config["noFormat"] = undefined;
                        config["chartType"] = "line";//图表类型
                        config["bGap"] = false;//图表类型
                        chartUtils.getXType(config, $rootScope.interval);
                        cf.renderChart(data, config);
                    }
                } else {
                    config["noFormat"] = undefined;
                    config["chartType"] = "line";//图表类型
                    config["bGap"] = false;//图表类型
                    chartUtils.getXType(config, $rootScope.interval);
                    cf.renderChart(data, config);
                }
            }
        }
        $scope.charts = [
            {
                config: {
                    legendId: "today_charts_legend",
                    legendAllowCheckCount: 2,
                    legendClickListener: $scope.onLegendClickListener,
                    legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "新访客数", "新访客比率", "IP数", "跳出率", "平均访问时长", "平均访问页数"],//显示几种数据
                    legendDefaultChecked: [0, 1],
                    id: "today_charts",
                    min_max: false,
                    bGap: false,//首行缩进
                    chartType: "line",//图表类型
                    dataKey: "key",//传入数据的key值
                    keyFormat: 'hour',
                    dataValue: "quota"//传入数据的value值
                },
                types: ["pv", "uv"],
                dimension: ["period"],
                interval: $rootScope.interval,
                url: "/api/charts",
                cb: $scope.todayFormat
            }];
        $scope.compareLegendData = [];
        $scope.init = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.interval = 1;
            $scope.charts.forEach(function (e) {
                $scope.compareLegendData = e.config.legendData;
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                util.renderLegend(chart, e.config);
            })
            requestService.refresh($scope.charts);
        }
        $scope.init();
        $scope.$on("ssh_refresh_charts", function (e, msg) {
            //if ($scope.charts[0].config.compare) {
            //    if ($rootScope.start > -7) {
            //        $scope.start--;
            //        $scope.end--
            //        if ($scope.compareType == 1) {
            //            $scope.compareLastDay();
            //        } else {
            //            $scope.compareLastWeek();
            //        }
            //    } else {
            //        $scope.restCompare();
            //    }
            //}
            if ($scope.charts[0].config.compareCustom) {
                $scope.resetC();
            }
            if ($rootScope.start > -6 && $scope.charts[0].config.keyFormat == "week") {
                $rootScope.interval = -1;
            }
            if ($rootScope.interval == -1) {
                $scope.lastDaySelect = false;
                $scope.lastWeekSelect = false;
                $scope.clearCompareSelect = false;
            }
            $scope.charts.forEach(function (chart) {
                chart.config.instance = echarts.init(document.getElementById(chart.config.id));
                chart.config.time = chartUtils.getWeekTime($rootScope.start, $rootScope.end);
            });
            requestService.refresh($scope.charts);
            $rootScope.targetSearch();
        });

        $scope.hourcheck = function () {
            $scope.hourcheckClass = true;
            $scope.dayClass = false;
            $scope.timeselect = false;
            $rootScope.interval = 1;
            $scope.weekcheckClass = false;
            $scope.mothcheckClass = false;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.bGap = false;//图表类型
            });
            if ($rootScope.start <= -7) {
                $scope.lastDaySelect = false;
                $scope.lastWeekSelect = false;
                $scope.clearCompareSelect = false;
            } else {
                $scope.lastDaySelect = true;
                $scope.lastWeekSelect = true;
                $scope.clearCompareSelect = true;
            }
            $rootScope.tableFormat = "hour";
            $rootScope.targetSearch();
            requestService.refresh($scope.charts);

        };
        $scope.daycheck = function () {
            $scope.dayClass = true;
            $scope.weekcheckClass = false;
            $scope.mothcheckClass = false;
            $scope.mothselected = true;
            $scope.hourcheckClass = false;
            $scope.timeselect = true;
            $scope.lastDaySelect = false;
            $scope.lastWeekSelect = false;
            $scope.clearCompareSelect = false;
            $rootScope.interval = -1;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.keyFormat == "day";
                e.config.noFormat = undefined;
            });
            $rootScope.tableFormat = "day";
            $rootScope.targetSearch();
            var config = $scope.charts[0].config;
            if (config.compare) {
                var times = [$rootScope.start - 1, $rootScope.end];
                if ($scope.compareType == 2) {
                    times = [$rootScope.start - 6, $rootScope.end - 7];
                }
                $scope.compare(times, "pv");
            } else {
                requestService.refresh($scope.charts);
            }
        };

        $scope.clear = function () {
            $scope.extendway.selected = undefined;
            $scope.city.selected = undefined;
            $scope.country.selected = undefined;
            $scope.continent.selected = undefined;
            $scope.souce.selected = undefined;
        };
        //604800000 week
        $scope.weekcheck = function () {
            $scope.weekcheckClass = true;
            $scope.hourcheckClass = false;
            $scope.mothcheckClass = false;
            $scope.dayClass = false;
            $rootScope.interval = 604800000;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.keyFormat = "week";
            });
            $rootScope.tableFormat = "week";
            $rootScope.targetSearch();
            requestService.refresh($scope.charts);

        };

        //2592000000 month
        $scope.mothcheck = function () {
            $scope.weekcheckClass = false;
            $scope.hourcheckClass = false;
            $scope.mothcheckClass = true;
            $scope.dayClass = false;
            $scope.mothselected = false;
            $rootScope.interval = 2592000000;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.noFormat = undefined;
                e.config.keyFormat = "month";
            });
            $rootScope.tableFormat = "month";
            $rootScope.targetSearch();
            requestService.refresh($scope.charts);
            $scope.dayClass = false;
            $scope.mothcheckClass = false;
        };
        //日历
        $rootScope.datepickerClick = function (start, end, label) {
            if ($scope.compareType) {
                $scope.compareReset();
            }
            var time = chartUtils.getTimeOffset(start, end);
            var offset = time[1] - time[0];
            $scope.reset();
            if (offset >= 31) {
                $scope.mothselected = false;
                $scope.weekselected = false;
            } else {
                if (offset >= 7) {
                    $scope.weekselected = false;
                } else {
                    $scope.weekselected = true;
                }
                $scope.mothselected = true;
            }
            $rootScope.start = time[0];
            $rootScope.end = time[1];
            $rootScope.interval = -1;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.time = chartUtils.getWeekTime($rootScope.start, $rootScope.end);
            })
            requestService.refresh($scope.charts);
            $rootScope.tableTimeStart = time[0];
            $rootScope.tableTimeEnd = time[1];
            $rootScope.targetSearch();
            $scope.$broadcast("ssh_dateShow_options_time_change");
        }
        $scope.cancelChecked = function () {
            $scope.isCancelYesterdayCompare = false;
            $scope.isCancelWeekCompare = false;
            //$(".specialCheckbox")[0].style.backgroundPosition = "0 0";
            //$(".specialCheckbox")[1].style.backgroundPosition = "0 0";
        }
        //前一日
        $scope.isCancelYesterdayCompare = false;
        $scope.isCancelWeekCompare = false;
        $scope.isShowCalendar = false;
        $scope.compareLastDay = function () {
            console.log("昨日");
            //if ($scope.isCancelYesterdayCompare == false) {
            //    $scope.isCancelWeekCompare = false;
            //    if (!$scope.todayCalendar) {
            //        $scope.todayCalendar = GetDateStr(0);
            //    }
            //    var todayCalendarArray = $scope.todayCalendar.split("-");
            //    var lastDate = todayCalendarArray[2] - 1;
            //    $scope.dayOrWeek = todayCalendarArray[0] + "-" + todayCalendarArray[1] + "-" + lastDate;
            //    $scope.isShowCalendar = true;
            //    $(".specialCheckbox")[0].style.backgroundPosition = "0 -" + 50 + "px";
            //    $(".specialCheckbox")[1].style.backgroundPosition = "0 0";
            //    $scope.isCancelYesterdayCompare = true;
            //
            //    //对比开始
            //    var _chart = $scope.charts[0];
            //    var type = [chartUtils.convertEnglish($scope.charts[0].config.legendData[0])];
            //    var times = [0, -1];
            //    if (_chart.config.compareCustom) {
            //        $scope.compare(times, type, false);
            //    } else {
            //        $scope.compare(times, type, true);
            //    }
            //} else {
            //
            //    $(".specialCheckbox")[0].style.backgroundPosition = "0 0";
            //    $scope.isShowCalendar = false;
            //    $scope.isCancelYesterdayCompare = false;
            //}
            //$scope.compareReset();
            //$scope.compareType = 1;
            //$scope.compareLastDayClass = true;
            //$scope.compareLastWeekClass = false;
            ////$scope.dayselect = true;
            ////$scope.dayClass = false;
            //$scope.hourcheckClass = true;
            //$scope.charts.forEach(function (e) {
            //    var chart = echarts.init(document.getElementById(e.config.id));
            //    e.config.instance = chart;
            //    e.config.legendAllowCheckCount = 1;
            //    e.config.legendDefaultChecked = undefined;
            //    e.types = [chartUtils.convertEnglish(e.config.legendData[0])];
            //    console.log(e.config.keyFormat);
            //    if (e.config.keyFormat == "hour" || e.config.keyFormat == "none") {
            //        e.config.chartType = "line";
            //    } else {
            //        e.config.chartType = "bar";
            //    }
            //    e.config.noFormat = "none";
            //    e.config.compare = true;
            //    util.renderLegend(chart, e.config);
            //    //Custom.initCheckInfo();
            //});
            //Custom.initCheckInfo();
            //var todayData = $http.get("api/charts?type=" + chartUtils.convertEnglish($scope.charts[0].config.legendData[0]) + "&dimension=period&start=" + $rootScope.start + "&end=" + $rootScope.end + "&userType=" + $rootScope.userType + "&int=" + $rootScope.interval);
            //var lastDayData = $http.get("api/charts?type=" + chartUtils.convertEnglish($scope.charts[0].config.legendData[0]) + "&dimension=period&start=" + ($rootScope.start - 1) + "&end=" + ( $rootScope.end - 1) + "&userType=" + $rootScope.userType + "&int=" + $rootScope.interval);
            //$q.all([todayData, lastDayData]).then(function (res) {
            //    var dateStamp = chartUtils.getDateStamp($rootScope.start);
            //    var final_result = chartUtils.compareTo(res, dateStamp);
            //    cf.renderChart(final_result, $scope.charts[0].config);
            //});

        }
        $scope.compareType = 1;
        //上周同期
        $scope.compareLastWeek = function () {
            console.log("上周");
            //if ($scope.compareType) {
            //    $scope.compareReset();
            //}
            //if ($scope.isCancelWeekCompare == false) {
            //    $scope.isCancelWeekCompare = true;
            //    $scope.isCancelYesterdayCompare = false;
            //    if (!$scope.todayCalendar) {
            //        $scope.todayCalendar = GetDateStr(0);
            //    }
            //    var todayCalendarArray = $scope.todayCalendar.split("-");
            //    var lastDate = todayCalendarArray[2] - 7;
            //    $scope.dayOrWeek = todayCalendarArray[0] + "-" + todayCalendarArray[1] + "-" + lastDate;
            //    $(".specialCheckbox")[1].style.backgroundPosition = "0 -" + 75 + "px";
            //    $(".specialCheckbox")[0].style.backgroundPosition = "0 0";
            //    $scope.dayOrWeek = GetDateStr(-6);
            //    $scope.isShowCalendar = true;
            //    $scope.compareType = 2;
            //    $scope.compareLastDayClass = false;
            //    $scope.compareLastWeekClass = true;
            //    //$scope.dayselect = true;
            //    //$scope.dayClass = false;
            //    $scope.hourcheckClass = true;
            //    $scope.charts.forEach(function (e) {
            //        var chart = echarts.init(document.getElementById(e.config.id));
            //        e.config.instance = chart;
            //        e.config.legendAllowCheckCount = 1;
            //        e.config.legendDefaultChecked = undefined;
            //        e.config.chartType = "line";
            //        e.types = [chartUtils.convertEnglish(e.config.legendData[0])];
            //        util.renderLegend(chart, e.config);
            //        //Custom.initCheckInfo();
            //    });
            //    Custom.initCheckInfo();
            //    var todayData = $http.get("api/charts?type=" + chartUtils.convertEnglish($scope.charts[0].config.legendData[0]) + "&dimension=period&start=" + ($rootScope.start - 7) + "&end=" + ($rootScope.end - 7) + "&userType=" + $rootScope.userType + "&int=" + $rootScope.interval);
            //    var lastDayData = $http.get("api/charts?type=" + chartUtils.convertEnglish($scope.charts[0].config.legendData[0]) + "&dimension=period&start=" + ($rootScope.start - 8) + "&end=" + ( $rootScope.end - 8) + "&userType=" + $rootScope.userType + "&int=" + $rootScope.interval);
            //    $q.all([todayData, lastDayData]).then(function (res) {
            //        var dateStamp = chartUtils.getDateStamp($rootScope.start - 7);
            //        var final_result = chartUtils.compareTo(res, dateStamp);
            //        $scope.charts[0].config.noFormat = "none";
            //        $scope.charts[0].config.compare = true;
            //        cf.renderChart(final_result, $scope.charts[0].config);
            //    });
            //} else {
            //    $scope.isCancelWeekCompare = false;
            //    $(".specialCheckbox")[1].style.backgroundPosition = "0 0";
            //    $scope.restCompare();
            //}
        }

        $scope.restCompare = function () {
            $scope.dayselect = false;
            $scope.dayClass = false;
            $scope.hourcheckClass = true;
            $scope.compareLastDayClass = false;
            $scope.compareLastWeekClass = false;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.chartType = "line";
                e.config.noFormat = "none";
                e.config.keyFormat = "day";
                e.config.legendAllowCheckCount = 2;
                e.config.legendDefaultChecked = [0, 1];
                e.config.compare = undefined;
                e.config.legendData = $scope.compareLegendData;
                e.types = [chartUtils.convertEnglish(e.config.legendData[0]), chartUtils.convertEnglish(e.config.legendData[1])];
                util.renderLegend(chart, e.config);
                Custom.initCheckInfo();
            });
            var refreshCompare = false;
            $("input[name='compareRadio']").each(function (i, o) {
                if ($(o).prev("span")) {
                    refreshCompare = true;
                }
            });
            if (refreshCompare) {
                requestService.refresh($scope.charts);
            }
        }
        $scope.myradio = function () {
            Custom.initCheckInfo();
        }
        $scope.compareType = false;
        $scope.datePickerCompare = function (start, end, label) {
            var time = chartUtils.getTimeOffset(start, end);
            var offset = time[1] - time[0];
            if (offset < 0) {
                alert("请选择正确的对比时间！");
                return;
            }
            if ($scope.charts[0].config.compare) {
                $scope.restCompare();
            }
            var times = chartUtils.getTimeOffset(start, end);
            // $scope.reset();
            $scope.hourselect = true;
            $scope.dayselect = true;
            $scope.mothselected = true;
            $scope.weekselected = true;
            $scope.choiceClass = true;
            $scope.dayClass = false;
            $scope.hourcheckClass = true;
            $rootScope.start = times[0];
            $rootScope.end = times[1];
            $rootScope.interval = -1;
            $(".time_select").hide();
            $scope.compareType = true;
            var type = [chartUtils.convertEnglish($scope.charts[0].config.legendData[0])];
            $scope.compare(times, type, true);
        }
        $scope.compare = function (times, type, legendRender) {
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.legendAllowCheckCount = 1;
                e.config.legendDefaultChecked = undefined;
                e.config.noFormat = true;
                e.config.bGap = false;
                e.config.noFormat = "none";
                e.config.compareCustom = true;
                e.types = type;
                if (legendRender) {
                    e.config.legendData = $scope.compareLegendData;
                    util.renderLegend(chart, e.config);
                    Custom.initCheckInfo();
                }
                var reqRequestStart = $http.get(e.url + "?type=" + e.types + "&dimension=" + e.dimension + "&start=" + times[0] + "&end=" + times[0] + "&userType=" + $rootScope.userType);
                var reqRequestEnd = $http.get(e.url + "?type=" + e.types + "&dimension=" + e.dimension + "&start=" + times[1] + "&end=" + times[1] + "&userType=" + $rootScope.userType);
                e.config.instance.showLoading({
                    text: "正在努力的读取数据中..."
                });
                $q.all([reqRequestStart, reqRequestEnd]).then(function (data) {
                    var final_result = [];
                    data.forEach(function (q) {
                        var json = JSON.parse(eval("(" + q.data + ")").toString());
                        json.forEach(function (item) {
                            if (item.key.length) {
                                var _timeBase = new Date(item.key[0]).Format("yyyy-MM-dd hh:mm:ss");
                                var _label = _timeBase.substring(0, 10) + ":" + chartUtils.convertChinese(item.label);
                                var _key = [];
                                item.key.forEach(function (k) {
                                    k = new Date(k).Format("yyyy-MM-dd hh:mm:ss");
                                    k = Number(k.toString().substring(10, 13));
                                    _key.push(k);
                                });
                                item.key = _key;
                                item.label = _label;
                            }
                        });
                        final_result.push(json[0]);
                    });
                    cf.renderChart(final_result, e.config);
                });
            });
        }
        $scope.resetC=function(){
            $(".time_select").show();
            $scope.compareType = false;
            // $scope.reset();
            $scope.choiceClass = false;
            $scope.dayselect = false;
            //$scope.hourselect = false;
            //$scope.hourcheckClass = false;
            //$scope.dayClass = true;
            $rootScope.interval = 1;
            $scope.date = "与其他时间段对比";
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.bGap = false;
                e.config.legendDefaultChecked = [0, 1];
                e.config.legendAllowCheckCount = 2;
                e.config.compareCustom = undefined;
                e.types = [chartUtils.convertEnglish(e.config.legendData[0]), chartUtils.convertEnglish(e.config.legendData[1])];
                util.renderLegend(chart, e.config);
                Custom.initCheckInfo();
            });
        }
        $scope.compareReset = function () {

            $(".time_select").show();
            $scope.compareType = false;
            // $scope.reset();
            $scope.choiceClass = false;
            $scope.dayselect = false;
            $scope.hourselect = false;
            $scope.hourcheckClass = false;
            $scope.dayClass = true;
            $rootScope.interval = 1;
            $scope.date = "与其他时间段对比";
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.bGap = false;
                e.config.legendDefaultChecked = [0, 1];
                e.config.legendAllowCheckCount = 2;
                e.config.compareCustom = undefined;
                e.types = [chartUtils.convertEnglish(e.config.legendData[0]), chartUtils.convertEnglish(e.config.legendData[1])];
                util.renderLegend(chart, e.config);
                Custom.initCheckInfo();
            });
            //requestService.refresh($scope.charts);
        }
        function GetDateStr(AddDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
            var y = dd.getFullYear();
            var m = dd.getMonth() + 1;//获取当前月份的日期
            var d = dd.getDate();
            return y + "-" + m + "-" + d;
        }

        //刷新
        $scope.page_refresh = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.tableTimeStart = 0;
            $rootScope.tableTimeEnd = 0;
            $scope.reloadByCalendar("today");
//            $scope.charts.forEach(function (e) {
//                var chart = echarts.init(document.getElementById(e.config.id));
//                e.config.instance = chart;
//            });
//            //图表
//            requestService.refresh($scope.charts);
//            $scope.reloadByCalendar("today");
            $('#reportrange span').html(GetDateStr(0));
            //首页表格
            //requestService.gridRefresh(scope.grids);
            //其他页面表格
//            $rootScope.targetSearch(true);
//            $scope.$broadcast("ssh_dateShow_options_time_change");
            //classcurrent
            $scope.reset();
            $scope.todayClass = true;
        };
    });
});
