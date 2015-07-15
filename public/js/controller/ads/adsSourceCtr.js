/**
 * Created by ss on 2015/6/24.
 */
/**
 * Created by XiaoWei on 2015/4/22.
 */
define(["./module"], function (ctrs) {
    "use strict";
    ctrs.controller("adsSourceCtr", function ($scope, $rootScope, $http, requestService, messageService, areaService, uiGridConstants) {
        //        高级搜索提示
        $scope.visitorSearch = "";
        $scope.areaSearch = "";
//        取消显示的高级搜索的条件
        $scope.removeVisitorSearch = function(obj){
            $rootScope.$broadcast("loadAllVisitor");
            obj.visitorSearch = "";
        }
        $scope.removeAreaSearch = function(obj){
            $scope.city.selected = {"name": "全部"};
            $rootScope.$broadcast("loadAllArea");
            obj.areaSearch = "";
        }
        $scope.todayClass = true;
        $scope.send = true;
        //table配置
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        $rootScope.tableFormat = null;
        //配置默认指标
        $rootScope.checkedArray = ["vc", "uv", "nuvRate", "avgPage", "ip"];
        $rootScope.gridArray = [
            {
                name: "xl",
                displayName: "",
                cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                maxWidth: 10,
                enableSorting: false
            },
            {
                name: "事件名称",
                displayName: "事件名称",
                field: "se",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                enableSorting: false
            },
            {
                name: "浏览量",
                displayName: "浏览量",
                field: "vc",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>",
                sort: {
                    direction: uiGridConstants.DESC,
                    priority: 1
                }
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
                field: "nuvRate",
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
            var chart = $scope.charts[1];
            chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            chart.types = checkedVal;
            requestService.refresh([chart]);
        }
        $scope.searchengineFormat = function (data, config, e) {
            var json = JSON.parse(eval("(" + data + ")").toString());
            var times = [$rootScope.start, $rootScope.end];
            var result_json = chartUtils.getRf_type(json, times, "serverLabel", e.types, config);
            config['noFormat'] = true;
            config['twoYz'] = "none"
            cf.renderChart(result_json, config);
            var pieData = chartUtils.getEnginePie(result_json, null, e);
            var e0 = $scope.charts[0];
            e0.config.instance = echarts.init(document.getElementById(e0.config.id));
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
        $scope.charts = [{
            config: {
                legendData: [],
                id: "sourse_charts",
                pieStyle: true,
                serieName: "搜索引擎",
                chartType: "pie",
                dataKey: "key",
                dataValue: "quota",
                onHover: $scope.extPieHover
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
                    legendData: ["浏览量(PV)", "访问次数", "访客数(UV)", "新访客数", "新访客比率", "IP数", "转化次数", "跳出率", "平均访问时长", "平均访问页数"],
                    legendClickListener: $scope.onLegendClick,
                    legendAllowCheckCount: 2,
                    legendDefaultChecked: [2, 8],
                    allShowChart: 4,
                    min_max: false,
                    bGap: true,
                    autoInput: 20,
                    auotHidex: true,
                    id: "indicators_charts",
                    chartType: "bar",//图表类型
                    keyFormat: 'eq',
                    noFormat: true,
                    dataKey: "key",//传入数据的key值
                    dataValue: "quota"//传入数据的value值
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
            var chart = $scope.charts[1];
            chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            util.renderLegend(chart, chart.config);
            requestService.refresh([$scope.charts[1]]);
        }
        $scope.init();
        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $rootScope.targetSearch();
            var chart = $scope.charts[1];
            chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            requestService.refresh([chart]);
        });
        $scope.page = {};
        $scope.pages = [
            {name: '全部页面目标'},
            {name: '全部事件目标'},
            {name: '所有页面右上角按钮'},
            {name: '所有页面底部400按钮'},
            {name: '详情页右侧按钮'},
            {name: '时长目标'},
            {name: '访问页数目标'}
        ];
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
