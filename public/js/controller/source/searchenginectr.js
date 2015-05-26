/**
 * Created by XiaoWei on 2015/4/22.
 */
define(["./module"], function(ctrs) {
    "use strict";
    ctrs.controller("searchenginectr", function ($scope, $rootScope, $http, requestService, messageService, areaService, uiGridConstants) {
        $scope.todayClass = true;
        //table配置
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        $rootScope.tableFormat = null;
        //配置默认指标
        $rootScope.checkedArray = ["vc", "uv", "nuvRate", "avgPage", "ip"];
        $rootScope.gridArray = [
            {name: "xl", displayName: "序列号", cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",maxWidth:70},
            {name: "搜索引擎", displayName: "搜索引擎", field: "se"},
            {
                name: " ",
                cellTemplate: "<div class='table_box'><button onmousemove='getMyButton(this)' class='table_btn'></button><div class='table_win'><ul style='color: #45b1ec'><li><a ui-sref='history5' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' target='_blank'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看来源分布</a></li></ul></div></div>"
            },
            {name: "访问次数", displayName: "访问次数", field: "vc"},
            {name: "访客数(UV)", displayName: "访客数(UV)", field: "uv"},
            {name: "新访客比率", displayName: "新访客比率", field: "nuvRate"},
            {name: "平均访问页数", displayName: "平均访问页数", field: "avgPage"},
            {name: "IP数", displayName: "IP数", field: "ip"}
        ];
        $rootScope.tableSwitch = {
            latitude: {name: "搜索引擎", displayName: "搜索引擎", field: "se"},
            tableFilter: "[{\"rf_type\": [\"2\"]}]",
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 2,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: "<li><a ui-sref='history5' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' target='_blank'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>",
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false, //是否清空指标array
            isJudge: false //是否清空filter 默认为清空
        };


        $scope.pieFormat = function (data, config) {
            var json = JSON.parse(eval("(" + data + ")").toString());
            cf.renderChart(json, config);
        }
        $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
            clear.lineChart(config, checkedVal);
            $scope.charts.forEach(function (chart) {
                chart.config.instance = echarts.init(document.getElementById(chart.config.id));
                chart.types = checkedVal;
            });
            requestService.refresh($scope.charts);
        }
        $scope.searchengineFormat = function (data, config, e) {
            var json = JSON.parse(eval("(" + data + ")").toString());
            var result_json = chartUtils.getRf_type(json, $rootScope.start, "serverLabel", e.types);
            config['noFormat'] = true;
            config['twoYz'] = "none"
            cf.renderChart(result_json, config);
            //var pieData = chartUtils.getEnginePie(final_result);
            //$scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
            //cf.renderChart(pieData, $scope.charts[0].config);

        }
        $scope.charts = [{
            config: {
                legendData: [],
                id: "sourse_charts",
                pieStyle: true,
                serieName: "搜索引擎",
                chartType: "pie",
                dataKey: "key",
                dataValue: "quota"
            },
            types: ["pv"],
            dimension: ["se"],
            filter: "[{\"rf_type\":[\"2\"]}]",
            url: "/api/map",
            cb: $scope.pieFormat
        },
            {
                config: {
                    legendId: "indicators_charts_legend",
                    legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "新访客数", "IP数", "页面转化", "订单数", "订单金额", "订单转化率"],
                    legendClickListener: $scope.onLegendClick,
                    legendAllowCheckCount: 1,
                    min_max: false,
                    bGap: true,
                    id: "indicators_charts",
                    keyFormat: "none",//设置不需要chart工厂处理x轴数据
                    chartType: "line",
                    lineType:false,
                    dataKey: "key",
                    dataValue: "quota"
                },
                types: ["pv"],
                dimension: ["period,se"],
                filter: "[{\"rf_type\":[\"2\"]}]",
                interval: $rootScope.interval,
                url: "/api/charts",
                cb: $scope.searchengineFormat
            }]
        $scope.init = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.interval = undefined;
            $scope.charts.forEach(function (chart) {
                chart.config.instance = echarts.init(document.getElementById(chart.config.id));
                util.renderLegend(chart, chart.config);
            });
            requestService.refresh($scope.charts);
        }
        $scope.init();
        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $rootScope.targetSearch();
            $scope.charts.forEach(function (chart) {
                chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            });
            requestService.refresh($scope.charts);
        });
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
            $rootScope.tableTimeStart = time[0];
            $rootScope.tableTimeEnd = time[1];
            $rootScope.targetSearch();
            $scope.$broadcast("ssh_dateShow_options_time_change");
        }
    });
});
