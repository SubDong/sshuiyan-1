/**
 * Created by XiaoWei on 2015/4/13.
 */
app.controller("sourcectr", function ($scope, $rootScope, $http, requestService) {
    $scope.todayClass = true;
    $scope.start = today_start().getTime();
    $scope.end = custom_end(new Date(), 20).getTime();
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
        var chartarray = [$scope.charts[0]];
        requestService.refresh(chartarray);
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
                dataKey: "time",
                dataValue: "value"
            },
            types: ["pv"],
            quota: [],
            interval: $rootScope.interval,
            url:"/api/charts"
        }, {
            config: {
                legendData: [],
                id: "sourse_charts",
                pieStyle: true,
                serieName: "访问情况",
                chartType: "pie",
                dataKey: "name",
                dataValue: "value"
            },
            types: ["pv"],
            quota: [],
            interval: $rootScope.interval,
            url:"/api/vapie"
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
        $rootScope.start = today_start().getTime();
        $rootScope.end = today_end().getTime();
        $scope.charts[0].interval=12;
        $scope.charts[1].interval=12;
        requestService.refresh($scope.charts);
    }
    $scope.yesterday = function () {
        $scope.reset();
        $scope.yesterdayClass = true;
        $rootScope.start = yesterday_start().getTime();
        $rootScope.end = yesterday_end().getTime();
        requestService.refresh($scope.charts);
    };
    $scope.sevenDay = function () {
        $scope.reset();
        $scope.sevenDayClass = true;
        $rootScope.start = lastWeek_start().getTime();
        $rootScope.end = lastWeek_end().getTime();
        requestService.refresh($scope.charts);
    };
    $scope.month = function () {
        $scope.reset();
        $scope.monthClass = true;
        $rootScope.start = lastMonth_start().getTime();
        $rootScope.end = lastMonth_end().getTime();
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
