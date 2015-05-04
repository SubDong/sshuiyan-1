/**
 * Created by XiaoWei on 2015/4/13.
 */
app.controller("sourcectr", function ($scope, $rootScope, $http, requestService, areaService) {
    $scope.todayClass = true;

    //table 参数配置
    $rootScope.tableTimeStart = 0;
    $rootScope.tableTimeEnd = 0;
    $rootScope.tableSwitch = {
        latitude:{name: "来源类型", field: "rf_type"},
        tableFilter:undefined,
        dimen:"rf_type",
        // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
        number:2,
        //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
        coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
        //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
    };



    $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
        clear.lineChart(config, checkedVal);
        $scope.charts.forEach(function (chart) {
            chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            chart.types = checkedVal;
        })
        requestService.refresh($scope.charts);
    }
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
    $scope.customFormat = function (data, config, e) {
        var json = JSON.parse(eval("(" + data + ")").toString());
        var result = chartUtils.getRf_type(json, $rootScope.start, null, e.types);
        config['noFormat'] = true;
        config['twoYz'] = "none";
        cf.renderChart(result, config);
    }
    $scope.charts = [
        {
            config: {
                legendData: ["外部链接", "搜索引擎", "直接访问"],
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
        },
        {
            config: {
                legendId: "source_charts_legend",
                legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "新访客数", "IP数", "页面转化", "订单数", "订单金额", "订单转化率"],
                legendClickListener: $scope.onLegendClick,
                legendAllowCheckCount: 1,
                id: "indicators_charts",
                min_max: false,
                bGap: true,
                chartType: "bar",
                keyFormat: "none",
                dataKey: "key",
                dataValue: "quota"
            },
            types: ["pv"],
            dimension: ["period,rf_type"],
            interval: $rootScope.interval,
            url: "/api/charts",
            cb: $scope.customFormat
        },
    ];
    $scope.init = function () {
        $rootScope.start = 0;
        $rootScope.end = 0;
        $rootScope.interval = undefined;
        $scope.charts.forEach(function (e) {
            var chart = echarts.init(document.getElementById(e.config.id));
            e.config.instance = chart;
            util.renderLegend(chart, e.config);
        })
        requestService.refresh($scope.charts);
    }
    $scope.init();

    $scope.$on("ssh_refresh_charts", function (e, msg) {
        $rootScope.targetSearch();
        $scope.charts.forEach(function (e) {
            var chart = echarts.init(document.getElementById(e.config.id));
            e.config.instance = chart;
        })
        requestService.refresh($scope.charts);
    });

    $scope.disabled = undefined;
    $scope.enable = function () {
        $scope.disabled = false;
    };
    $scope.disable = function () {
        $scope.disabled = true;
    };
    $scope.clear = function () {
        $scope.extendway.selected = undefined;
    };

});
