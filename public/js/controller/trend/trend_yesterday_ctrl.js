/**
 * Created by john on 2015/4/3.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('trend_yesterday_ctrl', function ($scope, $rootScope, $http, requestService, messageService, areaService, uiGridConstants) {
        $scope.yesterdayClass = true;
        $scope.dayClass = true,
        //table配置
        $rootScope.tableTimeStart = -1;
        $rootScope.tableTimeEnd = -1;
        $rootScope.tableFormat = "hour";
        //配置默认指标
        $rootScope.checkedArray = ["pv", "uv", "ip", "outRate", "avgTime"];
        $rootScope.gridArray = [
            {name: "日期", displayName: "日期", field: "period"},
            {
                name: " ",
                cellTemplate: "<div class='table_box'><button onclick='getMyButton(this)' class='table_nextbtn'></button><div class='table_win'><ul><li><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' target='_blank'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看来源分布</a></li></ul></div></div>"
            },
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
            clear.lineChart($scope.charts[0].config, checkedVal);
            $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
            $scope.charts[0].types = checkedVal;
            var chartarray = [$scope.charts[0]];
            requestService.refresh(chartarray);
        }
        $scope.yesterDayFormat = function (data, config, e) {
            if (e.interval == 1) {
                var final_result = chartUtils.getByHourByDayData(data);
                config["noFormat"] = "noFormat";
                config["keyFormat"] = "none";
                cf.renderChart(final_result, config);
            } else {
                cf.renderChart(data, config);
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
            $rootScope.interval = undefined;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                if ($rootScope.start <= -7) {
                    e.config.keyFormat = "day";
                } else {
                    e.config.keyFormat = "hour";
                }
                util.renderLegend(chart, e.config);
            })
            $rootScope.start = -1;
            $rootScope.end = -1;
            $rootScope.interval = 24;
            requestService.refresh($scope.charts);
        }
        $scope.init();

        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $rootScope.targetSearch();
            $scope.charts.forEach(function (chart) {
                chart.config.instance = echarts.init(document.getElementById(chart.config.id));
                //chart.config.keyFormat = $rootScope.keyFormat;
                if ($rootScope.start <= -7) {
                    chart.config.keyFormat = "day";
                } else {
                    chart.config.keyFormat = "hour";
                }
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
            $scope.dayClass = false;
            $scope.hourcheckClass = true;
            $scope.timeselect = false;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.interval = 1;
                if ($rootScope.start <= -7) {
                    e.config.keyFormat = "day";
                } else {
                    e.config.keyFormat = "hour";
                }
            });
            $rootScope.tableFormat = "hour";
            $rootScope.targetSearch();
            requestService.refresh($scope.charts);

        };
        $scope.daycheck = function () {
            $scope.hourcheckClass = false;
            $scope.dayClass = true;
            $scope.timeselect = true;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.interval = undefined;
                e.config.noFormat = undefined;
                if ($rootScope.start <= -7) {
                    e.config.keyFormat = "day";
                } else {
                    e.config.keyFormat = "hour";
                }
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
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.interval = 604800000;
                e.config.noFormat = undefined;
            });
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
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.interval = 2592000000;
                e.config.noFormat = undefined;
            });
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
            })
            if ($rootScope.start <= -1) {
                $scope.charts[0].config.keyFormat = "day";
            } else {
                $scope.charts[0].config.keyFormat = "hour";
            }
            requestService.refresh($scope.charts);
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
