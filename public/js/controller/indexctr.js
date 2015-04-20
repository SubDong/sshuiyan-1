/**
 * Created by yousheng on 15/3/26.
 */

app.controller('indexctr', function ($scope, $rootScope, $http, requestService, messageService) {


        $scope.todayClass = true;
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
            enableScrollbars: false,
            enableGridMenu: true,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            columnDefs: [
                {name: 'name', displayName: "关键词"},
                {name: 'value', displayName: "浏览量"}
            ]
        };
        $scope.onLegendClickListener = function (radio, chartObj, chartConfig, checkedVal) {
            $scope.charts[0].types = checkedVal;
            var chartarray = [$scope.charts[0]];
            requestService.refresh(chartarray);
        }
        $scope.indexLineFormat = function (data) {
            return data;
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
                    dataKey: "time",//传入数据的key值
                    dataValue: "value"//传入数据的value值
                },
                types: ["pv"],
                quota: [],
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
                    dataKey: "name",
                    dataValue: "value"
                },
                types: ["pv"],
                quota: ["region"],
                url: "/api/map"
            },
            {
                config: {
                    legendData: [],
                    chartType: "pie",
                    id: "environment_map",
                    serieName: "设备环境",
                    dataKey: "name",
                    dataValue: "value"
                },
                types: ["pv"],
                quota: ["device"],
                url: "/api/pie"
            }
        ];
        $scope.grids = [
            {
                config: {
                    gridOptions:$scope.gridOptions
                },
                types: ["pv"],
                quota: ["keyword"],
                url: "/api/grid"
            }
        ]
        $scope.init = function () {

            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                if (e.config.legendData.length > 0) {
                    util.renderLegend(chart, e.config);
                }
            })
            //requestService.initCharts($scope.charts);
            requestService.refresh($scope.charts);
            requestService.gridRefresh($scope.grids);
        }
        $scope.init();

        $scope.today = function () {
            $scope.reset();
            $scope.todayClass = true;
            $rootScope.start = today_start().getTime();
            $rootScope.end = today_end().getTime();
            requestService.refresh($scope.charts);
            requestService.gridRefresh($scope.grids);
        };
        $scope.yesterday = function () {
            $scope.reset();
            $scope.yesterdayClass = true;
            $rootScope.start = yesterday_start().getTime();
            $rootScope.end = yesterday_end().getTime();
            requestService.refresh($scope.charts);
            requestService.gridRefresh($scope.grids);
        };
        $scope.sevenDay = function () {
            $scope.reset();
            $scope.sevenDayClass = true;
            $rootScope.start = lastWeek_start().getTime();
            requestService.refresh($scope.charts);
            requestService.gridRefresh($scope.grids);
        };
        $scope.month = function () {
            $scope.reset();
            $scope.monthClass = true;
            $rootScope.start = lastMonth_start().getTime();
            $rootScope.end = today_end().getTime();
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
        $scope.selected = '';
        $scope.view = [
            {
                id: 2,
                when: '访客次数(UV) '
            },
            {
                id: 3,
                when: '新访客数'
            },
            {
                id: 4,
                when: 'IP数'
            },
            {
                id: 5,
                when: '跳出率'
            },
            {
                id: 6,
                when: '平均访问时长'

            }, {
                id: 7,
                when: '转化次数'
            },


        ]
        $scope.twoview = [
            {
                id: 8,
                when: '访客次数(UV) '
            },
            {
                id: 9,
                when: '新访客数'
            },
            {
                id: 10,
                when: 'IP数'
            },
            {
                id: 11,
                when: '跳出率'
            },
            {
                id: 12,
                when: '平均访问时长'
            }, {
                id: 13,
                when: '转化次数'
            },


        ]
        $scope.threeview = [
            {
                id: 15,
                when: '访客次数(UV) '
            },
            {
                id: 16,
                when: '新访客数'
            },
            {
                id: 17,
                when: 'IP数'
            },
            {
                id: 18,
                when: '跳出率'
            },
            {
                id: 19,
                when: '平均访问时长'
            }, {
                id: 20,
                when: '转化次数'
            },
        ]

    }
)
;
