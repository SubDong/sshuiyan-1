/**
 * Created by john on 2015/4/1.
 */
app.controller('trend_month_ctrl', function ($scope, $rootScope, $http, requestService, messageService, areaService, uiGridConstants) {
    $scope.monthClass = true;
    $scope.dayClass = true;
    $scope.reset = function () {
        $scope.todayClass = false;
        $scope.yesterdayClass = false;
        $scope.sevenDayClass = false;
        $scope.monthClass = false;
        $scope.definClass = false;
        $scope.hourcheckClass = false;
    };
    //table配置
    $rootScope.tableTimeStart = -30;
    $rootScope.tableTimeEnd = -1;
    $rootScope.tableSwitch = {
        latitude:{name: "日期", field: "period"},
        tableFilter:null,
        dimen:false,
        // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
        number:0,
        //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
        coding:false,
        //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
        arrayClear: true //是否清空指标array
    };
    //

    $scope.dt = new Date();
    $scope.onLegendClickListener = function (radio, chartObj, chartConfig, checkedVal) {
        clear.lineChart($scope.charts[0].config, checkedVal);
        $scope.charts[0].types = checkedVal;
        var chartarray = [$scope.charts[0]];
        requestService.refresh(chartarray);
    }
    $scope.monthFormat = function (data, config, e) {
        if (e.interval == 1) {
            var final_result = chartUtils.getByHourByDayData(data);
            config["noFormat"] = "noFormat";
            config["keyFormat"] = "none";
            cf.renderChart(final_result, config);
        } else {
            cf.renderChart(data, config);
        }
    }
    $scope.charts = [
        {
            config: {
                legendId: "moth_charts_legend",
                legendAllowCheckCount: 2,
                legendClickListener: $scope.onLegendClickListener,
                legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "新访客数", "新访客比率", "IP数", "跳出率", "平均访问时长", "平均访问页数", "转化次数", "转化率"],//显示几种数据
                legendDefaultChecked: [0, 1],
                id: "moth_charts",
                min_max:false,
                bGap: false,//首行缩进
                chartType: "line",//图表类型
                dataKey: "key",//传入数据的key值
                dataValue: "quota"//传入数据的value值

            },
            types: ["pv", "uv"],
            dimension: ["period"],
            interval: $rootScope.interval,
            url: "/api/charts",
            cb: $scope.monthFormat
        }];

    $scope.init = function () {
        $rootScope.start = -30;
        $rootScope.end = -1;
        $rootScope.interval = undefined;
        $scope.charts.forEach(function (e) {
            var chart = echarts.init(document.getElementById(e.config.id));
            e.config.instance = chart;
            if ($rootScope.start <= -7) {
                e.config.keyFormat = "day";
            } else {
                e.config.keyFormat = "hour";
            }
            util.renderLegend(chart, e.config);
        })
        requestService.refresh($scope.charts);
    }
    $scope.init();

    $scope.$on("ssh_refresh_charts", function (e, msg) {
        $rootScope.targetSearch();
        $scope.charts.forEach(function (chart) {
            chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            if ($rootScope.start <= -7) {
                chart.config.keyFormat = "day";
            } else {
                chart.config.keyFormat = "hour";
            }
        });
        requestService.refresh($scope.charts);
    });

    $scope.hourcheck = function () {
        $scope.dayClass = false;
        $scope.hourcheckClass = true;
        $scope.timeselect = false;
        $scope.charts.forEach(function (e) {
            var chart = echarts.init(document.getElementById(e.config.id));
            e.config.instance = chart;
            e.interval = 1;
            if ($rootScope.start <= -7) {
                e.config.keyFormat = "day";
            } else {
                e.config.keyFormat = "hour";
            }
        });
        requestService.refresh($scope.charts);

    };
    $scope.daycheck = function () {
        $scope.hourcheckClass = false;
        $scope.dayClass = true;
        $scope.timeselect = true;
        $scope.charts.forEach(function (e) {
            var chart = echarts.init(document.getElementById(e.config.id));
            e.config.instance = chart;
            e.interval = undefined;
            e.config.noFormat = undefined;
            if ($rootScope.start <= -7) {
                e.config.keyFormat = "day";
            } else {
                e.config.keyFormat = "hour";
            }
        });
        requestService.refresh($scope.charts);
    };

    $scope.clear = function () {
        $scope.extendway.selected = undefined;
        $scope.city.selected = undefined;
        $scope.country.selected = undefined;
        $scope.continent.selected = undefined;
        $scope.souce.selected = undefined;
    };
    $scope.extendway = {};
    $scope.extendways = [
        {name: '全部页面目标'},
        {name: '公告'},
        {name: '全部事件目标'},
        {name: '完整下载'},
        {name: '在线下载'},
        {name: '时长目标'},
        {name: '访问页数目标'},
    ];
    $scope.souce = {};
    $scope.souces = [
        {name: '全部'},
        {name: '直接访问'},
        {name: '搜索引擎'},
        {name: '外部链接'},
    ];
    //日历
    this.selectedDates = [new Date().setHours(0, 0, 0, 0)];
    this.type = 'range';
    /*      this.identity = angular.identity;*/

    this.removeFromSelected = function (dt) {
        this.selectedDates.splice(this.selectedDates.indexOf(dt), 1);
    }
});
