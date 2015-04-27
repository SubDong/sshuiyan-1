/**
 * Created by yousheng on 15/3/26.
 */

app.controller('indexctr', function ($scope, $rootScope, $http, requestService, messageService, areaService) {
        $scope.todayClass = true;
        $scope.dt = new Date();
        $scope.dayClass = true;
        $scope.timeselect = true;
        $scope.reset = function () {
            $scope.todayClass = false;
            $scope.yesterdayClass = false;
            $scope.sevenDayClass = false;
            $scope.monthClass = false;
            $scope.definClass = false;
        };
        $scope.gridOptions = {
            enableColumnMenus: false,
            enableSorting: true,
            enableScrollbars: false,
            enableGridMenu: false,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            columnDefs: [
                {name: 'name', displayName: "关键词"},
                {name: 'value', displayName: "浏览量"}
            ]
        };
        $scope.onLegendClickListener = function (radio, chartObj, chartConfig, checkedVal) {
            clear.lineChart($scope.charts[0].config, checkedVal);
            $scope.charts[0].types = checkedVal;
            var chartArray = [$scope.charts[0]];
            requestService.refresh(chartArray);

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
            cf.renderChart(json, config);
        }

        $scope.charts = [
            {
                config: {
                    legendId: "index_charts_legend",
                    legendData: ["浏览量(PV)", "访客数(UV)", "跳出率", "抵达率", "平均访问时长", "页面转化"],//显示几种数据
                    legendAllowCheckCount: 2,
                    legendClickListener: $scope.onLegendClickListener,
                    id: "index_charts",
                    bGap: false,//首行缩进
                    chartType: "line",//图表类型
                    dataKey: "key",//传入数据的key值
                    keyFormat: "hour",//x轴根据传入值生成
                    dataValue: "quota"//传入数据的value值
                },
                types: ["pv", "uv"],
                dimension: ["period"],
                interval: $rootScope.interval,
                url: "/api/charts"
            },
            {
                config: {
                    min_max: false,//是否显示最大，最小值
                    legendData: [],
                    id: "gest_map",
                    bGap: true,
                    chartType: "bar",
                    dataKey: "key",
                    dataValue: "quota"
                },
                types: ["pv"],
                dimension: ["region"],
                url: "/api/map"
            },
            {
                config: {
                    legendData: ["移动", "PC"],
                    chartType: "pie",
                    id: "environment_map",
                    serieName: "设备环境",
                    dataKey: "key",
                    dataValue: "quota"
                },
                types: ["pv"],
                dimension: ["pm"],
                url: "/api/pie",
                cb: $scope.pieFormat
            }
        ];
        $scope.grids = [
            {
                config: {
                    gridOptions: $scope.gridOptions
                },
                types: ["pv"],
                dimension: ["kw"],
                url: "/api/pie"
            }
        ]
        $scope.init = function () {

            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                util.renderLegend(chart, e.config);
            })
            //requestService.initCharts($scope.charts);
            requestService.refresh($scope.charts);
            requestService.gridRefresh($scope.grids);
        }
        $scope.init();

        $scope.today = function () {
            $scope.reset();
            $scope.todayClass = true;
            $rootScope.start = 0;
            $rootScope.end = 0;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.keyFormat = "hour";
            })
            requestService.refresh($scope.charts);
            requestService.gridRefresh($scope.grids);
        };
        $scope.yesterday = function () {
            $scope.reset();
            $scope.yesterdayClass = true;
            $rootScope.start = -1;
            $rootScope.end = -1;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.keyFormat = "hour";
            })
            requestService.refresh($scope.charts);
            requestService.gridRefresh($scope.grids);
        };
        $scope.sevenDay = function () {
            $scope.reset();
            $scope.sevenDayClass = true;
            $rootScope.start = -7;
            $rootScope.end = -1;
            $rootScope.interval = 7;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.keyFormat = "day";
            })
            requestService.refresh($scope.charts);
            requestService.gridRefresh($scope.grids);
        };
        $scope.month = function () {
            $scope.reset();
            $scope.monthClass = true;
            $rootScope.start = -30;
            $rootScope.end = -1;
            $rootScope.interval = 30;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.keyFormat = "day";
            })
            requestService.refresh($scope.charts);
            requestService.gridRefresh($scope.grids);
        };
        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
            $scope.reset();
            $scope.definClass = true;
        };

        $scope.hourcheck = function () {
            $scope.hourcheckClass = true;
            $scope.dayClass = false;
            $scope.timeselect = false;

        };
        $scope.daycheck = function () {
            $scope.hourcheckClass = false;
            $scope.dayClass = true;
            $scope.timeselect = true;

            $scope.today();
        };
        //下拉框
        $scope.mapChange = function (_this) {
            $scope.charts[1].types = _this.value;
            var chartArray = [$scope.charts[1]];
            requestService.refresh(chartArray);
        }
        $scope.equipmentChange = function (_this) {
            $scope.charts[2].types = _this.value;
            var chartArray = [$scope.charts[2]];
            requestService.refresh(chartArray);
        }
        $scope.searchChange = function (_this) {
            $scope.grids[0].types = _this.value;
            var chartArray = [$scope.grids[0]];
            requestService.gridRefresh(chartArray);
        }

        //index select
        $scope.disabled = undefined;
        $scope.enable = function () {
            $scope.disabled = false;
        };
        $scope.disable = function () {
            $scope.disabled = true;
        };
        $scope.clear = function () {
            $scope.country.selected = undefined;
            $scope.continent.selected = undefined;
        },
            $scope.continent = {};
        $scope.country = {};

    }
)
;
