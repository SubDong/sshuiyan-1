/**
 * Created by john on 2015/4/1.
 */
app.controller('trend_today_ctrl', function ($scope, $rootScope, $http, requestService, messageService, areaService, uiGridConstants) {
    $scope.todayClass = true;

    //table配置
    $rootScope.tableTimeStart = 0;
    $rootScope.tableTimeEnd = 0;
    $rootScope.latitude = {name: "日期", field: "period"};
    $rootScope.tableFilter = undefined;
    $rootScope.dimen = false;
    //

    $scope.dt = new Date();
    $scope.onLegendClickListener = function (radio, chartObj, chartConfig, checkedVal) {
        clear.lineChart($scope.charts[0].config, checkedVal);
        $scope.charts[0].types = checkedVal;
        var chartarray = [$scope.charts[0]];
        requestService.refresh(chartarray);
    }
    $scope.charts = [
        {
            config: {
                legendId: "today_charts_legend",
                legendAllowCheckCount: 2,
                legendClickListener: $scope.onLegendClickListener,
                legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "新访客数", "新访客比率", "IP数", "跳出率", "平均访问时长", "平均访问页数", "转化次数", "转化率"],//显示几种数据
                id: "today_charts",
                bGap: false,//首行缩进
                chartType: "line",//图表类型
                dataKey: "key",//传入数据的key值
                keyFormat:'hour',
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
        $rootScope.start = 0;
        $rootScope.end = 0;
        $rootScope.interval = 24;
        requestService.refresh($scope.charts);
    }
    $scope.init();

    $scope.$on("ssh_refresh_charts", function(e, msg) {
        $rootScope.targetSearch();
        var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
        $scope.charts[0].config.instance = chart;
        requestService.refresh($scope.charts);
    });

    // initialize
    /*    $scope.today();*/
    //$scope.initMap();
    $scope.clear = function () {
        $scope.extendway.selected = undefined;
        $scope.city.selected = undefined;
        $scope.country.selected = undefined;
        $scope.continent.selected = undefined;
        $scope.souce.selected = undefined;
    };


});
