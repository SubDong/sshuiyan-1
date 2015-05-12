/**
 * Created by john on 2015/4/3.
 */
app.controller('wayctrl', function ($scope, $rootScope, $http, requestService, messageService, SEM_API_URL) {
    $scope.visible = true;
    $rootScope.tableTimeStart = 0;//开始时间
    $rootScope.tableTimeEnd = 0;//结束时间、
    //配置默认指标
    $rootScope.checkedArray = ["click", "cost", "cpc", "pv", "vc", "avgPage"];
    $rootScope.gridArray = [
        {name: "推广方式", displayName: "推广方式", field: "accountName"},
        {
            name: " ",
            cellTemplate: "<div class='table_box'><a href='http://www.best-ad.cn' class='table_btn'></a></div>"
        },
        {name: "点击", displayName: "点击", field: "click"},
        {name: "消费", displayName: "消费", field: "cost"},
        {name: "平均点击价格", displayName: "平均点击价格", field: "cpc"},
        {name: "浏览量(PV)", displayName: "浏览量(PV)", field: "pv"},
        {name: "访客数(UV)", displayName: "访客数(UV)", field: "vc"},
        {name: "平均访问页数", displayName: "平均访问页数", field: "avgPage"}
    ];
    $rootScope.tableSwitch = {
        latitude: {name: "推广方式", displayName: "推广方式", field: "accountName"},
        tableFilter: null,
        dimen: false,
        // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
        number: 1,
        //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
        coding: false,
        //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
        arrayClear: false, //是否清空指标array
        promotionSearch: true //是否开始推广中sem数据
    };

    $scope.reset = function () {
        $scope.todayClass = false;
        $scope.yesterdayClass = false;
        $scope.sevenDayClass = false;
        $scope.monthClass = false;
        $scope.definClass = false;
    };

    $scope.$on("ssh_refresh_charts", function (e, msg) {
        $rootScope.targetSearch();
        //$scope.doSearchAreas($scope.tableTimeStart, $scope.tableTimeEnd, "1", $scope.mapOrPieConfig);
    });


    $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
        clear.lineChart(config, checkedVal);
        $scope.charts.forEach(function (chart) {
            chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            chart.types = checkedVal;
        })
        requestService.refresh($scope.charts);
    }
    $scope.wayFormat = function (data, config) {

    }
    $scope.charts = [
        {
            config: {
                legendId: "indicators_charts_legend",
                legendData: ["浏览量(PV)", "访客数(UV)", "跳出率", "平均访问时长", "点击量", "消费", "转化次数"],
                legendClickListener: $scope.onLegendClick,
                legendAllowCheckCount: 2,
                bGap: true,
                min_max: false,
                id: "indicators_charts",
                chartType: "bar",
                dataKey: "key",
                keyFormat: 'none',
                dataValue: "quota"
            },
            types: ["pv", "outRate"],
            dimension: ["region"],
            interval: $rootScope.interval,
            url: "/api/charts"
        },
    ];
    //*************推广*********************/

    //**************************************/
    $scope.init = function () {
        var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
        $scope.charts[0].config.instance = chart;
        util.renderLegend(chart, $scope.charts[0].config);
        var chartArray = [$scope.charts[0]];
        requestService.refresh(chartArray);
    }
    $scope.init();
    $scope.today = function () {
        $scope.reset();
        $scope.todayClass = true;
    };
    $scope.yesterday = function () {
        $scope.reset();
        $scope.yesterdayClass = true;
    };
    $scope.sevenDay = function () {
        $scope.reset();
        $scope.sevenDayClass = true;

    };
    $scope.month = function () {
        $scope.reset();
        $scope.monthClass = true;

    };
    $scope.open = function ($event) {
        $scope.reset();
        $scope.definClass = true;
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
    $scope.checkopen = function ($event) {
        $scope.reset();
        $scope.definClass = true;
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opens = true;
    };
    // initialize
    $scope.yesterday();
    //$scope.initMap();
    $scope.disabled = undefined;
    $scope.enable = function () {
        $scope.disabled = false;
    };

    $scope.disable = function () {
        $scope.disabled = true;
    };

    $scope.clear = function () {
        $scope.page.selected = undefined;
        $scope.city.selected = undefined;
        $scope.country.selected = undefined;
        $scope.continent.selected = undefined;
    };
    $scope.page = {};
    $scope.pages = [
        {name: '全部页面目标'},
        {name: '全部事件目标'},
        {name: '所有页面右上角按钮'},
        {name: '所有页面底部400按钮'},
        {name: '详情页右侧按钮'},
        {name: '时长目标'},
        {name: '访问页数目标'},
    ];
    $scope.country = {};
    $scope.countrys = [
        {name: '中国'},
        {name: '泰国'},

    ];
    $scope.city = {};
    $scope.citys = [
        {name: '北京'},
        {name: '上海'},
        {name: '成都'},
    ];
    $scope.continent = {};
    $scope.continents = [
        {name: '亚洲'},
        {name: '美洲 '},
    ];
    //日历
    this.selectedDates = [new Date().setHours(0, 0, 0, 0)];
    this.type = 'range';
    /*      this.identity = angular.identity;*/

    this.removeFromSelected = function (dt) {
        this.selectedDates.splice(this.selectedDates.indexOf(dt), 1);
    }
})
