/**
 * Created by baizz on 2015-4-3.
 */
app.controller('Trend_realtime_ctrl', function ($scope, $rootScope, $http, requestService, messageService, $log) {
    $scope.visitorCount = 0;
//table配置
    $rootScope.tableTimeStart = 0;
    $rootScope.tableTimeEnd = 0;
    $rootScope.latitude = {name: "地域", field: "region"};
    $rootScope.checkedArray = "SS"
    $rootScope.dimen = true;
    //
    $scope.onLegendClickListener = function (radio, chartObj, chartConfig, checkedVal) {
        clear.lineChart($scope.charts[0].config, checkedVal);
        $scope.charts.forEach(function (chart) {
            chart.types = checkedVal;
        })
        requestService.refresh($scope.charts);
    }
    $scope.charts = [
        {
            config: {
                legendData: ["浏览量(PV)", "访客数(UV)", "IP数"],
                legendId: "realtime_charts_legend",
                legendAllowCheckCount: 2,
                legendClickListener: $scope.onLegendClickListener,
                //显示几种数据
                id: "realtime_charts",
                bGap: false,//首行缩进
                chartType: "line",//图表类型
                dataKey: "key",//传入数据的key值
                dataValue: "quota"//传入数据的value值
            },
            types: ["pv", "uv"],
            dimension: ["period"],
            interval: $rootScope.interval,
            url: "/api/charts"
        }];

    $scope.init = function () {

        $scope.charts.forEach(function (e) {
            var chart = echarts.init(document.getElementById(e.config.id));
            e.config.instance = chart;
            util.renderLegend(chart, e.config);
        })
        //requestService.initCharts($scope.charts);
        requestService.refresh($scope.charts);
    }
    $scope.init();

    /*    $scope.search = function (keyword, time, ip) {
     requestService.gridRequest($scope.startTime, $scope.endTime, $scope.gridOptions, "uv");
     };*/
    $scope.calTimePeriod = function () {
        $scope.endTime = new Date().valueOf();
        $scope.startTime = $scope.endTime - 30 * 60 * 1000;
    };
    // initialize
    $scope.calTimePeriod();
    $scope.disabled = undefined;
    $scope.enable = function () {
        $scope.disabled = false;
    };

    $scope.disable = function () {
        $scope.disabled = true;
    };

    $scope.clear = function () {
        $scope.city.selected = undefined;
        $scope.country.selected = undefined;
        $scope.souce.selected = undefined;
    };

    $scope.country = {};
    $scope.countrys = [
        {name: '中国'},
    ];
    $scope.souce = {};
    $scope.souces = [
        {name: '全部'},
        {name: '直接访问'},
        {name: '搜索引擎'},
        {name: '外部链接'},
    ];
    $scope.city = {};
    $scope.citys = [
        {name: '北京'},
        {name: '上海'},
        {name: '广州'},
    ];

});