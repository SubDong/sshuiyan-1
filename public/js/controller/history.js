/**
 * Created by SubDong on 2015/5/14.
 */
define(['./module'], function (ctrs) {
    'use strict';
    ctrs.controller('history', function ($scope, $window, $location, $rootScope, requestService, areaService, $http, SEM_API_URL) {
        if ($rootScope.gridArray == undefined || $rootScope.tableSwitch == undefined) {
            $rootScope.gridArray = [];
            var temp_path = $location.path();
            var _index = temp_path.indexOf("/history");
            $location.path(temp_path.substring(0, _index));
        }

        $scope.monthClass = true;
        var esType = $rootScope.userType;

        $rootScope.tableTimeStart = -29;
        $rootScope.tableTimeEnd = -0;
        $rootScope.tableFormat = null;


        $rootScope.gridArray[0] = {name: "日期", displayName: "日期", field: "period"};
        $rootScope.gridArray.splice(1, 1);
        $rootScope.tableSwitch.dimen = false;

        $rootScope.tableSwitch.latitude = {name: "日期", displayName: "日期", field: "period"};
        $rootScope.historyJu = "NO";

        $scope.historyInit = function () {
            var getTime = $rootScope.tableTimeStart <= -6 ? "day" : "hour";
            if ($rootScope.tableSwitch.number == 4) {
                var searchUrl = SEM_API_URL + "elasticsearch/" + esType + "/?startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd;
                $http({
                    method: 'GET',
                    url: searchUrl
                }).success(function (data, status) {
                    var newDataInfo = "";
                    if(getTime == "hour"){
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
                        newDataInfo =  result;
                    }else{
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
                    if(getTime == "hour"){
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
                        newDataInfo1 =  result;
                    }else{
                        newDataInfo1 = data;
                    }
                    $scope.$broadcast("history", newDataInfo1);
                    $rootScope.historyJu = "";
                    $scope.init(data, $rootScope.checkedArray);
                }).error(function (error) {
                    console.log(error);
                });
            }
        }
        $scope.charts = [
            {
                config: {
                    id: 'VistorMap_charts',
                    //legendId: "index_charts_legend",
                    //legendData: ["浏览量(PV)", "访客数(UV)", "跳出率", "抵达率", "平均访问时长", "页面转化"],//显示几种数据
                    min_max: false,
                    chartType: "line",//图表类型
                    lineType: 'none',
                    bGap: true,
                    keyFormat: 'none',
                    toolTip: false,
                    noFormat: true,
                    twoYz: true,
                    qingXie: false,
                    dataKey: "key",//传入数据的key值
                    dataValue: "quota"//传入数据的value值
                }
            }
        ];
        $scope.init = function (data, quotas) {
            $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
            if ($rootScope.tableTimeStart > -6) {
                $scope.charts[0].config.noFormat = undefined;
                cf.renderChart(data, $scope.charts[0].config);
                return;
            }
            $scope.charts[0].config.noFormat = true;
            var final_result = [];
            if (data) {
                quotas.forEach(function (quota) {
                    var _tmp = {};
                    var _key = [];
                    var _val = [];
                    data.forEach(function (item) {
                        _val.push(item[quota]);
                        _key.push(item["period"]);
                    });
                    _tmp["label"] = chartUtils.convertChinese(quota);
                    _tmp["quota"] = _val;
                    _tmp["key"] = _key;
                    final_result.push(_tmp);
                });
                cf.renderChart(final_result, $scope.charts[0].config);
            }
        }

        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $scope.historyInit()
        });
        //日历
        this.selectedDates = [new Date().setHours(0, 0, 0, 0)];

        this.type = 'range';
        this.removeFromSelected = function (dt) {
            this.selectedDates.splice(this.selectedDates.indexOf(dt), 1);
        }
    });
});