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
        $scope.btnchecked = true;
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
        legendData: ["pv", "uv", "跳出率", "抵达率", "平均访问时长", "页面转化"],//显示几种数据
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
        $scope.btnchecked = false;
        var start = today_start(), end = today_end();
        var option = {
            type: "pv",
            interval: 24
        };
        requestService.request(start.getTime(), end.getTime(), option,$scope.lineChartConfig);
        requestService.mapRequest(start.getTime(), start.getTime(), "pv",$scope.barchartConfig);
        requestService.pieRequest(start.getTime(), end.getTime(), "pv",$scope.piechartConfig);
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
        requestService.pieRequest( start.getTime(), end.getTime(), "pv",$scope.piechartConfig);
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
        requestService.pieRequest( start.getTime(), end.getTime(), "pv",$scope.piechartConfig);
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
        requestService.pieRequest( start.getTime(), end.getTime(), "pv",$scope.piechartConfig);
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

    $scope.model = [{
        id: 1,
        when: '00:00-00:59'

    }, {
        id: 2,
        when: '01:00-01:59'
    }, {
        id: 3,
        when: '02:00-02:59'
    },
        {
            id: 4,
            when: '03:00-03:59'
        },
        {
            id: 5,
            when: '04:00-04:59'
        },
        {
            id: 6,
            when: '05:00-05:59'
        },
        {
            id: 7,
            when: '06:00-06:59'
        },
        {
            id: 8,
            when: '07:00-07:59'
        },
        {
            id: 9,
            when: '08:00-08:59'
        },
        {
            id: 10,
            when: '09:00-09:59'
        },
        {
            id: 11,
            when: '10:00-10:59'
        },
        {
            id: 12,
            when: '11:00-11:59'
        },
        {
            id: 13,
            when: '12:00-12:59'
        },
        {
            id: 14,
            when: '13:00-13:59'
        },
        {
            id: 15,
            when: '14:00-14:59'
        },
        {
            id: 16,
            when: '15:00-15:59'
        },
        {
            id: 17,
            when: '16:00-16:59'
        },
        {
            id: 18,
            when: '17:00-17:59'
        },
        {
            id: 19,
            when: '18:00-18:59'
        },
        {
            id: 20,
            when: '19:00-19:59'
        },
        {
            id: 21,
            when: '20:00-20:59'
        },
        {
            id: 22,
            when: '21:00-21:59'
        },
        {
            id: 23,
            when: '22:00-22:59'
        },
        {
            id: 24,
            when: '23:00-23:59'
        },


    ];
    $scope.view = [
        {
            id: 1,
            when: '浏览量(PV)'
        },
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
            id: 7,
            when: '浏览量(PV)'
        },
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
            id: 14,
            when: '浏览量(PV)'
        },
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
