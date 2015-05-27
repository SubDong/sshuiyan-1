/**
 * Created by john on 2015/3/30.
 */
define(["app"], function (app) {

    "use strict";

    app.controller("TabsCtrl", function ($timeout, $scope, $rootScope, $http, $q, requestService, SEM_API_URL, $cookieStore) {
        $scope.todayClass = true;
        var user = $rootScope.user
        var baiduAccount = $rootScope.baiduAccount;
        var esType = $rootScope.userType;

        $scope.tabs = [
            {title: 'Dynamic Title 1', content: 'Dynamic content 1'},
            {title: 'Dynamic Title 2', content: 'Dynamic content 2', disabled: true}
        ]
        //sem
        $scope.target = [
            {consumption_name: "展现量", name: "impression"},
            {consumption_name: "点击量", name: "click"},
            {consumption_name: "消费", name: "cost"},
            {consumption_name: "点击率", name: "ctr"},
            {consumption_name: "平均点击价格", name: "cpc"}
        ];
        //
        $scope.Webbased = [
            {consumption_name: "浏览量(PV)", name: "pv"},
            {consumption_name: "访问次数", name: "vc"},
            {consumption_name: "访客数(UV)", name: "uv"},
            {consumption_name: "新访客数", name: "nuv"},
            {consumption_name: "新访客比率", name: "nuvRate"},
            //{consumption_name: "页头访问次数", name: "o1"}
        ];
        $scope.flow = [
            {consumption_name: "跳出率", name: "outRate"},
            {consumption_name: "平均访问时长", name: "avgTime"},
            {consumption_name: "平均访问页数", name: "avgPage"},
            {consumption_name: "抵达率", name: "arrivedRate"},
        ];
        $scope.transform = [
            {consumption_name: "转化次数", name: "m1"},
            {consumption_name: "转化率", name: "m2"},
            {consumption_name: "平均转化成本", name: "m3"},
            {consumption_name: "收益", name: "m4"},
            {consumption_name: "利润", name: "m5"},
            {consumption_name: "投资回报率", name: "m6"},
        ];
        $scope.mobile = [
            {consumption_name: "搜索页直拨电话展现", name: "v1"},
            {consumption_name: "搜索页直拨电话点击", name: "v2"},
            {consumption_name: "搜索页直拨电话消费", name: "v3"},
            {consumption_name: "搜索页沟通展现", name: "v4"},
            {consumption_name: "搜索页沟通点击", name: "v5"},
            {consumption_name: "搜索页沟通消费", name: "v6"},
            {consumption_name: "搜索页回呼电话展现", name: "v7"},
            {consumption_name: "搜索页回呼电话点击", name: "v8"},
            {consumption_name: "搜索页回呼电话消费", name: "v9"},
            {consumption_name: "搜索页APP下载展现", name: "b1"},
            {consumption_name: "搜索页APP下载点击", name: "b2"},
            {consumption_name: "搜索页APP下载消费", name: "b3"},
        ];
        $scope.recall = [
            {consumption_name: "电话量", name: "z7"},
            {consumption_name: "已接电话量", name: "z8"},
            {consumption_name: "平均通话时长", name: "z9"},
            {consumption_name: "漏接电话量", name: "x1"}
        ];
        $scope.TodayWeb = [
            {consumption_name: "浏览量(PV)", name: "pv"},
            {consumption_name: "访问次数", name: "vc"},
            {consumption_name: "访客数(UV)", name: "uv"},
            {consumption_name: "新访客数", name: "nuv"},
            {consumption_name: "新访客比率", name: "nuvRate"},
            {consumption_name: "IP数", name: "ip"}
        ];
        $scope.Todytransform = [
            {consumption_name: "转化次数", name: "zhuanF"},
            {consumption_name: "转化率", name: "zhuanN"}
        ];
        $scope.Todayfloweds = [
            {consumption_name: "跳出率", name: "outRate"},
            {consumption_name: "平均访问时长", name: "avgTime"},
            {consumption_name: "平均访问页数", name: "avgPage"},
        ];
        $scope.Order = [
            {consumption_name: "订单数", name: "q4"},
            {consumption_name: "订单金额", name: "q5"},
            {consumption_name: "订单转化率", name: "q6"}
        ];
        $scope.Indexform = [
            {consumption_name: "转化指标", name: "q7"},
            {consumption_name: "转化率", name: "q8"}
        ];
        $scope.Indexfloweds = [
            //{consumption_name: "贡献浏览量", name: "q9"},
            {consumption_name: "跳出率", name: "outRate"},
            {consumption_name: "平均访问时长", name: "avgTime"},
            {consumption_name: "平均访问页数", name: "avgPage"},
        ];
        $scope.Mapwebbase = [
            {consumption_name: "浏览量(PV)", name: "pv"},
            //{consumption_name: "浏览量占比", name: "a5"},
            {consumption_name: "访问次数", name: "vc"},
            {consumption_name: "访客数(UV)", name: "uv"},
            {consumption_name: "新访客数", name: "nuv"},
            {consumption_name: "新访客比率", name: "nuvRate"},
            {consumption_name: "IP数", name: "ip"}
        ];
        $scope.Novisitorbase = [
            {consumption_name: "浏览量(PV)", name: "pv"},
            //{consumption_name: "浏览量占比", name: "z3"},
            {consumption_name: "访问次数", name: "vc"},
            {consumption_name: "访客数(UV)", name: "uv"},
            {consumption_name: "IP数", name: "ip"}
        ];
        var getHtmlTableData = function () {
            $http({
                method: 'GET',
                url: '/api/realTimeAccess/?filerInfo=' + $rootScope.tableSwitch.tableFilter + "&type=" + esType
            }).success(function (data, status) {
                $scope.gridOpArray = angular.copy($rootScope.gridArray);
                $scope.gridOptions.columnDefs = $scope.gridOpArray;
                $scope.gridOptions.data = data;
            }).error(function (error) {
                console.log(error);
            });
        };
        if (typeof($rootScope.checkedArray) != undefined && $rootScope.checkedArray == "SS") {
            $scope.tableJu = "html";
            $rootScope.gridArray = [
                {
                    name: "xl",
                    displayName: "",
                    cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                    maxWidth: 10
                },
                {name: '地域', displayName: "地域", field: "city"},
                {name: '访问时间', displayName: "访问时间", field: "utime"},
                {
                    name: '来源',
                    displayName: "来源",
                    field: "source",
                    cellTemplate: "<a href='{{grid.appScope.getDataUrlInfo(grid, row,1)}}' style='color:#0965b8;line-height:30px; display:block; padding:0 10px;'>{{grid.appScope.getDataUrlInfo(grid, row,2)}}</a>"
                },
                {name: '访客标识码', displayName: "访客标识码", field: "tt"},
                {name: "访问IP", displayName: "访问IP", field: "ip"},
                {name: "访问时长", displayName: "访问时长", field: "utimeAll"},
                {name: "访问页数", displayName: "访问页数", field: "pageNumber"}];
            getHtmlTableData();
        } else {
            if ($rootScope.tableSwitch.arrayClear)$rootScope.checkedArray = new Array();
            if ($rootScope.tableSwitch.arrayClear)$rootScope.gridArray = new Array();
        }

        //table Button 配置 table_nextbtn
        if ($rootScope.tableSwitch.number == 1) {
            $scope.gridBtnDivObj = "<div class='table_box'><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' class='table_nextbtn test'  title='查看历史趋势'></a></div>";
        } else if ($rootScope.tableSwitch.number == 2) {
            $scope.gridBtnDivObj = "<div class='table_box'><button onmousemove='getMyButton(this)' class='table_btn'></button><div class='table_win'><ul style='color: #45b1ec'>" + $rootScope.tableSwitch.coding + "</ul></div></div>";
        }
        $rootScope.indicators = function (item, entities, number, refresh) {
            $rootScope.gridArray.shift();
            $rootScope.gridArray.shift();
            if (refresh == "refresh") {
                $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude);
                return
            }
            $rootScope.tableSwitch.number != 0 ? $scope.gridArray.shift() : "";
            $scope.gridObj = {};
            $scope.gridObjButton = {};
            var a = $rootScope.checkedArray.indexOf(item.name);
            if (a != -1) {
                $rootScope.checkedArray.splice(a, 1);
                $rootScope.gridArray.splice(a, 1);

                if ($rootScope.tableSwitch.number != 0) {
                    $scope.gridObjButton["name"] = " ";
                    $scope.gridObjButton["cellTemplate"] = $scope.gridBtnDivObj;
                    $rootScope.gridArray.unshift($scope.gridObjButton);
                }
                $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude);
            } else {
                if ($rootScope.checkedArray.length >= number) {
                    $rootScope.checkedArray.shift();
                    $rootScope.checkedArray.push(item.name);
                    $rootScope.gridArray.shift();

                    $scope.gridObj["name"] = item.consumption_name;
                    $scope.gridObj["displayName"] = item.consumption_name;
                    $scope.gridObj["field"] = item.name;

                    $rootScope.gridArray.push($scope.gridObj);

                    if ($rootScope.tableSwitch.number != 0) {
                        $scope.gridObjButton["name"] = " ";
                        $scope.gridObjButton["cellTemplate"] = $scope.gridBtnDivObj;
                        $rootScope.gridArray.unshift($scope.gridObjButton);
                    }

                    $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude);
                    $scope.gridObjButton = {};
                    $scope.gridObjButton["name"] = "xl";
                    $scope.gridObjButton["displayName"] = "";
                    $scope.gridObjButton["cellTemplate"] = "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>";
                    $scope.gridObjButton["maxWidth"] = 10;
                    $rootScope.gridArray.unshift($scope.gridObjButton);
                } else {
                    $rootScope.checkedArray.push(item.name);

                    $scope.gridObj["name"] = item.consumption_name;
                    $scope.gridObj["displayName"] = item.consumption_name;
                    $scope.gridObj["field"] = item.name;
                    $rootScope.gridArray.push($scope.gridObj);

                    if ($rootScope.tableSwitch.number != 0) {
                        $scope.gridObjButton["name"] = " ";
                        $scope.gridObjButton["cellTemplate"] = $scope.gridBtnDivObj;
                        $rootScope.gridArray.unshift($scope.gridObjButton);
                    }
                    $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude);
                    $scope.gridObjButton = {};
                    $scope.gridObjButton["name"] = "xl";
                    $scope.gridObjButton["displayName"] = "";
                    $scope.gridObjButton["cellTemplate"] = "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>";
                    $scope.gridObjButton["maxWidth"] = 10;
                    $rootScope.gridArray.unshift($scope.gridObjButton);
                }
            }
            angular.forEach(entities, function (subscription, index) {
                if (subscription.name == item.name) {
                    $scope.classInfo = 'current';
                }
            });
            //$rootScope.$broadcast("ssh_reload_datashow");
        };
        // 推广概况表格配置项
        if (typeof($rootScope.checkedArray) != undefined && $scope.tableJu == "html") {
            $scope.gridOptions = {
                paginationPageSize: 25,
                expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions'></div>",
                expandableRowHeight: 360,
                enableColumnMenus: false,
                enablePaginationControls: false,
                enableSorting: true,
                enableGridMenu: false,
                enableHorizontalScrollbar: 0,
                columnDefs: $scope.gridOpArray,
                onRegisterApi: function (girApi) {
                    $rootScope.gridApi2 = girApi;
                    griApihtml(girApi);
                }
            };
        } else {
            $scope.gridOptions = {
                paginationPageSize: 25,
                expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions'></div>",
                expandableRowHeight: 360,
                enableColumnMenus: false,
                enablePaginationControls: false,
                enableSorting: true,
                enableGridMenu: false,
                enableHorizontalScrollbar: 0,
                columnDefs: $scope.gridOpArray,
                onRegisterApi: function (gridApi) {
                    $rootScope.gridApi2 = gridApi;
                    if ($rootScope.tableSwitch.dimen) {
                        griApiInfo(gridApi);
                    }
                }
            };
        }
        $scope.page = "";
        $scope.pagego = function (pagevalue) {
            pagevalue.pagination.seek(Number($scope.page));
        }

        //地图分类
        $scope.setDimen = function (a) {
            $rootScope.tableSwitch.dimen = a;
            $scope.targetSearch();
        }
        //设置来源终端
        $scope.setTerminal = function (a) {
            if (a == 0) $rootScope.tableSwitch.tableFilter = null;
            if (a == 1) $rootScope.tableSwitch.tableFilter = "[{\"pm\":[0]}]";
            if (a == 2) $rootScope.tableSwitch.tableFilter = "[{\"pm\":[1]}]";
            $scope.isJudge = false;
            $scope.targetSearch();
        };
        //设置（外部链接）设备过滤
        $scope.setExLinkTerminal = function (a) {
            if (a == 0) $rootScope.tableSwitch.tableFilter = "[{\"rf_type\":[3]}]";
            if (a == 1) $rootScope.tableSwitch.tableFilter = "[{\"pm\":[0]},{\"rf_type\":[3]}]";
            if (a == 2) $rootScope.tableSwitch.tableFilter = "[{\"pm\":[1]},{\"rf_type\":[3]}]";
            $scope.isJudge = false;
            $scope.targetSearch();
        };
        //设置（搜索引擎）设备过滤
        $scope.setSearchEngineTerminal = function (a) {
            if (a == 0) $rootScope.tableSwitch.tableFilter = "[{\"rf_type\":[2]}]";
            if (a == 1) $rootScope.tableSwitch.tableFilter = "[{\"pm\":[0]},{\"rf_type\":[2]}]";
            if (a == 2) $rootScope.tableSwitch.tableFilter = "[{\"pm\":[1]},{\"rf_type\":[2]}]";
            $scope.isJudge = false;
            $scope.targetSearch();
        };
        //设置来源过滤
        $scope.setSource = function (a) {
            if (a == 0) $rootScope.tableSwitch.tableFilter = null;
            if (a == 1) $rootScope.tableSwitch.tableFilter = "[{\"rf_type\":[1]}]";
            if (a == 2) $rootScope.tableSwitch.tableFilter = "[{\"rf_type\":[2]}]";
            if (a == 3) $rootScope.tableSwitch.tableFilter = "[{\"rf_type\":[3]}]";
            $scope.isJudge = false;
            $scope.targetSearch();
        };
        //设置访客来源
        $scope.setVisitors = function (a) {
            if (a == 0) $rootScope.tableSwitch.tableFilter = null;
            if (a == 1) $rootScope.tableSwitch.tableFilter = "[{\"ct\":[0]}]";
            if (a == 2) $rootScope.tableSwitch.tableFilter = "[{\"ct\":[1]}]";
            $scope.isJudge = false;
            $scope.targetSearch();
        };
        //设置来源网站
        $scope.setWebSite = function (a) {
            if (a == 1) {
                $rootScope.tableSwitch.tableFilter = null;
                $rootScope.tableSwitch.latitude = {name: "来源网站", displayName: "来源网站", field: "dm"};
                $scope.webSite = 1;
                $rootScope.gridArray.shift();
                $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude)
            }
            if (a == 0) {
                $rootScope.tableSwitch.tableFilter = null;
                $rootScope.tableSwitch.latitude = {name: "来源类型", displayName: "来源类型", field: "rf_type"};
                $rootScope.gridArray.shift();
                $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude)
            }
            $scope.isJudge = false;
            $scope.targetSearch();
        };
        //设置地域过滤
        $scope.setAreaFilter = function (area) {
            if (!$rootScope.tableSwitch) {
                return;
            }
            if ("全部" == area) {
                $rootScope.tableSwitch.tableFilter = null;
            } else {
                $rootScope.tableSwitch.tableFilter = "[{\"region\":[\"" + area + "\"]}]";
            }
            $scope.isJudge = false;
            if ($scope.tableJu == "html") {
                getHtmlTableData();
            } else {
                $scope.targetSearch();
            }
        };
        //设置（搜索引擎）地域过滤
        $scope.setSearchEngineAreaFilter = function (area) {
            if (!$rootScope.tableSwitch) {
                return;
            }
            if ("全部" == area) {
                $rootScope.tableSwitch.tableFilter = "[{\"rf_type\":[2]}]";
            } else {
                $rootScope.tableSwitch.tableFilter = "[{\"region\":[\"" + area + "\"]},{\"rf_type\":[2]}]";
            }
            $scope.isJudge = false;
            $scope.targetSearch();
        };

        // 搜索词过滤
        $scope.setGjcFilter = function (gjcText) {
            if (!$rootScope.tableSwitch) {
                return;
            }
            if (undefined == gjcText || "" == gjcText) {
                $rootScope.tableSwitch.tableFilter = null;
            } else {
                $rootScope.tableSwitch.tableFilter = "[{\"kw\":[\"" + gjcText + "\"]}]";
            }
            $scope.isJudge = false;
            $scope.targetSearch();
        };

        // 输入URL过滤
        $scope.searchURLFilter = function (urlText) {
            if (!$rootScope.tableSwitch) {
                return;
            }
            if (undefined == urlText || "" == urlText) {
                $rootScope.tableSwitch.tableFilter = null;
            } else {
                $rootScope.tableSwitch.tableFilter = "[{\"loc\":[\"" + urlText + "\"]}]";
            }
            $scope.isJudge = false;
            $scope.targetSearch();
        };

        // 外部链接搜索
        $scope.searchURLFilterBySourceEl = function (urlText) {
            if (!$rootScope.tableSwitch) {
                return;
            }
            if (undefined == urlText || "" == urlText) {
                $rootScope.tableSwitch.tableFilter = "[{\"rf_type\": [\"3\"]}]";
            } else {
                $rootScope.tableSwitch.tableFilter = "[{\"rf_type\": [\"3\"]}, {\"rf\":[\"" + urlText + "\"]}]";
            }
            $scope.isJudge = false;
            $scope.targetSearch();
        };

        /**
         *
         * @param start 开始时间
         * @param end   结束时间
         * @param indic   查询指标
         * @param lati   查询纬度
         * @param type
         */
        $rootScope.targetSearch = function (isClicked) {
            $scope.gridOpArray = angular.copy($rootScope.gridArray);
            $scope.gridOptions.columnDefs = $scope.gridOpArray;
            $scope.gridOptions.rowHeight = 32;
            if (isClicked) {
                $rootScope.$broadcast("ssh_dateShow_options_quotas_change", $rootScope.checkedArray);
            }
            if ($rootScope.tableSwitch.latitude != null && $rootScope.tableSwitch.latitude == undefined) {
                console.error("error: latitude is not defined,Please check whether the parameter the configuration.");
                return;
            }
            if ($rootScope.tableTimeStart == undefined) {
                console.error("error: tableTimeStart is not defined,Please check whether the parameter the configuration.");
                return;
            }
            if ($rootScope.tableTimeEnd == undefined) {
                console.error("error: tableTimeEnd is not defined,Please check whether the parameter the configuration.");
                return;
            }
            if ($rootScope.tableSwitch.isJudge == undefined) $scope.isJudge = true;
            if ($rootScope.tableSwitch.isJudge) $rootScope.tableSwitch.tableFilter = undefined;
            if ($rootScope.tableSwitch.number == 4) {
                var searchUrl = SEM_API_URL + "elasticsearch/" + esType + "/?startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd;
                $http({
                    method: 'GET',
                    url: searchUrl
                }).success(function (data, status) {
                    $scope.gridOptions.data = data;
                })
            } else {
                $http({
                    method: 'GET',
                    url: '/api/indextable/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field)
                    + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&promotion=" + $rootScope.tableSwitch.promotionSearch + "&formartInfo=" + $rootScope.tableFormat + "&type=" + esType
                }).success(function (data, status) {
                    if ($rootScope.tableSwitch.promotionSearch != undefined && $rootScope.tableSwitch.promotionSearch) {
                        var url = SEM_API_URL + user + "/" + baiduAccount + "/account/?startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd + "&device=-1"
                        $http({
                            method: 'GET',
                            url: url
                        }).success(function (dataSEM, status) {
                            var dataArray = []
                            var dataObj = {};
                            if (dataSEM.length == 1) {
                                $rootScope.checkedArray.forEach(function (item, i) {
                                    if ($rootScope.tableSwitch.latitude.field == "accountName") {
                                        dataObj["accountName"] = dataSEM[0].accountName
                                    }
                                    dataSEM.forEach(function (sem, i) {
                                        if (dataObj[item] == undefined) {
                                            if (item == "ctr") {
                                                dataObj[item] = sem[item] + "%"
                                            } else {
                                                dataObj[item] = sem[item]
                                            }
                                        }
                                    });
                                    data.forEach(function (es, i) {
                                        if (dataObj[item] == undefined) {
                                            dataObj[item] = es[item]
                                        }
                                    })
                                });
                                dataArray.push(dataObj);
                            }
                            $scope.gridOptions.data = dataArray;
                        });
                    } else {
                        if ($rootScope.tableFormat != "hour") {
                            if ($rootScope.tableFormat == "week") {
                                data.forEach(function (item, i) {
                                    item.period = util.getYearWeekState(item.period);
                                });
                                $scope.gridOptions.data = data;
                            } else {
                                $scope.gridOptions.data = data;
                            }
                        } else {
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
                            $scope.gridOptions.data = result;
                        }
                    }
                }).error(function (error) {
                    console.log(error);
                });
            }
        };
        //init
        if ($scope.tableJu != 'html' && $rootScope.historyJu != "NO") {
            $scope.targetSearch();
        }
        $scope.$on("history", function (e, msg) {
            $scope.gridOpArray = angular.copy($rootScope.gridArray);
            $scope.gridOptions.columnDefs = $scope.gridOpArray;
            $scope.gridOptions.data = msg;
        });


        //数据对比
        $rootScope.datepickerClickTow = function (start, end, label) {
            var gridArrayOld = angular.copy($rootScope.gridArray);
            $rootScope.gridArray.forEach(function (item, i) {
                var a = item["field"];
                if (item["cellTemplate"] == undefined) {
                    item["cellTemplate"] = "<ul class='contrastlist'><li>{{grid.appScope.getContrastInfo(grid, row,0,'" + a + "')}}</li><li>{{grid.appScope.getContrastInfo(grid, row,1,'" + a + "')}}</li><li>{{grid.appScope.getContrastInfo(grid, row,2,'" + a + "')}}</li><li>{{grid.appScope.getContrastInfo(grid, row,3,'" + a + "')}}</li></ul>"
                }
            });
            $scope.gridOptions.rowHeight = 95;
            var time = chartUtils.getTimeOffset(start, end);
            var startTime = time[0];
            var endTime = time[0] + ($rootScope.tableTimeEnd - $rootScope.tableTimeStart);

            $rootScope.$broadcast("ssh_load_compare_datashow", startTime, endTime);

            var dateTime1 = chartUtils.getSetOffTime($rootScope.tableTimeStart, $rootScope.tableTimeEnd);
            var dateTime2 = chartUtils.getSetOffTime(startTime, endTime);
            $scope.targetDataContrast(null, null, function (item) {
                var target = ($rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field);
                var dataArray = [];
                var is = 0;
                $scope.targetDataContrast(startTime, endTime, function (contrast) {
                    item.forEach(function (a, b) {
                        var dataObj = {};
                        for (var i = 0; i < contrast.length; i++) {
                            if (a[target] == contrast[i][target]) {
                                $rootScope.checkedArray.forEach(function (tt, aa) {
                                    var bili = ((parseInt(a[tt].replace("%")) - parseInt((contrast[i][tt]).replace("%"))) / parseInt((contrast[i][tt]).replace("%")) * 100).toFixed(2);
                                    dataObj[tt] = (isNaN(bili) ? 0 : bili) + "%";
                                    a[tt] = "　" + "," + a[tt] + "," + contrast[i][tt] + "," + dataObj[tt]
                                });
                                a[target] = a[target] + "," + ($rootScope.startString != undefined ? $rootScope.startString : dateTime1[0] + " 至 " + dateTime1[1]) + "," + (dateTime2[0] + " 至 " + dateTime2[1]) + "," + "变化率"
                                dataArray.push(a);
                                is = 0;
                                break;
                            } else {
                                is = 1
                            }
                        }
                        if (is == 1) {
                            $rootScope.checkedArray.forEach(function (tt, aa) {
                                dataObj[tt] = "--"
                                a[tt] = "　" + "," + a[tt] + "," + "--" + "," + "--"
                            });
                            a[target] = a[target] + "," + ($rootScope.startString != undefined ? $rootScope.startString : dateTime1[0] + " 至 " + dateTime1[1]) + "," + (dateTime2[0] + " 至 " + dateTime2[1]) + "," + "变化率"
                            dataArray.push(a);
                        }
                    })
                });
                $scope.gridOptions.data = dataArray;
                $rootScope.gridArray = gridArrayOld;
            })
        };
        //数据对比实现方法
        $scope.targetDataContrast = function (startInfoTime, endInfoTime, cabk) {
            $scope.gridOpArray = angular.copy($rootScope.gridArray);
            $scope.gridOptions.columnDefs = $scope.gridOpArray;
            if ($rootScope.tableSwitch.isJudge == undefined) $scope.isJudge = true;
            if ($rootScope.tableSwitch.isJudge) $rootScope.tableSwitch.tableFilter = undefined;
            if ($rootScope.tableSwitch.number == 4) {
                var searchUrl = SEM_API_URL + "elasticsearch/" + esType + "/?startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd;
                $http({
                    method: 'GET',
                    url: searchUrl
                }).success(function (data, status) {
                    cabk(data);
                })
            } else {
                $http({
                    method: 'GET',
                    url: '/api/indextable/?start=' + (startInfoTime == null ? $rootScope.tableTimeStart : startInfoTime) + "&end=" + (endInfoTime == null ? $rootScope.tableTimeEnd : endInfoTime) + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field)
                    + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&promotion=" + $rootScope.tableSwitch.promotionSearch + "&formartInfo=day&type=" + esType
                }).success(function (data, status) {
                    if ($rootScope.tableSwitch.promotionSearch != undefined && $rootScope.tableSwitch.promotionSearch) {
                        var url = SEM_API_URL + user + "/" + baiduAccount + "/account/?startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd + "&device=-1"
                        $http({
                            method: 'GET',
                            url: url
                        }).success(function (dataSEM, status) {
                            var dataArray = []
                            var dataObj = {};
                            if (dataSEM.length == 1) {
                                $rootScope.checkedArray.forEach(function (item, i) {
                                    if ($rootScope.tableSwitch.latitude.field == "accountName") {
                                        dataObj["accountName"] = dataSEM[0].accountName
                                    }
                                    dataSEM.forEach(function (sem, i) {
                                        if (dataObj[item] == undefined) {
                                            if (item == "ctr") {
                                                dataObj[item] = sem[item] + "%"
                                            } else {
                                                dataObj[item] = sem[item]
                                            }
                                        }
                                    });
                                    data.forEach(function (es, i) {
                                        if (dataObj[item] == undefined) {
                                            dataObj[item] = es[item]
                                        }
                                    })
                                });
                                dataArray.push(dataObj);
                            }
                            cabk(dataArray);
                        });
                    } else {
                        if ($rootScope.tableFormat != "hour") {
                            if ($rootScope.tableFormat == "week") {
                                data.forEach(function (item, i) {
                                    item.period = util.getYearWeekState(item.period);
                                });
                                cabk(data);
                            } else {
                                cabk(data);
                            }
                        } else {
                            var result = [];
                            var maps = {}
                            var newData = chartUtils.getByHourByDayData(data);
                            newData.forEach(function (info, x) {
                                for (var i = 0; i < info.key.length; i++) {
                                    var infoKey = info.key[i];
                                    var obj = maps[infoKey];
                                    if (!obj) {
                                        obj = {};
                                        var dataString = (infoKey.toString().length >= 2 ? "" : "0");
                                        obj["period"] = dataString + infoKey + ":00 - " + dataString + infoKey + ":59";
                                        maps[infoKey] = obj;
                                    }
                                    obj[chartUtils.convertEnglish(info.label)] = info.quota[i];
                                    maps[infoKey] = obj;
                                }
                            });
                            for (var key in maps) {
                                if (key != null) {
                                    result.push(maps[key]);
                                }
                            }
                            cabk(result);
                        }
                    }
                }).error(function (error) {
                    console.log(error);
                });
            }
        };

        //表格数据展开项
        var griApiInfo = function (gridApi) {
            gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                var dataNumber;
                if (row.isExpanded && $rootScope.tableSwitch.dimen != false) {
                    if (row.entity[$rootScope.tableSwitch.latitude.field] == "搜索引擎" && $rootScope.tableSwitch.latitude.field == "rf_type")$rootScope.tableSwitch.dimen = "se";
                    if (row.entity[$rootScope.tableSwitch.latitude.field] == "外部链接" && $rootScope.tableSwitch.latitude.field == "rf_type")$rootScope.tableSwitch.dimen = "rf";
                    if ($scope.webSite == 1)$rootScope.tableSwitch.dimen = "rf";
                    var returnFilter = angular.copy($rootScope.tableSwitch.tableFilter);
                    var entity = row.entity[$rootScope.tableSwitch.latitude.field];
                    var newEntity = row.entity[$rootScope.tableSwitch.latitude.field].split(",");
                    newEntity.length > 0 ? entity = newEntity[0] : "";
                    $rootScope.tableSwitch.tableFilter = "[{\"" + $rootScope.tableSwitch.latitude.field + "\":[\"" + getField(entity, $rootScope.tableSwitch.latitude.field) + "\"]}]";
                    row.entity.subGridOptions = {
                        showHeader: false,
                        columnDefs: $rootScope.gridArray
                    };
                    $http({
                        method: 'GET',
                        async: false,
                        url: '/api/indextable/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=" + $rootScope.tableSwitch.dimen
                        + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&type=" + esType
                    }).success(function (data, status) {
                        var reg = new RegExp($rootScope.tableSwitch.dimen, "g");
                        if (data != undefined && data.length != 0) {
                            data = JSON.parse(JSON.stringify(data).replace(reg, $rootScope.tableSwitch.latitude.field));
                            dataNumber = data.length;
                        }
                        row.entity.subGridOptions.data = data;
                        $rootScope.tableSwitch.tableFilter = returnFilter;
                    }).error(function (error) {
                        console.log(error);
                    });
                }
            });
        };
        //得到数据中的url
        $scope.getDataUrlInfoa = function (grid, row, number) {
            var a = row.entity.source.split(",");
            if (number == 1) {
                return a[0];
            } else if (number == 2) {
                var url = a[1].length > 1 ? a[1].substring(0, 1) + "..." : a[1]
                return url;
            }
        };

        //数据对比分割数据
        $scope.getContrastInfo = function (grid, row, number, fieldData) {
            if (fieldData != undefined || fieldData != "undefined") {
                var a = row.entity[fieldData].split(",");
                if (number == 0) {
                    return a[0];
                } else if (number == 1) {
                    return a[1];
                } else if (number == 2) {
                    return a[2];
                } else if (number == 3) {
                    return a[3];
                }
            }
        };

        //表格HTML展开项
        var griApihtml = function (gridApi) {

            gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                var filter = "[{\"tt\":[\"" + row.entity.tt + "\"]}]";
                var htmlData = new Array();
                row.entity.subGridOptions = {
                    showHeader: false,
                    enableHorizontalScrollbar: 0,
                    columnDefs: htmlData
                };
                $http({
                    method: 'GET',
                    url: '/api/realTimeHtml/?filerInfo=' + filter + "&type=" + esType
                }).success(function (datas, status) {
                    var res = {};
                    res["name"] = "test";
                    res["field"] = "info";
                    res["cellTemplate"] = datas.htmlData;
                    htmlData.push(res);
                    row.entity.subGridOptions.data = [{"info": " "}];
                }).error(function (error) {
                    console.log(error);
                });
            });
        };

        /**
         *  table 历史趋势
         */
        $scope.getHistoricalTrend = function (b) {
            if ($rootScope.tableSwitch.isJudge == undefined)$scope.isJudge = true;
            if ($rootScope.tableSwitch.isJudge)$rootScope.tableSwitch.tableFilter = undefined;

            var a = b.$parent.$parent.row.entity[$rootScope.tableSwitch.latitude.field];
            var s = a.split(",");
            s.length > 0 ? a = s[0] : "";
            $rootScope.tableSwitch.tableFilter = "[{\"" + $rootScope.tableSwitch.latitude.field + "\":[\"" + getField(a, $rootScope.tableSwitch.latitude.field) + "\"]}]";

        }


        //得到数据中的url
        $scope.getDataUrlInfo = function (grid, row, number) {
            var a = row.entity.source.split(",");
            if (number == 1) {
                if (a[0] == "-") {
                    a[0] = "javascript:void(0)"
                }
                return a[0];
            } else if (number == 2) {
                if (a[0] == "-") {
                    a[1] = "直接访问";
                }
                return a[1];
            }
        };
        //得到序列号
        $scope.getIndex = function (b) {
            return b.$parent.$parent.rowRenderIndex + 1
        };

        var getField = function (rr, ss) {
            switch (rr) {
                case "新访客":
                    return 0;
                case "老访客":
                    return 1;
                case "直接访问":
                    if (ss == "se" || ss == "rf") return "-"; else return 1;
                case "搜索引擎":
                    return 2;
                case "外部链接":
                    return 3;
                case "计算机端":
                    return 0;
                case "移动端":
                    return 1;
                default :
                    return rr
            }
        }
        var select = $scope.select = {};

        //数组对象用来给ng-options遍历
        select.optionsData = [{
            title: "公告"
        }, {
            title: "全部事件目标"
        }, {
            title: "完整下载"
        }, {
            title: "在线下载"
        }, {
            title: "时长目标"

        }, {
            title: "访问页数目标"
        }
        ];
    });
});

/**********************隐藏table中按钮的弹出层*******************************/
var s = 1;
function getMyButton(item) {
    var a = document.getElementsByClassName("table_win");
    theDisplay(a);
    item.nextSibling.style.display = "block";
    s = 1
}
function hiddenMyButton(item) {
    item.nextSibling.style.display = "none";
}
function theDisplay(a) {
    for (var i = 0; i < a.length; i++) {
        if (document.getElementsByClassName("table_win")[i].style.display == "block") {
            document.getElementsByClassName("table_win")[i].style.display = "none";
        }
    }
}
document.onclick = function () {
    var a = document.getElementsByClassName("table_win");
    if (a.length != 0) {
        if (s > 0) {
            theDisplay(a);
            s = 1
        }
        s++
    }
};
/*******************************************************************/
