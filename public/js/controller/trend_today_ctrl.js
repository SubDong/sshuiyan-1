/**
 * Created by john on 2015/4/1.
 */
app.controller('trend_today_ctrl', function ($scope, $http,requestService,messageService,areaService,uiGridConstants) {
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
        showGridFooter: true,
        showColumnFooter: true,
        columnDefs: [
            {name: 'date', displayName: "日期"},
            {name: 'number', displayName: "访问次数",aggregationType: uiGridConstants.aggregationTypes.sum},
            {name: 'uv', displayName: "访客数(UV)",aggregationType: uiGridConstants.aggregationTypes.sum},
            {name: 'ratio', displayName: "新访客比率",aggregationType: uiGridConstants.aggregationTypes.sum}
        ]
    };
    $scope.lineChartConfig = {
        legendData: ["浏览量(PV)","访客数(UV)","访问次数","新访客数","新访客比率","IP数","跳出率","平均访问时长","平均访问页数","转化次数","转化率"],//显示几种数据
        chartId: "Today_charts",
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
            chart: "line",
            interval: 24
        };
        requestService.request(start.getTime(), end.getTime(), option, $scope.lineChartConfig);
        requestService.gridRequest({}, $scope.gridOptions,"uv");

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
        requestService.request( start.getTime(), end.getTime(), option,$scope.lineChartConfig);
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
    $scope.clear = function() {
        $scope.extendway.selected = undefined;
        $scope.city.selected = undefined;
        $scope.country.selected = undefined;
        $scope.continent.selected = undefined;
        $scope.souce.selected = undefined;
    };
    $scope.extendway = {};
    $scope.extendways = [
        { name: '全部页面目标'},
        { name: '公告'},
        { name: '全部事件目标'},
        { name: '完整下载'},
        { name: '在线下载'},
        { name: '时长目标'},
        { name: '访问页数目标'},
    ];
    $scope.souce = {};
    $scope.souces = [
        { name: '全部'},
        { name: '直接访问'},
        { name: '搜索引擎'},
        {name: '外部链接'},
    ];

});
