/**
 * Created by SubDong on 2015/5/14.
 */
define(['./module'], function (ctrs) {
    'use strict';
    ctrs.controller('history', function ($cookieStore, $scope, $window, $location, $rootScope, requestService, areaService, $http, SEM_API_URL) {

        //        高级搜索提示
        $scope.sourceSearch = "";
        $scope.visitorSearch = "";
//        取消显示的高级搜索的条件
        $scope.removeSourceSearch = function (obj) {
            $scope.souce.selected = {"name": "全部"};
            $rootScope.$broadcast("loadAllSource");
            obj.sourceSearch = "";
        }
        $scope.removeVisitorSearch = function (obj) {
            $rootScope.$broadcast("loadAllVisitor");
            obj.visitorSearch = "";
        }
        $scope.SELECT_PAGE = 0;
        $scope.SELECT_EVENT = 1;
        $scope.SELECT_ALL = -1;


        $scope.extendway = {selected: {name: "全部事件目标", id: $scope.SELECT_EVENT}};
        $scope.childrenExtendway = {selected: {name: "请选择", id: $scope.SELECT_ALL}};


        var uid = $cookieStore.get("uid");
        var site_id = $rootScope.siteId;


        //转化目标-父级别切换
        $scope.extendwayChange = function (extendway) {
            $scope.extendway = extendway;
            var url = "";

            if (extendway.selected.id == $scope.SELECT_PAGE) { //页面
                url = "/config/page_conv?type=search&query={\"uid\":\"" + uid + "\",\"site_id\":\"" + site_id + "\"}";
            } else if (extendway.selected.id == $scope.SELECT_EVENT) { //事件
                url = "/config/eventchnage_list?type=search&query={\"uid\":\"" + uid + "\",\"root_url\":\"" + site_id + "\"}";
            }

            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                $scope.childrenExtendways = [];
                var childrenExtendways = [{name: "查询所有", id: $scope.SELECT_ALL}];
                if (extendway.selected.id == $scope.SELECT_PAGE) { //页面
                    angular.forEach(dataConfig, function (data) {
                        angular.forEach(data.target_url, function (thisv1) {
                            var obj = {};
                            obj.name = data.target_name;
                            obj.id = thisv1.url;
                            childrenExtendways.push(obj);
                        });
                    });
                } else if (extendway.selected.id == $scope.SELECT_EVENT) {//事件
                    angular.forEach(dataConfig, function (data) {
                        var obj = {};
                        obj.name = data.event_name;
                        obj.id = data.event_id;
                        childrenExtendways.push(obj);
                    });
                }
                $scope.childrenExtendways = childrenExtendways;
                $scope.childrenExtendway = {selected: {name: "请选择", id: $scope.SELECT_ALL}};
            });
        }

        //转化目标-子级别切换
        $scope.childrenExtendwayChange = function (childrenExtendway) {

            $scope.childrenExtendway = childrenExtendway;

            if ($scope.extendway.selected.id == $scope.SELECT_PAGE) {
                $rootScope.tableSwitch.tableFilter = "[{\"loc\":[\"" + childrenExtendway.selected.id + "\"]}]";
            } else if ($scope.extendway.selected.id == $scope.SELECT_EVENT) {
                $rootScope.tableSwitch.tableFilter = "[{\"et_category\":[\"" + childrenExtendway.selected.id + "\"]}]";
            }

            $scope.radioCheckVal = ["conversions"];
            $scope.refreshChart(["conversions"]);
        }


        if ($rootScope.gridArray == undefined || $rootScope.tableSwitch == undefined) {
            $rootScope.gridArray = [];
            var temp_path = $location.path();
            var _index = temp_path.indexOf("/history");
            $location.path(temp_path.substring(0, _index));
        }
        $scope.webName = $rootScope.webName
        $scope.monthClass = true;
        var esType = $rootScope.userType;

        $rootScope.end = 0;
        $rootScope.start = -29;
        $rootScope.tableTimeStart = -29;
        $rootScope.tableTimeEnd = 0;
        $rootScope.tableFormat = null;


        $rootScope.gridArray[0] = {
            name: "日期",
            displayName: "日期",
            cellClass: 'grid_padding',
            headerCellClass: 'grid_padding',
            field: "period",
            footerCellTemplate: "<div class='ui-grid-cell-contents grid_padding'>当页汇总</div>"
        };
        $rootScope.gridArray.splice(1, 1);
        if ($rootScope.tableSwitch) {
            $rootScope.tableSwitch.dimen = false;
            $rootScope.tableSwitch.latitude = {
                name: "日期",
                displayName: "日期",
                field: "period",
                cellClass: 'grid_padding'
            };
        }

        $rootScope.historyJu = "NO";

        $scope.historyInit = function () {
            var getTime = $rootScope.tableTimeStart < -1 ? "day" : "hour";
            if ($rootScope.tableSwitch.number == 4) {
                var searchUrl = SEM_API_URL + "search_word/" + esType + "/?startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd;
                $http({
                    method: 'GET',
                    url: searchUrl
                }).success(function (data, status) {
                    var newDataInfo = "";
                    if (getTime == "hour") {
                        var result = [];
                        var vaNumber = 0;
                        var maps = {}
                        var newData = chartUtils.getByHourByDayData(data);
                        newData.forEach(function (info, x) {
                            for (var i = 0; i < info.key.length; i++) {
                                var infoKey = info.key[i];
                                var obj = maps[infoKey];
                                if (!obj) {
                                    obj = {};
                                    var dataString = (infoKey.toString().length >= 2 ? "" : "0")
                                    obj["period"] = dataString + infoKey + ":00 - " + dataString + infoKey + ":59";
                                    maps[infoKey] = obj;
                                }
                                obj[chartUtils.convertEnglish(info.label)] = info.quota[i]
                                maps[infoKey] = obj;
                            }
                        });
                        for (var key in maps) {
                            if (key != null) {
                                result.push(maps[key]);
                            }
                        }
                        newDataInfo = result;
                    } else {
                        newDataInfo = data;
                    }


                    $scope.$broadcast("history", newDataInfo);
                    $rootScope.historyJu = "";

                })
            } else {
                $rootScope.tableSwitch.number = 0;
                $http({
                    method: 'GET',
                    url: '/api/indextable/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=" + $rootScope.tableSwitch.latitude.field
                    + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&formartInfo=" + getTime + "&type=" + esType
                }).success(function (data, status) {
                    var newDataInfo1 = "";
                    if (getTime == "hour") {
                        var result = [];
                        var vaNumber = 0;
                        var maps = {}
                        var newData = chartUtils.getByHourByDayData(data);
                        newData.forEach(function (info, x) {
                            for (var i = 0; i < info.key.length; i++) {
                                var infoKey = info.key[i];
                                var obj = maps[infoKey];
                                if (!obj) {
                                    obj = {};
                                    var dataString = (infoKey.toString().length >= 2 ? "" : "0")
                                    obj["period"] = dataString + infoKey + ":00 - " + dataString + infoKey + ":59";
                                    maps[infoKey] = obj;
                                }
                                obj[chartUtils.convertEnglish(info.label)] = info.quota[i]
                                maps[infoKey] = obj;
                            }
                        });
                        for (var key in maps) {
                            if (key != null) {
                                result.push(maps[key]);
                            }
                        }
                        newDataInfo1 = result;
                    } else {
                        newDataInfo1 = data;
                    }
                    $scope.$broadcast("history", newDataInfo1);
                    $rootScope.historyJu = "";
                }).error(function (error) {
                    console.log(error);
                });
            }
        }
        $scope.radioCheckVal = [];
        $scope.refreshChart = function (types) {
            var quota = $scope.radioCheckVal;
            if (types) {
                esType = $rootScope.userType;
                quota = types;
                if (types == "conversions") {  //转化次数
                    if ($scope.extendway.selected.id == $scope.SELECT_PAGE) { //页面转化
                        if ($scope.childrenExtendway.selected.id == $scope.SELECT_ALL) {//是否查询所有
                            $rootScope.tableSwitch.tableFilter = "null";
                        } else {
                            $rootScope.tableSwitch.tableFilter = "[{\"loc\":[\"" + $scope.childrenExtendway.selected.id + "\"]}]";
                        }
                    } else if ($scope.extendway.selected.id == $scope.SELECT_EVENT) { //事件转化
                        esType = "1_event"; //查询类型 1_event
                        if ($scope.childrenExtendway.selected.id == $scope.SELECT_ALL) {//是否查询所有
                            $rootScope.tableSwitch.tableFilter = "null";

                        } else {
                            $rootScope.tableSwitch.tableFilter = "[{\"et_category\":[\"" + $scope.childrenExtendway.selected.id + "\"]}]";
                        }
                    }
                }
            }

            var chart = $scope.charts[0];
            if ($rootScope.end - $rootScope.start == 0) {
                chart.config.keyFormat = "none";
            } else {
                chart.config.keyFormat = "day";
            }
            var getTime = $rootScope.tableTimeStart < -1 ? "day" : "hour";
            var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
            $scope.charts[0].config.instance = chart;
            chart.showLoading({
                effect: 'whirling',
                text: "正在努力的读取数据中..."
            });
            $http({
                method: 'GET',
                url: '/api/indextable/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + quota + "&dimension=" + $rootScope.tableSwitch.latitude.field
                + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&formartInfo=" + getTime + "&type=" + esType
            }).success(function (data, status) {
                if ($rootScope.tableTimeStart >= -1) {
                    $scope.charts[0].config.noFormat = undefined;
                    cf.renderChart(data, $scope.charts[0].config);
                } else {
                    $scope.charts[0].config.noFormat = true;
                    var final_result = chartUtils.getHistoryData(data, quota);
                    cf.renderChart(final_result, $scope.charts[0].config);
                }
            });
        }

        $scope.onLegendClickListener = function (radio, chartObj, chartConfig, checkedVal) {
            $scope.radioCheckVal = checkedVal;
            $scope.refreshChart(checkedVal);
        }
        $scope.charts = [
            {
                config: {
                    id: 'VistorMap_charts',
                    legendId: "VistorMap_charts_legend",
                    legendData: ["浏览量(PV)", "访问次数", "访客数(UV)", "新访客数", "新访客比率", "IP数", "跳出率", "平均访问时长", "平均访问页数"],//显示几种数据
                    min_max: false,
                    chartType: "line",//图表类型
                    legendClickListener: $scope.onLegendClickListener,
                    lineType: 'none',
                    bGap: false,
                    keyFormat: 'day',
                    noFormat: true,
                    qingXie: false,
                    dataKey: "key",//传入数据的key值
                    dataValue: "quota"//传入数据的value值
                }
            }
        ];
        $scope.init = function () {
            var customLegendData = [];

            $rootScope.checkedArray.push("conversions"); //转化次数

            $rootScope.checkedArray.forEach(function (item) {
                customLegendData.push(chartUtils.convertChinese(item));
            });
            $scope.charts[0].config.legendData = customLegendData;
            $scope.radioCheckVal = [$rootScope.checkedArray[0]];
            var quota = [$rootScope.checkedArray[0]];
            var getTime = $rootScope.tableTimeStart < -1 ? "day" : "hour";
            $http({
                method: 'GET',
                url: '/api/indextable/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + quota + "&dimension=" + $rootScope.tableSwitch.latitude.field
                + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&formartInfo=" + getTime + "&type=" + esType
            }).success(function (data, status) {
                var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
                chart.showLoading({
                    effect: 'whirling',
                    text: "正在努力的读取数据中..."
                });
                util.renderLegend(chart, $scope.charts[0].config);
                Custom.initCheckInfo();
                $scope.charts[0].config.instance = chart;
                if ($rootScope.tableTimeStart > -6) {
                    $scope.charts[0].config.noFormat = undefined;
                    cf.renderChart(data, $scope.charts[0].config);
                    return;
                }
                $scope.charts[0].config.noFormat = true;
                var final_result = chartUtils.getHistoryData(data, quota)
                cf.renderChart(final_result, $scope.charts[0].config);
            });
        }
        $scope.init();

        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $scope.historyInit();
            $scope.refreshChart();
        });
        $rootScope.datepickerClick = function (start, end, label) {
            $scope.timeClass = true;
            var time = chartUtils.getTimeOffset(start, end);
            $rootScope.tableTimeStart = time[0];
            $rootScope.tableTimeEnd = time[1];
            $scope.reset();
            $scope.charts[0].config.keyFormat = "day";
            $scope.refreshChart();
            $scope.historyInit();
        }
        //日历
        this.selectedDates = [new Date().setHours(0, 0, 0, 0)];

        this.type = 'range';
        this.removeFromSelected = function (dt) {
            this.selectedDates.splice(this.selectedDates.indexOf(dt), 1);
        }
    });
});