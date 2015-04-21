/**
 * Created by XiaoWei on 2015/4/13.
 */
app.controller("sourcectr", function ($scope, $rootScope, $http, requestService) {
    $scope.todayClass = true;
    $scope.reset = function () {
        $scope.todayClass = false;
        $scope.yesterdayClass = false;
        $scope.sevenDayClass = false;
        $scope.monthClass = false;
        $scope.definClass = false;
        $scope.btnchecked = true;
    };
    $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
        $scope.charts[0].types = checkedVal;
        $scope.charts[1].types = checkedVal;
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
    $scope.charts = [
        {
            config: {
                legendId: "source_charts_legend",
                legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "新访客数", "IP数", "页面转化", "订单数", "订单金额", "订单转化率"],
                legendClickListener: $scope.onLegendClick,
                legendAllowCheckCount: 1,
                id: "indicators_charts",
                chartType: "line",
                dataKey: "key",
                dataValue: "quota"
            },
            types: ["pv"],
            dimension: ["period"],
            interval: $rootScope.interval,
            url: "/api/charts"
        },
        {
            config: {
                legendData: ["外部链接", "直接访问", "搜索引擎","外部链接"],
                id: "sourse_charts",
                pieStyle: true,
                serieName: "访问情况",
                chartType: "pie",
                dataKey: "key",
                dataValue: "quota"
            },
            types: ["pv"],
            dimension: ["rf_type"],
            interval: $rootScope.interval,
            url: "/api/map",
            cb: $scope.pieFormat
        }
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
        $rootScope.start =-7;
        $rootScope.end =-1;
        $rootScope.interval = 7;
        $scope.charts.forEach(function (e) {
            var chart = echarts.init(document.getElementById(e.config.id));
            e.config.instance = chart;
        })
        requestService.refresh($scope.charts);
    };
    $scope.month = function () {
        $scope.reset();
        $scope.monthClass = true;
        $rootScope.start = -30;
        $rootScope.end = -1;
        $rootScope.interval = 30;
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
    $scope.extendway = {};
    $scope.extendways = [
        {name: '全部页面目标'},
        {name: '公告'},
        {name: '全部事件目标'},
        {name: '完整下载'},
        {name: '在线下载'},
        {name: '时长目标'},
        {name: '访问页数目标'},
    ];

});
