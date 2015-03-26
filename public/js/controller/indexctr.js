/**
 * Created by yousheng on 15/3/26.
 */

app.controller('indexctr', function ($scope, $http, requestService) {
    $scope.today = function () {
        var start = today_start(), end = today_end();
        var selectedType = getCheckbox("radio1");
        if (!selectedType) {
            alert("请选择统计指标");
            return;
        }
        var option = {
            type: selectedType,
            chart: "line"

        };
        requestService.request('index_charts', start.getTime(), end.getTime(), option)
    };

    $scope.yesterday = function () {
        var selectedType = getCheckbox("radio1");
        if (!selectedType) {
            alert("请选择统计指标");
            return;
        }
        var start = yesterday_start(), end = yesterday_end(), option = {type: selectedType, chart: 'line'};
        requestService.request('index_charts', start.getTime(), end.getTime(), option);
    };

    $scope.lastWeek = function () {
        var selectedType = getCheckbox("radio1");
        if (!selectedType) {
            alert("请选择统计指标");
            return;
        }
        var start = lastWeek_start(), end = lastWeek_end(), option = {type: selectedType, chart: 'line'};
        requestService.request('index_charts', start.getTime(), end.getTime(), option);

    };

    $scope.lasMonth = function () {
        var selectedType = getCheckbox("radio1");
        if (!selectedType) {
            alert("请选择统计指标");
            return;
        }
        var start = lastWeek_start(), end = lastWeek_end(), option = {type: selectedType, chart: 'line'};
        requestService.request('index_charts', start.getTime(), end.getTime(), option);
    }


    $scope.today();

})