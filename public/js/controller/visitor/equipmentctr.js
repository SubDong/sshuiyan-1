/**
 * Created by XiaoWei on 2015/4/22.
 */
app.controller('equipmentctr', function ($scope, $rootScope, $http, requestService, areaService) {
    $scope.todayClass = true;
    $scope.dt = new Date();
    //table配置
    $rootScope.tableTimeStart = 0;
    $rootScope.tableTimeEnd = 0;
    $rootScope.tableSwitch = {
        latitude: {name: "网络供应商", field: "isp"},
        tableFilter: undefined,
        dimen: "region",
        // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
        number: 0,
        //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
        coding: false
        //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
    };
    //

    $scope.reset = function () {
        $scope.todayClass = false;
        $scope.yesterdayClass = false;
        $scope.sevenDayClass = false;
        $scope.monthClass = false;
        $scope.definClass = false;
    };
    $scope.equipmentChange = function (val) {
        $scope.charts[0].dimension = val.field;
        requestService.refresh($scope.charts);

        $rootScope.tableSwitch.latitude = val;
        val.field == "ips" ? $rootScope.tableSwitch.dimen = "region" : val.field == "pm" ? $rootScope.tableSwitch.dimen = "br" : $rootScope.tableSwitch.dimen = false
        $rootScope.indicators(null, null, null, "refresh");
        $rootScope.targetSearch();


    }
    $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
        $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
        $scope.charts[0].types = checkedVal;
        var chartArray = [$scope.charts[0]];
        requestService.refresh(chartArray);
    }
    $scope.pieFormat = function (data, config) {
        var json = JSON.parse(eval("(" + data + ")").toString());

        json.forEach(function (e) {
            var tmpData = [];
            var _value = []
            for (var i = 1; i < 12; i++) {
                tmpData.push("");
                _value.push(0);
            }
            for (var i = 0; i < e.key.length; i++) {
                if ($scope.equipment.selected)
                    tmpData.push(chartUtils.getCustomDevice(e.key[i], $scope.equipment.selected.field));
                else
                    tmpData.push(e.key[i]);

                _value.push(e.quota[i]);
            }
            for (var i = 12; i < 24; i++) {
                tmpData.push("");
                _value.push(0);
            }
            e.key = tmpData;
            e.quota = _value;
            e.label = chartUtils.convertChinese(e.label);
        });
        config["noFormat"] = "noFormat";
        config['twoYz'] = "none"
        cf.renderChart(json, config);
    }
    $scope.charts = [
        {
            config: {
                legendId: "equipment_legend",
                legendData: ["访客数(UV)", "访问次数", "新访客数", "IP数", "贡献浏览量", "转化次数"],
                legendClickListener: $scope.onLegendClick,
                legendAllowCheckCount: 2,
                min_max: false,
                bGap: true,
                id: "equipment",
                chartType: "bar",
                dataKey: "key",
                keyFormat: 'none',
                dataValue: "quota"
            },
            types: ["uv"],
            dimension: ["isp"],
            interval: $rootScope.interval,
            url: "/api/charts",
            cb: $scope.pieFormat
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
    $scope.$on("ssh_refresh_charts", function (e, msg) {
        $rootScope.targetSearch();
        var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
        $scope.charts[0].config.instance = chart;
        requestService.refresh($scope.charts);
    });


    $scope.checkopen = function ($event) {
        $scope.reset();
        $scope.definClass = true;
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opens = true;
    };

});