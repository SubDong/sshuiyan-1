/**
 * Created by john on 2015/4/2.
 */
app.controller('searchctr', function ($scope, $rootScope, $q, requestService, areaService, $http, SEM_API_URL) {
        $scope.visible = true;
        $scope.yesterdayClass = true;
        $rootScope.tableTimeStart = 0;//开始时间
        $rootScope.tableTimeEnd = 0;//结束时间、
        $rootScope.tableFormat = null;
        //配置默认指标
        $rootScope.checkedArray = ["impression", "cost", "cpc", "outRate", "avgTime", "nuvRate"]
        var newVar = {
            name: "状态",
            displayName: "状态",
            cellTemplate: "<div class='table_box'><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' class='table_btn'></a></div>"
        };
        $rootScope.gridArray = [
            {name: "地域", displayName: "地域", field: "region"},
            {
                name: " ",
                cellTemplate: "<div class='table_box'><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' class='table_btn'></a></div>"
            },
            {name: "展现", displayName: "展现", field: "impression"},
            {name: "消费", displayName: "消费", field: "cost"},
            {name: "平均点击价格", displayName: "平均点击价格", field: "cpc"},
            {name: "跳出率", displayName: "跳出率", field: "outRate"},
            {name: "平均访问时长", displayName: "平均访问时长", field: "avgTime"},
            {name: "新访客比率", displayName: "新访客比率", field: "nuvRate"}
        ];
        $rootScope.tableSwitch = {
            latitude: {name: "关键词", displayName: "关键词", field: "kw"},
            tableFilter: null,
            dimen: "city",
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 1,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: false,
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false, //是否清空指标array
            promotionSearch: {
                turnOn: true, //是否开始推广中sem数据
                SEMData: "keyword" //查询类型
            }
        };


        $scope.selectedQuota = ["click", "impression"];
        $scope.onLegendClickListener = function (radio, chartInstance, config, checkedVal) {
            $scope.init($rootScope.user, $rootScope.baiduAccount, "campaign", checkedVal, $rootScope.start, $rootScope.end);
        }
        $scope.charts = [
            {
                config: {
                    legendId: "indicators_charts_legend",
                    legendData: ["浏览量(PV)", "访客数(UV)", "跳出率", "抵达率", "平均访问时长", "页面转化"],//显示几种数据
                    legendMultiData: $rootScope.lagerMulti,
                    legendAllowCheckCount: 2,
                    legendClickListener: $scope.onLegendClickListener,
                    legendDefaultChecked: [0, 1],
                    min_max: false,
                    bGap: true,
                    id: "indicators_charts",
                    chartType: "bar",//图表类型
                    keyFormat: 'none',
                    noFormat: true,
                    dataKey: "key",//传入数据的key值
                    dataValue: "quota"//传入数据的value值
                }
            }
        ];
        $scope.init = function (user, baiduAccount, semType, quotas, start, end, renderLegend) {
            $rootScope.start = -1;
            $rootScope.end = -1;
            if (quotas.length) {
                var semRequest = "";
                if (quotas.length == 1) {
                    semRequest = $http.get(SEM_API_URL + user + "/" + baiduAccount + "/" + semType + "/" + quotas[0] + "-?startOffset=" + start + "&endOffset=" + end);
                } else {
                    semRequest = $http.get(SEM_API_URL + user + "/" + baiduAccount + "/" + semType + "/" + quotas[0] + "-" + quotas[1] + "-?startOffset=" + start + "&endOffset=" + end)
                }
                $q.all([semRequest]).then(function (final_result) {
                    final_result[0].data.sort(chartUtils.by(quotas[0]));
                    var total_result = chartUtils.getSemBaseData(quotas, final_result, "campaignName");
                    var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
                    chart.showLoading({
                        text: "正在努力的读取数据中..."
                    });
                    $scope.charts[0].config.instance = chart;
                    if (renderLegend) {
                        util.renderLegend(chart, $scope.charts[0].config);
                        Custom.initCheckInfo();
                    }
                    cf.renderChart(total_result, $scope.charts[0].config);
                    chart.hideLoading();
                });
            }
        }
        $scope.init($rootScope.user, $rootScope.baiduAccount, "campaign", $scope.selectedQuota, -1, -1, true);

        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $rootScope.targetSearch();
            $scope.init($rootScope.user, $rootScope.baiduAccount, "campaign", $scope.selectedQuota, $rootScope.start, $rootScope.end);
        });


        //$scope.initMap();
        //点击显示指标
        $scope.visible = true;
        $scope.select = function () {
            $scope.visible = false;
        };
        $scope.clear = function () {
            $scope.page.selected = undefined;
            $scope.city.selected = undefined;
            $scope.country.selected = undefined;
            $scope.continent.selected = undefined;
        };
        $scope.page = {};
        $scope.pages = [
            {name: '全部页面目标'},
            {name: '全部事件目标'},
            {name: '所有页面右上角按钮'},
            {name: '所有页面底部400按钮'},
            {name: '详情页右侧按钮'},
            {name: '时长目标'},
            {name: '访问页数目标'},
        ];
        //日历
        $scope.dateClosed = function () {
            $rootScope.start = $scope.startOffset;
            $rootScope.end = $scope.endOffset;
            $scope.init($rootScope.user, $rootScope.baiduAccount, "campaign", $scope.selectedQuota, $rootScope.start, $rootScope.end);
            $rootScope.targetSearch();
            $rootScope.tableTimeStart = $scope.startOffset;
            $rootScope.tableTimeEnd = $scope.endOffset;
            $scope.$broadcast("ssh_dateShow_options_time_change");
        };
        //

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
    }
)
/**
 * 搜索推广。单元
 */
/**
 * 搜索推广。关键词
 */

/**
 * 搜索推广。创意
 */
/**
 * 搜索推广。创意
 */
/**
 * 搜索推广。搜索词
 */

/**
 * 搜索推广。推广URL
 */
