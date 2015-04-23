/**
 * Created by XiaoWei on 2015/4/22.
 */
app.controller("searchenginectr", function ($scope, $rootScope, $http, requestService) {

    $scope.pieFormat = function (data, config) {
        var json = JSON.parse(eval("(" + data + ")").toString());
        var tmpData = [];
        json.forEach(function (e) {
            e.key.forEach(function (item) {
                tmpData.push(chartUtils.getLinked(item));
            });
            e.key = tmpData;
        });
        cf.renderChart(json, config);
    }
    $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
        clear.lineChart($scope.charts[1].config, checkedVal);
        $scope.charts[0].types = checkedVal;
        $scope.charts[1].types = checkedVal;
        requestService.refresh($scope.charts);
    }
    $scope.charts = [{
        config: {
            legendData: ["外部链接", "直接访问", "搜索引擎", "外部链接"],
            id: "sourse_charts",
            pieStyle: true,
            serieName: "访问情况",
            chartType: "pie",
            dataKey: "key",
            dataValue: "quota"
        },
        types: ["pv"],
        dimension: ["rf_type"],
        url: "/api/map",
        cb: $scope.pieFormat
    }, {
        config: {
            legendId: "indicators_charts_legend",
            legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "新访客数", "IP数", "页面转化", "订单数", "订单金额", "订单转化率"],
            legendClickListener: $scope.onLegendClick,
            legendAllowCheckCount: 1,
            id: "indicators_charts",
            chartType: "line",
            dataKey: "key",
            dataValue: "quota"
        },
        types: ["pv"],
        dimension: ["period"],
        filter: "rf_type",
        filterVal: [1, 2, 3],
        interval: $rootScope.interval,
        url: "/api/charts"
    }]
    $scope.init = function () {
        $scope.charts.forEach(function (e) {
            var chart = echarts.init(document.getElementById(e.config.id));
            e.config.instance = chart;
            util.renderLegend(chart, e.config);
        })
        requestService.refresh($scope.charts);
    }
    $scope.init();
});