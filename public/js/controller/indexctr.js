/**
 * Created by yousheng on 15/3/26.
 */

app.controller('Indexctr', function ($scope, $http, requestService) {
    $scope.onMeun = "menuTody";
    $scope.checkMenu = function (menu) {
        switch (menu) {
            case "menuTody":
                var start = today_start(), end = today_end();
                var selectedType = getCheckbox("radio1");
                if (!selectedType) {
                    alert("请选择统计指标");
                    return;
                }
                var option = {
                    type: selectedType,
                    chart: "line",
                    interval: 24

                };
                requestService.request('index_charts', start.getTime(), end.getTime(), option);
                break;
            case "menuYesterday":
                var selectedType = getCheckbox("radio1");
                if (!selectedType) {
                    alert("请选择统计指标");
                    return;
                }
                var start = yesterday_start(), end = yesterday_end(), option = {
                    type: selectedType,
                    chart: 'line',
                    interval: 24
                };
                requestService.request('index_charts', start.getTime(), end.getTime(), option);
                break;
            case "menuAweek":
                var selectedType = getCheckbox("radio1");
                if (!selectedType) {
                    alert("请选择统计指标");
                    return;
                }
                var start = lastWeek_start(), end = today_end(), option = {
                    type: selectedType,
                    chart: 'line',
                    interval: 7
                };
                requestService.request('index_charts', start.getTime(), end.getTime(), option);
                break;
            case "menuMoth":
                var selectedType = getCheckbox("radio1");
                if (!selectedType) {
                    alert("请选择统计指标");
                    return;
                }
                var start = lastMonth_start(), end = today_end(), option = {
                    type: selectedType,
                    chart: 'line',
                    interval: 30
                };
                requestService.request('index_charts', start.getTime(), end.getTime(), option);
                break;
        }
        $scope.onMeun = menu;
    }

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
        requestService.request('index_charts', start.getTime(), end.getTime(), option);
    }


    $scope.checkMenu("menuTody");

    $scope.initMap = function () {
        var start = today_start(), end = today_end();
        requestService.mapRequest('gest_map', start.getTime(), end.getTime(), "pv");
    }
    $scope.initMap();

})