/**
 * Created by yousheng on 15/3/26.
 */

app.controller('indexctr', function ($scope, $rootScope, $http, requestService, messageService, areaService) {
        $scope.todayClass = true;
        $scope.dayClass = true;
        $scope.timeselect = true;
        $scope.reset = function () {
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
                {name: 'value', displayName: "浏览量(PV)"}
            ]
        };
        $scope.onLegendClickListener = function (radio, chartObj, chartConfig, checkedVal) {
            clear.lineChart($scope.charts[0].config, checkedVal);
            $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
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
        $scope.indexLineFormat = function (data, config, e) {
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
                    legendId: "index_charts_legend",
                    legendData: ["浏览量(PV)", "访客数(UV)", "跳出率", "抵达率", "平均访问时长", "页面转化"],//显示几种数据
                    legendAllowCheckCount: 2,
                    legendClickListener: $scope.onLegendClickListener,
                    legendDefaultChecked: [0, 1],
                    id: "index_charts",
                    bGap: false,//首行缩进
                    min_max: false,
                    chartType: "line",//图表类型
                    dataKey: "key",//传入数据的key值
                    dataValue: "quota"//传入数据的value值
                },
                types: ["pv", "uv"],
                dimension: ["period"],
                interval: $rootScope.interval,
                url: "/api/charts",
                cb: $scope.indexLineFormat
            },
            {
                config: {
                    min_max: false,//是否显示最大，最小值
                    legendData: [],
                    id: "gest_map",
                    bGap: true,
                    chartType: "bar",
                    auotHidex: true,
                    dataKey: "key",
                    keyFormat: 'none',
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
                    serieName: "所占比例",
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
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.interval = undefined;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                util.renderLegend(chart, e.config);
            })
            requestService.refresh($scope.charts);
            requestService.gridRefresh($scope.grids);
        }
        $scope.init();

        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $scope.charts.forEach(function (chart) {
                chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            });
            if ($rootScope.start <= -7) {
                $scope.charts[0].config.keyFormat = "day";
            } else {
                $scope.charts[0].config.keyFormat = "hour";
            }
            requestService.refresh($scope.charts);
            requestService.gridRefresh($scope.grids);
        });
        $scope.hourcheck = function () {
            $scope.hourcheckClass = true;
            $scope.dayClass = false;
            $scope.timeselect = false;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.interval = 1;
            });
            if ($rootScope.start <= -7) {
                $scope.charts[0].config.keyFormat = "day";
            } else {
                $scope.charts[0].config.keyFormat = "hour";
            }
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
            });
            if ($rootScope.start <= -7) {
                $scope.charts[0].config.keyFormat = "day";
            } else {
                $scope.charts[0].config.keyFormat = "hour";
            }
            requestService.refresh($scope.charts);
        };
        $scope.weekcheck = function () {
            $scope.weekcheckClass = true;
            requestService.refresh($scope.charts);

        };

        //下拉框
        $scope.mapChange = function (_this) {
            $scope.charts[1].types = _this.value;
            $scope.charts[1].config.instance = echarts.init(document.getElementById($scope.charts[1].config.id));
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
            $scope.gridOptions.columnDefs[1].displayName = _this.name;
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
        }
        $scope.continent = {};
        $scope.country = {};

        //
        $scope.dateClosed = function () {
            $rootScope.start = $scope.startOffset;
            $rootScope.end = $scope.endOffset;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
            })
            if ($rootScope.start <= -1) {
                $scope.charts[0].config.keyFormat = "day";
            } else {
                $scope.charts[0].config.keyFormat = "hour";
            }
            requestService.refresh($scope.charts);
            requestService.gridRefresh($scope.grids);

        };
        //

        this.selectedDates = [new Date().setHours(0, 0, 0, 0)];
        //this.type = 'range';
        /*      this.identity = angular.identity;*/
        //$scope.$broadcast("update", "msg");
        $scope.$on("update", function (e, datas) {
            // 选择时间段后接收的事件
            datas.sort();
            //console.log(datas);
            var startTime = datas[0];
            var endTime = datas[datas.length - 1];
            $scope.startOffset = (startTime - today_start()) / 86400000;
            $scope.endOffset = (endTime - today_start()) / 86400000;
            //console.log("startOffset=" + startOffset + ", " + "endOffset=" + endOffset);

        });

    }
)
;
