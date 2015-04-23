/**
 * Created by XiaoWei on 2015/4/22.
 */
app.controller('entrancepagectr', function ($scope, $rootScope, $http, requestService) {
    $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
        clear.lineChart($scope.charts[1].config, checkedVal);
        $scope.charts[0].types = checkedVal;
        $scope.charts[1].types = checkedVal;
        requestService.refresh($scope.charts);
    }
    $scope.pieFormat = function (data, config) {
        var json = JSON.parse(eval("(" + data + ")").toString());
        cf.renderChart(json, config);
    }
    $scope.mainFormat = function (data, config) {
        var json = JSON.parse(eval("(" + data + ")").toString());
        var result = chartUtils.getRf_type(json, $rootScope.start,"labelType");
        config['noFormat'] = true;
        cf.renderChart(result, config);
    }

    $scope.charts = [
        {
            config: {
                legendData: [],
                id: "sourse_charts",
                pieStyle: true,
                serieName: "访问情况",
                chartType: "pie",
                dataKey: "key",
                dataValue: "quota"
            },
            types: ["pv"],
            dimension: ["rf"],
            url: "/api/map",
            cb: $scope.pieFormat
        },
        {
            config: {
                legendId: "indicators_charts_legend",
                legendData: ["访客数(UV)", "访问次数", "新访客数", "IP数", "贡献浏览量", "转化次数"],
                legendClickListener: $scope.onLegendClick,
                legendAllowCheckCount: 1,
                id: "indicators_charts",
                bGap:true,
                chartType: "bar",
                dataKey: "key",
                dataValue: "quota"
            },
            types: ["pv"],
            dimension: ["period,rf"],
            interval: $rootScope.interval,
            url: "/api/charts",
            cb: $scope.mainFormat
        }
    ]
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