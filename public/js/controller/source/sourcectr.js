/**
 * Created by XiaoWei on 2015/4/13.
 */
define(["./module"], function(ctrls) {

    'use strict';

    ctrls.controller("sourcectr", function ($scope, $rootScope, $http, requestService, areaService, messageService, uiGridConstants) {
        $scope.todayClass = true;

        //table 参数配置
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        $rootScope.tableFormat = null;
        //配置默认指标
        $rootScope.checkedArray = ["vc", "nuvRate", "ip"];
        $rootScope.gridArray = [
            {name: "xl", displayName: "序列号", cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",maxWidth:70},
            {name: "来源类型", displayName: "来源类型", field: "rf_type"},
            {
                name: " ",
                cellTemplate: "<div class='table_box'><button onmousemove='getMyButton(this)' class='table_btn'></button><div class='table_win'><ul style='color: #45b1ec'><li><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' target='_blank'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看来源分布</a></li></ul></div></div>"
            },
            {name: "访问次数", displayName: "访问次数", field: "vc"},
            {name: "新访客比率", displayName: "新访客比率", field: "nuvRate"},
            {name: "IP数", displayName: "IP数", field: "ip"}
        ];
        $rootScope.tableSwitch = {
            latitude: {name: "来源类型", displayName: "来源类型", field: "rf_type"},
            tableFilter: null,
            dimen: "rf_type",
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 2,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: "<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>",
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false //是否清空指标array
        };


        $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
            clear.lineChart(config, checkedVal);
            $scope.charts.forEach(function (chart) {
                chart.config.instance = echarts.init(document.getElementById(chart.config.id));
                chart.types = checkedVal;
            })
            requestService.refresh($scope.charts);
        }
        $scope.pieFormat = function (data, config) {
            var json = JSON.parse(eval("(" + data + ")").toString());
            var tmpData = [];
            json.forEach(function (e) {
                e.key.forEach(function (item) {
                    tmpData.push(chartUtils.getLinked(item));
                });
                e.key = tmpData;
            });
            cf.renderChart(json, config);
        }
        $scope.customFormat = function (data, config, e) {
            var json = JSON.parse(eval("(" + data + ")").toString());
            var result = chartUtils.getRf_type(json, $rootScope.start, null, e.types);
            config['noFormat'] = true;
            config['twoYz'] = "none";
            cf.renderChart(result, config);
        }
        $scope.charts = [
            {
                config: {
                    legendData: ["外部链接", "搜索引擎", "直接访问"],
                    id: "sourse_charts",
                    pieStyle: true,
                    serieName: "访问情况",
                    chartType: "pie",
                    dataKey: "key",
                    dataValue: "quota"
                },
                types: ["pv"],
                dimension: ["rf_type"],
                url: "/api/map",
                cb: $scope.pieFormat
            },
            {
                config: {
                    legendId: "source_charts_legend",
                    legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "新访客数", "IP数", "页面转化", "订单数", "订单金额", "订单转化率"],
                    legendClickListener: $scope.onLegendClick,
                    legendAllowCheckCount: 1,
                    id: "indicators_charts",
                    min_max: false,
                    bGap: true,
                    chartType: "bar",
                    keyFormat: "none",
                    dataKey: "key",
                    dataValue: "quota"
                },
                types: ["pv"],
                dimension: ["period,rf_type"],
                interval: $rootScope.interval,
                url: "/api/charts",
                cb: $scope.customFormat
            }
        ];
        $scope.init = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.interval = undefined;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                util.renderLegend(chart, e.config);
            })
            requestService.refresh($scope.charts);
        }
        $scope.init();

        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $rootScope.targetSearch();
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
            })
            requestService.refresh($scope.charts);
        });

        $scope.disabled = undefined;
        $scope.enable = function () {
            $scope.disabled = false;
        };
        $scope.disable = function () {
            $scope.disabled = true;
        };
        $scope.clear = function () {
            $scope.extendway.selected = undefined;
        };
        //日历
        $scope.dateClosed = function () {
            $rootScope.start = $scope.startOffset;
            $rootScope.end = $scope.endOffset;
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
            $rootScope.targetSearch();
            $rootScope.tableTimeStart = $scope.startOffset;
            $rootScope.tableTimeEnd = $scope.endOffset;
            $scope.$broadcast("ssh_dateShow_options_time_change");
        };
        //日历
        $rootScope.datepickerClick = function (start, end, label) {
            var time = chartUtils.getTimeOffset(start, end);
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
            $rootScope.targetSearch();
            $rootScope.tableTimeStart = time[0];
            $rootScope.tableTimeEnd = time[1];
            $scope.$broadcast("ssh_dateShow_options_time_change");
        }
    });

});
