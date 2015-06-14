/**
 * Created by XiaoWei on 2015/4/13.
 */
define(["./module"], function (ctrls) {

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
            {
                name: "xl",
                displayName: "",
                cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                maxWidth: 10
            },
            {
                name: "来源类型",
                displayName: "来源类型",
                field: "rf_type",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                cellClass: "table_list_color"
            },
            {
                name: " ",
                cellTemplate: "<div class='table_box'><button onmousemove='getMyButton(this)' class='table_btn'></button><div class='table_win'><ul style='color: #45b1ec'><li><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' target='_blank'>查看历史趋势</a></li><li><a href='javascript:void(0)' ng-click='grid.appScope.showEntryPageLink(row, 1)'>查看入口页链接</a></li></ul></div></div>"
                // cellTemplate:" <button popover-placement='right' popover='On the Right!' class='btn btn-default'>Right</button>"
            },
            {
                name: "访问次数",
                displayName: "访问次数",
                field: "vc",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "新访客比率",
                displayName: "新访客比率",
                field: "nuvRate",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "IP数",
                displayName: "IP数",
                field: "ip",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            }
        ];
        $rootScope.tableSwitch = {
            latitude: {name: "来源类型", displayName: "来源类型", field: "rf_type"},
            tableFilter: null,
            dimen: "rf_type",
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 2,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: "<li><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' target='_blank'>查看历史趋势</a></li><li><a href='javascript:void(0)' ng-click='grid.appScope.getHistoricalTrend(this)'>查看入口页链接</a></li>",
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false //是否清空指标array
        };


        $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
            clear.lineChart(config, checkedVal);
            var chart = $scope.charts[1];
            chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            chart.types = checkedVal;
            requestService.refresh([chart]);
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
            var times = [$rootScope.start, $rootScope.end];
            var result = chartUtils.getRf_type(json, times, null, e.types, config);
            config['noFormat'] = true;
            config['twoYz'] = "none";
            cf.renderChart(result, config);
            var pieData = chartUtils.getEnginePie(result, "?", e);
            var e0 = $scope.charts[0];
            e0.config.instance = echarts.init(document.getElementById(e0.config.id));
            //$scope.charts[0].config.instance.on("hover", $scope.pieListener);
            cf.renderChart(pieData, e0.config);
        }
        $scope.extPieHover = function (params, type) {
            if (params.dataIndex != -1) {
                var colorIndex = Number(params.dataIndex);
                $(".chart_box").attr("style", "background:" + $rootScope.chartColors[colorIndex]);
                $("#chartlink").html(params.name);
                $("#chartname").html(chartUtils.convertChinese(type));
                $("#chartnumber").html(params.data.value);
                $("#chartpointe").html(params.special + "%");
            }
        }
        $scope.itemHover = function (params, typeTotal, allTotal) {
            var type = chartUtils.convertChinese($scope.charts[1].types.toString())
            $(".chart_box").attr("style", "background:" + $rootScope.chartColors[params.seriesIndex]);
            $("#chartlink").html(params[0]);
            $("#chartname").html(type);
            $("#chartnumber").html(typeTotal);
            $("#chartpointe").html(parseFloat(typeTotal / allTotal * 100).toFixed(2) + "%");
            var xName = params[1].toString();
            var res = '<li>' + type + '</li>';
            if ($rootScope.start - $rootScope.end == 0) {
                res += '<li>' + xName + ':00-' + xName + ':59</li>';
            } else {
                res += '<li>' + xName + '</li>';
            }
            res += '<li  class=chartstyle' + params.seriesIndex + '>' + params[0] + '：' + params[2] + '</li>';
            return res;
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
                    dataValue: "quota",
                    onHover: $scope.extPieHover
                },
                types: ["pv"],
                dimension: ["rf_type"],
                url: "/api/map",
                cb: $scope.pieFormat
            },
            {
                config: {
                    legendId: "source_charts_legend",
                    legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "新访客数", "IP数", "页面转化"],
                    legendClickListener: $scope.onLegendClick,
                    legendAllowCheckCount: 1,
                    id: "indicators_charts",
                    min_max: false,
                    bGap: false,
                    chartType: "line",
                    lineType: false,
                    auotHidex: true,
                    tt: "item",
                    itemHover: $scope.itemHover,
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
            var chart = echarts.init(document.getElementById($scope.charts[1].config.id));
            $scope.charts[1].config.instance = chart;
            util.renderLegend(chart, $scope.charts[1].config);
            requestService.refresh([$scope.charts[1]]);
        }
        $scope.init();

        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $rootScope.targetSearch();
            var e = $scope.charts[1];
            var chart = echarts.init(document.getElementById(e.config.id));
            e.config.instance = chart;
            requestService.refresh([e]);
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
            var e = $scope.charts[1];
            e.config.keyFormat = "day";
            var chart = echarts.init(document.getElementById(e.config.id));
            e.config.instance = chart;
            requestService.refresh([e]);
            $rootScope.targetSearch();
            $rootScope.tableTimeStart = time[0];
            $rootScope.tableTimeEnd = time[1];
            $scope.$broadcast("ssh_dateShow_options_time_change");
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
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
            });
            //图表
            requestService.refresh($scope.charts);
            //首页表格
            //requestService.gridRefresh(scope.grids);
            //其他页面表格
            $rootScope.targetSearch();
            $scope.reloadByCalendar("today");
            $('#reportrange span').html(GetDateStr(0));
            //classcurrent
            $scope.reset();
            $scope.todayClass = true;
        };
    });

});
