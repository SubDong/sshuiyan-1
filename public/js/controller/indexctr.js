/**
 * Created by yousheng on 15/3/26.
 */

app.controller('DateChartController', function ($scope, $http, requestService) {
    $scope.onMeun = "menu1";
    $scope.checkMenu = function (menu) {
        switch (menu) {
            case "menu1":
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
                break;
            case "menu2":
                var selectedType = getCheckbox("radio1");
                if (!selectedType) {
                    alert("请选择统计指标");
                    return;
                }
                var start = yesterday_start(), end = yesterday_end(), option = {type: selectedType, chart: 'line'};
                requestService.request('index_charts', start.getTime(), end.getTime(), option);
                break;
            case "menu3":
                var selectedType = getCheckbox("radio1");
                if (!selectedType) {
                    alert("请选择统计指标");
                    return;
                }
                var start = lastWeek_start(), end = lastWeek_end(), option = {type: selectedType, chart: 'line'};
                requestService.request('index_charts', start.getTime(), end.getTime(), option);
                break;
            case "menu4":
                var selectedType = getCheckbox("radio1");
                if (!selectedType) {
                    alert("请选择统计指标");
                    return;
                }
                var start = lastWeek_start(), end = lastWeek_end(), option = {type: selectedType, chart: 'line'};
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

    $scope.checkMenu("menu1");
})