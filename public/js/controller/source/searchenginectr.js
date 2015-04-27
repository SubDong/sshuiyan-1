/**
 * Created by XiaoWei on 2015/4/22.
 */
app.controller("searchenginectr", function ($scope, $rootScope, $http, requestService,areaService) {
    $scope.todayClass = true;
    $scope.reset = function () {
        $scope.todayClass = false;
        $scope.yesterdayClass = false;
        $scope.sevenDayClass = false;
        $scope.monthClass = false;
        $scope.definClass = false;
        $scope.btnchecked = true;
    };
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
    $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
        clear.lineChart(config, checkedVal);
        $scope.charts[1].config.instance = echarts.init(document.getElementById($scope.charts[1].config.id));
        $scope.charts[1].types = checkedVal;
        var chartArray = [$scope.charts[1]]
        requestService.refresh(chartArray);
    }
    $scope.searchengineFormat = function (data, config, types) {
        var json = JSON.parse(eval("(" + data + ")").toString());
        var result = chartUtils.getRf_type(json, $rootScope.start, "serverLabel", types);
        config['noFormat'] = true;
        var final_result = chartUtils.getEngine(result);
        cf.renderChart(final_result, config);
        var pieData = chartUtils.getEnginePie(final_result);
        $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
        cf.renderChart(pieData, $scope.charts[0].config);

    }
    $scope.charts = [{
        config: {
            legendData: [],
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
    }, {
        config: {
            legendId: "indicators_charts_legend",
            legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "新访客数", "IP数", "页面转化", "订单数", "订单金额", "订单转化率"],
            legendClickListener: $scope.onLegendClick,
            legendAllowCheckCount: 1,
            min_max: false,
            bGap: false,
            id: "indicators_charts",
            chartType: "bar",
            dataKey: "key",
            dataValue: "quota"
        },
        types: ["pv"],
        dimension: ["period,rf"],
        interval: $rootScope.interval,
        url: "/api/charts",
        cb: $scope.searchengineFormat
    }]
    $scope.init = function () {
        var chart = echarts.init(document.getElementById($scope.charts[1].config.id));
        $scope.charts[1].config.instance = chart;
        util.renderLegend(chart, $scope.charts[1].config);
        var chartArray = [$scope.charts[1]]
        requestService.refresh(chartArray);
    }
    $scope.init();
    $scope.today = function () {
        $scope.reset();
        $scope.todayClass = true;
        $rootScope.start = 0;
        $rootScope.end = 0;
        $rootScope.interval
        var chart = echarts.init(document.getElementById($scope.charts[1].config.id));
        $scope.charts[1].config.instance = chart;
        var chartArray = [$scope.charts[1]]
        requestService.refresh(chartArray);
    }
    $scope.yesterday = function () {
        $scope.reset();
        $scope.yesterdayClass = true;
        $rootScope.start = -1;
        $rootScope.end = -1;
        var chart = echarts.init(document.getElementById($scope.charts[1].config.id));
        $scope.charts[1].config.instance = chart;
        var chartArray = [$scope.charts[1]]
        requestService.refresh(chartArray);
    };


    $scope.sevenDay = function () {
        $scope.reset();
        $scope.sevenDayClass = true;
        $rootScope.start = -7;
        $rootScope.end = -1;
        $rootScope.interval = 24;
        var chart = echarts.init(document.getElementById($scope.charts[1].config.id));
        $scope.charts[1].config.instance = chart;
        $scope.charts[1].config.bGap = true;
        var chartArray = [$scope.charts[1]]
        requestService.refresh(chartArray);
    };
});