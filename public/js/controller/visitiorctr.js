/**
 * Created by john on 2015/3/31.
 */
app.controller("Vistiorctr", function ($scope, $rootScope, $http, requestService) {
    $scope.todayClass = true;

    $rootScope.tableTimeStart = 0;
    $rootScope.tableTimeEnd = 0;
    $rootScope.tableFilter = undefined;


    $scope.dateTimeStart = today_start().valueOf();
    $scope.dateTimeEnd = today_end().valueOf();
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
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;

        $scope.dateTimeStart = today_start().valueOf();
        $scope.dateTimeEnd = today_end().valueOf();
        $scope.doSearch(today_start().valueOf(), today_end().valueOf(), "1");
        $scope.doSearchAreas(today_start().valueOf(), today_end().valueOf(), "1", $scope.mapOrPieConfig);
    };
    $scope.yesterday = function () {
        $scope.reset();
        $scope.yesterdayClass = true;
        $rootScope.tableTimeStart = -1;
        $rootScope.tableTimeEnd = -1;

        $scope.dateTimeStart = yesterday_start().valueOf();
        $scope.dateTimeEnd = yesterday_end().valueOf();
        $scope.doSearch(yesterday_start().valueOf(), yesterday_end().valueOf(), "1");
        $scope.doSearchAreas(yesterday_start().valueOf(), yesterday_end().valueOf(), "1", $scope.mapOrPieConfig);
    };
    $scope.sevenDay = function () {
        $scope.reset();
        $scope.sevenDayClass = true;
        $rootScope.tableTimeStart = -7;
        $rootScope.tableTimeEnd = -1;

        $scope.dateTimeStart = lastWeek_start().valueOf();
        $scope.dateTimeEnd = lastWeek_end().valueOf();
        $scope.doSearch(lastWeek_start().valueOf(), lastWeek_end().valueOf(), "1");
        $scope.doSearchAreas(lastWeek_start().valueOf(), lastWeek_end().valueOf(), "1", $scope.mapOrPieConfig);
    };
    $scope.month = function () {
        $scope.reset();
        $scope.monthClass = true;
        $rootScope.tableTimeStart = -30;
        $rootScope.tableTimeEnd = -1;

        $scope.dateTimeStart = lastMonth_start().valueOf();
        $scope.dateTimeEnd = lastMonth_end().valueOf();
        $scope.doSearch(lastMonth_start().valueOf(), lastMonth_end().valueOf(), "1");
        $scope.doSearchAreas(lastMonth_start().valueOf(), lastMonth_end().valueOf(), "1", $scope.mapOrPieConfig);

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
        $scope.othersdateClass = true;
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opens = true;
    };


    $scope.gridOptions = {
        enableScrollbars: false,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        columnDefs: [
            {name: '地域'},
            {name: '访问时间'},
            {name: '来源'},
            {name: '访问IP'},
            {name: '访问时长'},
            {name: '访问页数'},
        ]
    };

    $scope.mapOrPieConfig = {
        chartId: "VistorMap_charts",
        serieName: "地域分布"
    }

    $scope.areas = "region";
    $scope.property = "loc";

    $scope.setProperty = function (property,position,entities) {
        $scope.property = property;
        $scope.doSearchAreas($scope.dateTimeStart, $scope.dateTimeEnd, "1", $scope.mapOrPieConfig);
    }

    $scope.setArea = function (area) {
        $scope.areas = area;
        $scope.doSearchAreas()
    };
    /**
     * 基础数据
     * @param start
     * @param end
     * @param areas  地域分组
     * @param property  数据统计
     * @param type
     */
    $scope.doSearch = function (start, end, type) {

        $http({
            method: 'GET',
            url: '/api/visitormap/?start=' + start + "&end=" + end + "&type=" + type
        }).success(function (data, status) {
            var _data = JSON.parse(eval('(' + data + ')').toString());
            $scope.pv = _data.pv;
            $scope.uv = _data.uv;
            $scope.ip = _data.ip;
            $scope.jump = _data.jump;
            $scope.avgTime = _data.avgTime;

        }).error(function (error) {
            console.log(error);
        });
    };


    //图表数据
    $scope.doSearchAreas = function (start, end, type, chartConfig) {
        var chart = echarts.init(document.getElementById(chartConfig.chartId));
        var jupName = "";
        chart.on("hover", function (param) {
            var option = this.getOption();
            var mapSeries = option.series[0];
            if (param.seriesIndex == 1) {
                var data = [];
                if (jupName == param.name) {
                    return;
                }
                jupName = param.name;
                for (var p = 0, len = mapSeries.data.length; p < len; p++) {
                    var name = mapSeries.data[p].name;
                    if (mapSeries.data[p].name == param.name) {
                        data.push({
                            name: name,
                            value: option.series[0].data[p].value,
                            tooltip: {
                                show: true,
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c}"
                            },
                            selected: true
                        });
                    } else {
                        data.push({
                            name: name,
                            value: option.series[0].data[p].value,
                            selected: false
                        });
                    }
                }
                option.series[0].data = data;
                chart.setOption(option, true);
            }
        });
        $http({
            method: 'GET',
            url: '/api/provincemap/?start=' + start + "&end=" + end + "&type=" + type + "&areas=" + $scope.areas + "&property=" + $scope.property
        }).success(function (data, status) {
            var title_name;
            switch ($scope.property) {
                case "loc":
                    title_name = "浏览量(PV)";
                    break;
                case "tt":
                    title_name = "访问次数";
                    break;
                case "_ucv":
                    title_name = "访客数(UV)";
                    break;
                case "ct":
                title_name = "新访客数";
                    break;
                case "remote":
                    title_name = "IP数";
                    break;
            }
            data["title_name"] = title_name;
            mixingMap.mapOrPie(data, chart);

        }).error(function (error) {
            console.log(error);
        });
    };

    //图标数据

    // init
    $scope.doSearch(today_start().valueOf(), today_end().valueOf(), "1");
    $scope.doSearchAreas(today_start().valueOf(), today_end().valueOf(), "1", $scope.mapOrPieConfig);
    $scope.mapselect= [
        {consumption_name: "浏览量(PV)"},
        {consumption_name: "访问次数"},
        {consumption_name: "访客数(UV)"},
        {consumption_name: "新访客数"},
        {consumption_name: "新访客比率"},
        {consumption_name: "IP数"}
    ];
    $scope.mapset = function (row) {
        console.log(row);
        alert(row)


    };


});