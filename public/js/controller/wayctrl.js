/**
 * Created by john on 2015/4/3.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller('wayctrl', function ($scope, $rootScope, $q, $http, requestService, areaService, SEM_API_URL) {
        $scope.visible = true;
        $rootScope.tableTimeStart = 0;//开始时间
        $rootScope.tableTimeEnd = 0;//结束时间、
        //配置默认指标
        $rootScope.checkedArray = ["click", "cost", "cpc", "pv", "vc", "avgPage"];
        $rootScope.tableFormat = null;
        $rootScope.gridArray = [
            {name: "推广方式", displayName: "推广方式", field: "accountName"},
            {
                name: " ",
                cellTemplate: "<div class='table_box'><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' class='table_btn'></a></div>"
            },
            {name: "点击", displayName: "点击", field: "click"},
            {name: "消费", displayName: "消费", field: "cost"},
            {name: "平均点击价格", displayName: "平均点击价格", field: "cpc"},
            {name: "浏览量(PV)", displayName: "浏览量(PV)", field: "pv"},
            {name: "访客数(UV)", displayName: "访客数(UV)", field: "vc"},
            {name: "平均访问页数", displayName: "平均访问页数", field: "avgPage"}
        ];
        $rootScope.tableSwitch = {
            latitude: {name: "推广方式", displayName: "推广方式", field: "accountName"},
            tableFilter: null,
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 1,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: false,
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false, //是否清空指标array
            promotionSearch: true //是否开始推广中sem数据
        };
        $scope.reset = function () {
            $scope.todayClass = false;
            $scope.yesterdayClass = false;
            $scope.sevenDayClass = false;
            $scope.monthClass = false;
            $scope.definClass = false;
        };

        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $rootScope.targetSearch();
            $scope.init($rootScope.user, $rootScope.baiduAccount, "account", $scope.selectedQuota, $rootScope.start, $rootScope.end);
            //$scope.doSearchAreas($scope.tableTimeStart, $scope.tableTimeEnd, "1", $scope.mapOrPieConfig);
        });

        $scope.selectedQuota = ["click", "impression"];
        $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
            $scope.selectedQuota = checkedVal;
            $scope.init($rootScope.user, $rootScope.baiduAccount, "account", $scope.selectedQuota, $rootScope.start, $rootScope.end);
        }
        $scope.charts = [
            {
                config: {
                    legendId: "indicators_charts_legend",
                    legendData: ["浏览量(PV)", "访客数(UV)", "跳出率", "平均访问时长", "点击量", "消费", "转化次数"],
                    legendClickListener: $scope.onLegendClick,
                    legendMultiData: $rootScope.lagerMulti,
                    legendAllowCheckCount: 2,
                    legendDefaultChecked: [0, 1],
                    bGap: true,
                    min_max: false,
                    id: "indicators_charts",
                    chartType: "bar",
                    noFormat: true,
                    dataKey: "key",
                    keyFormat: 'none',
                    dataValue: "quota"
                }
            }
        ];
        //*************推广*********************/

        //**************************************/
        $scope.init = function (user, baiduAccount, semType, quotas, start, end, renderLegend) {
            var requestParams = chartUtils.qAll(quotas);
            var requestArray = [];
            if (requestParams[0] != "") {
                var semRequest = $http.get(SEM_API_URL + user + "/" + baiduAccount + "/" + semType + "/" + requestParams[0] + "?startOffset=" + start + "&endOffset=" + end);
                requestArray.push(semRequest);
            }
            if (requestParams[1].length) {
                var esRequest = $http.get("/api/charts/?type=" + requestParams[1].toString() + "&dimension=one&start=" + start + "&end=" + end + "&userType=" + $rootScope.userType);
                requestArray.push(esRequest);
            }
            if (requestArray.length) {
                $q.all(requestArray).then(function (res) {
                    var final_result = chartUtils.getSearchTypeResult(quotas, res);
                    chartUtils.addStep(final_result, 24);//填充空白
                    $scope.charts[0].config.chartType = "bar";
                    $scope.charts[0].config.bGap = true;
                    var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
                    chart.showLoading({
                        text: "正在努力的读取数据中..."
                    });
                    $scope.charts[0].config.instance = chart;
                    if (renderLegend) {
                        util.renderLegend(chart, $scope.charts[0].config);
                        Custom.initCheckInfo();
                    }
                    cf.renderChart(final_result, $scope.charts[0].config);
                    chart.hideLoading();
                });
            }


            //if (quotas.length) {
            //    var semRequest = "";
            //    if (quotas.length == 1) {
            //        semRequest = $http.get(SEM_API_URL + user + "/" + baiduAccount + "/" + semType + "/" + quotas[0] + "-?startOffset=" + start + "&endOffset=" + end);
            //    } else {
            //        semRequest = $http.get(SEM_API_URL + user + "/" + baiduAccount + "/" + semType + "/" + quotas[0] + "-" + quotas[1] + "-?startOffset=" + start + "&endOffset=" + end)
            //    }
            //    $q.all([semRequest]).then(function (final_result) {
            //        var chart_result = [];
            //        quotas.forEach(function (quota) {
            //            var tmp = [];
            //            var _semData = {};
            //            var _val = 0;
            //            final_result[0].data.forEach(function (i) {
            //                _val += i[quota];
            //            });
            //            if (quota == "cpc") {
            //                _val = parseFloat(_val / final_result[0].data.length).toFixed(2);
            //            }else if(quota=="ctr"){
            //                _val = parseFloat(_val / final_result[0].data.length).toFixed(2);
            //            }
            //            tmp.push(_val);
            //            _semData["label"] = chartUtils.convertChinese(quota);
            //            _semData["quota"] = tmp;
            //            _semData["key"] = ["搜索推广"];
            //            chart_result.push(_semData);
            //        });
            //        chartUtils.addStep(chart_result, 24);//填充空白
            //        $scope.charts[0].config.chartType = "bar";
            //        $scope.charts[0].config.bGap = true;
            //var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
            //chart.showLoading({
            //    text: "正在努力的读取数据中..."
            //});
            //$scope.charts[0].config.instance = chart;
            //if (renderLegend) {
            //    util.renderLegend(chart, $scope.charts[0].config);
            //Custom.initCheckInfo();
            //}
            //        cf.renderChart(chart_result, $scope.charts[0].config);
            //chart.hideLoading();
            //    });
            //}
        }
        $scope.yesterday = function () {
            $scope.reset();
            $scope.yesterdayClass = true;
            $rootScope.start = -1;
            $rootScope.end = -1;
            $scope.init($rootScope.user, $rootScope.baiduAccount, "account", $scope.selectedQuota, $rootScope.start, $rootScope.end, true);
        };
        // initialize
        $scope.yesterday();
        //$scope.initMap();
        $scope.disabled = undefined;
        $scope.enable = function () {
            $scope.disabled = false;
        };

        $scope.disable = function () {
            $scope.disabled = true;
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
        $scope.country = {};
        $scope.countrys = [
            {name: '中国'},
            {name: '泰国'},

        ];
        $scope.city = {};
        $scope.citys = [
            {name: '北京'},
            {name: '上海'},
            {name: '成都'},
        ];
        $scope.continent = {};
        $scope.continents = [
            {name: '亚洲'},
            {name: '美洲 '},
        ];
        //日历
        this.selectedDates = [new Date().setHours(0, 0, 0, 0)];
        this.type = 'range';
        /*      this.identity = angular.identity;*/

        this.removeFromSelected = function (dt) {
            this.selectedDates.splice(this.selectedDates.indexOf(dt), 1);
        }
    });
});
