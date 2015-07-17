/**
 * Created by XiaoWei on 2015/4/22.
 */
define(["./../module"], function (ctrs) {

    "use strict";

    ctrs.controller('attractivenessanalysisctr', function ($scope, $rootScope, $http, requestService, messageService, areaService, uiGridConstants, popupService) {
            $scope.todayClass = true;

            $rootScope.tableTimeStart = 0;
            $rootScope.tableTimeEnd = 0;
            $rootScope.tableFormat = null;
            //配置默认指标
            $rootScope.checkedArray = ["contribution", "outRate", "avgTime", "avgPage"];
            $rootScope.gridArray = [
                {
                    name: "xl",
                    displayName: "",
                    cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                    maxWidth: 10,
                    enableSorting: false
                },
                {
                    name: "页面url",
                    displayName: "页面url",
                    field: "loc",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                    enableSorting: false,
                    cellTooltip: function (row, col) {
                        return row.entity.loc;
                    }
                },
                {
                    name: " ",
                    cellTemplate: "<div class='table_box'><button onmousemove='getMyButton(this)' class='table_btn'></button><div class='table_win'><ul style='color: #45b1ec'><li><a ui-sref='history10' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' target='_blank'>查看历史趋势</a></li><li><a ng-click='grid.appScope.showSourceDistribution(row)'>查看来源分布</a></li></ul></div></div>",
                    enableSorting: false
                },
                {
                    name: "贡献浏览量",
                    displayName: "贡献浏览量",
                    field: "contribution",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>",
                    sort: {
                        direction: uiGridConstants.DESC,
                        priority: 1
                    }
                },
                {
                    name: "跳出率",
                    displayName: "跳出率",
                    field: "outRate",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "平均访问时长",
                    field: "avgTime",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "平均访问页面",
                    field: "avgPage",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                }
            ];
            $rootScope.tableSwitch = {
                latitude: {name: "页面url", displayName: "页面url", field: "loc"},
                tableFilter: null,
                dimen: false,
                // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
                number: 2,
                //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
                coding: "<li><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' target='_blank'>查看历史趋势</a></li><li><a ng-click='grid.appScope.showSourceDistribution(row)'>查看来源分布</a></li>",
                arrayClear: false
            };

            $scope.showSourceDistribution = function (row) {
                popupService.showSourceDistributionData(row.entity.loc);
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
                cf.renderChart(json, config);
            }
            $scope.attractiveFormat = function (data, config, e) {
                var json = JSON.parse(eval("(" + data + ")").toString());
                var times = [$rootScope.start, $rootScope.end];
                var result = chartUtils.getRf_type(json, times, "serverLabel", e.types, config);
                config['noFormat'] = true;
                config['twoYz'] = "none";
                cf.renderChart(result, config);
                var final_result = chartUtils.getExternalinkPie(result);//获取barchart的数据
                var pieData = chartUtils.getEnginePie(final_result, null, e);
                $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
                cf.renderChart(pieData, $scope.charts[0].config);
                var firstCount=0;
                pieData.forEach(function(i){
                    i.quota.forEach(function(q){
                        firstCount+=q;
                    });
                });
                if(firstCount){
                    $(".chart_box").attr("style", "background:" + $rootScope.chartColors[0]);
                    $("#chartlink").html(pieData[0].key[0]);
                    $("#chartname").html(chartUtils.convertChinese('pv'));
                    $("#chartnumber").html(pieData[0].quota[0]);
                    $("#chartpointe").html(parseFloat(pieData[0].quota[0]/firstCount*100).toFixed(2)+"%");
                }
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
                        legendData: [],
                        id: "sourse_charts",
                        //pieStyle: true,
                        serieName: "入口页面",
                        chartType: "pie",
                        dataKey: "key",
                        dataValue: "quota",
                        onHover: $scope.extPieHover
                    },
                    types: ["pv"],
                    dimension: ["rf"],
                    url: "/api/map",
                    cb: $scope.pieFormat
                },
                {
                    config: {
                        legendId: "indicators_charts_legend",
                        legendData: ["访客数(UV)", "访问次数", "新访客数", "IP数", "贡献浏览量", "转化次数"],
                        legendClickListener: $scope.onLegendClick,
                        legendAllowCheckCount: 1,
                        id: "indicators_charts",
                        min_max: false,
                        bGap: false,
                        chartType: "line",
                        //auotHidex: true,
                       //qingXie:true,
                        qxv:18,
                      //  tt: "item",
                        itemHover: $scope.itemHover,
                        lineType: false,
                        keyFormat: 'none',
                        dataKey: "key",
                        dataValue: "quota"
                    },
                    types: ["pv"],
                    dimension: ["period,loc"],
                    interval: $rootScope.interval,
                    url: "/api/charts",
                    cb: $scope.attractiveFormat
                }
            ]
            $scope.init = function () {
                $rootScope.start = 0;
                $rootScope.end = 0;
                $rootScope.interval = undefined;
                var e = $scope.charts[1];
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                util.renderLegend(chart, e.config);
                requestService.refresh([e]);
            }
            $scope.init();

            $scope.$on("ssh_refresh_charts", function (e, msg) {
                $rootScope.targetSearch();
                var chart = echarts.init(document.getElementById($scope.charts[1].config.id));
                $scope.charts[1].config.instance = chart;
                var arrayChart = [$scope.charts[1]]
                requestService.refresh(arrayChart);
            });
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
                $rootScope.tableTimeStart = time[0];
                $rootScope.tableTimeEnd = time[1];
                $rootScope.targetSearch();
                $scope.$broadcast("ssh_dateShow_options_time_change");
            }     //

            this.selectedDates = [new Date().setHours(0, 0, 0, 0)];
            //this.type = 'range';
            /*      this.identity = angular.identity;*/
            //$scope.$broadcast("update", "msg");
            $scope.$on("update", function (e, datas) {
                // 选择时间段后接收的事件
                datas.sort();
                //console.log(datas);
                var startTime = datas[0];
                var endTime = datas[datas.length - 1];
                $scope.startOffset = (startTime - today_start()) / 86400000;
                $scope.endOffset = (endTime - today_start()) / 86400000;
                //console.log("startOffset=" + startOffset + ", " + "endOffset=" + endOffset);
            });
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
//                $scope.charts.forEach(function (e) {
//                    var chart = echarts.init(document.getElementById(e.config.id));
//                    e.config.instance = chart;
//                });
                //图表
//                requestService.refresh($scope.charts);
                $scope.reloadByCalendar("today");
                $('#reportrange span').html(GetDateStr(0));
                //其他页面表格
//                $rootScope.targetSearch();
                //classcurrent
                $scope.reset();
                $scope.todayClass = true;
            };
        }
    )
    ;

});
