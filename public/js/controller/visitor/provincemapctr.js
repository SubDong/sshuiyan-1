/**
 * Created by john on 2015/3/31.
 */
define(["./module"], function (ctrs) {

    ctrs.controller("provincemapctr", function ($scope, $rootScope, $http) {
        $scope.todayClass = true;

        $rootScope.tableTimeStart = 0;//开始时间
        $rootScope.tableTimeEnd = 0;//结束时间、
        $rootScope.tableFormat = null;
        //配置默认指标
        $rootScope.checkedArray = ["pv", "uv", "outRate"];
        $rootScope.gridArray = [
            {name: "a", displayName: "序列号", cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",maxWidth:70},
            {name: "地域", displayName: "地域", field: "region"},
            {
                name: " ",
                cellTemplate: "<div class='table_box'><a ui-sref='history1' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' class='table_nextbtn'></a></div>"
            },
            {name: "浏览量(PV)", displayName: "浏览量(PV)", field: "pv"},
            {name: "访客数(UV)", displayName: "访客数(UV)", field: "uv"},
            {name: "跳出率", displayName: "跳出率", field: "outRate"}
        ];
        $rootScope.tableSwitch = {
            latitude: {name: "地域", displayName: "地域", field: "region"},
            tableFilter: null,
            dimen: "city",
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 1,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: false,
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false //是否清空指标array
        };

        $scope.dateTimeStart = 0;
        $scope.dateTimeEnd = 0;

        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $rootScope.targetSearch();
            $scope.doSearchAreas($scope.tableTimeStart, $scope.tableTimeEnd, "2", $scope.mapOrPieConfig);
        });

        $scope.gridOptions = {
            enableScrollbars: false,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            columnDefs: [
                {name: '地域', displayName: "地域"},
                {name: '访问时间', displayName: "访问时间"},
                {name: '来源', displayName: "来源"},
                {name: '访问IP', displayName: "访问IP"},
                {name: '访问时长', displayName: "访问时长"},
                {name: '访问页数', displayName: "访问页数"},
            ]
        };

        $scope.mapOrPieConfig = {
            chartId: "VistorMap_charts",
            serieName: "地域分布"
        }

        $scope.areas = "region";
        $scope.property = "loc";

        $scope.setProperty = function (property, position, entities) {
            $scope.property = property;
            $scope.doSearchAreas($scope.dateTimeStart, $scope.dateTimeEnd, "2", $scope.mapOrPieConfig);
        }

        $scope.setArea = function (area) {
            $scope.areas = area;
            $scope.doSearchAreas()
        };
        $scope.lat = "region";
        $scope.setLat = function (lat) {
            if (lat == undefined) {
                $scope.lat = "region";
            } else {
                $scope.lat = lat;
            }
        }
        /**
         * 基础数据
         * @param start
         * @param end
         * @param areas  地域分组
         * @param property  数据统计
         * @param type
         */
        $scope.doSearch = function (start, end, type) {
            var quotas = [];
            quotas.push("pv");
            quotas.push("uv");
            quotas.push("ip");
            quotas.push("outRate");
            quotas.push("avgTime");
            $http({
                method: 'GET',
                url: '/api/visitormap/?start=' + start + "&end=" + end + "&type=" + type + "&quotas=" + quotas
            }).success(function (data, status) {
                $scope.pv = data.pv;
                $scope.uv = data.uv;
                $scope.ip = data.ip;
                $scope.jump = data.outRate;
                $scope.avgTime = data.avgTime;
            }).error(function (error) {
                console.log(error);
            });
        };


        //图表数据
        $scope.doSearchAreas = function (start, end, type, chartConfig) {
            var chart = echarts.init(document.getElementById(chartConfig.chartId));
            var jupName = "";
            chart.on("hover", function (param) {
                var option = this.getOption();
                var mapSeries = option.series[0];
                if (param.seriesIndex == 1) {
                    var data = [];
                    if (jupName == param.name) {
                        return;
                    }
                    jupName = param.name;
                    for (var p = 0, len = mapSeries.data.length; p < len; p++) {
                        var name = mapSeries.data[p].name;
                        if (mapSeries.data[p].name == param.name) {
                            data.push({
                                name: name,
                                value: option.series[0].data[p].value,
                                tooltip: {
                                    show: true,
                                    trigger: 'item',
                                    formatter: "{a} <br/>{b} : {c}"
                                },
                                selected: true
                            });
                        } else {
                            data.push({
                                name: name,
                                value: option.series[0].data[p].value,
                                selected: false
                            });
                        }
                    }
                    option.series[0].data = data;
                    chart.setOption(option, true);
                }
            });

            $http({
                method: 'GET',
                url: '/api/provincemap/?start=' + start + "&end=" + end + "&type=" + type + "&areas=" + $scope.areas + "&property=" + $scope.property
            }).success(function (data, status) {
                var title_name;
                switch ($scope.property) {
                    case "loc":
                        title_name = "浏览量(PV)";
                        break;
                    case "tt":
                        title_name = "访问次数";
                        break;
                    case "_ucv":
                        title_name = "访客数(UV)";
                        break;
                    case "ct":
                        title_name = "新访客数";
                        break;
                    case "remote":
                        title_name = "IP数";
                        break;
                }
                data["title_name"] = title_name;
                mixingMap.mapOrPie(data, chart);

            }).error(function (error) {
                console.log(error);
            });
        };

        //图标数据

        // init
        $scope.doSearch($scope.dateTimeStart, $scope.dateTimeEnd, "2");
        $scope.doSearchAreas($scope.dateTimeStart, $scope.dateTimeEnd, "2", $scope.mapOrPieConfig);
        $scope.mapselect = [
            {consumption_name: "浏览量(PV)"},
            {consumption_name: "访问次数"},
            {consumption_name: "访客数(UV)"},
            {consumption_name: "新访客数"},
            {consumption_name: "新访客比率"},
            {consumption_name: "IP数"}
        ];
        $scope.mapset = function (row) {


        };
        //日历
        this.selectedDates = [new Date().setHours(0, 0, 0, 0)];
        this.type = 'range';
        /*      this.identity = angular.identity;*/

        //日历
        $rootScope.datepickerClick = function (start, end, label) {
            var time = chartUtils.getTimeOffset(start, end);
            $rootScope.tableTimeStart = time[0];
            $rootScope.tableTimeEnd = time[1];
            $rootScope.targetSearch();
            $scope.doSearchAreas($rootScope.tableTimeStart, $rootScope.tableTimeEnd, "2", $scope.mapOrPieConfig);
            $scope.$broadcast("ssh_dateShow_options_time_change");
        }

    });

});
