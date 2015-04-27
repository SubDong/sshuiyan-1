/**
 * Created by XiaoWei on 2015/4/22.
 */
app.controller('equipmentctr', function ($scope, $rootScope, $http, requestService,areaService) {
    $scope.todayClass = true;
    $scope.dt = new Date();
    //table配置
    $rootScope.tableTimeStart = 0;
    $rootScope.tableTimeEnd = 0;
    $rootScope.tableFilter = undefined;

    $scope.reset = function () {
        $scope.todayClass = false;
        $scope.yesterdayClass = false;
        $scope.sevenDayClass = false;
        $scope.monthClass = false;
        $scope.definClass = false;
    };
    $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
        clear.lineChart($scope.charts[0].config, checkedVal);
        $scope.charts[0].types = checkedVal;
        requestService.refresh($scope.charts);
    }
    $scope.pieFormat = function (data, config) {
        var json = JSON.parse(eval("(" + data + ")").toString());
        var tmpData = [];
        json.forEach(function (e) {
            e.key.forEach(function (item) {
                tmpData.push(chartUtils.getDevice(item));
            });
            e.key = tmpData;
        });
        config["dataType"]="noFormat";
        cf.renderChart(data, config);
    }
    $scope.charts = [
        {
            config: {
                legendId: "equipment_legend",
                legendData: ["访客数(UV)", "访问次数", "新访客数", "IP数", "贡献浏览量", "转化次数"],
                legendClickListener: $scope.onLegendClick,
                legendAllowCheckCount: 1,
                min_max:false,
                bGap:true,
                id: "equipment",
                chartType: "bar",
                dataKey: "key",
                dataValue: "quota"
            },
            types: ["pv"],
            dimension: ["pm"],
            interval: $rootScope.interval,
            url: "/api/charts",
            cb:$scope.pieFormat
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
        //table配置
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;

        $rootScope.start = 0;
        $rootScope.end = 0;
        $rootScope.interval = 24;
        var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
        $scope.charts[0].config.instance = chart;
        requestService.refresh($scope.charts);
    };
    $scope.yesterday = function () {
        $scope.reset();
        $scope.yesterdayClass = true;

        //table配置
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;

        $rootScope.start = -1;
        $rootScope.end = -1;
        $rootScope.interval = 24;
        var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
        $scope.charts[0].config.instance = chart;
        requestService.refresh($scope.charts);

    };

    $scope.sevenDay = function () {
        $scope.reset();
        $scope.sevenDayClass = true;
        $rootScope.tableTimeStart = -7;
        $rootScope.tableTimeEnd = -1;

    };
    $scope.month = function () {
        $scope.reset();
        $scope.monthClass = true;
        $rootScope.tableTimeStart = -30;
        $rootScope.tableTimeEnd = -1;

    };

    $scope.checkopen = function ($event) {
        $scope.reset();
        $scope.definClass = true;
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opens = true;
    };

});