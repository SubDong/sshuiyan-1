/**
 * Created by yousheng on 15/3/26.
 */

app.controller('IndexCtrl', function ($scope, $http, requestService, messageService) {
    $scope.todayClass = true;
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
        var selectedType = getCheckbox("radio1");
        if (!selectedType) {
            messageService.alertMsg("请选择统计指标");
            return;
        }
        var option = {
            type: selectedType,
            chart: "line",
            interval: 24

        };
        requestService.request('index_charts', start.getTime(), end.getTime(), option);
    };
    $scope.yesterday = function () {
        $scope.reset();
        $scope.yesterdayClass = true;
        var selectedType = getCheckbox("radio1");
        if (!selectedType) {
            messageService.alertMsg("请选择统计指标");
            return;
        }
        var start = yesterday_start(), end = yesterday_end(), option = {
            type: selectedType,
            chart: 'line',
            interval: 24
        };
        requestService.request('index_charts', start.getTime(), end.getTime(), option);
    };
    $scope.sevenDay = function () {
        $scope.reset();
        $scope.sevenDayClass = true;
        var selectedType = getCheckbox("radio1");
        if (!selectedType) {
            messageService.alertMsg("请选择统计指标");
            return;
        }
        var start = lastWeek_start(), end = today_end(), option = {
            type: selectedType,
            chart: 'line',
            interval: 7
        };
        requestService.request('index_charts', start.getTime(), end.getTime(), option);

    };
    $scope.month = function () {
        $scope.reset();
        $scope.monthClass = true;
        var selectedType = getCheckbox("radio1");
        if (!selectedType) {
            messageService.alertMsg("请选择统计指标");
            return;
        }
        var start = lastMonth_start(), end = today_end(), option = {
            type: selectedType,
            chart: 'line',
            interval: 30
        };
        requestService.request('index_charts', start.getTime(), end.getTime(), option);

    };
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
        $scope.reset();
        $scope.definClass = true;
    };

    $scope.initMap = function () {
        var start = today_start(), end = today_end();
        requestService.mapRequest('gest_map', start.getTime(), end.getTime(), "pv");
    };


    // initialize
    $scope.today();
    $scope.initMap();
});