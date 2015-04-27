/**
 * Created by XiaoWei on 2015/4/13.
 */
app.controller("sourcectr", function ($scope, $rootScope, $http, requestService, areaService) {
    $scope.todayClass = true;

    //table 参数配置
    $rootScope.tableTimeStart = 0;
    $rootScope.tableTimeEnd = 0;
    $rootScope.tableFilter = undefined;

    $scope.reset = function () {
        $scope.todayClass = false;
        $scope.yesterdayClass = false;
        $scope.sevenDayClass = false;
        $scope.monthClass = false;
        $scope.definClass = false;
        $scope.btnchecked = true;
    };
    $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
        clear.lineChart(config, checkedVal);
        $scope.charts.forEach(function (chart) {
            chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            chart.types = checkedVal;
        })
        requestService.refresh($scope.charts);
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
    $scope.customFormat = function (data, config, types) {
        var json = JSON.parse(eval("(" + data + ")").toString());
        var result = chartUtils.getRf_type(json, $rootScope.start, null, types);
        config['noFormat'] = true;
        cf.renderChart(result, config);
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
                dataValue: "quota"
            },
            types: ["pv"],
            dimension: ["rf_type"],
            url: "/api/map",
            cb: $scope.pieFormat
        },
        {
            config: {
                legendId: "source_charts_legend",
                legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "新访客数", "IP数", "页面转化", "订单数", "订单金额", "订单转化率"],
                legendClickListener: $scope.onLegendClick,
                legendAllowCheckCount: 1,
                id: "indicators_charts",
                min_max: false,
                bGap: true,
                chartType: "bar",
                dataKey: "key",
                dataValue: "quota"
            },
            types: ["pv"],
            dimension: ["period,rf_type"],
            interval: $rootScope.interval,
            url: "/api/charts",
            cb: $scope.customFormat
        },
    ];
    $scope.init = function () {
        $scope.charts.forEach(function (e) {
            var chart = echarts.init(document.getElementById(e.config.id));
            e.config.instance = chart;
            util.renderLegend(chart, e.config);
        })
        requestService.refresh($scope.charts);
    }
    $scope.init();

    $scope.today = function () {
        $scope.reset();
        $scope.todayClass = true;
        //table 参数配置
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        //
        $rootScope.start = 0;
        $rootScope.end = 0;
        $rootScope.interval
        $scope.charts.forEach(function (e) {
            var chart = echarts.init(document.getElementById(e.config.id));
            e.config.instance = chart;
        })
        requestService.refresh($scope.charts);
    }
    $scope.yesterday = function () {
        $scope.reset();
        $scope.yesterdayClass = true;

        //table 参数配置
        $rootScope.tableTimeStart = -1;
        $rootScope.tableTimeEnd = -1;
        //

        $rootScope.start = -1;
        $rootScope.end = -1;
        $scope.charts.forEach(function (e) {
            var chart = echarts.init(document.getElementById(e.config.id));
            e.config.instance = chart;
        })
        requestService.refresh($scope.charts);
    };
    $scope.sevenDay = function () {
        $scope.reset();
        $scope.sevenDayClass = true;
        //table 参数配置
        $rootScope.tableTimeStart = -7;
        $rootScope.tableTimeEnd = -1;
        //

        $rootScope.start = -7;
        $rootScope.end = -1;
        $rootScope.interval = 24;

        $scope.charts.forEach(function (e) {
            var chart = echarts.init(document.getElementById(e.config.id));
            e.config.instance = chart;
        })
        requestService.refresh($scope.charts);
    };
    $scope.month = function () {
        $scope.reset();
        $scope.monthClass = true;
        //table 参数配置
        $rootScope.tableTimeStart = -30;
        $rootScope.tableTimeEnd = -1;
        //

        $rootScope.start = -30;
        $rootScope.end = -1;
        $rootScope.interval = 24;
        $scope.charts.forEach(function (e) {
            var chart = echarts.init(document.getElementById(e.config.id));
            e.config.instance = chart;
        })
        requestService.refresh($scope.charts);
    };
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
        $scope.reset();
        $scope.definClass = true;
    };

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

});
