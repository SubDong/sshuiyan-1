/**
 * Created by XiaoWei on 2015/4/22.
 */
app.controller('flowanalysisctr', function ($scope, $rootScope, $http, requestService) {
    $scope.todayClass = true;
    $scope.reset = function () {
        $scope.todayClass = false;
        $scope.yesterdayClass = false;
        $scope.sevenDayClass = false;
        $scope.monthClass = false;
        $scope.definClass = false;
        $scope.btnchecked = true;
    };
    $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
        clear.lineChart(config, checkedVal);
        $scope.charts.forEach(function (chart) {
            chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            chart.types = checkedVal;
        });
        requestService.refresh($scope.charts);
    }
    $scope.pieFormat = function (data, config) {
        var json = JSON.parse(eval("(" + data + ")").toString());
        cf.renderChart(json, config);
    }
    $scope.flowanalyFomrmat = function (data, config, e) {
        var json = JSON.parse(eval("(" + data + ")").toString());
        var result = chartUtils.getRf_type(json, $rootScope.start, "serverLabel", e.types);
        var final_result = chartUtils.getExternalinkPie(result);//获取barchart的数据
        config['noFormat'] = true;
        cf.renderChart(result, config);
        var pieData = chartUtils.getEnginePie(final_result);
        $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
        cf.renderChart(pieData, $scope.charts[0].config);
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
                min_max: false,
                bGap: true,
                chartType: "bar",
                keyFormat:'none',
                dataKey: "key",
                dataValue: "quota"
            },
            types: ["pv"],
            dimension: ["period,loc"],
            interval: $rootScope.interval,
            url: "/api/charts",
            cb: $scope.flowanalyFomrmat
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

    $scope.today = function () {
        $scope.reset();
        $scope.todayClass = true;
        //table 参数配置
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        //
        $rootScope.start = 0;
        $rootScope.end = 0;
        $rootScope.interval
        var chart = echarts.init(document.getElementById($scope.charts[1].config.id));
        $scope.charts[1].config.instance = chart;
        var arrayChart = [$scope.charts[1]]
        requestService.refresh(arrayChart);
    }

    $scope.yesterday = function () {
        $scope.reset();
        $scope.yesterdayClass = true;
        //table 参数配置
        $rootScope.tableTimeStart = -1;
        $rootScope.tableTimeEnd = -1;
        $rootScope.start = -1;
        $rootScope.end = -1;
        var chart = echarts.init(document.getElementById($scope.charts[1].config.id));
        $scope.charts[1].config.instance = chart;
        var arrayChart = [$scope.charts[1]]
        requestService.refresh(arrayChart);
    };

    $scope.sevenDay = function () {
        $scope.reset();
        $scope.sevenDayClass = true;
        //table 参数配置
        $rootScope.tableTimeStart = -7;
        $rootScope.tableTimeEnd = -1;
        $rootScope.start = -7;
        $rootScope.end = -1;
        $rootScope.interval = 24;
        var chart = echarts.init(document.getElementById($scope.charts[1].config.id));
        $scope.charts[1].config.instance = chart;
        var arrayChart = [$scope.charts[1]]
        requestService.refresh(arrayChart);
    };

    $scope.month = function () {
        $scope.reset();
        $scope.monthClass = true;
        //table 参数配置
        $rootScope.tableTimeStart = -30;
        $rootScope.tableTimeEnd = -1;
        $rootScope.start = -30;
        $rootScope.end = -1;
        $rootScope.interval = 24;
        var chart = echarts.init(document.getElementById($scope.charts[1].config.id));
        $scope.charts[1].config.instance = chart;
        var arrayChart = [$scope.charts[1]]
        requestService.refresh(arrayChart);
    };
});