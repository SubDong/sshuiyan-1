/**
 * Created by baizz on 2015-4-3.
 */
app.controller('Trend_realtime_ctrl', function ($scope, $http, requestService, messageService) {

    $scope.visitorCount = 0;
    $scope.gridOptions = {
        enableScrollbars: false,
        enableGridMenu: true,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        columnDefs: [
            {name: 'name', displayName: "地域"},
            {name: 'time', displayName: "访问时间"},
            {name: 'name', displayName: "来源"},
            {name: 'ip', displayName: "访问IP"},
            {name: 'times', displayName: "访问时长"},
            {name: 'page', displayName: "访问页数"}

        ]
    };
    $scope.lineChartConfig = {
        legendData: ["pv", "uv", "IP数"],//显示几种数据
        bGap: false,//首行缩进
        chartType: "line",//图表类型
        dataKey: "time",//传入数据的key值
        dataValue: "value"//传入数据的value值
    }
    $scope.readChartData = function (type) {

        var option = {
            type: "pv",
            chart: "line",
            interval: 30
        };
        requestService.request('Realtime_charts', $scope.startTime, $scope.endTime, option, $scope.lineChartConfig);
        //requestService.request("Realtime_charts", $scope.startTime, $scope.endTime, option, $scope.lineChartConfig);
    };

    $scope.search = function (keyword, entryPage, ip) {
        requestService.gridRequest($scope.startTime, $scope.endTime, $scope.gridOptions, "uv");
    };


    $scope.calTimePeriod = function () {
        $scope.endTime = new Date().valueOf();
        $scope.startTime =  $scope.endTime - 30 * 60 * 1000;
    };

    // initialize
    $scope.calTimePeriod();
    $scope.readChartData();

});