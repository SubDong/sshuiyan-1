/**
 * Created by john on 2015/4/3.
 */
app.controller('wayctrl', function ($scope, $http,requestService,messageService) {
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
    $scope.lineChartConfig = {
        legendData: ["点击量","消费","浏览量PV","跳出率","平均访问时长","转化次数"],//显示几种数据
        chartId: "indicators_charts",
        bGap: false,//首行缩进
        chartType: "line",//图表类型
        dataKey: "time",//传入数据的key值
        dataValue: "value"//传入数据的value值
    }
    $scope.today = function () {
        $scope.reset();
        $scope.todayClass = true;
        $scope.dt = new Date();
        var start = today_start(), end = today_end();
        var option = {
            type: "pv",
            interval: 24
        };
        requestService.request(start.getTime(), end.getTime(), option,$scope.lineChartConfig);
    };
    $scope.yesterday = function () {
        $scope.reset();
        $scope.yesterdayClass = true;

        var start = yesterday_start(), end = yesterday_end(), option = {
            type: "pv",
            chart: 'line',
            interval: 24
        };
        requestService.request(start.getTime(), end.getTime(), option,$scope.lineChartConfig);
        requestService.gridRequest({}, $scope.gridOptions, "uv");
    };
    $scope.sevenDay = function () {
        $scope.reset();
        $scope.sevenDayClass = true;
        var start = lastWeek_start(), end = today_end(), option = {
            type: "pv",
            chart: 'line',
            interval: 7
        };
        requestService.request(start.getTime(), end.getTime(), option,$scope.lineChartConfig);

    };
    $scope.month = function () {
        $scope.reset();
        $scope.monthClass = true;
        var start = lastMonth_start(), end = today_end(), option = {
            type: "pv",
            chart: 'line',
            interval: 30
        };
        requestService.request(start.getTime(), end.getTime(), option,$scope.lineChartConfig);

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
    $scope.enable = function() {
        $scope.disabled = false;
    };

    $scope.disable = function() {
        $scope.disabled = true;
    };

    $scope.clear = function() {
        $scope.page.selected = undefined;
        $scope.city.selected = undefined;
        $scope.country.selected = undefined;
        $scope.continent.selected = undefined;
    };
    $scope.page = {};
    $scope.pages = [
        { name: '全部页面目标'},
        { name: '全部事件目标'},
        { name: '所有页面右上角按钮'},
        { name: '所有页面底部400按钮'},
        { name: '详情页右侧按钮'},
        { name: '时长目标'},
        { name: '访问页数目标'},
    ];
    $scope.country = {};
    $scope.countrys = [
        { name: '中国'},
        { name: '泰国'},

    ];
    $scope.city = {};
    $scope.citys = [
        { name: '北京'},
        { name: '上海'},
        { name: '成都'},
    ];
    $scope.continent = {};
    $scope.continents = [
        { name: '亚洲'},
        { name: '美洲 '},
    ];
})
