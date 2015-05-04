/**
 * Created by XiaoWei on 2015/4/22.
 */
app.controller("searchenginectr", function ($scope, $rootScope, $http, requestService, areaService) {
    $scope.todayClass = true;
    //table配置
    $rootScope.tableTimeStart = 0;
    $rootScope.tableTimeEnd = 0;
    $rootScope.tableSwitch = {
        latitude:{name: "搜索引擎", field: "se"},
        tableFilter:[{"rf_type": ["2"]}],
        dimen:false,
        // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
        number:2,
        //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
        coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>",
        //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
        arrayClear: true //是否清空指标array
    };


    $scope.pieFormat = function (data, config) {
        var json = JSON.parse(eval("(" + data + ")").toString());
        cf.renderChart(json, config);
    }
    $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
        clear.lineChart(config, checkedVal);
        $scope.charts.forEach(function (chart) {
            chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            chart.types = checkedVal;
        });
        requestService.refresh($scope.charts);
    }
    $scope.searchengineFormat = function (data, config, e) {
        var json = JSON.parse(eval("(" + data + ")").toString());
        var result_json = chartUtils.getRf_type(json, $rootScope.start, "serverLabel", e.types);
        config['noFormat'] = true;
        config['twoYz'] = "none"
        cf.renderChart(result_json, config);
        //var pieData = chartUtils.getEnginePie(final_result);
        //$scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
        //cf.renderChart(pieData, $scope.charts[0].config);

    }
    $scope.charts = [{
        config: {
            legendData: [],
            id: "sourse_charts",
            pieStyle: true,
            serieName: "搜索引擎",
            chartType: "pie",
            dataKey: "key",
            dataValue: "quota"
        },
        types: ["pv"],
        dimension: ["se"],
        filter: "[{\"rf_type\":[\"2\"]}]",
        url: "/api/map",
        cb: $scope.pieFormat
    },
        {
            config: {
                legendId: "indicators_charts_legend",
                legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "新访客数", "IP数", "页面转化", "订单数", "订单金额", "订单转化率"],
                legendClickListener: $scope.onLegendClick,
                legendAllowCheckCount: 1,
                min_max: false,
                bGap: false,
                id: "indicators_charts",
                chartType: "bar",
                keyFormat: "none",//设置不需要chart工厂处理x轴数据
                dataKey: "key",
                dataValue: "quota"
            },
            types: ["pv"],
            dimension: ["period,se"],
            filter: "[{\"rf_type\":[\"2\"]}]",
            interval: $rootScope.interval,
            url: "/api/charts",
            cb: $scope.searchengineFormat
        }]
    $scope.init = function () {
        $rootScope.start = 0;
        $rootScope.end = 0;
        $rootScope.interval = undefined;
        $scope.charts.forEach(function (chart) {
            chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            util.renderLegend(chart, chart.config);
        });
        requestService.refresh($scope.charts);
    }
    $scope.init();
    $scope.$on("ssh_refresh_charts", function (e, msg) {
        $rootScope.targetSearch();
        $scope.charts.forEach(function (chart) {
            chart.config.instance = echarts.init(document.getElementById(chart.config.id));
        });
        requestService.refresh($scope.charts);
    });
});