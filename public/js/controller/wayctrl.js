/**
 * Created by john on 2015/4/3.
 */
app.controller('wayctrl', function ($scope, $rootScope, $http, requestService, messageService) {
    $scope.todayClass = true;
    $scope.reset = function () {
        $scope.todayClass = false;
        $scope.yesterdayClass = false;
        $scope.sevenDayClass = false;
        $scope.monthClass = false;
        $scope.definClass = false;
    };
    $scope.gridOptions = {
        enableScrollbars: false,
        enableGridMenu: true,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        columnDefs: [
            {name: 'date', displayName: "日期"},
            {name: 'number', displayName: "访问次数"},
            {name: 'uv', displayName: "uv"},
            {name: 'ratio', displayName: "新访客比率"}
        ]
    };
    $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
        clear.lineChart(config, checkedVal);
        $scope.charts.forEach(function (chart) {
            chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            chart.types = checkedVal;
        })
        requestService.refresh($scope.charts);
    }
    $scope.wayFormat = function (data, config) {

    }
    $scope.charts = [
        {
            config: {
                legendId: "indicators_charts_legend",
                legendData: ["浏览量(PV)", "访客数(UV)", "跳出率", "平均访问时长", "点击量", "消费", "转化次数"],
                legendClickListener: $scope.onLegendClick,
                legendAllowCheckCount: 2,
                bGap: true,
                min_max: false,
                id: "indicators_charts",
                chartType: "bar",
                dataKey: "key",
                keyFormat:'none',
                dataValue: "quota"
            },
            types: ["pv", "outRate"],
            dimension: ["region"],
            interval: $rootScope.interval,
            url: "/api/charts"
        },
    ];
    $scope.init = function () {
        var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
        $scope.charts[0].config.instance = chart;
        util.renderLegend(chart, $scope.charts[0].config);
        var chartArray = [$scope.charts[0]];
        requestService.refresh(chartArray);
    }
    $scope.init();
    $scope.today = function () {
        $scope.reset();
        $scope.todayClass = true;
    };
    $scope.yesterday = function () {
        $scope.reset();
        $scope.yesterdayClass = true;
    };
    $scope.sevenDay = function () {
        $scope.reset();
        $scope.sevenDayClass = true;

    };
    $scope.month = function () {
        $scope.reset();
        $scope.monthClass = true;

    };
    $scope.open = function ($event) {
        $scope.reset();
        $scope.definClass = true;
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
    $scope.checkopen = function ($event) {
        $scope.reset();
        $scope.definClass = true;
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opens = true;
    };
    // initialize
    $scope.today();
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
})
