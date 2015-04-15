/**
 * Created by XiaoWei on 2015/4/13.
 */
app.controller("sourcectr", function ($scope, $http, requestService) {
    $scope.todayClass = true;
    $scope.start = today_start().getTime();
    $scope.end = custom_end(new Date(), 20).getTime();
    $scope.reset = function () {
        $scope.todayClass = false;
        $scope.yesterdayClass = false;
        $scope.sevenDayClass = false;
        $scope.monthClass = false;
        $scope.definClass = false;
        $scope.btnchecked = true;
    };
    $scope.onLegendClick = function (chart, param, start, end, opt) {
        var type = chartUtils.convertEnglish(param.target);
        $scope.reset();
        $scope.todayClass = true;
        $scope.btnchecked = false;
        var opt = {
            type: type,
            interval: 12,
            pieType: "vapie"
        }
        requestService.request($scope.start, $scope.end, opt, $scope.lineChartConfig);
        requestService.pieRequest($scope.start, $scope.end, opt, $scope.pieChartConfig);

    }
    $scope.lineChartConfig = {
        legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "新访客数", "IP数", "页面转化", "订单数", "订单金额", "订单转化率"],
        chartId: "indicators_charts",
        chartType: "line",
        dataKey: "time",
        dataValue: "value",
        onLegendClick: $scope.onLegendClick
    }
    $scope.pieChartConfig = {
        legendData: [],
        chartId: "sourse_charts",
        pieStyle: true,
        serieName: "访问情况",
        chartType: "pie",
        dataKey: "name",
        dataValue: "value"
    }
    $scope.today = function () {
        $scope.reset();
        $scope.todayClass = true;
        $scope.btnchecked = false;
        $scope.dt = new Date();
        var opt = {
            type: "pv",
            interval: 12,
            pieType: "vapie"
        }
        requestService.request($scope.start, $scope.end, opt, $scope.lineChartConfig);
        requestService.pieRequest($scope.start, $scope.end, opt, $scope.pieChartConfig);
    };
    $scope.yesterday = function () {
        $scope.reset();
        $scope.yesterdayClass = true;
        console.log("yesterday");
    };
    $scope.sevenDay = function () {
        $scope.reset();
        $scope.sevenDayClass = true;
        console.log("sevenDay");
    };
    $scope.month = function () {
        $scope.reset();
        $scope.monthClass = true;
        console.log("month");
    };
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
        $scope.reset();
        $scope.definClass = true;
    };

    $scope.change = function (value) {
        var opt = {
            type: value,
            interval: 12,
            pieType: "vapie"
        }
        requestService.request($scope.start, $scope.end, opt, $scope.lineChartConfig);
        requestService.pieRequest($scope.start, $scope.end, opt, $scope.pieChartConfig);
        //$http.get("/api/charts?start=" + $scope.start + "&end=" +$scope.end + "&type="+value+"&int=7").success(function (result) {
        //    console.log(result);
        //});
    }
    $scope.today();
});
