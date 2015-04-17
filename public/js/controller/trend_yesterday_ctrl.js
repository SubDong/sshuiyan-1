/**
 * Created by john on 2015/4/3.
 */
app.controller('Trend_yesterday_ctrl', function ($scope, $http,requestService,areaService,messageService) {
    $scope.yesterdayClass = true;
    $scope.reset = function () {
        $scope.todayClass = false;
        $scope.yesterdayClass = false;
        $scope.sevenDayClass = false;
        $scope.monthClass = false;
        $scope.definClass = false;
    };
    $scope.today = function () {
        $scope.reset();
        $scope.todayClass = true;
        var start = today_start(), end = today_end();
        var option = {
            type: "pv",
            interval: 24
        };
        requestService.request('indicators_charts', start.getTime(), end.getTime(), option,$scope.lineChartConfig);

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
        legendData: ["浏览量(PV)","访客数(UV)","访问次数","新访客数","新访客比率","IP数","跳出率","平均访问时长","平均访问页数","转化次数","转化率"],//显示几种数据
        chartId: "indicators_charts",
        bGap: false,//首行缩进
        chartType: "line",//图表类型
        dataKey: "time",//传入数据的key值
        dataValue: "value"//传入数据的value值
    }
    $scope.yesterday = function () {
        $scope.reset();
        $scope.yesterdayClass = true;
        $scope.dt = new Date();
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
    $scope.yesterday();
    //$scope.initMap();

})
app.controller('todaydefine', function ($scope, $http,requestService,messageService) {
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
    $scope.Todytable = function (type) {
        requestService.request( option, $scope.lineChartConfig);
        //requestService.request("Realtime_charts", $scope.startTime, $scope.endTime, option, $scope.lineChartConfig);
    };
})
app.controller('todayfilter', function ($scope, $http,requestService,messageService) {
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
    $scope.Todytable = function (type) {
        requestService.request( option, $scope.lineChartConfig);

    };
})