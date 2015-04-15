/**
 * Created by yousheng on 15/3/26.
 */

app.controller('IndexCtrl', function ($scope, $http, requestService, messageService) {
    $scope.todayClass = true;
    $scope.dayClass = true;
    $scope.timeselect = true;
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
            {name: 'name', displayName: "关键词"},
            {name: 'value', displayName: "浏览量"}
        ]
    };
    $scope.lineChartConfig = {
        legendData: ["浏览量(PV)", "访客数(UV)", "跳出率", "抵达率", "平均访问时长", "页面转化"],//显示几种数据
        chartId:"index_charts",
        bGap: false,//首行缩进
        chartType: "line",//图表类型
        dataKey: "time",//传入数据的key值
        dataValue: "value"//传入数据的value值
    }
    $scope.barchartConfig = {
        min_max: false,//是否显示最大，最小值
        legendData: [],
        chartId: "gest_map",
        bGap: true,
        chartType: "bar",
        dataKey: "name",
        dataValue: "value"
    }
    $scope.piechartConfig = {
        legendData: [],
        chartType:"pie",
        chartId: "environment_map",
        serieName: "设备环境",
        dataKey: "name",
        dataValue: "value"
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
        requestService.mapRequest(start.getTime(), start.getTime(), "pv",$scope.barchartConfig);
        requestService.pieRequest(start.getTime(), end.getTime(), option,$scope.piechartConfig);
        requestService.gridRequest({}, $scope.gridOptions, "uv");
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
        requestService.mapRequest(start.getTime(), end.getTime(), "pv",$scope.barchartConfig);
        requestService.pieRequest( start.getTime(), end.getTime(), option,$scope.piechartConfig);
        requestService.gridRequest({start: start.getTime(), end: end.getTime()}, $scope.gridOptions, "uv");
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
        requestService.mapRequest( start.getTime(), end.getTime(), "pv",$scope.barchartConfig);
        requestService.pieRequest( start.getTime(), end.getTime(),option,$scope.piechartConfig);
        requestService.gridRequest({start: start.getTime(), end: end.getTime()}, $scope.gridOptions, "uv");
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
        requestService.mapRequest(start.getTime(), end.getTime(), "pv",$scope.barchartConfig);
        requestService.pieRequest( start.getTime(), end.getTime(),option,$scope.piechartConfig);
        requestService.gridRequest({start: start.getTime(), end: end.getTime()}, $scope.gridOptions, "uv");

    };
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
        $scope.reset();
        $scope.definClass = true;
    };

    $scope.today();
    $scope.hourcheck = function () {
        $scope.hourcheckClass = true;
        $scope.dayClass = false;
        $scope.timeselect = false;

    };
    $scope.daycheck = function () {
        $scope.hourcheckClass = false;
        $scope.dayClass = true;
        $scope.timeselect = true;

        $scope.today();
    };
    $scope.selected = '';
    $scope.view = [
        {
            id: 2,
            when: '访客次数(UV) '
        },
        {
            id: 3,
            when: '新访客数'
        },
        {
            id: 4,
            when: 'IP数'
        },
        {
            id: 5,
            when: '跳出率'
        },
        {
            id: 6,
            when: '平均访问时长'

        },   {
            id: 7,
            when: '转化次数'
        },


    ]
    $scope.twoview = [
        {
            id: 8,
            when: '访客次数(UV) '
        },
        {
            id: 9,
            when: '新访客数'
        },
        {
            id: 10,
            when: 'IP数'
        },
        {
            id:11,
            when: '跳出率'
        },
        {
            id: 12,
            when: '平均访问时长'
        },   {
            id: 13,
            when: '转化次数'
        },


    ]
    $scope.threeview = [
        {
            id: 15,
            when: '访客次数(UV) '
        },
        {
            id: 16,
            when: '新访客数'
        },
        {
            id: 17,
            when: 'IP数'
        },
        {
            id:18,
            when: '跳出率'
        },
        {
            id:19,
            when: '平均访问时长'
        },   {
            id: 20,
            when: '转化次数'
        },
    ]

});
