define(["./module"], function (ctrs) {
    "use strict";
    ctrs.controller("adsKeyWordCtr", function ($scope, $rootScope, $http, requestService, messageService, areaService, uiGridConstants, $cookieStore) {
        // 高级搜索提示
        $scope.visitorSearch = "";
        $scope.areaSearch = "";
        // 取消显示的高级搜索的条件
        $scope.removeVisitorSearch = function (obj) {
            $rootScope.$broadcast("loadAllVisitor");
            obj.visitorSearch = "";
        }
        $scope.removeAreaSearch = function (obj) {
            $scope.city.selected = {"name": "全部"};
            $rootScope.$broadcast("loadAllArea");
            obj.areaSearch = "";
        }
        $scope.todayClass = true;
        $scope.send = true;
        // table配置
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        $rootScope.tableFormat = null;
        // 配置默认指标
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
                name: "关键词",
                displayName: "关键词",
                field: "ioc",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                enableSorting: false
            },
            {
                name: " ",
                cellTemplate: "<div class='table_box'>" +
                "<button onmousemove='getMyButton(this)' class='table_btn'></button>" +
                "<div class='table_win'>" +
                "<ul style='color: #45b1ec'>" +
                "<li><a ui-sref='history6' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' target='_blank'>查看历史趋势</a></li>" +
                "</ul>" +
                "</div>" +
                "</div>",
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
            // 维度字段
            latitude: {name: "关键词", displayName: "关键词", field: "ioc"},
            // 过滤字段值
            tableFilter: null,
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 2,
            // 当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: "<li><a ui-sref='history6' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' target='_blank'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>",
            // 是否清空指标array
            arrayClear: false,
            // 是否清空filter 默认为清空
            isJudge: false
        };

        // 图例勾选监听事件
        $scope.onLegendClickListener = function (radio, chartObj, chartConfig, checkValue) {
            clear.lineChart(chartConfig, checkValue);
            var chart = $scope.charts[0];
            chart.types = checkValue;
            chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            requestService.refresh([chart]);
        };
        // 数据转化
        $scope.dataFormat = function (data, chartConfig, e) {
            // 将json格式的字符串data转为json对象
            var dataObj = JSON.parse(eval("(" + data + ")").toString());
            var topData = [];
            angular.forEach(dataObj, function (item) {
                var key = item.key;
                var label = item.label;
                var quota = item.quota;
                var topKey = key.slice(0, 10);
                var topQuota = quota.slice(0, 10);
                topData.push({key: topKey, label: label, quota: topQuota});
            });
            // 是否转化
            chartConfig['noFormat'] = true;
            // 是否为双轴
            chartConfig['twoYz'] = "none";
            // 图表渲染
            cf.renderChart(topData, chartConfig);
        };

        // echarts 图例配置
        $scope.charts = [
            {
                config: {
                    // 图例id
                    legendId: "indicators_charts_legend",
                    // 图例说明
                    legendData: ["浏览量(PV)", "访问次数", "访客数(UV)", "新访客数", "新访客比率", "IP数", "转化次数", "跳出率", "平均访问时长", "平均访问页数"],
                    // 监听图例勾选点击事件
                    legendClickListener: $scope.onLegendClickListener,
                    // 最多允许勾选项数
                    legendAllowCheckCount: 2,
                    // 图例默认勾选项数
                    legendDefaultChecked: [0, 1],
                    // 是否显示最大最小值
                    min_max: false,
                    // 图表首行缩进
                    bGap: true,
                    // 要渲染的图表元素id
                    id: "indicators_charts",
                    // 图表类型
                    chartType: "bar",
                    keyFormat: 'eq',
                    // 传入数据的key值
                    dataKey: "key",
                    // 传入数据的value值
                    dataValue: "quota"
                },
                // 默认图例勾选的指标值
                types: ["pv", "vc"],
                // 图例过滤的值
                dimension: ["ioc"],
                interval: $rootScope.interval,
                url: "/api/charts",
                cb: $scope.dataFormat
            }
        ];
        // echart 数据初始化
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
            // 实际请求在 requestService 中
            requestService.refresh([chart]);
        });
        $scope.page = {};
        $scope.pages = [];
        $scope.events = [];
        $scope.times = [];
        $scope.convertData = function () {
            var uid = $cookieStore.get("uid");
            var event_url = "/config/eventchnage_list?type=search&query={\"uid\":\"" + uid + "\"}";
            var page_url = "/config/page_conv?type=search&query="+JSON.stringify({uid: uid});
            //var time_url= "/config/time_conv?type=search&query={\"uid\":\""+uid+"\"}";

            $http({method: 'GET', url: page_url}).success(function (dataConfig) {
                dataConfig.forEach(function(item){
                    $scope.pages.push({name: item.target_name});
                });
            });

            $http({method: 'GET', url: event_url}).success(function (dataConfig) {
                dataConfig.forEach(function(item){
                    $scope.events.push({name: item.event_name});
                });
            });
            /* $http({method: 'GET', url: time_url}).success(function (dataConfig) {
             dataConfig.forEach(function(item){
             $scope.pages.push({time: item._id});
             });
             });*/
        };
        $scope.convertData();

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
            $scope.reloadByCalendar("today");
            $('#reportrange span').html(GetDateStr(0));
            $scope.reset();
            $scope.todayClass = true;
        };

    });
});
