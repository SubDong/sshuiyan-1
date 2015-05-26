/**
 * Created by XiaoWei on 2015/4/22.
 */
define(["./module"], function (ctrs) {
    "use strict";
    ctrs.controller("externallinksctr", function ($scope, $rootScope, $http, requestService, messageService, areaService, uiGridConstants) {
        $scope.todayClass = true;

        //table默认信息配置
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        $rootScope.tableFormat = null;
        //配置默认指标
        $rootScope.checkedArray = ["uv", "nuv", "nuvRate"];
        $rootScope.gridArray = [
            {name: "外部连接", displayName: "外部连接", field: "rf"},
            {
                name: " ",
                cellTemplate: "<div class='table_box'><button onmousemove='getMyButton(this)' onmouseout='hiddenMyButton(this)' class='table_nextbtn'></button><div class='table_win'><ul style='color: #45b1ec'><li><a ui-sref='history7' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' target='_blank'>查看历史趋势</a></li><li><a href='javascript:void(0)'>查看来源分布</a></li></ul></div></div>"
            },
            {name: "访客数(UV)", displayName: "访客数(UV)", field: "uv"},
            {name: "新访客数", displayName: "新访客数", field: "nuv"},
            {name: "新访客比率", displayName: "新访客比率", field: "nuvRate"},
        ];
        $rootScope.tableSwitch = {
            latitude: {name: "外部连接", displayName: "外部连接", field: "rf"},
            tableFilter: "[{\"rf_type\": [\"3\"]}]",
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 2,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: "<li><a ui-sref='history7' ng-click='grid.appScope.getHistoricalTrend(this)'>查看历史趋势</a></li><li><a href='javascriptLvoid(0)'>查看入口页连接</a></li>",
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false, //是否清空指标array
            isJudge: false //是否清空filter 默认为清空
        };


        //

        $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
            clear.lineChart(config, checkedVal);
            $scope.charts[1].config.instance = echarts.init(document.getElementById($scope.charts[1].config.id));
            $scope.charts[1].types = checkedVal;
            var chartArray = [$scope.charts[1]]
            requestService.refresh(chartArray);
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
        $scope.externalinkFormat = function (data, config, e) {
            var json = JSON.parse(eval("(" + data + ")").toString());
            var result = chartUtils.getRf_type(json, $rootScope.start, "serverLabel", e.types);
            config['noFormat'] = true;//告知chart工厂无须格式化json，可以直接使用data对象
            config['twoYz'] = "none";
            cf.renderChart(result, config);
            //渲染pie图
            var pieData = chartUtils.getEnginePie(result, "?");
            $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
            cf.renderChart(pieData, $scope.charts[0].config);
        }
        $scope.topNFormat = function (data, config, e) {
            var json = JSON.parse(eval("(" + data + ")").toString());
            var _key = [];
            json.forEach(function (e) {
                e.dimension.buckets.forEach(function (buck) {
                    if (buck) {
                    }
                    //console.log(e.key_as_string + ">>" + buck.value_count);
                });
                _key.push(e.key_as_string);
            });
        }
        $scope.charts = [
            {
                config: {
                    legendData: ["外部链接", "直接访问", "搜索引擎"],
                    id: "sourse_charts",
                    pieStyle: true,
                    serieName: "访问情况",
                    chartType: "pie",
                    dataKey: "key",
                    dataValue: "quota"
                },
                types: ["pv"],
                dimension: ["dm"],
                filter: '[{\"rf_type\":[3]}]',
                topN: [-2, 5],
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
                    chartType: "bar",
                    dataKey: "key",
                    keyFormat: "none",
                    dataValue: "quota"
                },
                types: ["pv"],
                dimension: ["period,dm"],
                filter: '[{\"rf_type\":[3]}]',
                interval: $rootScope.interval,
                url: "/api/charts",
                cb: $scope.externalinkFormat
            },
        ];
        $scope.init = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.interval = undefined;
            var chart = echarts.init(document.getElementById($scope.charts[1].config.id));
            $scope.charts[1].config.instance = chart;
            util.renderLegend(chart, $scope.charts[1].config);
            var arrayChart = [$scope.charts[1]];
            requestService.refresh(arrayChart);
        }
        $scope.init();

        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $rootScope.targetSearch();
            var chart = echarts.init(document.getElementById($scope.charts[1].config.id));
            $scope.charts[1].config.instance = chart;
            var arrayChart = [$scope.charts[1]];
            requestService.refresh(arrayChart);
        });
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
            $rootScope.tableTimeStart = time[0];
            $rootScope.tableTimeEnd = time[1];
            $rootScope.targetSearch();
            $scope.$broadcast("ssh_dateShow_options_time_change");
        }
    });

});
