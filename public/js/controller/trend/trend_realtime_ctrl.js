/**
 * Created by baizz on 2015-4-3.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('trend_realtime_ctrl', function ($scope, $rootScope, $http, requestService, messageService, $log, areaService, SEM_API_URL) {
        $scope.visitorCount = 0;
        //table配置
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        $rootScope.checkedArray = 'SS';
        $rootScope.tableFormat = null;
        $scope.souce.selected = {"name": "全部"};
        $scope.browser.selected = {"name": "全部"};
        $scope.city.selected = {"name": "全部"};
        //        高级搜索提示
        $scope.sourceSearch = "";
        $scope.terminalSearch = "";
        $scope.areaSearch = "";
//        取消显示的高级搜索的条件
        $scope.removeSourceSearch = function (obj) {
            $scope.souce.selected = {"name": "全部"};
            $rootScope.$broadcast("loadAllSource");
            obj.sourceSearch = "";
        }
        $scope.removeTerminalSearch = function (obj) {
            $rootScope.$broadcast("loadAllTerminal");
            obj.terminalSearch = "";
        }
        $scope.removeAreaSearch = function (obj) {
            $scope.city.selected = {"name": "全部"};
            $rootScope.$broadcast("loadAllArea");
            obj.areaSearch = "";
        }
        $rootScope.tableSwitch = {
            dimen: true,
            latitude: {name: "地域", displayName: "地域", field: "region"},
            tableFilter: null,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 0,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: false,
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false //是否清空指标array
        };
        $scope.getTableHeight = function () {
            var rowHeight = 30; // your row height
            var headerHeight = 30; // your header height
            return {
                height: ($scope.gridData.data.length * rowHeight + headerHeight) + "px"
            };
        };

        //
        $scope.onLegendClickListener = function (radio, chartObj, chartConfig, checkedVal) {
            clear.lineChart($scope.charts[0].config, checkedVal);
            $scope.charts.forEach(function (chart) {
                chart.types = checkedVal;
                chart.config.instance = echarts.init(document.getElementById(chart.config.id))
            })
            requestService.refresh($scope.charts);
        }

        $scope.realTimeFormat = function (data, config, e) {
            var final_result = [];
            if (data != "[]") {
                var json = JSON.parse(eval("(" + data + ")").toString());
                var result = json[0].result;
                e.types.forEach(function (qtype) {
                    switch (qtype) {
                        case "pv":
                            var _key = [];
                            var _quota = [];
                            result.buckets.forEach(function (e) {
                                _key.push(new Date(e.key).Format("yyyy-MM-dd hh:mm:ss").substring(10, 16));
                                _quota.push(e.pv_aggs.value);
                            });
                            final_result.push({label: chartUtils.convertChinese('pv'), key: _key, quota: _quota})
                            break;
                        case "uv":
                            var _key = [];
                            var _quota = [];
                            result.buckets.forEach(function (e) {
                                _key.push(new Date(e.key).Format("yyyy-MM-dd hh:mm:ss").substring(10, 16));
                                _quota.push(e.uv_aggs.value);
                            });
                            final_result.push({label: chartUtils.convertChinese('uv'), key: _key, quota: _quota})
                            break;
                        case "ip":
                            var _key = [];
                            var _quota = [];
                            result.buckets.forEach(function (e) {
                                _key.push(new Date(e.key).Format("yyyy-MM-dd hh:mm:ss").substring(10, 16));
                                _quota.push(e.ip_aggs.value);
                            });
                            final_result.push({label: chartUtils.convertChinese('ip'), key: _key, quota: _quota})
                            break;
                    }
                });
            }
            config["noFormat"] = "noFormat";
            config["twoYz"] = "twoYz";
            cf.renderChart(final_result, config);
            //$scope.initPeron();
        }
        $scope.initPeron = function () {
            $http.get("api/halfhour?userType=" + $rootScope.userType + "&type=uv&start=0&end=0&dimension=period").success(function (data) {
                var count = 0;
                if (data != "[]") {
                    var json = JSON.parse(eval("(" + data + ")").toString());
                    var result = json[0].result;
                    if (result) {
                        if (result.buckets) {
                            if (result.buckets.length > 0) {
                                result.buckets.forEach(function (e) {
                                    count += Number(e.uv_aggs.value);
                                });
                            }
                        }
                    }
                }
                $scope.visitorCount = count;
            });
        }
        $scope.initPeron();
        $scope.charts = [
            {
                config: {
                    legendData: ["浏览量(PV)", "访客数(UV)", "IP数"],
                    legendId: "realtime_charts_legend",
                    legendAllowCheckCount: 2,
                    legendClickListener: $scope.onLegendClickListener,
                    legendDefaultChecked: [0, 1],
                    //显示几种数据
                    id: "realtime_charts",
                    //min_max: false,
                    bGap: false,//首行缩进
                    chartType: "line",//图表类型
                    half: true,
                    keyFormat: 'none',
                    dataKey: "key",//传入数据的key值
                    dataValue: "quota"//传入数据的value值
                },
                types: ["pv", "uv"],
                dimension: ["period"],
                interval: $rootScope.interval,
                url: "/api/halfhour",
                cb: $scope.realTimeFormat
            }];

        $scope.init = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.interval = undefined;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                util.renderLegend(chart, e.config);
            })
            //requestService.initCharts($scope.charts);
            requestService.refresh($scope.charts);
            Custom.initCheckInfo();
        }
        $scope.init();
        /*    $scope.search = function (keyword, time, ip) {
         requestService.gridRequest($scope.startTime, $scope.endTime, $scope.gridOptions, "uv");
         };*/
        $scope.calTimePeriod = function () {
            $scope.endTime = new Date().valueOf();
            $scope.startTime = $scope.endTime - 30 * 60 * 1000;
        };
        // initialize
        $scope.calTimePeriod();
        $scope.disabled = undefined;
        $scope.enable = function () {
            $scope.disabled = false;
        };

        $scope.disable = function () {
            $scope.disabled = true;
        };

        $scope.clear = function () {
            $scope.city.selected = undefined;
            $scope.country.selected = undefined;
            $scope.souce.selected = undefined;
        };
        //刷新
        $scope.page_refresh = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.tableTimeStart = 0;
            $rootScope.tableTimeEnd = 0;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
            });
            //图表
            requestService.refresh($scope.charts);
            //其他页面表格
            $rootScope.targetSearch(true);
            //classcurrent
//                $scope.reset();
//                $scope.todayClass = true;
        };
    });

});
