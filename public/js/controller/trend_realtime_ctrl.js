/**
 * Created by baizz on 2015-4-3.
 */
app.controller('Trend_realtime_ctrl', function ($scope, $http, requestService, messageService) {

    $scope.visitorCount = 0;

    $scope.gridOptions = {};

    $scope.readChartData = function (type) {

        var option = {
            type: type,
            chart: "line",
            interval: 30
        };

        requestService.request("indicators_charts", $scope.startTime, $scope.endTime, option);
    };

    $scope.search = function (keyword, entryPage, ip) {
        requestService.gridRequest($scope.startTime, $scope.endTime, $scope.gridOptions, "uv");
    };


    $scope.calTimePeriod = function () {
        $scope.endTime = new Date();
        $scope.startTime = end - 30 * 60 * 1000;
    };

    // initialize
    $scope.calTimePeriod();
});