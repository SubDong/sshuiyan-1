/**
 * Created by yousheng on 15/3/26.
 */

define(['./module'], function (ctrs) {
    'use strict';

    ctrs.controller("indexctr", ['$scope', '$rootScope', '$http', 'requestService', 'messageService', 'areaService', function ($scope, $rootScope, $http, requestService, messageService, areaService) {
        $scope.todayClass = true;
        $scope.hourcheckClass = true;
        $scope.reset = function () {
            $scope.definClass = false;
        };
        $scope.gridOptions = {
            enableColumnMenus: false,
            enableSorting: true,
            enableScrollbars: false,
            enableGridMenu: false,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            columnDefs: [
                {name: 'name', displayName: "关键词"},
                {name: 'value', displayName: "浏览量(PV)"}
            ]
        };
        $scope.onLegendClickListener = function (radio, chartObj, chartConfig, checkedVal) {
            clear.lineChart($scope.charts[0].config, checkedVal);
            $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
            $scope.charts[0].types = checkedVal;
            var chartArray = [$scope.charts[0]];
            requestService.refresh(chartArray);

        }
        $scope.pieFormat = function (data, config) {
            var json = JSON.parse(eval("(" + data + ")").toString());
            var tmpData = [];
            json.forEach(function (e) {
                e.key.forEach(function (item) {
                    tmpData.push(chartUtils.getDevice(item));
                });
                e.key = tmpData;
            });
            cf.renderChart(json, config);
        }
        $scope.indexLineFormat = function (data, config, e) {
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
                        chartUtils.getXType(config, $rootScope.interval, $rootScope.start);
                        config["chartType"] = "bar";//图表类型
                        chartUtils.addStep(json, 24);
                        chartUtils.noFormatConvertLabel(json);
                        cf.renderChart(json, config);
                    } else {
                        config["noFormat"] = undefined;
                        config["chartType"] = "line";//图表类型
                        chartUtils.getXType(config, $rootScope.interval, $rootScope.start);
                        cf.renderChart(data, config);
                    }
                } else {
                    config["noFormat"] = undefined;
                    config["chartType"] = "line";//图表类型
                    chartUtils.getXType(config, $rootScope.interval, $rootScope.start);
                    cf.renderChart(data, config);
                }
            }
        }
        $scope.charts = [
            {
                config: {
                    legendId: "index_charts_legend",
                    legendData: ["浏览量(PV)", "访客数(UV)", "跳出率", "抵达率", "平均访问时长", "页面转化"],//显示几种数据
                    legendAllowCheckCount: 2,
                    legendClickListener: $scope.onLegendClickListener,
                    legendDefaultChecked: [0, 1],
                    id: "index_charts",
                    bGap: false,//首行缩进
                    min_max: false,
                    chartType: "line",//图表类型
                    dataKey: "key",//传入数据的key值
                    dataValue: "quota"//传入数据的value值
                },
                types: ["pv", "uv"],
                dimension: ["period"],
                interval: $rootScope.interval,
                url: "/api/charts",
                cb: $scope.indexLineFormat
            },
            {
                config: {
                    min_max: false,//是否显示最大，最小值
                    legendData: [],
                    id: "gest_map",
                    bGap: true,
                    chartType: "bar",
                    auotHidex: true,
                    dataKey: "key",
                    keyFormat: 'none',
                    dataValue: "quota"
                },
                types: ["pv"],
                dimension: ["region"],
                url: "/api/map"
            },
            {
                config: {
                    legendData: ["移动", "PC"],
                    chartType: "pie",
                    id: "environment_map",
                    serieName: "所占比例",
                    dataKey: "key",
                    dataValue: "quota"
                },
                types: ["pv"],
                dimension: ["pm"],
                url: "/api/pie",
                cb: $scope.pieFormat
            }
        ];
        $scope.grids = [
            {
                config: {
                    gridOptions: $scope.gridOptions
                },
                types: ["pv"],
                dimension: ["kw"],
                url: "/api/pie"
            }
        ]
        $scope.init = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.interval = 1;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                util.renderLegend(chart, e.config);
            })
            requestService.refresh($scope.charts);
            requestService.gridRefresh($scope.grids);
        }
        $scope.init();

        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $scope.charts.forEach(function (chart) {
                chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            });
            requestService.refresh($scope.charts);
            requestService.gridRefresh($scope.grids);
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
            requestService.refresh($scope.charts);

        };
        $scope.daycheck = function () {
            $scope.dayClass = true;
            $scope.weekcheckClass = false;
            $scope.mothcheckClass = false;
            $scope.mothselected = true;
            $scope.hourcheckClass = false;
            $scope.timeselect = true;
            $rootScope.interval = -1;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.noFormat = undefined;
            });
            requestService.refresh($scope.charts);
        };
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
            $scope.charts[0].config.keyFormat = "week";
            requestService.refresh($scope.charts);

        };
        //604800000 week
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
            $scope.charts[0].config.keyFormat = "month";
            requestService.refresh($scope.charts);
            $scope.dayClass = false;
            $scope.mothcheckClass = false;
        };

        //下拉框
        $scope.mapChange = function (_this) {
            $scope.charts[1].types = _this.value;
            $scope.charts[1].config.instance = echarts.init(document.getElementById($scope.charts[1].config.id));
            var chartArray = [$scope.charts[1]];
            requestService.refresh(chartArray);
        }
        $scope.equipmentChange = function (_this) {
            $scope.charts[2].types = _this.value;
            var chartArray = [$scope.charts[2]];
            requestService.refresh(chartArray);
        }
        $scope.searchChange = function (_this) {
            $scope.grids[0].types = _this.value;
            $scope.gridOptions.columnDefs[1].displayName = _this.name;
            var chartArray = [$scope.grids[0]];
            requestService.gridRefresh(chartArray);
        }

        //index select
        $scope.disabled = undefined;
        $scope.enable = function () {
            $scope.disabled = false;
        };
        $scope.disable = function () {
            $scope.disabled = true;
        };
        $scope.clear = function () {
            $scope.country.selected = undefined;
            $scope.continent.selected = undefined;
        }
        $scope.continent = {};
        $scope.country = {};
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
            requestService.gridRefresh($scope.grids);

        }
    }])

})

