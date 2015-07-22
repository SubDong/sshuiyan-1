/**
 * Created by XiaoWei on 2015/5/14.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller('adsCreativeCtr', function ($scope, $rootScope, $q, requestService, areaService, $http, SEM_API_URL,uiGridConstants) {
        //高级搜索提示
        $scope.visitorSearch = "";
        $scope.areaSearch = "";
        //取消显示的高级搜索的条件
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
        $rootScope.checkedArray = ["pv", "uv", "ip", "outRate", "avgTime"];
        $rootScope.gridArray = [
            {
                name: "xl",
                displayName: "",
                cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                maxWidth: 10,
                enableSorting: false
            },
            {
                name: "来源",
                displayName: "来源",
                field: "city",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                enableSorting: false
            },
            {
                name: "浏览量(PV)",
                displayName: "浏览量(PV)",
                field: "pv",
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
                field: "outRate",
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
            //维度字段
            latitude: {name: "来源", displayName: "来源", field: "city"},
            //过滤字段值
            tableFilter: null,
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 2,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: "<li><a ui-sref='history5' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' target='_blank'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>",
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false, //是否清空指标array
            isJudge: false //是否清空filter 默认为清空
        };

        $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
            clear.lineChart(config, checkedVal);
            var chart = $scope.charts[0];
            chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            chart.types = checkedVal;
            requestService.refresh([chart]);
        };

        // 数据转化
        $scope.dataFormat = function (data, chartConfig, e) {
            var dataObj = JSON.parse(eval("(" + data + ")").toString());
            var times = [$rootScope.start, $rootScope.end];
            var resultObj = chartUtils.getRf_type(dataObj, times, "serverLabel", e.types, chartConfig);
            chartConfig['noFormat'] = true;
            chartConfig['twoYz'] = "none"
            cf.renderChart(resultObj, chartConfig);
            var pieData = chartUtils.getEnginePie(resultObj, null, e);
            var e0 = $scope.charts[0];
            e0.config.instance = echarts.init(document.getElementById(e0.config.id));
            cf.renderChart(pieData, e0.config);

        };

        $scope.charts = [
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
                dimension: ["period,city"],
                //filter: "[{\"rf_type\":[\"2\"]}]",
                interval: $rootScope.interval,
                url: "/api/charts",
                cb: $scope.dataFormat
            }
        ];
        $scope.init = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.interval = undefined;
            var chart = $scope.charts[0];
            chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            util.renderLegend(chart, chart.config);
            requestService.refresh([$scope.charts[0]]);
        };
        $scope.init();
        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $rootScope.targetSearch();
            var chart = $scope.charts[0];
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

        function GetDateStr(AddDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
            var y = dd.getFullYear();
            var m = dd.getMonth() + 1;//获取当前月份的日期
            var d = dd.getDate();
            return y + "-" + m + "-" + d;
        };

        /**
         * 刷新
         */
        $scope.page_refresh = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.tableTimeStart = 0;
            $rootScope.tableTimeEnd = 0;
//            $scope.charts.forEach(function (e) {
//                var chart = echarts.init(document.getElementById(e.config.id));
//                e.config.instance = chart;
//            });
            //图表
//            requestService.refresh($scope.charts);
            //首页表格
            //requestService.gridRefresh(scope.grids);
            //其他页面表格
//            $rootScope.targetSearch();
            $scope.reloadByCalendar("today");
            $('#reportrange span').html(GetDateStr(0));
            //classcurrent
            $scope.reset();
            $scope.todayClass = true;
        };

    });

});