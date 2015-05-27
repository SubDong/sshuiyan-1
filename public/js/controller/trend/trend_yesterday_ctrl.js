/**
 * Created by john on 2015/4/3.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('trend_yesterday_ctrl', function ($scope, $rootScope, $q, $http, requestService, messageService, areaService, uiGridConstants) {
        $scope.yesterdayClass = true;
        $scope.hourcheckClass = true;
        $scope.lastDaySelect = true;
        $scope.lastWeekSelect = true;
        $scope.clearCompareSelect = true;
        $scope.reset = function () {
            $scope.todayClass = false;
            $scope.yesterdayClass = false;
            $scope.sevenDayClass = false;
            $scope.monthClass = false;
            $scope.definClass = false;
            $scope.hourcheckClass = false;
        };

        //table配置
        $rootScope.tableTimeStart = -1;
        $rootScope.tableTimeEnd = -1;
        $rootScope.tableFormat = "hour";
        //配置默认指标
        $rootScope.checkedArray = ["pv", "uv", "ip", "outRate", "avgTime"];
        $rootScope.gridArray = [
            {name: "xl", displayName: "", cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",maxWidth: 10},
            {name: "日期", displayName: "日期", field: "period"},
            {name: "浏览量(PV)", displayName: "浏览量(PV)", field: "pv"},
            {name: "访客数(UV)", displayName: "访客数(UV)", field: "uv"},
            {name: "IP数", displayName: "IP数", field: "ip"},
            {name: "跳出率", displayName: "跳出率", field: "outRate"},
            {name: "平均访问时长", displayName: "平均访问时长", field: "avgTime"}
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
                var todayData = $http.get("api/charts?type=" + checkedVal + "&dimension=period&start=" + time + "&end=" + $rootScope.end + "&userType=" + $rootScope.userType + "&int=" + $rootScope.interval);
                var lastDayData = $http.get("api/charts?type=" + checkedVal + "&dimension=period&start=" + (time - 1) + "&end=" + ( $rootScope.end - 1) + "&userType=" + $rootScope.userType + "&int=" + $rootScope.interval);
                $q.all([todayData, lastDayData]).then(function (res) {
                    var final_result = chartUtils.compareTo(res, $scope.compareArray);
                    $scope.charts[0].config.noFormat = "none";
                    $scope.charts[0].config.compare = true;
                    cf.renderChart(final_result, $scope.charts[0].config);
                });
            } else {
                clear.lineChart($scope.charts[0].config, checkedVal);
                $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
                $scope.charts[0].types = checkedVal;
                var chartarray = [$scope.charts[0]];
                requestService.refresh(chartarray);
            }
        }
        $scope.yesterDayFormat = function (data, config, e) {
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
                        chartUtils.addStep(json, 24);
                        chartUtils.noFormatConvertLabel(json);
                        cf.renderChart(json, config);
                    } else {
                        config["noFormat"] = undefined;
                        config["chartType"] = "line";//图表类型
                        chartUtils.getXType(config, $rootScope.interval);
                        cf.renderChart(data, config);
                    }
                } else {
                    config["noFormat"] = undefined;
                    config["chartType"] = "line";//图表类型
                    chartUtils.getXType(config, $rootScope.interval);
                    cf.renderChart(data, config);
                }
            }
        }
        $scope.charts = [
            {
                config: {
                    legendId: "yesterday_charts_legend",
                    legendAllowCheckCount: 2,
                    legendClickListener: $scope.onLegendClickListener,
                    legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "新访客数", "新访客比率", "IP数", "跳出率", "平均访问时长", "平均访问页数", "转化次数", "转化率"],//显示几种数据
                    legendDefaultChecked: [0, 1],
                    id: "yesterday_charts",
                    min_max: false,
                    bGap: false,//首行缩进
                    chartType: "line",//图表类型
                    dataKey: "key",//传入数据的key值
                    dataValue: "quota"//传入数据的value值

                },
                types: ["pv", "uv"],
                dimension: ["period"],
                interval: $rootScope.interval,
                url: "/api/charts",
                cb: $scope.yesterDayFormat
            }];

        $scope.init = function () {
            $rootScope.start = -1;
            $rootScope.end = -1;
            $rootScope.interval = 1;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                util.renderLegend(chart, e.config);
            })
            requestService.refresh($scope.charts);
        }
        $scope.init();
        $scope.$on("ssh_refresh_charts", function (e, msg) {
            if ($scope.charts[0].config.compare) {
                if ($rootScope.start > -7) {
                    $scope.start--;
                    $scope.end--
                    if ($scope.compareType == 1) {
                        $scope.compareLastDay();
                    } else {
                        $scope.compareLastWeek();
                    }
                } else {
                    $scope.restCompare();
                }
                return;
            }
            if ($rootScope.start > -7 && $scope.charts[0].config.keyFormat == "week") {
                $rootScope.interval = -1;
            }
            if ($rootScope.interval == -1) {
                $scope.lastDaySelect = false;
                $scope.lastWeekSelect = false;
                $scope.clearCompareSelect = false;
            }
            $scope.charts.forEach(function (chart) {
                chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            });
            requestService.refresh($scope.charts);
            if ($rootScope.start <= -7) {
                $rootScope.tableFormat = "day";
            } else {
                $rootScope.tableFormat = "hour";
            }
            $rootScope.targetSearch();
        });

        $scope.hourcheck = function () {
            $scope.hourcheckClass = true;
            $scope.dayClass = false;
            $scope.timeselect = false;
            $scope.weekcheckClass = false;
            $scope.mothcheckClass = false;
            $rootScope.interval = 1;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
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
                e.config.noFormat = undefined;
            });
            if ($rootScope.start <= -7) {
                $rootScope.tableFormat = "day";
            } else {
                $rootScope.tableFormat = "hour";
            }
            $rootScope.targetSearch();
            requestService.refresh($scope.charts);
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
                e.config.noFormat = undefined;
            });
            $rootScope.tableFormat = "week";
            $rootScope.targetSearch();
            $scope.charts[0].config.keyFormat = "week";
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
            });
            $rootScope.tableFormat = "month";
            $rootScope.targetSearch();
            $scope.charts[0].config.keyFormat = "month";
            requestService.refresh($scope.charts);
            $scope.dayClass = false;
            $scope.mothcheckClass = false;
        };
        //日历
        $rootScope.datepickerClick = function (start, end, label) {
            var time = chartUtils.getTimeOffset(start, end);
            var offest = time[1] - time[0];
            $scope.reset();
            if (offest >= 31) {
                $scope.mothselected = false;
                $scope.weekselected = false;
            } else {
                if (offest >= 7) {
                    $scope.weekselected = false;
                } else {
                    $scope.weekselected = true;
                }
                $scope.mothselected = true;
            }
            $rootScope.start = time[0];
            $rootScope.end = time[1];
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
            });
            requestService.refresh($scope.charts);
            $rootScope.tableTimeStart = time[0];
            $rootScope.tableTimeEnd = time[1];
            $rootScope.targetSearch();
            $scope.$broadcast("ssh_dateShow_options_time_change");
        }
        //前一日
        $scope.compareLastDay = function () {
            $scope.compareType = 1;
            $scope.compareLastDayClass = true;
            $scope.compareLastWeekClass = false;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.legendAllowCheckCount = 1;
                e.config.legendDefaultChecked = undefined;
                e.types = [chartUtils.convertEnglish(e.config.legendData[0])];
                util.renderLegend(chart, e.config);
            });
            Custom.initCheckInfo();
            var todayData = $http.get("api/charts?type=" + chartUtils.convertEnglish($scope.charts[0].config.legendData[0]) + "&dimension=period&start=" + $rootScope.start + "&end=" + $rootScope.end + "&userType=" + $rootScope.userType + "&int=" + $rootScope.interval);
            var lastDayData = $http.get("api/charts?type=" + chartUtils.convertEnglish($scope.charts[0].config.legendData[0]) + "&dimension=period&start=" + ($rootScope.start - 1) + "&end=" + ( $rootScope.end - 1) + "&userType=" + $rootScope.userType + "&int=" + $rootScope.interval);
            $q.all([todayData, lastDayData]).then(function (res) {
                var dateStamp = chartUtils.getDateStamp($rootScope.start);
                var final_result = chartUtils.compareTo(res, dateStamp);
                $scope.charts[0].config.noFormat = "none";
                $scope.charts[0].config.compare = true;
                cf.renderChart(final_result, $scope.charts[0].config);
            });

        }
        $scope.compareType = 1;
//上周同期
        $scope.compareLastWeek = function () {
            $scope.compareType = 2;
            $scope.compareArray = ["上周今日", "上周昨日"];
            $scope.compareLastDayClass = false;
            $scope.compareLastWeekClass = true;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.legendAllowCheckCount = 1;
                e.config.legendDefaultChecked = undefined;
                e.types = [chartUtils.convertEnglish(e.config.legendData[0])];
                util.renderLegend(chart, e.config);
            });
            Custom.initCheckInfo();
            var todayData = $http.get("api/charts?type=" + chartUtils.convertEnglish($scope.charts[0].config.legendData[0]) + "&dimension=period&start=" + ($rootScope.start - 7) + "&end=" + ($rootScope.end - 7) + "&userType=" + $rootScope.userType + "&int=" + $rootScope.interval);
            var lastDayData = $http.get("api/charts?type=" + chartUtils.convertEnglish($scope.charts[0].config.legendData[0]) + "&dimension=period&start=" + ($rootScope.start - 8) + "&end=" + ( $rootScope.end - 8) + "&userType=" + $rootScope.userType + "&int=" + $rootScope.interval);
            $q.all([todayData, lastDayData]).then(function (res) {
                var dateStamp = chartUtils.getDateStamp($rootScope.start - 7);
                var final_result = chartUtils.compareTo(res, dateStamp);
                $scope.charts[0].config.noFormat = "none";
                $scope.charts[0].config.compare = true;
                cf.renderChart(final_result, $scope.charts[0].config);
            });
        }
        $scope.restCompare = function () {
            $scope.dayselect = false;
            $scope.dayClass = false;
            $scope.hourcheckClass = true;
            $scope.compareLastDayClass = false;
            $scope.compareLastWeekClass = false;
            $scope.charts[0].config.legendAllowCheckCount = 2;
            $scope.charts[0].config.legendDefaultChecked = [0, 1];
            $scope.charts[0].config.compare = undefined;
            $scope.charts[0].types = [chartUtils.convertEnglish($scope.charts[0].config.legendData[0]), chartUtils.convertEnglish($scope.charts[0].config.legendData[1])];
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                util.renderLegend(chart, e.config);
            })
            requestService.refresh($scope.charts);
            Custom.initCheckInfo();
        }

    });

    ctrs.controller('todaydefine', function ($scope, $http, requestService, messageService) {
        $scope.gridOptions = {
            enableScrollbars: false,
            enableGridMenu: true,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            columnDefs: [
                {name: 'date', displayName: "日期"},
                {name: 'number', displayName: "访问次数"},
                {name: 'uv', displayName: "uv"},
                {name: 'ratio', displayName: "新访客比率"}
            ]
        };
        $scope.Todytable = function (type) {
            requestService.request(option, $scope.lineChartConfig);
            //requestService.request("Realtime_charts", $scope.startTime, $scope.endTime, option, $scope.lineChartConfig);
        };
    });

    ctrs.controller('todayfilter', function ($scope, $http, requestService, messageService) {
        $scope.gridOptions = {
            enableScrollbars: false,
            enableGridMenu: true,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            columnDefs: [
                {name: 'date', displayName: "日期"},
                {name: 'number', displayName: "访问次数"},
                {name: 'uv', displayName: "uv"},
                {name: 'ratio', displayName: "新访客比率"}
            ]
        };
        $scope.Todytable = function (type) {
            requestService.request(option, $scope.lineChartConfig);

        };

    })

});
