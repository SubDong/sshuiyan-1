/**
 * Created by baizz on 2015-4-3.
 */
app.controller('Trend_realtime_ctrl', function ($scope, $rootScope, $http, requestService, messageService, $log, areaService) {
    $scope.visitorCount = 0;
    //table配置
    $rootScope.tableTimeStart = 0;
    $rootScope.tableTimeEnd = 0;
    $rootScope.checkedArray = 'SS';
    $rootScope.tableSwitch = {
        latitude: {name: "地域", displayName: "地域", field: "region"},
        tableFilter: null,
        dimen: true,
        // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
        number: 0,
        //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
        coding: false,
        //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
        arrayClear: false //是否清空指标array
    };

    //
    $scope.onLegendClickListener = function (radio, chartObj, chartConfig, checkedVal) {
        clear.lineChart($scope.charts[0].config, checkedVal);
        $scope.charts.forEach(function (chart) {
            chart.types = checkedVal;
            chart.config.instance = echarts.init(document.getElementById(chart.config.id))
        })
        requestService.refresh($scope.charts);
    }
    $scope.realTimeFormat = function (data, config, e) {
        var json = JSON.parse(eval("(" + data + ")").toString());
        var result = json[0].result;
        var final_result = [];
        e.types.forEach(function (qtype) {
            switch (qtype) {
                case "pv":
                    var _key = [];
                    var _quota = [];
                    result.buckets.forEach(function (e) {
                        _key.push(new Date(e.key).toUTCString().substring(17, 22));
                        _quota.push(e.pv_aggs.value);
                    });
                    final_result.push({label: chartUtils.convertChinese('pv'), key: _key, quota: _quota})
                    break;
                case "uv":
                    var _key = [];
                    var _quota = [];
                    result.buckets.forEach(function (e) {
                        _key.push(new Date(e.key).toUTCString().substring(17, 22));
                        _quota.push(e.uv_aggs.value);
                    });
                    final_result.push({label: chartUtils.convertChinese('uv'), key: _key, quota: _quota})
                    break;
                case "ip":
                    var _key = [];
                    var _quota = [];
                    result.buckets.forEach(function (e) {
                        _key.push(new Date(e.key).toUTCString().substring(17, 22));
                        _quota.push(e.ip_aggs.value);
                    });
                    final_result.push({label: chartUtils.convertChinese('ip'), key: _key, quota: _quota})
                    break;
            }
        });
        config["noFormat"] = "noFormat";
        config["twoYz"] = "twoYz";
        cf.renderChart(final_result, config);
    }
    $scope.charts = [
        {
            config: {
                legendData: ["浏览量(PV)", "访客数(UV)", "IP数"],
                legendId: "realtime_charts_legend",
                legendAllowCheckCount: 2,
                legendClickListener: $scope.onLegendClickListener,
                legendDefaultChecked: [0, 1],
                //显示几种数据
                id: "realtime_charts",
                min_max: false,
                bGap: false,//首行缩进
                chartType: "line",//图表类型
                keyFormat: 'none',
                dataKey: "key",//传入数据的key值
                dataValue: "quota"//传入数据的value值
            },
            types: ["pv", "uv"],
            dimension: ["period"],
            interval: $rootScope.interval,
            url: "/api/halfhour",
            cb: $scope.realTimeFormat
        }];

    $scope.init = function () {
        $rootScope.start = 0;
        $rootScope.end = 0;
        $rootScope.interval = undefined;
        $scope.charts.forEach(function (e) {
            var chart = echarts.init(document.getElementById(e.config.id));
            e.config.instance = chart;
            util.renderLegend(chart, e.config);
        })
        //requestService.initCharts($scope.charts);
        requestService.refresh($scope.charts);
        Custom.initCheckInfo();
    }
    $scope.init();
    $scope.initPerson = function () {
        $http.get("/api/halfhour?type=uv&start=0&end=0?userType=" + $rootScope.userType).success(function (data) {
            var json = JSON.parse(eval("(" + data + ")").toString());
            var result = json[0].result;
            result.buckets.forEach(function (e) {
                $scope.visitorCount += e.uv_aggs.value;
            });
        });
    }
    $scope.initPerson();
    /*    $scope.search = function (keyword, time, ip) {
     requestService.gridRequest($scope.startTime, $scope.endTime, $scope.gridOptions, "uv");
     };*/
    $scope.calTimePeriod = function () {
        $scope.endTime = new Date().valueOf();
        $scope.startTime = $scope.endTime - 30 * 60 * 1000;
    };
    // initialize
    $scope.calTimePeriod();
    $scope.disabled = undefined;
    $scope.enable = function () {
        $scope.disabled = false;
    };

    $scope.disable = function () {
        $scope.disabled = true;
    };

    $scope.clear = function () {
        $scope.city.selected = undefined;
        $scope.country.selected = undefined;
        $scope.souce.selected = undefined;
    };

});