/**
 * Created by john on 2015/3/30.
 */
define(["app"], function (app) {

    "use strict";

    app.controller("TabsCtrl", function ($timeout, $scope, $rootScope, $http, $q, requestService, SEM_API_URL, $cookieStore, $location, $state, popupService, uiGridConstants) {
        $scope.todayClass = true;
        $scope.browserselect = true;
        var user = $rootScope.user;
        $scope.sortType = 'name';
        var baiduAccount = $rootScope.baiduAccount;
        var esType = $rootScope.userType;
        var trackid = $rootScope.siteTrackId;

        $scope.tabs = [
            {title: 'Dynamic Title 1', content: 'Dynamic content 1'},
            {title: 'Dynamic Title 2', content: 'Dynamic content 2', disabled: true}
        ]
        //sem
        $scope.target = [
            {consumption_name: "点击量", name: "click"},
            {consumption_name: "展现量", name: "impression"},
            {consumption_name: "消费", name: "cost"},
            {consumption_name: "点击率", name: "ctr"},
            {consumption_name: "平均点击价格", name: "cpc"}
        ];
        //网盟
        $scope.targetNms = [
            {consumption_name: "点击量", name: "click"},
            {consumption_name: "展现量", name: "impression"},
            {consumption_name: "消费", name: "cost"},
            {consumption_name: "点击率", name: "ctr"},
            {consumption_name: "平均点击价格", name: "acp"}
        ];
        $scope.Webbased = [
            {consumption_name: "浏览量(PV)", name: "pv"},
            {consumption_name: "访问次数", name: "vc"},
            {consumption_name: "访客数(UV)", name: "uv"},
            {consumption_name: "新访客数", name: "nuv"},
            {consumption_name: "新访客比率", name: "nuvRate"}
            //{consumption_name: "页头访问次数", name: "o1"}
        ];
        $scope.flow = [
            {consumption_name: "跳出率", name: "outRate"},
            {consumption_name: "平均访问时长", name: "avgTime"},
            {consumption_name: "平均访问页数", name: "avgPage"},
            {consumption_name: "抵达率", name: "arrivedRate"}
        ];
        $scope.transform = [
            {consumption_name: "转化次数", name: "m1"},
            {consumption_name: "转化率", name: "m2"},
            {consumption_name: "平均转化成本", name: "m3"},
            {consumption_name: "收益", name: "m4"},
            {consumption_name: "利润", name: "m5"},
            {consumption_name: "投资回报率", name: "m6"}
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
            {consumption_name: "搜索页APP下载消费", name: "b3"}
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
        $scope.TodayWebs = [
            {consumption_name: "浏览量(PV)", name: "pv"},
            {consumption_name: "访客数(UV)", name: "uv"},
            {consumption_name: "新访客数", name: "nuv"},
            {consumption_name: "新访客比率", name: "nuvRate"},
            {consumption_name: "IP数", name: "ip"}
        ];
        $scope.indexoverviewTodayWebs = [
            {consumption_name: "浏览量(PV)", name: "pv"},
            {consumption_name: "访客数(UV)", name: "uv"},
            {consumption_name: "新访客比率", name: "nuvRate"},
            {consumption_name: "IP数", name: "ip"}
        ];
        $scope.Indexflowedse = [
            {consumption_name: "跳出率", name: "outRate"},
            {consumption_name: "平均访问时长", name: "avgTime"},
            {consumption_name: "平均访问页数", name: "avgPage"},
            {consumption_name: "入口页次数", name: "entrance"}
        ];
        $scope.indexoverviewIndexflowedse = [
            {consumption_name: "跳出率", name: "outRate"},
            {consumption_name: "平均访问时长", name: "avgTime"},
            {consumption_name: "平均访问页数", name: "avgPage"},
            {consumption_name: "入口页次数", name: "entrance"}
        ];
        $scope.Todytransform = [
            {consumption_name: "转化次数", name: "zhuanF"},
            {consumption_name: "转化率", name: "zhuanN"}
        ];
        $scope.Todayfloweds = [
            {consumption_name: "跳出率", name: "outRate"},
            {consumption_name: "平均访问时长", name: "avgTime"},
            {consumption_name: "平均访问页数", name: "avgPage"}
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
            {consumption_name: "平均访问页数", name: "avgPage"}
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

        //事件
        $scope.bases = [
            {consumption_name: "浏览量(PV)", name: "pv"},
            {consumption_name: "访客数(UV)", name: "uv"},
            {consumption_name: "访问次数", name: "vc"},
            {consumption_name: "IP数", name: "ip"},
            {consumption_name: "新访客数", name: "nuv"},
            {consumption_name: "新访客比率", name: "nuvRate"}
        ];
        $scope.transform = [
            {consumption_name: '转化次数', name: 'conversions'},
            {consumption_name: '转化率', name: 'crate'},
            {consumption_name: '平均转化成本(事件)', name: 'transformCost'}
        ];
        $scope.adsTransform = [
            {consumption_name: '转化次数', name: 'conversions'},
            {consumption_name: '转化率', name: 'crate'}
        ];
        $scope.eventParameter = [
            {consumption_name: "事件点击总数", name: "clickTotal"},
            {consumption_name: "唯一访客事件数", name: "visitNum"}
        ];
        //实时访问
        //TODO item["searchWord"] == ""?"--" 为捕获到暂为  --
        var getHtmlTableData = function () {
            var fi = $rootScope.tableSwitch.tableFilter != undefined && $rootScope.tableSwitch.tableFilter != null ? "&q=" + encodeURIComponent($rootScope.tableSwitch.tableFilter) : "";
            var searchUrl = SEM_API_URL + "/es/real_time?tid=" + trackid + fi;
            $http({
                method: 'GET',
                url: searchUrl
            }).success(function (data, status) {
                if (data != undefined) {
                    try {
                        JSON.stringify(data);
                    } catch (e) {
                        return;
                    }

                    data.forEach(function (item, i) {
                        item["city"] = item["city"] == "-" ? "国外" : item["city"];
                        item["visitTime"] = new Date(item["visitTime"]).Format("yyyy-MM-dd hh:mm:ss");
                        var reere = item["searchEngine"] != "-" ? (item["referrer"] + "," + item["searchEngine"]) : item["referrer"] == "-" ? "-,直接访问" : item["referrer"] + "," + item["referrer"].substring(0, 40) + (item["referrer"].length > 40 ? "..." : "")
                        item["referrer"] = reere;
                        item["searchWord"] = item["searchWord"] == "-" ? "--" : item["searchWord"] == "" ? "--" : item["searchWord"];
                        item["keyword"] = item["keyword"] == "-" ? "--" : item["searchWord"];
                        item["isPromotion"] = item["isPromotion"] ? "是" : "否";
                        var a = (Math.round(parseInt(item["totalTime"]) / 1000));
                        item["totalTime"] = parseInt(a / 60) + "\'" + (a % 60) + "\"";
                    })
                    $scope.gridOpArray = angular.copy($rootScope.gridArray);
                    $scope.gridOptions.columnDefs = $scope.gridOpArray;
                    $scope.gridOptions.data = data;
                }
            }).error(function (error) {
            });
        };
        if (typeof($rootScope.checkedArray) != undefined && $rootScope.checkedArray == "SS") {
            $scope.tableJu = "html";
            $rootScope.gridArray = [
                {
                    name: "xl",
                    displayName: "",
                    cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                    maxWidth: 10,
                    enableSorting: false
                },
                {
                    name: '地域', displayName: "地域", field: "city",
                    enableSorting: false
                },
                {
                    name: '访问时间', displayName: "访问时间", field: "visitTime",
                    sort: {
                        direction: uiGridConstants.DESC,
                        priority: 1
                    }
                },
                {
                    name: '来源',
                    displayName: "来源",
                    field: "referrer",
                    cellTemplate: "<div class='getReferrerData' my-data-one='{{grid.appScope.getCellDisplayValueReferrer(grid, row, 1)}}' my-data-two='{{grid.appScope.getCellDisplayValueReferrer(grid, row, 2)}}'></div>",
                    enableSorting: false
                },
                {
                    name: '入口页面',
                    displayName: "入口页面",
                    field: "entrance",
                    cellTemplate: '<a href="{{grid.appScope.getCellDisplayValueEntrance(grid, row)}}" title="{{grid.appScope.getCellDisplayValueEntrance(grid, row)}}" target="_blank" style="color:#0965b8;line-height:30px; display:block; padding:0 10px;white-space: nowrap;text-overflow:ellipsis; overflow:hidden;}">{{grid.appScope.getCellDisplayValueEntrance(grid, row)}}</a>',
                    enableSorting: false
                },
                {name: '关键词', displayName: "关键词", field: "keyword", enableSorting: false},
                {name: '搜索词', displayName: "搜索词", field: "searchWord", enableSorting: false},
                {name: '推广带来', displayName: "推广带来", field: "isPromotion", enableSorting: false},
                {name: "访问IP", displayName: "访问IP", field: "ip", enableSorting: false},
                {
                    name: '访客标识码', displayName: "访客标识码", field: "vid", cellTooltip: function (row, col) {
                    return row.entity.vid;
                },
                    enableSorting: false
                },
                {name: "访问时长", displayName: "访问时长", field: "totalTime"},
                {name: "访问页数", displayName: "访问页数", field: "viewPages"}];
            getHtmlTableData();
        } else {
            if ($rootScope.tableSwitch.arrayClear)$rootScope.checkedArray = new Array();
            if ($rootScope.tableSwitch.arrayClear)$rootScope.gridArray = new Array();
        }
        //table Button 配置 table_nextbtn
        if ($rootScope.tableSwitch.number == 1) {
            $scope.gridBtnDivObj = "<div class='table_box'><a ng-click='grid.appScope.getHistoricalTrend(this, \"history\")' target='_parent' class='table_nextbtn test'  title='查看历史趋势'></a></div>";
        } else if ($rootScope.tableSwitch.number == 2) {
            $scope.gridBtnDivObj = "<div class='table_box'><button onmousemove='getMyButton(this)' class='table_btn'></button><div class='table_win'><ul style='color: #45b1ec'>" + $rootScope.tableSwitch.coding + "</ul></div></div>";
        }

        //排序
        $rootScope.sortNumber = function (a, b) {
            var nulls = $rootScope.gridApi2.core.sortHandleNulls(a, b);
            if (nulls !== null) {
                return nulls;
            } else {
                if (parseInt(a) === parseInt(b)) {
                    return 0;
                }
                if (parseInt(a) < parseInt(b)) {
                    return -1;
                }
                if (parseInt(a) > parseInt(b)) {
                    return 1;
                }
                return 0;
            }

        }
        // 百分比排序
        $rootScope.sortPercent = function (a, b) {
            var _t_a = a.substring(0, a.length - 1);
            var _t_b = a.substring(0, b.length - 1);
            if (_t_a == _t_b) {
                return 0;
            }
            if (_t_a < _t_b) {
                return -1;
            }
            return 1;
        }

        $rootScope.indicators = function (item, entities, number, refresh) {
            $rootScope.gridArray.shift();
            $rootScope.gridArray.shift();
            var footerTemp
            if ($rootScope.tableSwitch.number == 6) {
                $rootScope.gridArray.shift();
                footerTemp = "<div class='ui-grid-cell-contents'>{{grid.appScope.getEventRootData(this,grid.getVisibleRows())}}</div>";
            } else {
                footerTemp = "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>";
            }
            if (refresh == "refresh") {
                $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude);
                $scope.gridObjButton = {};
                $scope.gridObjButton["name"] = "xl";
                $scope.gridObjButton["displayName"] = "";
                $scope.gridObjButton["cellTemplate"] = "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>";
                $scope.gridObjButton["maxWidth"] = 10;
                $rootScope.gridArray.unshift($scope.gridObjButton);
                return
            }

            $rootScope.tableSwitch.number != 0 && $rootScope.tableSwitch.number != 6 ? $scope.gridArray.shift() : "";
            $scope.gridObj = {};
            $scope.gridObjButton = {};
            var a = $rootScope.checkedArray.indexOf(item.name);
            if (a != -1) {
                $rootScope.checkedArray.splice(a, 1);
                $rootScope.gridArray.splice(a, 1);
                if ($rootScope.tableSwitch.number == 6) {
                    var tempButton = {};
                    tempButton["name"] = "页面URL";
                    tempButton["displayName"] = "页面URL";
                    tempButton["field"] = "loc";
                    tempButton["footerCellTemplate"] = "<div class='ui-grid-cell-contents'>--</div>"
                    $rootScope.gridArray.unshift(tempButton);
                }
                if ($rootScope.tableSwitch.number != 0 && $rootScope.tableSwitch.number != 6) {
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
                if ($rootScope.checkedArray.length >= number) {
                    $rootScope.checkedArray.shift();
                    $rootScope.checkedArray.push(item.name);
                    $rootScope.gridArray.shift();

                    $scope.gridObj["name"] = item.consumption_name;
                    $scope.gridObj["displayName"] = item.consumption_name;
                    $scope.gridObj["footerCellTemplate"] = footerTemp
                    $scope.gridObj["field"] = item.name;

                    $rootScope.gridArray.push($scope.gridObj);
                    if ($rootScope.tableSwitch.number == 6) {
                        var tempButton = {};
                        tempButton["name"] = "页面URL";
                        tempButton["displayName"] = "页面URL";
                        tempButton["field"] = "loc";
                        tempButton["footerCellTemplate"] = "<div class='ui-grid-cell-contents'>--</div>"
                        $rootScope.gridArray.unshift(tempButton);
                    }
                    if ($rootScope.tableSwitch.number != 0 && $rootScope.tableSwitch.number != 6) {
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
                    $scope.gridObj["footerCellTemplate"] = footerTemp;
                    $scope.gridObj["field"] = item.name;
                    $rootScope.gridArray.push($scope.gridObj);
                    if ($rootScope.tableSwitch.number == 6) {
                        var tempButton = {};
                        tempButton["name"] = "页面URL";
                        tempButton["displayName"] = "页面URL";
                        tempButton["field"] = "loc";
                        tempButton["footerCellTemplate"] = "<div class='ui-grid-cell-contents'>--</div>"
                        $rootScope.gridArray.unshift(tempButton);
                    }
                    if ($rootScope.tableSwitch.number != 0 && $rootScope.tableSwitch.number != 6) {
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


            //默认指标设置排序类型
            angular.forEach($rootScope.gridArray, function (_record, index) {
                if (_record.name == "新访客比率" || _record.name == "跳出率") {
                    _record.sortingAlgorithm = $rootScope.sortPercent;
                } else if (_record.field == "vc" || _record.field == "uv" || _record.field == "pv"
                    || _record.field == "nuv" || _record.field == "ip" || _record.field == "avgPage") {
                    _record.sortingAlgorithm = $rootScope.sortNumber;
                }
            });

            angular.forEach(entities, function (subscription, index) {
                if (subscription.name == item.name) {
                    $scope.classInfo = 'current';
                }
            });


            //$rootScope.$broadcast("ssh_reload_datashow");
        }
        var temp_path = $location.path();
        var today = temp_path.indexOf("/today");
        var yesterday = temp_path.indexOf("/yesterday");
        var month = temp_path.indexOf("/month");
        // 通用表格配置项

        if (typeof($rootScope.checkedArray) != undefined && $scope.tableJu == "html") {
            $scope.gridOptions = {

                paginationPageSize: today != -1 || yesterday != -1 || month != -1 ? 24 : 20,
                expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions'></div>",
                //expandableRowHeight: 360,
                paginationPageSizes: [20, 50, 100],
                //enableExpandableRowHeader: false,
                enableExpandableRowHeader: true,
                enableColumnMenus: false,
                showColumnFooter: true,
                enablePaginationControls: true,
                enableSorting: true,
                enableGridMenu: false,
                enableScrollbars: false,
                enableHorizontalScrollbar: 0,
                enableVerticalScrollbar: 0,
                onRegisterApi: function (girApi) {
                    $rootScope.gridApi2 = girApi;
                    griApihtml(girApi);
                }
            };

        } else {
            $scope.gridOptions = {
                paginationPageSize: today != -1 || yesterday != -1 || month != -1 ? 24 : 20,
                expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions'></div>",
                //expandableRowHeight: 360,
                paginationPageSizes: [20, 50, 100],
                //enableExpandableRowHeader: false,
                enableExpandableRowHeader: true,
                enableColumnMenus: false,
                showColumnFooter: true,
                enablePaginationControls: true,
                enableSorting: true,
                enableGridMenu: false,
                enableScrollbars: false,
                enableHorizontalScrollbar: 0,
                enableVerticalScrollbar: 0,
                onRegisterApi: function (gridApi) {
                    $rootScope.gridApi2 = gridApi;
                    if ($rootScope.tableSwitch.dimen) {
                        griApiInfo(gridApi);
                    }
                }
            }
            if ($scope.changeListHide == true) {
                $scope.gridOptions.enablePaginationControls = false;
                $scope.gridOptions.paginationPageSize = 50;
            }
            //$rootScope.$broadcast("ssh_reload_datashow");
        }
        ;

        $scope.$on("ssh_refresh_charts", function (e, msg) {
            if ($scope.charts && $scope.charts[0]) {
                $scope.charts[0].config.legendDefaultChecked = [0, 1];
            }

            if ($location.path().indexOf("history") == -1) {
                $scope.targetSearch()
            }
        });
        $scope.page = "";
        $scope.pagego = function (pagevalue) {
            pagevalue.pagination.seek(Number($scope.page));
        }
        //地图分类
        $scope.setDimen = function (a) {
            var b = "";
            if (a == "city") {
                b = 0;
            } else {
                b = 1;
            }
            var now = +new Date();
            if (now - evTimeStamp < 100) {
                return;
            }
            evTimeStamp = now;
            var inputArray = $(".custom_select .styled");
            inputArray.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop("checked", false);
            });
            $(inputArray[b]).prev("span").css("background-position", "0px -51px");
            $rootScope.tableSwitch.dimen = a;
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch();
        }
        //设置来源终端
        var evTimeStamp = 0;
        $rootScope.$on("loadAllTerminal", function () {
            $scope.setTerminal(0);
        })
        $scope.setTerminal = function (a) {
            var now = +new Date();
            if (now - evTimeStamp < 100) {
                return;
            }
            evTimeStamp = now;
            var inputArray = $(".chart_top2 .styled");
            inputArray.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop("checked", false);
            });
            $(inputArray[a]).prev("span").css("background-position", "0px -51px");

            var _pmFilter = "";
            var _pmFilterRealTime = "";

            if (a == 0) {
                $scope.terminalSearch = "";
            }
            if (a == 1) {
                _pmFilter = JSON.parse("{\"pm\":[0]}");
                _pmFilterRealTime = JSON.parse("{\"pm\":\"0\"}");
                $scope.terminalSearch = "计算机";
            }
            if (a == 2) {
                _pmFilter = JSON.parse("{\"pm\":[1]}");
                _pmFilterRealTime = JSON.parse("{\"pm\":\"1\"}");
                $scope.terminalSearch = "移动设备";
            }


            $scope.isJudge = false;
            if ($scope.tableJu == "html") {
                var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
                _allFilters = filterUtil.filter(_allFilters, "pm", _pmFilterRealTime);
                $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);
                getHtmlTableData();
            } else {

                if ($location.path().indexOf("source/searchterm_yq") != -1) {
                    var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
                    _allFilters = filterUtil.filter(_allFilters, "pm", _pmFilterRealTime);
                    $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);
                } else {
                    //获取所有过滤条件
                    var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
                    _allFilters = filterUtil.filter(_allFilters, "pm", _pmFilter);
                    $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);
                }

                $rootScope.$broadcast("ssh_data_show_refresh");
                $scope.targetSearch();
            }
        };
        //设置（外部链接）设备过滤
        $rootScope.$on("ExLoadAllTerminal", function () {
            $scope.setExLinkTerminal(0);
        })
        $scope.setExLinkTerminal = function (a) {
            var now = +new Date();
            if (now - evTimeStamp < 100) {
                return;
            }
            evTimeStamp = now;
            var inputArray = $(".chart_top2_1 .styled");
            inputArray.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop("checked", false);
            });
            $(inputArray[a]).prev("span").css("background-position", "0px -51px");
            var _pmFilter = "";
            if (a == 0) {
                $scope.exTerminalSearch = "";
            }
            if (a == 1) {
                _pmFilter = JSON.parse("{\"pm\":[0]}");
                $scope.exTerminalSearch = "计算机";
            }
            if (a == 2) {
                _pmFilter = JSON.parse("{\"pm\":[1]}");
                $scope.exTerminalSearch = "移动设备";
            }

            var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
            _allFilters = filterUtil.filter(_allFilters, "pm", _pmFilter);
            $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);

            $scope.isJudge = false;
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch();
        };
        $rootScope.$on("ExLoadAllWeb", function () {
            $scope.webClass(0);
        })
        $scope.webClass = function (a) {
            var now = +new Date();
            if (now - evTimeStamp < 100) {
                return;
            }
            evTimeStamp = now;
            var inputArray = $(".chart_top2_2 .styled");
            inputArray.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop("checked", false);
            });
            $(inputArray[a]).prev("span").css("background-position", "0px -51px");
            var _webFilter = "";
            if (a == 0) {
                $scope.webTypeSearch = "";
            }
            if (a == 1) {
                _webFilter = JSON.parse("{\"web_type\":[1]}");
                $scope.webTypeSearch = "社会化媒体";
            }
            if (a == 2) {
                _webFilter = JSON.parse("{\"web_type\":[2]}");
                $scope.webTypeSearch = "导航网站";
            }
            if (a == 3) {
                _webFilter = JSON.parse("{\"web_type\":[3]}");
                $scope.webTypeSearch = "电子邮箱";
            }
            var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
            _allFilters = filterUtil.filter(_allFilters, "web_type", _webFilter);
            $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);

            $scope.isJudge = false;
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch();
        }
        $scope.urlDomain = function (a) {
            var now = +new Date();
            if (now - evTimeStamp < 100) {
                return;
            }
            evTimeStamp = now;
            var inputArray = $(".custom_select .styled");
            inputArray.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop("checked", false);
            });
            $(inputArray[a]).prev("span").css("background-position", "0px -51px");
        }
        //设置（搜索引擎）设备过滤
        $scope.setSearchEngineTerminal = function (a) {
            if (a == 0) $rootScope.tableSwitch.tableFilter = "[{\"rf_type\":[2]}]";
            if (a == 1) $rootScope.tableSwitch.tableFilter = "[{\"pm\":[0]},{\"rf_type\":[2]}]";
            if (a == 2) $rootScope.tableSwitch.tableFilter = "[{\"pm\":[1]},{\"rf_type\":[2]}]";

            $scope.isJudge = false;
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch();
        };

        //设置来源过滤
        $rootScope.$on("loadAllSource", function () {
            $scope.setSource(0);
        })
        $scope.setSource = function (a) {
            if (a == 0) {
                $scope.sourceSearch = "";
            }
            //来源过滤条件
            var _rfFilter = "";
            var _rfRealTimeFilter = "";
            if (a == 1) {
                _rfFilter = JSON.parse("{\"rf_type\":[1]}");
                _rfRealTimeFilter = JSON.parse("{\"rf_type\":\"1\"}");
                $scope.sourceSearch = "直接访问";
            }
            if (a == 2) {
                _rfFilter = JSON.parse("{\"rf_type\":[2]}");
                _rfRealTimeFilter = JSON.parse("{\"rf_type\":\"2\"}");
                $scope.sourceSearch = "搜索引擎";
            }
            if (a == 2) {
                $scope.browserselect = false;
            }
            else {
                $scope.browserselect = true;
            }
            if (a == 3) {
                _rfFilter = JSON.parse("{\"rf_type\":[3]}");
                _rfRealTimeFilter = JSON.parse("{\"rf_type\":\"3\"}");
                $scope.sourceSearch = "外部链接";
            }

            if ($scope.tableJu == "html") {
                //获取所有过滤条件
                var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
                _allFilters = filterUtil.filter(_allFilters, "rf_type", _rfRealTimeFilter);
                if (a != 2) {// 排除搜索引擎
                    filterUtil.filter(_allFilters, "se", "");
                }
                $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);
                getHtmlTableData();
            } else {
                //获取所有过滤条件
                var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
                _allFilters = filterUtil.filter(_allFilters, "rf_type", _rfFilter);
                if (a == 0) {
                    //排除搜索引擎
                    filterUtil.filter(_allFilters, "se", "");
                }
                $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);

                $rootScope.$broadcast("ssh_data_show_refresh");
                $scope.targetSearch();
            }
        };
        //设置访客来源
        $rootScope.$on("loadAllVisitor", function () {
            $scope.setVisitors(0);
        })
        $scope.setVisitors = function (a) {
            var now = +new Date();
            if (now - evTimeStamp < 100) {
                return;
            }
            evTimeStamp = now;
            var inputArray = $(".chart_top2 .styled");
            inputArray.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop("checked", false);
            });
            $(inputArray[a]).prev("span").css("background-position", "0px -51px");

            //访客过滤条件
            var _viFilter = "";
            if (a == 0) {
                $scope.visitorSearch = "", $scope.showVisitor = false
            } else if (a == 1) {
                _viFilter = JSON.parse("{\"ct\":[0]}"), $scope.visitorSearch = "新访客", $scope.showVisitor = true
            } else if (a == 2) {
                _viFilter = JSON.parse("{\"ct\":[1]}"), $scope.visitorSearch = "老访客", $scope.showVisitor = true
            }
            var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
            //获取所有过滤条件
            _allFilters = filterUtil.filter(_allFilters, "ct", _viFilter);
            $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);

            if ($rootScope.tableSwitch.number == 6 && (a == 1 || a == 2)) {
                $rootScope.tableSwitch.visitorFilter = {ct: a - 1}
            } else {
                $rootScope.tableSwitch.visitorFilter = null
            }
            //$scope.isJudge = false;
            $rootScope.$broadcast("ssh_data_show_refresh");
            if ($rootScope.tableSwitch.number == 6) {
                $scope.targetSearch();
                //$rootScope.targetSearch(false)
            } else {
                $scope.targetSearch();
            }
        };
        //设置来源网站
        $scope.setWebSite = function (a) {
            $rootScope.webSite = a;
            var now = +new Date();
            if (now - evTimeStamp < 100) {
                return;
            }
            evTimeStamp = now;
            var inputArray = $(".custom_select .styled");
            inputArray.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop("checked", false);
            });
            $(inputArray[a]).prev("span").css("background-position", "0px -51px");
            if (a == 1) {
                $rootScope.tableSwitch.tableFilter = null;
                $rootScope.tableSwitch.latitude = {name: "来源网站", displayName: "来源网站", field: "dm"};
                $scope.webSite = 1;
                $rootScope.gridArray.shift();
                $rootScope.gridArray.shift();
                $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude)
                $rootScope.gridArray.unshift({
                    name: "a",
                    displayName: "",
                    cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                    maxWidth: 10
                })
            }
            if (a == 0) {
                $rootScope.tableSwitch.tableFilter = null;
                $rootScope.tableSwitch.latitude = {name: "来源类型", displayName: "来源类型", field: "rf_type"};
                $rootScope.gridArray.shift();
                $rootScope.gridArray.shift();
                $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude)
                $rootScope.gridArray.unshift({
                    name: "a",
                    displayName: "",
                    cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                    maxWidth: 10
                })
            }
            $scope.isJudge = false;
            if ($rootScope.sshuiyanCompareFlag) {
                $rootScope.datepickerClickTow($rootScope.sshuiyanCompareStart, $rootScope.sshuiyanCompareEnd);
            } else {
                $rootScope.$broadcast("ssh_data_show_refresh");
                $scope.targetSearch();
            }
        };
        //设置地域过滤
        $rootScope.$on("loadAllArea", function () {
            $scope.setAreaFilter("全部");
        })
        $scope.setAreaFilter = function (area) {
            $rootScope.areaFilter = area;
            $scope.areaSearch = area == "全部" ? "" : area;
            if (area == "北京" || area == "上海" || area == "广州") {
                if ($scope.city.selected != undefined) {
                    $scope.city.selected = {};
                    $scope.city.selected["name"] = area;
                } else {
                    $scope.city.selected = {};
                    $scope.city.selected["name"] = area;
                }
            }
            $scope.allCitys = angular.copy($rootScope.citys);
            if (!$rootScope.tableSwitch) {
                return;
            }
            var _areaFilter = "";
            if ("全部" != area) {
                area = (area == "北京" ? area + "市" : area);
            }

            if ($scope.tableJu == "html") {
                if ("全部" != area) {
                    _areaFilter = JSON.parse("{\"region\":\"" + area + "\" }");
                }
                //获取所有过滤条件
                var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
                _allFilters = filterUtil.filter(_allFilters, "region", _areaFilter);
                $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);
            } else {
                if ($location.path().indexOf("source/searchterm_yq") != -1) {
                    if ("全部" != area) {
                        _areaFilter = JSON.parse("{\"region\":\"" + area + "\" }");
                    }
                    //获取所有过滤条件
                    var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
                    _allFilters = filterUtil.filter(_allFilters, "region", _areaFilter);
                    $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);
                } else {
                    if ("全部" != area) {
                        _areaFilter = JSON.parse("{\"region\":[\"" + area + "\"]}");
                    }
                    //获取所有过滤条件
                    var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
                    _allFilters = filterUtil.filter(_allFilters, "region", _areaFilter);
                    $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);
                }

            }

            $scope.isJudge = false;
            if ($scope.tableJu == "html") {
                getHtmlTableData();
            } else {
                $rootScope.$broadcast("ssh_data_show_refresh");
                $scope.targetSearch();
            }

        };
        //自定义时间设置
        $scope.sitetimes = [{"hour": {"selected": {"name": "0:00"}}, "hour1": {"selected": {"name": "0:59"}}}];
        $scope.sitetimesadd = function () {
            $scope.sitetimes.push({
                "hour": {"selected": {"name": "0:00"}},
                "hour1": {"selected": {"name": "0:59"}}
            });
        };

        $scope.sitetimesclear = function () {
            $scope.sitetimes = [{"hour": {"selected": {"name": "0:00"}}, "hour1": {"selected": {"name": "0:59"}}}];
        };
        //设置时段过滤

        $scope.setTimeFilter = function (time) {
            $scope.sitetimesclear();
            $scope.timeSearch = time == "全部" ? "" : time;
            if (time == "00:00 - 00:59") {
                if ($scope.time.selected != undefined) {
                    $scope.time.selected.name = time;
                } else {
                    $scope.time.selected = {};
                    $scope.time.selected["name"] = time;
                }
            }
            if (!$rootScope.tableSwitch) {
                return;
            }
            //var _dateFilter = "";
            //if ("全部" == time) {
            //    _dateFilter = "";
            //} else {
            //    time = (time == "00:00 - 00:59" ? time + "" : time);
            //    if ($scope.tableJu == "html") {
            //        $rootScope.tableSwitch.tableFilter = "[{\"period\":\"" + time + "\"}]";
            //    } else {
            //        _dateFilter = JSON.parse("{\"period\":[\"" + time + "\"]}");
            //    }
            //}
            //获取所有过滤条件
            //var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
            //_allFilters = filterUtil.filter(_allFilters, "period", _dateFilter);
            //$rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);
            // 设置过滤时间段
            if (time == "全部") {
                $rootScope.timeFilter = null;
            } else if (time == "工作时段") {
                $rootScope.timeFilter = [9, 10, 11, 13, 14, 15, 16, 17];
            } else if (time == "非工作时段") {
                $rootScope.timeFilter = [0, 1, 2, 3, 4, 5, 6, 7, 8, 12, 18, 19, 20, 21, 22, 23];
            } else {// 自定义时段
                $rootScope.timeFilter = [0];
            }
            $scope.isJudge = false;
            if ($scope.tableJu == "html") {
                getHtmlTableData();
            } else {
                $rootScope.$broadcast("ssh_data_show_refresh");
                $scope.targetSearch();
            }
        };
        $scope.setZdyTimeFilter = function (siteTimes) {
            if (!$rootScope.tableSwitch) {
                return;
            }

            $rootScope.timeFilter = [];
            siteTimes.forEach(function (_st) {
                var _st_h_s = _st.hour.selected.name;
                var _st_h_e = _st.hour1.selected.name;
                for (var i = parseInt(_st_h_s.split(":")[0]); i <= parseInt(_st_h_e.split(":")[0]); i++) {
                    if ($rootScope.timeFilter.indexOf(i) == -1) {
                        $rootScope.timeFilter.push(i);
                    }
                }
            });
            $scope.isJudge = false;
            if ($scope.tableJu == "html") {
                getHtmlTableData();
            } else {
                $rootScope.$broadcast("ssh_data_show_refresh");
                $scope.targetSearch();
            }
        };
        //设置（搜 索引擎）地域过滤
        $scope.setSearchEngineAreaFilter = function (area) {
            if (!$rootScope.tableSwitch) {
                return;
            }
            if ("全部" == area) {

                $scope.areaSearch = "";
                var _rfFilter = JSON.parse("{\"rf_type\":[2]}");
                if ($rootScope.tableSwitch.number == 6) {
                    $scope.curArea = "";
                    $scope.showArea = false
                    $rootScope.tableSwitch.areaFilter = null
                }
                //获取所有过滤条件
                var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
                _allFilters = filterUtil.filter(_allFilters, "rf_type", _rfFilter);
                _allFilters = filterUtil.filter(_allFilters, "region", "");
                $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);
            } else {
                $scope.areaSearch = area;
                var _rfFilter = JSON.parse("{\"rf_type\":[2]}");
                var _areaFilter = JSON.parse("{\"region\":[\"" + area + "\"]}");

                if ($rootScope.tableSwitch.number == 6) {
                    $scope.curArea = area;
                    $scope.showArea = true
                    $rootScope.tableSwitch.areaFilter = [{region: area}]
                }
                //获取所有过滤条件
                var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
                _allFilters = filterUtil.filter(_allFilters, "rf_type", _rfFilter);
                _allFilters = filterUtil.filter(_allFilters, "region", _areaFilter);
                $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);
            }
            if (area == "北京" || area == "上海" || area == "广州") {
                if ($scope.city.selected != undefined) {
                    $scope.city.selected = {};
                    $scope.city.selected["name"] = area;
                } else {
                    $scope.city.selected = {};
                    $scope.city.selected["name"] = area;
                }
            }
            $scope.isJudge = false;
            $rootScope.$broadcast("ssh_data_show_refresh");
            if ($rootScope.tableSwitch.number == 6) {
                $rootScope.targetSearch()(false)
            } else {
                $scope.targetSearch();
            }
            $scope.allCitys = angular.copy($rootScope.citys);
        };

        $scope.searchBrowser = function (value, segin) {
            if (segin == "全部") {
                $scope.sourceSearch = "全部引擎";
                $rootScope.tableSwitch.seFilter = null
            } else {
                $scope.sourceSearch = segin;
                $rootScope.tableSwitch.seFilter = {se: segin}
            }
            if (segin == "百度" || segin == "Google") {
                if ($scope.browser.selected != undefined) {
                    $scope.browser.selected.name = segin;
                } else {
                    $scope.browser.selected = {};
                    $scope.browser.selected["name"] = segin;
                }
            }
            $scope.allBrowsers = angular.copy($rootScope.browsers);
            $rootScope.tableSwitch.eginFilter = {rf_type: 2}
            if ($rootScope.tableSwitch.number == 6) {
                $rootScope.targetSearch(false)
            }
        }
        $scope.setSearchEngine = function (value, info) {


            if (value == 0) {
                $scope.sourceSearch = "";
                $rootScope.tableSwitch.seFilter = null
                $rootScope.tableSwitch.eginFilter = null
            } else {
                $scope.sourceSearch = info;
                $scope.showSource = true
                if (value == 2) {//搜索引擎
                    $scope.browserselect = false;
                } else {
                    $rootScope.tableSwitch.seFilter = null
                    $scope.browserselect = true;
                }
                $rootScope.tableSwitch.eginFilter = {rf_type: value}
            }
            if ($rootScope.tableSwitch.number == 6) {
                $rootScope.targetSearch(false)
            }
        }
        ;
        //设置搜索引擎过滤
        $scope.searchEngine = function (info) {
            $rootScope.tableSwitch.seFilter = null
            if (info === '全部') {
                var _rfFilter = JSON.parse("{\"rf_type\":[2]}");
                //获取所有过滤条件
                var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
                _allFilters = filterUtil.filter(_allFilters, "rf_type", _rfFilter);
                $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);
                $scope.sourceSearch = "全部引擎";
            } else {
                var _seFilter = JSON.parse("{\"se\":[\"" + info + "\"]}");
                //获取所有过滤条件
                var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
                _allFilters = filterUtil.filter(_allFilters, "se", _seFilter);
                $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);
                $scope.sourceSearch = info;
            }

            $scope.isJudge = false;
            if ($scope.tableJu == "html") {
                if (info === '全部') {
                    $rootScope.tableSwitch.tableFilter = null;
                    //获取所有过滤条件
                    var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
                    filterUtil.filter(_allFilters, "se", "");
                    filterUtil.filter(_allFilters, "rf_type", "");
                    $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);
                } else {
                    var _seFilter = JSON.parse("{\"se\":\"" + info + "\"}");
                    //获取所有过滤条件
                    var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
                    _allFilters = filterUtil.filter(_allFilters, "se", _seFilter);
                    filterUtil.filter(_allFilters, "rf_type", "");
                    $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);
                }
                getHtmlTableData();
            } else {
                $rootScope.$broadcast("ssh_data_show_refresh");
                $scope.targetSearch();
            }
            if (info == "百度" || info == "Google") {
                if ($scope.browser.selected != undefined) {
                    $scope.browser.selected.name = info;
                } else {
                    $scope.browser.selected = {};
                    $scope.browser.selected["name"] = info;
                }
            }
            $scope.allBrowsers = angular.copy($rootScope.browsers);
        };


        $scope.removeSource = function (obj) {
            //consolelog("删除来源");
            $rootScope.tableSwitch.eginFilter = null
            $rootScope.tableSwitch.seFilter = null
            $scope.souce.selected = {"name": "全部"};

            obj.curSource = "";
            obj.showSource = false;
            obj.curBrowser = "";
            obj.showBrowser = false;
            $scope.browserselect = true;//隐藏浏览器
            $rootScope.targetSearch(false)
        }
        $scope.removeBrowser = function (obj) {
            //consolelog("删除搜索")
            $rootScope.tableSwitch.seFilter = null
            $scope.browser.selected = {"name": "全部"};
            obj.curBrowser = "";
            obj.showBrowser = false;
            $rootScope.targetSearch(false)
        }
        $scope.removeVisitor = function (obj) {
            $rootScope.tableSwitch.visitorFilter = null
            obj.visitorSearch = "";
            obj.showVisitor = false;
            $rootScope.targetSearch(false)

        }
        $scope.removeArea = function (obj) {
            $rootScope.tableSwitch.areaFilter = null
            $scope.city.selected = {"name": "全部"};
            obj.curArea = "";
            obj.showArea = false;
            $rootScope.targetSearch(false)
        }
        // 输入URL过滤
        $scope.searchURLFilter = function (urlText) {
            if (!$rootScope.tableSwitch) {
                return;
            }

            var _urlFilter = "";
            if (undefined == urlText || "" == urlText) {
                _urlFilter = ""
            } else {
                _urlFilter = JSON.parse("{\"loc\":[\"" + urlText + "\"]}");
            }
            //获取所有过滤条件
            var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
            _allFilters = filterUtil.filter(_allFilters, "loc", _urlFilter);
            $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);
            _allFilters = filterUtil.filter(_allFilters, "rf_type", _rfFilter);
            _allFilters = filterUtil.filter(_allFilters, "rf", _rfilter);
            $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);
            $scope.isJudge = false;
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch();
        };
        // 实时访问输入查询
        $scope.input_gjc = "";
        $scope.input_rky = "";
        $scope.input_ip = "";
        $scope.realTimeVisit = function () {
            var visitFilert = [];
            if ($scope.input_gjc != "") {
                visitFilert.push("{\"kw\": \"" + $scope.input_gjc + "\"}")
            }
            if ($scope.input_rky != "") {
                visitFilert.push("{\"entrance\": \"1\"},{\"loc\":\"" + $scope.input_rky + "\"}")
            }
            if ($scope.input_ip != "") {
                visitFilert.push("{\"remote\": \"" + $scope.input_ip + "\"}")
            }
            if ($scope.input_ip == "" && $scope.input_rky == "" && $scope.input_gjc == "") {
                $rootScope.tableSwitch.tableFilter = null;
            } else {
                $rootScope.tableSwitch.tableFilter = "[" + visitFilert + "]";
            }
            $scope.isJudge = false;
            getHtmlTableData();
        };

        $scope.$on("RealTimePageRefresh", function () {
            $scope.realTimeVisit();
        });

        // 实时访问输入查询
        $scope.input_gjc = "";
        $scope.input_rky = "";
        $scope.input_ip = "";
        $scope.realTimeVisit = function () {
            var visitFilert = [];
            if ($scope.input_gjc != "") {
                visitFilert.push("{\"kw\": \"" + $scope.input_gjc + "\"}")
            }
            if ($scope.input_rky != "") {
                visitFilert.push("{\"entrance\": \"1\"},{\"loc\":\"" + $scope.input_rky + "\"}")
            }
            if ($scope.input_ip != "") {
                visitFilert.push("{\"remote\": \"" + $scope.input_ip + "\"}")
            }
            if ($scope.input_ip == "" && $scope.input_rky == "" && $scope.input_gjc == "") {
                $rootScope.tableSwitch.tableFilter = null;
            } else {
                $rootScope.tableSwitch.tableFilter = "[" + visitFilert + "]";
            }
            $scope.isJudge = false;
            getHtmlTableData();
        };

        $scope.$on("RealTimePageRefresh", function () {
            $scope.realTimeVisit();
        });

        //事件名称过滤
        $scope.searchGjcText = ""
        $scope.oldGirdData = [];
        $scope.filtrateEventName = function () {
            if ($scope.searchGjcText.trim() != "" && $scope.gridOptions.data != undefined && $scope.gridOptions.data.length > 0) {
                var tempDatas = []
                $rootScope.gridData.forEach(function (data) {
                    if (data.eventName.indexOf($scope.searchGjcText) > -1) {
                        tempDatas.push(data)
                    }
                })
                $scope.gridOptions.data = tempDatas
            } else {
                $scope.gridOptions.data = $rootScope.gridData
            }
        }
        // 外部链接搜索
        $scope.searchURLFilterBySourceEl = function (urlText) {
            if (!$rootScope.tableSwitch) {
                return;
            }
            var _rfFilter = "";
            var _rfilter = "";
            var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);

            if (undefined == urlText || "" == urlText) {
                var _rfFilter = JSON.parse("{\"rf_type\": [\"3\"]}");
                _allFilters = filterUtil.filter(_allFilters, "rf", "");
                _allFilters = filterUtil.filter(_allFilters, "dm", "");
            } else {
                var _rfFilter = JSON.parse("{\"rf_type\": [\"3\"]}");
                if ($rootScope.myRfDm && $rootScope.myRfDm == "dm") {
                    var _rfilter = JSON.parse("{\"dm\":[\"" + urlText + "\"]}");
                    _allFilters = filterUtil.filter(_allFilters, "dm", _rfilter);
                    _allFilters = filterUtil.filter(_allFilters, "rf", "");
                } else {
                    var _rfilter = JSON.parse("{\"rf\":[\"" + urlText + "\"]}");
                    _allFilters = filterUtil.filter(_allFilters, "rf", _rfilter);
                    _allFilters = filterUtil.filter(_allFilters, "dm", "");
                }
            }

            _allFilters = filterUtil.filter(_allFilters, "rf_type", _rfFilter);

            $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);
            $scope.isJudge = false;
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch("rf_dm");
        };
        // 实时访问输入查询
        $scope.input_gjc = "";
        $scope.input_rky = "";
        $scope.input_ip = "";
        $scope.realTimeVisit = function () {
            var visitFilert = [];
            if ($scope.input_gjc != "") {
                visitFilert.push("{\"kw\": \"" + $scope.input_gjc + "\"}")
            }
            if ($scope.input_rky != "") {
                visitFilert.push("{\"entrance\": \"1\"},{\"loc\":\"" + $scope.input_rky + "\"}")
            }
            if ($scope.input_ip != "") {
                visitFilert.push("{\"remote\": \"" + $scope.input_ip + "\"}")
            }
            if ($scope.input_ip == "" && $scope.input_rky == "" && $scope.input_gjc == "") {
                $rootScope.tableSwitch.tableFilter = null;
            } else {
                $rootScope.tableSwitch.tableFilter = "[" + visitFilert + "]";
            }
            $scope.isJudge = false;
            getHtmlTableData();
        };

        $scope.$on("RealTimePageRefresh", function () {
            $scope.realTimeVisit();
        });
        // 搜索词过滤
        $scope.setGjcFilter = function (gjcText) {
            if (!$rootScope.tableSwitch) {
                return;
            }
            var _gicFilter = "";
            var _gjcSEMilter = "";
            if (undefined == gjcText || "" == gjcText) {
                _gicFilter = ""
                _gjcSEMilter = "";
            } else {
                _gicFilter = JSON.parse("{\"kw\":[\"" + gjcText + "\"]}");
                _gjcSEMilter = JSON.parse("{\"kw\":\"" + gjcText + "\"}");
            }
            //获取所有过滤条件
            var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
            if ($location.path().indexOf("source/searchterm_yq") != -1) {
                _allFilters = filterUtil.filter(_allFilters, "kw", _gjcSEMilter);
            } else {
                _allFilters = filterUtil.filter(_allFilters, "kw", _gicFilter);
            }
            $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);

            $scope.isJudge = false;
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch();
        };

        //事件名称过滤
        $scope.searchGjcText = ""
        $scope.oldGirdData = [];
        $scope.filtrateEventName = function () {
            if ($scope.searchGjcText.trim() != "" && $scope.gridOptions.data != undefined && $scope.gridOptions.data.length > 0) {
                var tempDatas = []
                $rootScope.gridData.forEach(function (data) {
                    if (data.eventName.indexOf($scope.searchGjcText) > -1) {
                        tempDatas.push(data)
                    }
                })
                $scope.gridOptions.data = tempDatas
            } else {
                $scope.gridOptions.data = $rootScope.gridData
            }
        }
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
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch();
        };
        // 按url，按域名过滤
        $scope.setURLDomain = function (urlText) {
            var now = +new Date();
            if (now - evTimeStamp < 100) {
                return;
            }
            /*阻止冒泡，执行两次*/
            $rootScope.myRfDm = urlText;
            var b = "";
            if (urlText == "rf") {
                b = 0;
                $("#externallinksInput").attr('placeholder', '输入URL...')
                $("#externallinksInput").blur(function () {
                    $(this).attr('placeholder', '输入URL...')
                })
            } else {
                b = 1;
                $("#externallinksInput").attr('placeholder', '输入域名...')
                $("#externallinksInput").blur(function () {
                    $(this).attr('placeholder', '输入域名...')
                })
            }
            evTimeStamp = now;
            var inputArray = $(".custom_select .styled");
            inputArray.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop("checked", false);
            });
            $(inputArray[b]).prev("span").css("background-position", "0px -51px");
            if (undefined == urlText || "" == urlText) {
                $rootScope.tableSwitch.latitude.field = null;
            } else {
                $rootScope.gridArray[1].field = urlText;
                $rootScope.tableSwitch.latitude.field = urlText;
            }
            $scope.isJudge = false;
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch("rf_dm");
            $scope.refreshChartByTable(urlText);
        };
        // 查看入口页链接
        $scope.showEntryPageLink = function (row, _type) {
            if (_type == 1) {// 搜索引擎
                popupService.showEntryPageData(row.entity.rf_type || row.entity.dm);
            } else if (_type == 2) {
                popupService.showEntryPageData(row.entity.se);
            } else {
                popupService.showEntryPageData(row.entity.rf);
            }
        };
        // 实时访问输入查询
        $scope.input_gjc = "";
        $scope.input_rky = "";
        $scope.input_ip = "";
        $scope.realTimeVisit = function () {
            var visitFilert = [];
            if ($scope.input_gjc != "") {
                visitFilert.push("{\"kw\": \"" + $scope.input_gjc + "\"}")
            }
            if ($scope.input_rky != "") {
                visitFilert.push("{\"entrance\": \"1\"},{\"loc\":\"" + $scope.input_rky + "\"}")
            }
            if ($scope.input_ip != "") {
                visitFilert.push("{\"remote\": \"" + $scope.input_ip + "\"}")
            }
            if ($scope.input_ip == "" && $scope.input_rky == "" && $scope.input_gjc == "") {
                $rootScope.tableSwitch.tableFilter = null;
            } else {
                $rootScope.tableSwitch.tableFilter = "[" + visitFilert + "]";
            }
            $scope.isJudge = false;
            getHtmlTableData();
        };
        $scope.getEventRootData = function (a, options) {
            var hash = {}
            var val = 0
            if (a.col.field == "crate") {
                var sumConv = 0, sumUv = 0
                var flag = false;//是否有%号
                var temp = 0;
                var cratehash = {}
                options.forEach(function (option) {
                    sumConv += option.entity["conversions"] == undefined ? 0 : option.entity["conversions"]
                    if (!cratehash[option.entity.loc]) {//以网页分组统计内容
                        cratehash[option.entity.loc] = true;
                        sumUv = sumUv + Number(option.entity["vc"])
                    }
                })
                val = sumUv > 0 ? (((sumConv / sumUv) * 100).toFixed(2) + "%") : "0.00%"
            }
            //else if ( a.col.field == "nuvRate") {
            //    options.forEach(function (option) {
            //        var tempCrate = (option.entity[a.col.field] + "").indexOf("%") < 0 ? option.entity[a.col.field] : option.entity[a.col.field].substring(0, option.entity[a.col.field].length - 2)
            //        val = val + Number(tempCrate)
            //
            //    })
            //    val = Number(val).toFixed(2)
            //    val += "%"
            //}
            else if (a.col.field == "clickTotal") {
                options.forEach(function (option) {
                    val = val + Number(option.entity[a.col.field])
                })
            } else if (a.col.field == "conversions") {
                options.forEach(function (option) {
                    val = val + Number(option.entity[a.col.field])
                })
            }
            else if (a.col.field == "transformCost") {
                options.forEach(function (option) {
                    if ((option.entity[a.col.field] + "").indexOf("元") > -1)
                        val = val + Number(option.entity[a.col.field].substring(0, option.entity[a.col.field].length - 1))
                    else
                        val = val + option.entity[a.col.field]
                })
                if (options.length > 0)
                    val = val / options.length
                val = val.toFixed(2) + "元"
            } else {
                var flag = false;//是否有%号
                var temp = 0;
                options.forEach(function (option) {
                    if (!hash[option.entity.loc]) {//以网页分组统计内容
                        hash[option.entity.loc] = true;
                        if ((option.entity[a.col.field] + "").indexOf("%") > -1) {
                            temp = temp + Number(option.entity[a.col.field].replace("%", ""))
                            if (!flag)
                                flag = true
                        } else {
                            val = val + Number(option.entity[a.col.field])
                        }
                    }
                })
                if (flag) {
                    val = temp.toFixed(2) + "%"
                }
            }
            return val
        }


        $rootScope.refreshGridData = function () {
            $scope.gridOptions.data = $rootScope.gridData
        }
        $rootScope.changeFooterShow = function () {
            $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
        }
        //前端ui-grid通用查询方法
        $rootScope.targetSearch = function (isClicked) {
            if (window.location.href.split("/")[window.location.href.split("/").length - 1] == "changelist") {
                // 来源变化榜不需要查询
                $rootScope.changeListInit({
                    start: $rootScope.start,
                    end: $rootScope.end,
                    contrastStart: $rootScope.contrastStart,
                    contrastEnd: $rootScope.contrastEnd,
                    filterType: $rootScope.changeListFilterType,
                    gridArray: $rootScope.gridArray
                });
                return;
            }
            $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
            $scope.gridOpArray = angular.copy($rootScope.gridArray);
            $scope.gridOptions.columnDefs = $scope.gridOpArray;
            $scope.gridOptions.rowHeight = 32;
            $scope.gridOptions.columnFooterHeight = 32;
            $(".custom_table i").css({"display": "block"});

            //默认指标设置排序类型
            angular.forEach($scope.gridOptions.columnDefs, function (_record, index) {
                if (_record.name == "新访客比率" || _record.name == "跳出率") {
                    _record.sortingAlgorithm = $rootScope.sortPercent;
                } else if (_record.field == "vc" || _record.field == "uv" || _record.field == "pv"
                    || _record.field == "nuv" || _record.field == "ip" || _record.field == "avgPage") {
                    _record.sortingAlgorithm = $rootScope.sortNumber;
                }
            });
            //if (isClicked) {
            $rootScope.$broadcast("ssh_dateShow_options_quotas_change", $rootScope.checkedArray);
            //}
            if ($rootScope.tableSwitch.latitude != null && $rootScope.tableSwitch.latitude == undefined) {
                //consoleerror("error: latitude is not defined,Please check whether the parameter the configuration.");
                return;
            }
            if ($rootScope.tableTimeStart == undefined) {
                //consoleerror("error: tableTimeStart is not defined,Please check whether the parameter the configuration.");
                return;
            }
            if ($rootScope.tableTimeEnd == undefined) {
                //consoleerror("error: tableTimeEnd is not defined,Please check whether the parameter the configuration.");
                return;
            }
            if ($rootScope.tableSwitch.isJudge == undefined) $scope.isJudge = true;
            if ($rootScope.tableSwitch.isJudge) $rootScope.tableSwitch.tableFilter = undefined;
            if ($rootScope.tableSwitch.number == 6) {
                var a = $rootScope.tableSwitch.latitude.field;
                $scope.gridOpArray.forEach(function (item, i) {
                    if (item["cellTemplate"] == undefined) {
                        if (a == item["field"]) {
                            item["footerCellTemplate"] = "<div class='ui-grid-cell-contents' style='height: 32px'>当页汇总</div>";
                        } else if (item["field"] == "eventId" || item["field"] == "loc") {
                            item["footerCellTemplate"] = "<div class='ui-grid-cell-contents' style='height: 32px'>--</div>";
                        } else {
                            item["footerCellTemplate"] = "<div class='ui-grid-cell-contents' style='height: 32px'>" +
                                "<ul><li>{{grid.appScope.getEventRootData(this,grid.getVisibleRows())}}</li></ul></div>";
                        }
                    }
                });
            } else {
                $scope.gridOpArray.forEach(function (item, i) {
                    if (item["cellTemplate"] == undefined) {
                        var a = $rootScope.tableSwitch.latitude.field;
                        if (a != undefined && a == item["field"]) {
                            item["footerCellTemplate"] = "<div class='ui-grid-cell-contents' style='height: 32px'>当页汇总</div>";
                        } else {
//                        item["footerCellTemplate"] = "<div class='ui-grid-cell-contents' style='height: 100px'>{{grid.appScope.getFooterData(this,grid.getVisibleRows(),2)}}<br/>{{grid.appScope.getFooterData(this,grid.getVisibleRows(),3)}}<br/>{{grid.appScope.getFooterData(this,grid.getVisibleRows(),4)}}</div>";
                            item["footerCellTemplate"] = "<div class='ui-grid-cell-contents' style='height: 32px'>" +
                                "<ul><li>{{grid.appScope.getFooterData(this,grid.getVisibleRows(),2)}}</li><li>{{grid.appScope.getFooterData(this,grid.getVisibleRows(),3)}}</li><li>{{grid.appScope.getFooterData(this,grid.getVisibleRows(),4)}}</li></ul></div>";
                        }
                    }
                });
            }
            if ($rootScope.tableSwitch.number == 5) {//推广URL速度
                //var url = SEM_API_URL + "/sem/report/" + (area == "全部" ? $rootScope.tableSwitch.promotionSearch.SEMData : "region") + "?a=" + user + "&b=" + baiduAccount + "&startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd + "&device=-1" + (area == "全部" ? "" : "&rgna=" + area);
                $http({
                    method: 'GET',
                    url: "/api/getUrlspeed/?start=" + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&trackId=" + $rootScope.siteTrackId
                }).success(function (data, status) {
                    if (data.length <= 0) {
                        var fields = $rootScope.tableSwitch.latitude.field;
                        var result = [];
                        var resultObj = {};
                        resultObj[fields] = "暂无数据";
                        resultObj["openSpeed"] = "0";
                        resultObj["vc"] = "0";
                        result.push(resultObj);
                        $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                        $scope.gridOptions.data = result;
                    } else {
                        var dataArray = [];
                        var dataObj = {};
                        var speedDataInfo = 0;
                        var speedDataVc = 0
                        data.forEach(function (item, i) {
                            var urlDateTime = (parseInt(item.dms_time.value) / parseInt(item.doc_count) / 1000).toFixed(2);
                            dataObj["loc"] = item.key;
                            dataObj["openSpeed"] = urlDateTime + "\"";
                            dataObj["vc"] = item.ucv.value;
                            dataArray.push(dataObj);
                            speedDataInfo += urlDateTime;
                            speedDataVc += item.ucv.value
                        });
                        $rootScope.urlSeepdDataInfo = (speedDataInfo / (data.length <= 0 ? 1 : data.length)).toFixed(2) + "\"";
                        $rootScope.urlSeepdDataVc = speedDataVc;
                        $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                        $scope.gridOptions.data = dataArray;
                    }
                });
            } else if ($rootScope.tableSwitch.number == 4) {//来源分析搜索词-搜索
                var fi = $rootScope.tableSwitch.tableFilter != undefined && $rootScope.tableSwitch.tableFilter != null ? "&q=" + encodeURIComponent($rootScope.tableSwitch.tableFilter) : "";
                var searchUrl = SEM_API_URL + "/es/search_word?tid=" + trackid + "&startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd + fi;
                $http({
                    method: 'GET',
                    url: searchUrl
                }).success(function (data, status) {
                    $rootScope.$broadcast("LoadDateShowDataFinish", data);
                    var result = [];
                    data.forEach(function (item, i) {
                        var infoKey = item["word"];
                        if (infoKey != undefined && (infoKey == "-" || infoKey == "" || infoKey == "www" || infoKey == "null" || infoKey.length >= 40)) {
                        } else {
                            // 保留2位有效数字
                            for (var _p in item) {
                                if (_p != "word" && _p != "freq") {
                                    var value = item[_p];
                                    item[_p] = parseFloat(value.substring(0, value.length - 1)).toFixed(2) + "%";
                                }
                            }
                            result.push(item);
                        }
                    });
                    $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                    $scope.gridOptions.data = result;
                })
            } else if ($rootScope.tableSwitch.number == 6) {//来源分析搜索词-搜索
                $rootScope.refreshData(false)
            } else {
                $http({
                    method: 'GET',
                    url: '/api/indextable/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field)
                    + "&filerInfo=" + encodeURIComponent($rootScope.tableSwitch.tableFilter) + "&promotion=" + $rootScope.tableSwitch.promotionSearch + "&formartInfo=" + $rootScope.tableFormat + "&type=" + esType
                }).success(function (data, status) {
                    $rootScope.$broadcast("LoadDateShowDataFinish", data);
                    if ($rootScope.tableSwitch.promotionSearch != undefined && $rootScope.tableSwitch.promotionSearch) {
                        if ($rootScope.areaFilter != "全部" && $location.path() == "/extension/way") {// 推广方式地域过滤不为全部是特殊处理
                            var url = SEM_API_URL + "/sem/report/region?a=" + user + "&b=" + baiduAccount + "&startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd + "&device=-1&rgna=" + $rootScope.areaFilter
                        } else {
                            var url = SEM_API_URL + "/sem/report/account?a=" + user + "&b=" + baiduAccount + "&startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd + "&device=-1"
                        }

                        $http({
                            method: 'GET',
                            url: url
                        }).success(function (dataSEM, status) {
                            $rootScope.$broadcast("LoadDateShowSEMDataFinish", dataSEM);
                            var dataArray = []
                            var dataObj = {};
                            var semDataArray = [];
                            var semDataObj = {};
                            $scope.target.forEach(function (array, b) {
                                dataSEM.forEach(function (items, a) {
                                    if (items[array.name] != undefined) if (semDataObj[array.name] == undefined) semDataObj[array.name] = items[array.name]; else semDataObj[array.name] += items[array.name];
                                });
                            });
                            if (dataSEM.length > 1) {
                                semDataObj["cpc"] = (semDataObj["cost"] / semDataObj["click"]).toFixed(2);
                                semDataObj["ctr"] = ((semDataObj["click"] / semDataObj["impression"]).toFixed(4)) * 100;
                            }
                            semDataArray.push(semDataObj);
                            $rootScope.checkedArray.forEach(function (item, i) {
                                if ($rootScope.tableSwitch.latitude.field == "accountName") {
                                    if (dataSEM[0]) {
                                        if ($rootScope.areaFilter != "全部" && $location.path() == "/extension/way") {// 推广方式地域过滤不为全部是特殊处理
                                            dataObj["accountName"] = "搜索推广 (" + dataSEM[0].regionName + ")";
                                        } else {
                                            dataObj["accountName"] = "搜索推广 (" + dataSEM[0].accountName + ")";
                                        }
                                    } else {
                                        dataObj["accountName"] = "搜索推广 (暂无数据 )";
                                    }
                                }
                                semDataArray.forEach(function (sem, i) {
                                    if (dataObj[item] == undefined) {
                                        if (item == "ctr") {
                                            dataObj[item] = sem[item] + "%"
                                        } else {
                                            dataObj[item] = parseFloat(sem[item]).toFixed(2);
                                        }
                                    }
                                });
                                if (data.length > 0) {
                                    data.forEach(function (es, i) {
                                        if (isNaN(dataObj[item]) || dataObj[item] == undefined) {
                                            dataObj[item] = es[item] != undefined ? es[item] : "--"
                                        }
                                    });
                                } else {
                                    if (isNaN(dataObj[item]) || dataObj[item] == undefined) {
                                        dataObj[item] = "--"
                                    }
                                }

                            });
                            $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                            dataArray.push(dataObj);
                            $scope.gridOptions.data = dataArray;
                        });
                    }
                    else {
                        if (isClicked == "rf_dm") {
                            data.forEach(function (item, o) {
                                if (item["dm"]) {
                                    item["rf"] = item["dm"];
                                } else {
                                    item["dm"] = item["rf"];
                                }
                            })
                        }
                        if ($rootScope.tableFormat != "hour") {
                            if ($rootScope.tableFormat == "week") {
                                data.forEach(function (item, i) {
                                    item.period = util.getYearWeekState(item.period);
                                });
                                if (data.length == 0) {
                                    var resultData = [];
                                    var resultObj = {};
                                    $rootScope.checkedArray.forEach(function (item, a) {
                                        resultObj[item] = "--";
                                    });

                                    resultObj[$rootScope.tableSwitch.latitude.field] = "暂无数据";
                                    resultData.push(resultObj);
                                    $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                                    $scope.gridOptions.data = resultData;
                                } else {
                                    $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                                    $scope.gridOptions.data = data;
                                }
                            } else {

                                if (data.length == 0) {
                                    var resultData = [];
                                    var resultObj = {};
                                    if ($rootScope.checkedArray != undefined) {
                                        $rootScope.checkedArray.forEach(function (item, a) {
                                            resultObj[item] = "--";
                                        });
                                    }
                                    resultObj[$rootScope.tableSwitch.latitude.field] = "暂无数据";
                                    $(".custom_table i").css({"display": "none"});
                                    resultData.push(resultObj);
                                    $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                                    $scope.gridOptions.data = resultData;
                                } else {
                                    var filters = JSON.parse($rootScope.tableSwitch.tableFilter);
                                    if ($location.path() == "/page/indexoverview_ep") { //退出模块
                                        var rf_type = -1;
                                        var se = -1;
                                        var isNew = -1;
                                        if (filters != null) {
                                            var index;
                                            rf_type = (index = filters.elementHasOwnProperty("rf_type")) == -1 ? -1 : filters[index].rf_type[0];
                                            se = (index = filters.elementHasOwnProperty("se")) == -1 ? -1 : filters[index].se[0];
                                            if (se != -1) {
                                                se = $rootScope.browsersKeyMap[se];
                                            }
                                            isNew = (index = filters.elementHasOwnProperty("ct")) == -1 ? -1 : filters[index].ct[0];
                                        }
                                        var parameter = {
                                            type: $rootScope.userType,
                                            rf_type: rf_type,
                                            se: se,
                                            isNew: isNew,
                                            start: $rootScope.start,
                                            end: $rootScope.end
                                        };
                                        var url = "/gacache/queryECData?query=" + JSON.stringify(parameter);

                                        $http({
                                            method: 'GET',
                                            url: url
                                        }).success(function (exitCountDatas) {
                                            $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                                            data.forEach(function (trData) {
                                                if (exitCountDatas.hasOwnProperty(trData.loc)) {
                                                    trData.ec = exitCountDatas[trData.loc];
                                                } else {
                                                    trData.ec = "0";
                                                }
                                            });
                                            $scope.gridOptions.data = data;
                                        });
                                    } else {
                                        // 按日
                                        for (var i = 0; i < data.length; i++) {
                                            var _obj = data[i];
                                            // 特殊处理一些数据
                                            if (_obj.pv == 0) {
                                                $rootScope.checkedArray.forEach(function (item, a) {
                                                    _obj[item] = "--";
                                                });
                                            }
                                        }
                                        $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                                        $scope.gridOptions.data = data;
                                    }
                                }
                            }
                        } else {
                            var result = [];
                            var maps = {}
                            var newData = chartUtils.getByHourByDayData(data);
                            newData.forEach(function (info, x) {
                                if (info.key.length == 0) {
                                    for (var j = 0; j < 24; j++) {
                                        info.key.push(j);
                                    }
                                }
                                for (var i = 0; i < info.key.length; i++) {
                                    var infoKey = info.key[i];
                                    var obj = maps[infoKey];
                                    if (!obj) {
                                        obj = {};
                                        var dataString = (infoKey.toString().length >= 2 ? "" : "0")
                                        obj["period"] = dataString + infoKey + ":00 - " + dataString + infoKey + ":59";
                                        maps[infoKey] = obj;

                                    }
                                    if (info.label == "平均访问时长") {
                                        obj["avgTime"] = ad.formatFunc(info.quota[i], "avgTime");
                                    } else {
                                        if (info.label == "跳出率") {
                                            if (info.quota[i] == "--") {
                                                obj[chartUtils.convertEnglish(info.label)] = "--";
                                            } else {
                                                obj[chartUtils.convertEnglish(info.label)] = info.quota[i] + "%";
                                            }
                                        } else {
                                            if (info.label == "新访客比率") {
                                                if (info.quota[i] == "--") {
                                                    obj[chartUtils.convertEnglish(info.label)] = "--";
                                                } else {
                                                    obj[chartUtils.convertEnglish(info.label)] = info.quota[i] + "%";
                                                }
                                            } else {
                                                obj[chartUtils.convertEnglish(info.label)] = info.quota[i];
                                            }
                                        }
                                    }
                                    maps[infoKey] = obj;
                                }
                            });

                            var jupey = 0
                            for (var key in maps) {
                                jupey = 1;
                                if (key != null) {
                                    result.push(maps[key]);
                                }
                            }
                            if (jupey == 0) {
                                var resultObj = {};
                                $rootScope.checkedArray.forEach(function (item, a) {
                                    resultObj[item] = "--";
                                });
                                resultObj[$rootScope.tableSwitch.latitude.field] = "暂无数据";
                                result.push(resultObj)
                            } else {
                                // 改变跳出率和新访客比率
                                for (var i = 0; i < result.length; i++) {
                                    var _obj = result[i];
                                    var _outRate = "--";
                                    if ($rootScope.checkedArray.indexOf("outRate") != -1 && _obj["vc"] != "--" && _obj["svc"] != "--") {
                                        if (_obj["vc"] == 0) {
                                            _outRate = "0.00%";
                                        } else {
                                            _outRate = (_obj["svc"] * 100 / _obj["vc"]).toFixed(2) + "%";
                                        }
                                        _obj.outRate = _outRate;
                                    }
                                    var _nuvRate = "--";
                                    if ($rootScope.checkedArray.indexOf("nuvRate") != -1 && _obj["uv"] != "--" && _obj["nuv"] != "--") {
                                        if (_obj["uv"] == 0) {
                                            _nuvRate = "0.00%";
                                        } else {
                                            _nuvRate = (_obj["nuv"] * 100 / _obj["uv"]).toFixed(2) + "%";
                                        }
                                        _obj.nuvRate = _nuvRate;
                                    }
                                    var _avgPage = "--";
                                    if ($rootScope.checkedArray.indexOf("avgPage") != -1 && _obj["vc"] != "--" && _obj["pv"] != "--") {
                                        if (_obj["vc"] == 0) {
                                            _avgPage = "0.00";
                                        } else {
                                            _avgPage = (_obj["pv"] / _obj["vc"]).toFixed(2);
                                        }
                                        _obj.avgPage = _avgPage;
                                    }
                                }
                            }
                            $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                            // 今日统计按时特殊处理
                            if ($rootScope.tableTimeStart == 0 && $rootScope.tableTimeEnd == 0 && $scope.hourcheckClass == true && result.length == 24) {
                                result = result.slice(0, new Date().getHours() + 1);
                            }
                            // 时间段过滤
                            if ($rootScope.timeFilter) {
                                var resultArray = [];
                                $rootScope.timeFilter.forEach(function (e) {
                                    if (result[e]) {
                                        resultArray.push(result[e]);
                                    }
                                });
                                $scope.gridOptions.data = resultArray;
                            } else {
                                $scope.gridOptions.data = result;
                            }
                        }
                    }

                }).error(function (error) {
                });
            }
        };

        $scope.$on("history", function (e, msg) {
            $scope.gridOpArray = angular.copy($rootScope.gridArray);
            $scope.gridOpArray.splice(1, 1);
            $scope.gridOptions.columnDefs = $scope.gridOpArray;

            //默认指标设置排序类型
            angular.forEach($scope.gridOptions.columnDefs, function (_record, index) {
                if (_record.name == "新访客比率" || _record.name == "跳出率") {
                    _record.sortingAlgorithm = $rootScope.sortPercent;
                } else if (_record.field == "vc" || _record.field == "uv" || _record.field == "pv"
                    || _record.field == "nuv" || _record.field == "ip" || _record.field == "avgPage") {
                    _record.sortingAlgorithm = $rootScope.sortNumber;
                }
            });
            $scope.gridOptions.data = msg;
        });
        //数据对比
        $rootScope.datepickerClickTow = function (start, end, label) {
            //consolelog("事件 数据对比")
            $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
            var gridArrayOld = angular.copy($rootScope.gridArray);
            var latitudeOld = angular.copy($rootScope.tableSwitch.latitude);
            if ($rootScope.tableSwitch.number == 6) {
                $rootScope.gridArray.forEach(function (item, i) {
                    var a = item["field"];
                    if (item["cellTemplate"] == undefined) {
                        item["cellTemplate"] = "<ul class='contrastlist'><li>{{grid.appScope.getContrastInfo(grid, row,0,'" + a + "')}}</li><li>{{grid.appScope.getContrastInfo(grid, row,1,'" + a + "')}}</li><li>{{grid.appScope.getContrastInfo(grid, row,2,'" + a + "')}}</li><li>{{grid.appScope.getContrastInfo(grid, row,3,'" + a + "')}}</li></ul>";
                        item["footerCellTemplate"] = "<ul class='contrastlist'><li>{{grid.appScope.getEventCourFooterData(this,grid.getVisibleRows(),0)}}</li><li>{{grid.appScope.getEventCourFooterData(this,grid.getVisibleRows(),1)}}</li><li>{{grid.appScope.getEventCourFooterData(this,grid.getVisibleRows(),2)}}</li></ul>";

                    }
                });
            } else {
                $rootScope.gridArray.forEach(function (item, i) {
                    var a = item["field"];
                    if (item["cellTemplate"] == undefined) {
                        item["cellTemplate"] = "<ul class='contrastlist'><li>{{grid.appScope.getContrastInfo(grid, row,0,'" + a + "')}}</li><li>{{grid.appScope.getContrastInfo(grid, row,1,'" + a + "')}}</li><li>{{grid.appScope.getContrastInfo(grid, row,2,'" + a + "')}}</li><li>{{grid.appScope.getContrastInfo(grid, row,3,'" + a + "')}}</li></ul>";
                        item["footerCellTemplate"] = "<ul class='contrastlist'><li>{{grid.appScope.getCourFooterData(this,grid.getVisibleRows(),0)}}</li><li>{{grid.appScope.getCourFooterData(this,grid.getVisibleRows(),1)}}</li><li>{{grid.appScope.getCourFooterData(this,grid.getVisibleRows(),2)}}</li><li>{{grid.appScope.getCourFooterData(this,grid.getVisibleRows(),3)}}</li></ul>";
                    }
                });
            }

            $scope.gridOptions.rowHeight = 95;
            $scope.gridOptions.columnFooterHeight = 95;
            var time = chartUtils.getTimeOffset(start, end);
            var startTime = time[0];
            var endTime = time[0] + ($rootScope.tableTimeEnd - $rootScope.tableTimeStart);
            $rootScope.$broadcast("ssh_load_compare_datashow", startTime, endTime);
            var dateTime1 = chartUtils.getSetOffTime($rootScope.tableTimeStart, $rootScope.tableTimeEnd);
            var dateTime2 = chartUtils.getSetOffTime(startTime, endTime);
            $scope.targetDataContrast(null, null, false, function (item) {
                var target = $rootScope.tableSwitch.latitude.field;
                var dataArray = [];
                var is = 1;
                $scope.targetDataContrast(startTime, endTime, true, function (contrast) {
                    if ($rootScope.tableSwitch.number == 4) {//
                        var wordArray = [];// 搜索词数组
                        var aaaArray = [];
                        var bbbArray = [];
                        //item = [{"word":"","freq":1,"baidu":"100.0%","sougou":"0%","haosou":"0%","bing":"0%","other":"0%"},{"word":"百思 搜客","freq":1,"baidu":"0%","sougou":"100.0%","haosou":"0%","bing":"0%","other":"0%"}]
                        //contrast = [{"word":"","freq":1,"baidu":"100.0%","sougou":"0%","haosou":"0%","bing":"0%","other":"0%"},{"word":"SEM网销系统","freq":1,"baidu":"100.0%","sougou":"0%","haosou":"0%","bing":"0%","other":"0%"},{"word":"SEM管理系统","freq":2,"baidu":"100.0%","sougou":"0%","haosou":"0%","bing":"0%","other":"0%"},{"word":"百思买官网","freq":2,"baidu":"100.0%","sougou":"0%","haosou":"0%","bing":"0%","other":"0%"}];
                        item.forEach(function (_record) {
                            aaaArray.push(_record["word"]);
                            wordArray.push(_record["word"]);
                        });
                        contrast.forEach(function (_record) {
                            bbbArray.push(_record["word"]);
                            if (wordArray.indexOf(_record["word"]) == -1) {// 判断搜索词是否已存在
                                wordArray.push(_record["word"]);
                            }
                        });

                        for (var i = 0; i < wordArray.length; i++) {
                            if (wordArray[i] != undefined && (wordArray[i] == "-" || wordArray[i] == "" || wordArray[i] == "www" || wordArray[i] == "null" || wordArray[i].length >= 40)) {
                                continue;
                            }
                            var a_i = aaaArray.indexOf(wordArray[i]);
                            var b_i = bbbArray.indexOf(wordArray[i]);
                            if (a_i != -1 && b_i != -1) {
                                var obj = {
                                    "word": wordArray[i] + "," + getContrastLabel(dateTime1) + "," + getContrastLabel(dateTime2) + ",变化率",
                                    "freq": "　" + "," + item[a_i].freq + "," + contrast[b_i].freq + "," + parseFloat((item[a_i].freq - contrast[b_i].freq) / contrast[b_i].freq).toFixed(2) + "%"
                                };
                                var _item_obj = item[a_i];
                                var _contrast_obj = contrast[b_i];
                                for (var _p in _item_obj) {
                                    if (_p != "word" && _p != "freq") {
                                        var value_a = parseFloat(_item_obj[_p].substring(0, _item_obj[_p].length - 1));
                                        var value_b = parseFloat(_contrast_obj[_p].substring(0, _contrast_obj[_p].length - 1));
                                        if (value_b == 0) {
                                            obj[_p] = "　" + "," + value_a.toFixed(2) + "%," + value_b.toFixed(2) + "%,--";
                                        } else {
                                            obj[_p] = "　" + "," + value_a.toFixed(2) + "%," + value_b.toFixed(2) + "%," + ((value_a - value_b) / value_b).toFixed(2) + "%";
                                        }
                                    }
                                }
                                dataArray.push(obj);
                            }
                            if (a_i != -1 && b_i == -1) {
                                var obj = {
                                    "word": wordArray[i] + "," + getContrastLabel(dateTime1) + "," + getContrastLabel(dateTime2) + ",变化率",
                                    "freq": "　" + "," + item[a_i].freq + ",--,--"
                                };
                                var _item_obj = item[a_i];
                                for (var _p in _item_obj) {
                                    if (_p != "word" && _p != "freq") {
                                        var value = _item_obj[_p];
                                        obj[_p] = "　" + "," + parseFloat(value.substring(0, value.length - 1)).toFixed(2) + "%,--,--";
                                    }
                                }
                                dataArray.push(obj);
                            }
                            if (a_i == -1 && b_i != -1) {
                                var obj = {
                                    "word": wordArray[i] + "," + getContrastLabel(dateTime1) + "," + getContrastLabel(dateTime2) + ",变化率",
                                    "freq": "　" + "," + "--," + contrast[b_i].freq + ",--"
                                };
                                var _contrast_obj = contrast[b_i];
                                for (var _p in _contrast_obj) {
                                    if (_p != "word" && _p != "freq") {
                                        var value = _contrast_obj[_p];
                                        obj[_p] = "　" + ",--," + parseFloat(value.substring(0, value.length - 1)).toFixed(2) + "%,--";
                                    }
                                }
                                dataArray.push(obj);
                            }
                        }
                        if (dataArray.length == 0) {
                            var obj = {
                                "word": "暂无数据," + getContrastLabel(dateTime1) + "," + getContrastLabel(dateTime2) + ",变化率",
                                "freq": "　" + ",--,--,--",
                                "baidu": "　" + ",--,--,--",
                                "sougou": "　" + ",--,--,--",
                                "haosou": "　" + ",--,--,--",
                                "bing": "　" + ",--,--,--",
                                "other": "　" + ",--,--,--"
                            };
                            dataArray.push(obj);
                        }
                        $rootScope.$broadcast("LoadCompareDateShowDataFinish", item, contrast);
                    }
                    else {
                        item.forEach(function (a, b) {
                            var dataObj = {};
                            if (target == "period" && $location.$$path == "/trend/today" && $rootScope.tableFormat == "day") {// 今日统计按日统计时特殊处理
                                $rootScope.checkedArray.forEach(function (tt, aa) {
                                    try {
                                        var bili = ((parseInt(a[tt] + "".replace("%")) - parseInt((contrast[b][tt] + "").replace("%"))) / (parseInt((contrast[b][tt] + "").replace("%")) == 0 ? parseInt(a[tt] + "".replace("%")) : parseInt((contrast[b][tt] + "").replace("%"))) * 100).toFixed(2);
                                        if (isNaN(bili)) {
                                            dataObj[tt] = "0.00%";
                                        } else {
                                            dataObj[tt] = bili + "%";
                                        }
                                        if (tt == "nuvRate" || tt == "outRate") {
                                            a[tt] = "　" + "," + getRateValue(a[tt]) + "," + getRateValue(contrast[b][tt]) + "," + dataObj[tt];
                                        } else if (tt == "avgTime") {
                                            a[tt] = "　" + "," + MillisecondToDate(a[tt]) + "," + MillisecondToDate(contrast[b][tt]) + "," + dataObj[tt];
                                        } else {
                                            a[tt] = "　" + "," + a[tt] + "," + contrast[b][tt] + "," + dataObj[tt];
                                        }
                                    } catch (e) {
                                        a[tt] = "　" + "," + a[tt] + "," + "--" + "," + "--"
                                    }
                                });
                                a[target] = a[target] + "," + ($rootScope.startString != undefined ? $rootScope.startString : dateTime1[0] == dateTime1[1] ? dateTime1[0] + "," + dateTime2[0] + "," + "变化率" : dateTime1[0] + " 至 " + dateTime1[1]) + "," + (dateTime2[0] + " 至 " + dateTime2[1]) + "," + "变化率";
                                dataArray.push(a);
                                is = 0;
                            } else {
                                for (var i = 0; i < contrast.length; i++) {
                                    if (a[target] == contrast[i][target]) {
                                        $rootScope.checkedArray.forEach(function (tt, aa) {
                                            var bili = ((parseInt(a[tt] + "".replace("%")) - parseInt((contrast[i][tt] + "").replace("%"))) / (parseInt((contrast[i][tt] + "").replace("%")) == 0 ? parseInt(a[tt] + "".replace("%")) : parseInt((contrast[i][tt] + "").replace("%"))) * 100).toFixed(2);
                                            if (isNaN(bili)) {
                                                dataObj[tt] = "0.00%";
                                            } else {
                                                dataObj[tt] = bili + "%";
                                            }
                                            if (tt == "nuvRate" || tt == "outRate") {
                                                a[tt] = "　" + "," + getRateValue(a[tt]) + "," + getRateValue(contrast[i][tt]) + "," + dataObj[tt];
                                            } else if (tt == "avgTime") {
                                                a[tt] = "　" + "," + MillisecondToDate(a[tt]) + "," + MillisecondToDate(contrast[i][tt]) + "," + dataObj[tt];
                                            } else {
                                                a[tt] = "　" + "," + a[tt] + "," + contrast[i][tt] + "," + dataObj[tt];
                                            }
                                        });
                                        a[target] = a[target] + "," + ($rootScope.startString != undefined ? $rootScope.startString : dateTime1[0] == dateTime1[1] ? dateTime1[0] + "," + dateTime2[0] + "," + "变化率" : dateTime1[0] + " 至 " + dateTime1[1]) + "," + (dateTime2[0] + " 至 " + dateTime2[1]) + "," + "变化率";
                                        dataArray.push(a);
                                        is = 0;
                                        return;
                                    } else {
                                        is = 1
                                    }
                                }
                            }

                            if (is == 1) {
                                $rootScope.checkedArray.forEach(function (tt, aa) {
                                    dataObj[tt] = "--";
                                    a[tt] = "　" + "," + a[tt] + "," + "--" + "," + "--"
                                });
                                a[target] = a[target] + "," + ($rootScope.startString != undefined ? $rootScope.startString : dateTime1[0] == dateTime1[1] ? dateTime1[0] + "," + dateTime2[0] + "," + "变化率" : dateTime1[0] + " 至 " + dateTime1[1]) + "," + (dateTime2[0] + " 至 " + dateTime2[1]) + "," + "变化率"
                                dataArray.push(a);
                            }
                        });
                    }
                    $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                });
                $scope.gridOptions.data = dataArray;
                $rootScope.tableSwitch.latitude = latitudeOld;
                $rootScope.gridArray = gridArrayOld;
            })
        };
        function getContrastLabel(dateTimeArray) {
            if (undefined == dateTimeArray || null == dateTimeArray) {
                return "";
            }
            if (dateTimeArray[0] == dateTimeArray[1]) {
                return dateTimeArray[0];
            }
            return dateTimeArray[0] + "至" + dateTimeArray[1];
        }

        function getRateValue(_value) {
            if (_value == undefined) {
                return "--";
            }
            if (_value != "--") {
                if ((_value + "").indexOf("%") == -1) {
                    return _value + "%";
                }
            }
            return _value;
        }

        //数据对比实现方法
        $scope.targetDataContrast = function (startInfoTime, endInfoTime, isComparedData, cabk) {
            $scope.gridOpArray = angular.copy($rootScope.gridArray);
            $scope.gridOptions.columnDefs = $scope.gridOpArray;
            if ($rootScope.tableSwitch.isJudge == undefined) $scope.isJudge = true;
            if ($rootScope.tableSwitch.isJudge) $rootScope.tableSwitch.tableFilter = undefined;
            if ($rootScope.tableSwitch.number == 4) {
                var searchUrl = SEM_API_URL + "/es/search_word?tid=" + trackid + "&startOffset=" + (startInfoTime == null ? $rootScope.tableTimeStart : startInfoTime) + "&endOffset=" + (endInfoTime == null ? $rootScope.tableTimeEnd : endInfoTime);
                $http({
                    method: 'GET',
                    url: searchUrl
                }).success(function (data, status) {
                    cabk(data);
                });
                return;
            }
            if ($rootScope.tableSwitch.number == 6) {
                $http({
                    method: 'GET',
                    url: "/config/eventchnage_list?type=search&query=" + JSON.stringify({
                            uid: $cookieStore.get("uid"),
                            root_url: $rootScope.siteId
                        }
                    )
                }).success(function (events, status) {
                    var eventPages = [], hash = {}, eventParams = [], eventInfos = {};
                    events.forEach(function (elem) {
                        //去除页面中的/结尾情况
                        if (elem.event_page != undefined && elem.event_page != "" && elem.event_page[elem.event_page.length - 1] == "/") {
                            elem.event_page = elem.event_page.substring(0, elem.event_page.length - 1)
                        }
                        if (!hash[elem.event_page]) {
                            eventPages.push(elem.event_page);
                            hash[elem.event_page] = true;
                        } else {

                        }
                        eventParams.push({
                            event_page: elem.event_page,
                            event_id: elem.event_id,
                            update_time: elem.update_time,
                            event_target: elem.event_target
                        })
                    })
                    $rootScope.curEventConfs = eventParams;
                    var purl = "/api/transform/getEventPVs?start=" + (startInfoTime == null ? $rootScope.tableTimeStart : startInfoTime) + "&end=" + (endInfoTime == null ? $rootScope.tableTimeEnd : endInfoTime) + "&type=" + $rootScope.userType + "&queryOptions=" + $scope.es_checkArray + "&events=" + JSON.stringify(eventParams) + "&showType=day" + "&filters=" + $rootScope.getFilters()
                    $http.get(purl).success(function (pvs) {
                        if (pvs != null || pvs != "") {//PV 信息若不存在 则事件信息认为一定不存在
                            $rootScope.curEventPVs = pvs
                            events.forEach(function (event, index) {
                                pvs[index]["eventName"] = event.event_name
                                pvs[index]["eventId"] = event.event_id
                                pvs[index]["loc"] = event.event_page
                            })
                            var esurl = "/api/transform/getConvEvents?start=" + (startInfoTime == null ? $rootScope.tableTimeStart : startInfoTime) + "&end=" + (endInfoTime == null ? $rootScope.tableTimeEnd : endInfoTime) + "&type=" + $rootScope.userType + "&eventPages=" + JSON.stringify(eventParams) + "&showType=day" + "&filters=" + $rootScope.getFilters()
                            $http.get(esurl).success(function (eventInfos) {
                                $rootScope.curEventInfos = eventInfos
                                var results = [];
                                events.forEach(function (event, index) {
                                    var data = pvs[index]
                                    for (var i = 0; i < $scope.es_checkArray.length; i++) {
                                        if ($scope.es_checkArray[i] == "crate") {
                                            if (eventInfos[event.event_page + "_" + event.event_id] != undefined && Number(data["uv"]) != 0) {
                                                data["crate"] = (Number(eventInfos[event.event_page + "_" + event.event_id].convCount / Number(data["uv"])) * 100).toFixed(2) + "%";
                                            } else {
                                                data["crate"] = "0.00%";
                                            }
                                        } else if ($scope.es_checkArray[i] == "transformCost") {
                                            data["transformCost"] = /*(cost / Number(data["transformCost"])).toFixed(2).toString() +*/ "0.00元";
                                        } else if ($scope.es_checkArray[i] == "clickTotal") {
                                            if (eventInfos[event.event_page + "_" + event.event_id] != undefined) {
                                                data["clickTotal"] = eventInfos[event.event_page + "_" + event.event_id].eventCount;
                                            } else {
                                                data["clickTotal"] = 0
                                            }

                                        }
                                        else if ($scope.es_checkArray[i] == "conversions") {
                                            if (eventInfos[event.event_page + "_" + event.event_id] != undefined) {
                                                data["conversions"] = eventInfos[event.event_page + "_" + event.event_id].convCount;
                                            } else {
                                                data["conversions"] = 0;
                                            }
                                        }
                                    }
                                    //consolelog("对比查询数据")
                                    results.push(data)
                                })
                                $rootScope.setShowArray(events, eventInfos, pvs, isComparedData)
                                cabk(results)
                            })
                        }
                        else {
                            cabk([])
                        }
                    })
                })
            }
            else {
                $http({
                    method: 'GET',
                    url: '/api/indextable/?start=' + (startInfoTime == null ? $rootScope.tableTimeStart : startInfoTime) + "&end=" + (endInfoTime == null ? $rootScope.tableTimeEnd : endInfoTime) + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field)
                    + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&promotion=" + JSON.stringify($rootScope.tableSwitch.promotionSearch) + "&formartInfo=" + $rootScope.tableFormat + "&type=" + esType
                }).success(function (data, status) {
                    if ($rootScope.tableSwitch.promotionSearch != undefined && $rootScope.tableSwitch.promotionSearch) {
                        var url = SEM_API_URL + "/sem/report/account?a=" + user + "&b=" + baiduAccount + "&startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd + "&device=-1";
                        $http({
                            method: 'GET',
                            url: url
                        }).success(function (dataSEM, status) {
                            var dataArray = [];
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
                    }
                    else {
                        var filters = JSON.parse($rootScope.tableSwitch.tableFilter);
                        if ($location.path() == "/page/indexoverview_ep") { //退出模块
                            var rf_type = -1;
                            var se = -1;
                            var isNew = -1;
                            if (filters != null) {
                                var index;
                                rf_type = (index = filters.elementHasOwnProperty("rf_type")) == -1 ? -1 : filters[index].rf_type[0];
                                se = (index = filters.elementHasOwnProperty("se")) == -1 ? -1 : filters[index].se[0];
                                if (se != -1) {
                                    se = $rootScope.browsersKeyMap[se];
                                }
                                isNew = (index = filters.elementHasOwnProperty("ct")) == -1 ? -1 : filters[index].ct[0];
                            }
                            var parameter = {
                                type: $rootScope.userType,
                                rf_type: rf_type,
                                se: se,
                                isNew: isNew,
                                start:(startInfoTime == null ? $rootScope.tableTimeStart : startInfoTime),
                                end: (endInfoTime == null ? $rootScope.tableTimeEnd : endInfoTime)
                            };
                            var url = "/gacache/queryECData?query=" + JSON.stringify(parameter);

                            $http({
                                method: 'GET',
                                url: url
                            }).success(function (exitCountDatas) {
                                //$scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                                data.forEach(function (trData) {
                                    if (exitCountDatas.hasOwnProperty(trData.loc)) {
                                        trData.ec = exitCountDatas[trData.loc];
                                    } else {
                                        trData.ec = "0";
                                    }
                                });
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
                                    var maps = {};
                                    var newData = chartUtils.getByHourByDayData(data);
                                    newData.forEach(function (info, x) {
                                        for (var i = 0; i < info.key.length; i++) {
                                            var infoKey = info.key[i];
                                            var obj = maps[infoKey];
                                            if (!obj) {
                                                obj = {};
                                                var dataString = (infoKey.toString()
                                                    .length >= 2 ? "" : "0");
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
                            });
                        }else{
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
                                var maps = {};
                                var newData = chartUtils.getByHourByDayData(data);
                                newData.forEach(function (info, x) {
                                    for (var i = 0; i < info.key.length; i++) {
                                        var infoKey = info.key[i];
                                        var obj = maps[infoKey];
                                        if (!obj) {
                                            obj = {};
                                            var dataString = (infoKey.toString()
                                                .length >= 2 ? "" : "0");
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

                    }
                }).error(function (error) {
                    //consolelog(error);
                });
            }
        };

        //表格数据展开项
        var griApiInfo = function (gridApi) {
            $scope.gridOpArray = angular.copy($rootScope.gridArray);
            gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                var dataNumber;

                if (row.isExpanded && $rootScope.tableSwitch.dimen == false) {
                    row.isExpanded = false;
                }
                if (row.isExpanded && $rootScope.tableSwitch.dimen != false) {
                    if (row.entity[$rootScope.tableSwitch.latitude.field] == "搜索引擎" && $rootScope.tableSwitch.latitude.field == "rf_type")$rootScope.tableSwitch.dimen = "se";
                    if (row.entity[$rootScope.tableSwitch.latitude.field] == "外部链接" && $rootScope.tableSwitch.latitude.field == "rf_type")$rootScope.tableSwitch.dimen = "rf";
                    if ($scope.webSite == 1)$rootScope.tableSwitch.dimen =
                        "rf";
                    var returnFilter = angular.copy($rootScope.tableSwitch.tableFilter);
                    var entity = row.entity[$rootScope.tableSwitch.latitude.field];
                    var newEntity = row.entity[$rootScope.tableSwitch.latitude.field].split(",");
                    newEntity.length > 0 ? entity = newEntity[0] : "";
                    var fileteran = $rootScope.tableSwitch.tableFilter;
                    var newFileter = fileteran != undefined && fileteran != "undefined" && fileteran != null ? "," + fileteran : "";
                    newFileter = newFileter.toString().replace("[", "").replace(/]$/gi, "")
                    $rootScope.tableSwitch.tableFilter = "[{\"" + $rootScope.tableSwitch.latitude.field + "\":[\"" + getField(entity, $rootScope.tableSwitch.latitude.field) + "\"]}" + newFileter + "]";
                    //  $scope.gridApi2.expandable.collapseAllRows();

                    row.entity.subGridOptions = {
                        appScopeProvider: $scope.subGridScope,
                        showHeader: false,
                        enableHorizontalScrollbar: 0,
                        enableVerticalScrollbar: 0,
                        expandableRowHeight: 30,
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
                        //PS：直接使用$scope.gridOpArray作为只表格的配置会出现子表格数据显示问题
                        //row.entity.subGridOptions.columnDefs = $scope.gridOpArray;
                        row.entity.subGridOptions.columnDefs = $scope.getSubColumnDefs($scope.gridOpArray);
                        row.entity.subGridOptions.data = data;
                        row.entity.subGridOptions.virtualizationThreshold = data.length;
                        if (data.length == 0) {
                            row.isExpanded = false
                        }
                        $rootScope.tableSwitch.tableFilter = returnFilter;
                    }).error(function (error) {
                        //consolelog(error);
                    });
                }
            });
        };

        $scope.getSubColumnDefs = function (gridOpArray) {
            var _t_arr = [];
            for (var i = 0; i < gridOpArray.length; i++) {
                if (gridOpArray[i]["name"] == " ") {
                    _t_arr.push({
                        name: gridOpArray[i]["name"],
                        displayName: gridOpArray[i]["displayName"],
                        field: gridOpArray[i]["field"],
                        maxWidth: gridOpArray[i]["maxWidth"],
                        cellTemplate: gridOpArray[i]["cellTemplate"]
                    });
                } else if (gridOpArray[i]["name"] == "来源类型") {
                    _t_arr.push({
                        name: gridOpArray[i]["name"],
                        displayName: gridOpArray[i]["displayName"],
                        field: gridOpArray[i]["field"],
                        maxWidth: gridOpArray[i]["maxWidth"],
                        cellTemplate: "<div class='getExternalLinks' my-data-one='{{grid.appScope.getExternalLinksCellValue(grid, row, 1)}}' my-data-two='{{grid.appScope.getExternalLinksCellValue(grid, row, 2)}}'></div>"
                    });
                } else {
                    _t_arr.push({
                        name: gridOpArray[i]["name"],
                        displayName: gridOpArray[i]["displayName"],
                        field: gridOpArray[i]["field"],
                        maxWidth: gridOpArray[i]["maxWidth"]
                    });
                }
            }
            return _t_arr;
        };

        //子表格方法通用
        $scope.subGridScope = {
            getHistoricalTrend: function (b, sta) {
                $scope.getHistoricalTrend(b, sta, true);
            },
            showEntryPageLink: function (row, number) {
                $scope.showEntryPageLink(row, number);
            },
            getExternalLinksCellValue: function (grid, row, number) {
                return $scope.getExternalLinksCellValue(grid, row, number);
            }
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
                var a = (row.entity[fieldData] + "").split(",");
                if (number == 0) {
                    return a[0];
                } else if (number == 1) {
                    return a[1];
                } else if (number == 2) {
                    return a[2];
                } else if (number == 3) {
                    if (a[2] == 0) {
                        return "--";
                    }
                    return a[3];
                }
            }
        };
        //表格HTML展开项
        var griApihtml = function (gridApi) {
            gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                var htmlData = new Array();
                row.entity.subGridOptions = {
                    appScopeProvider: $scope.subGridScope,
                    expandableRowHeight: 360,
                    enableHorizontalScrollbar: 1,
                    enableVerticalScrollbar: 1,
                    showHeader: false,
                    columnDefs: htmlData
                };
                var search = SEM_API_URL + "/es/real_time?tid=" + trackid + "&tt=" + row.entity.tt;
                $http({
                    method: 'GET',
                    url: search
                }).success(function (datas, status) {
                    var utimeHtml = "";
                    var vtimeHtml = "";
                    var urlHtml = "";

                    datas.record.forEach(function (vtime, i) {
                        utimeHtml = utimeHtml + "<li><span>" + (new Date(parseInt(vtime.otime)).Format("hh:mm:ss")) + "</span></li>";
                        var a = (Math.round(parseInt(vtime.vtime) / 1000));
                        vtimeHtml = vtimeHtml + "<li><span>" + (datas.record.length - 1 == i ? "--" : (parseInt(a / 60) + "\'" + (a % 60) + "\"")) + "</span></li>";
                        urlHtml = urlHtml + "<li><span><a href='" + vtime.loc + "' target='_blank'>" + vtime.loc + "</a></span></li>"
                    });

                    var lastTime = "";

                    if (datas.ct == 0) {
                        lastTime = datas.last != "首次访问" ? new Date(parseInt(datas.last)).Format("yyyy-MM-dd hh:mm:ss") : datas.last;
                    } else {
                        lastTime = datas.last != "首次访问" ? new Date(parseInt(datas.last)).Format("yyyy-MM-dd hh:mm:ss") : "--";
                    }

                    var classInfo = "windows";
                    var classbr = "firefox";
                    datas.os.indexOf("Windows") != -1 ? classInfo = "windows" : "";
                    datas.os.indexOf("mac") != -1 ? classInfo = "mac" : "";
                    datas.os.indexOf("Linux") != -1 ? classInfo = "linux" : "";
                    datas.br.indexOf("Chrome") != -1 ? classbr = "google" : "";
                    datas.br.indexOf("Firefox") != -1 ? classbr = "firefox" : "";
                    datas.br.indexOf("IE") != -1 ? classbr = "ie" : "";
                    var result = "<div class='trendbox' style='height:360px; overflow:hidden;'>" +
                        "<div class='trend_top'><div class='trend_left'><div class='left_top'><div class='trend_img'><span class='" + classInfo + "'></span></div><div class='trend_text'>" +
                        "<ul><li>操作系统：<span>" + datas.os + "</span></li><li>网络服务商：<span>" + datas.isp + "</span></li><li>屏幕分辨率：<span>" + datas.sr + "</span></li>" +
                        "<li>屏幕颜色:<span>" + datas.sc + "</span></li></ul></div></div><div class='left_under'><div class='trend_img'><span class='" + classbr + "'></span></div><div class='trend_text'>" +
                        "<ul><li>浏览器：<span>" + datas.br + "</span></li><li>Flash版本：<span>" + (datas.fl != undefined ? datas.fl : "12.5") + "</span></li><li>是否支持Cookie：<span>" + (datas.ck == '1' ? " 支持" : " 不支持" ) + "</span></li>" +
                        "<li>是否支持JAVA:<span>" + (datas.ja == "0" ? " 支持" : " 不支持") + "</span></li></ul></div></div></div><div class='trend_right'>" +
                        "<ul><li>访问类型：<span>" + (datas.ct == 0 ? " 新访客" : " 老访客") + "</span></li>" +
                        "<li>当天访问频次：<span>" + datas.vfreq + "</span></li>" +
                        "<li>上一次访问时间：<span>" + lastTime + "</span></li>" +
                        "<li>本次来路:<span>" + (datas.se == "-" || datas.se == undefined || datas.se == "" ? " 直接访问" : "<a href='" + datas.rf + "' target='_blank'>" + datas.se + "( 搜索词:" + datas.kw + ")</a>") + "</span></li>" +
                        "<li>入口页面：<span><a href='" + datas.loc + "' target='_blank'>" + datas.loc + "</a></span></li>" +
                        "<li>最后停留在:<span><a href='" + datas.record[datas.record.length - 1]["loc"] + "' target='_blank'>" + datas.record[datas.record.length - 1]["loc"] + "</a></span></li></ul>" +
                        "</div></div><div class='trendunder'><b>访问路径：</b>" +
                        "<ul><li>打开时间</li>" + utimeHtml + "</ul>" +
                        "<ul><li>停留时长</li>" + vtimeHtml + "</ul>" +
                        "<ul><li>页面地址</li>" + urlHtml + "</ul></div></div>";

                    var res = {};
                    res["name"] = "test";
                    res["field"] = "info";
                    res["cellTemplate"] = result;
                    htmlData.push(res);
                    row.entity.subGridOptions.data = [{"info": " "}];
                }).error(function (error) {
                    //consolelog(error);
                });
            });
        };
        // table 历史趋势
        $scope.getHistoricalTrend = function (b, sta, x) {
            if ($rootScope.tableSwitch.isJudge == undefined)$scope.isJudge = true;
            if ($rootScope.tableSwitch.isJudge)$rootScope.tableSwitch.tableFilter = undefined;
            var a = b.$parent.$parent.row.entity[$rootScope.tableSwitch.latitude.field];
            $rootScope.webName = "[" + a + "]";
            var s = a.split(",");
            s.length > 0 ? a = s[0] : "";
            var fileteran = $rootScope.tableSwitch.tableFilter;
            var newFileter = fileteran != undefined && fileteran != "undefined" && fileteran != null ? "," + fileteran : "";
            newFileter = newFileter.toString().replace("[", "").replace(/]$/gi, "");
            if (x) {
                var f = $rootScope.tableSwitch.dimen;
                var field = f != undefined && f != null ? $rootScope.tableSwitch.dimen : $rootScope.tableSwitch.latitude.field;
                $rootScope.tableSwitch.tableFilter = "[{\"" + field + "\":[\"" + getField(a, $rootScope.tableSwitch.latitude.field) + "\"]}" + newFileter + "]";
            } else {
                $rootScope.tableSwitch.tableFilter = "[{\"" + $rootScope.tableSwitch.latitude.field + "\":[\"" + getField(a, $rootScope.tableSwitch.latitude.field) + "\"]}" + newFileter + "]";
            }
            $state.go(sta);
        };
        // 对比时的底部显示
        $scope.getEventCourFooterData = function (a, option, number) {
            var strs = ["", "", ""]
            var chashloc = {}
            var cmax = []
            var ohashloc = {}
            var omax = []

            var cconversions = 0
            var oconversions = 0
            if (a.renderIndex == 1) {
                strs[2] = "当页汇总";
            } else if (a.renderIndex == 2) {
            } else {
                if (a.col.field == "pv" || a.col.field == "uv" || a.col.field == "ip" || a.col.field == "vc" || a.col.field == "nuv" || a.col.field == "nuvRate") {
                    option.forEach(function (item, x) {
                        var itemSplDatas = (item.entity[a.col.field] + "").split(",");
                        if (chashloc[item.entity["loc"]] == undefined) {
                            chashloc[item.entity["loc"]] = cmax.length
                            cmax.push(itemSplDatas[1])
                        } else {
                            if (cmax[chashloc[item.entity["loc"]]] < itemSplDatas[1]) {
                                cmax.push(itemSplDatas[1])
                            }
                        }
                        if (ohashloc[item.entity["loc"]] == undefined) {
                            ohashloc[item.entity["loc"]] = omax.length
                            omax.push(itemSplDatas[2])
                        } else {
                            if (omax[ohashloc[item.entity["loc"]]] < itemSplDatas[2]) {
                                omax.push(itemSplDatas[2])
                            }
                        }
                    });
                }
                //else if(a.col.field == "crate"){//转化率计算
                //    option.forEach(function (item, x) {
                //        var itemSplDatas = (item.entity["vc"] + "").split(",");
                //        var convSplDatas = (item.entity["conversions"] + "").split(",");
                //
                //        if (chashloc[item.entity["loc"]] == undefined) {
                //            chashloc[item.entity["loc"]] = cmax.length
                //            cmax.push(itemSplDatas[1])
                //        } else {
                //            if (cmax[chashloc[item.entity["loc"]]] < itemSplDatas[1]) {
                //                cmax.push(itemSplDatas[1])
                //            }
                //        }
                //        cconversions+=convSplDatas[1]
                //
                //        if (ohashloc[item.entity["loc"]] == undefined) {
                //            ohashloc[item.entity["loc"]] = omax.length
                //            omax.push(itemSplDatas[2])
                //        } else {
                //            if (omax[ohashloc[item.entity["loc"]]] < itemSplDatas[2]) {
                //                omax.push(itemSplDatas[2])
                //            }
                //        }
                //        oconversions+=convSplDatas[2]
                //    });
                //    //consolelog(cmax)
                //}
                else {
                    option.forEach(function (item, x) {
                        var itemSplDatas = (item.entity[a.col.field] + "").split(",");
                        cmax.push(itemSplDatas[1])
                        omax.push(itemSplDatas[2])
                    });
                }
                var ctemp = 0, otemp = 0, ptemp = 0
                cmax.forEach(function (c) {
                    if (c != undefined)
                        ctemp += Number(c.indexOf("%") || c.indexOf("元") >= 0 ? c.replace("%", "").replace("元", "") : c)
                })
                omax.forEach(function (o) {
                    if (o != undefined)
                        otemp += Number(o.indexOf("%") || o.indexOf("元") >= 0 ? o.replace("%", "").replace("元", "") : 0)
                })

                if (a.col.field == "nuvRate" || a.col.field == "crate") {
                    strs[0] = ctemp.toFixed(2) + "%"
                    strs[1] = otemp.toFixed(2) + "%"
                    strs[2] = otemp == 0 ? "--" : (((ctemp - otemp) / otemp) * 100).toFixed(2) + "%"
                }
                //else if(a.col.field == "crate"){
                //    //consolelog("****************************")
                //    //consolelog(JSON.stringify(cmax))
                //    strs[0] = ctemp==0?"0.00":((cconversions/ctemp)*100).toFixed(2)+"%"
                //    strs[1] = otemp==0?"0.00":((oconversions/otemp)*100).toFixed(2)+"%"
                //    //strs[2] = "---"
                //    //consolelog(JSON.stringify(strs))
                //    strs[2] = (otemp.toFixed(2)==0?0:((oconversions/otemp)*100).toFixed(2))==0?"--":(((( ctemp.toFixed(2)==0?0:(cconversions/ctemp)*100)-( otemp.toFixed(2)==0?0:(oconversions/otemp)*100))/( otemp.toFixed(2)==0?0:(oconversions/otemp)*100)).toFixed(2))+"%"
                //}
                else {
                    strs[0] = ctemp
                    strs[1] = otemp
                    strs[2] = otemp == 0 ? "--" : (((ctemp - otemp) / otemp) * 100).toFixed(2) + "%"
                }

            }
            switch (number) {
                case 0:
                    return strs[0];
                case 1:
                    return strs[1];
                case 2:
                    return strs[2];
                default :
                    return "--";
            }

        };
        // 对比时底部汇总数据计算方法
        $scope.getCourFooterData = function (a, option, number) {
            var rast = [0.0, 0.0];
            var rastString = ["", ""];
            var bhlString = "";
            var _c_field = a.col.field;
            var perFieldArray = ["outRate", "nuvRate", "arrivedRate", "baidu", "sougou", "haosou", "bing", "other"]; // 显示百分比的指标数组
            var yqFieldArray = ["baidu", "sougou", "haosou", "bing", "other"];
            var yqLengthArray = [0, 0];
            option.forEach(function (items, x) {
                var itemSplDatas = (items.entity[a.col.field] + "").split(",");
                if (itemSplDatas[3] == "变化率") {
                    rastString[0] = itemSplDatas[1];
                    rastString[1] = itemSplDatas[2];
                    bhlString = "变化率";
                } else {
                    if (itemSplDatas[1] != "--") {
                        yqLengthArray[0]++;
                    }
                    rast[0] += ((itemSplDatas[1] + "").replace("%", "") == "--" || (itemSplDatas[1] + "").replace("%", "") == "　" ? 0.0 : parseFloat(((itemSplDatas[1] + "").replace("%", ""))));
                    if (itemSplDatas[2] != "--") {
                        yqLengthArray[1]++;
                    }
                    rast[1] += ((itemSplDatas[2] + "").replace("%", "") == "--" || (itemSplDatas[2] + "").replace("%", "") == "　" ? 0.0 : parseFloat(((itemSplDatas[2] + "").replace("%", ""))));
                }
            });

            var str = " ";
            if (a.renderIndex == 1) {
                str = "当页汇总";
            }
            if (a.col.field == "pv" || a.col.field == "uv" || a.col.field == "ip" || a.col.field == "vc" || a.col.field == "nuv" || a.col.field == "freq"||a.col.field == "ec") {
                //
                //if(a.col.field == "uv"&&option.length>0&&option[0].entity["all_uv"]!=undefined){
                //
                //}
            } else {
                if (yqFieldArray.indexOf(_c_field) != -1) {// 搜索词-按照搜索引擎
                    rast[0] = (rast[0] / (yqLengthArray[0] == 0 ? 1 : yqLengthArray[0])).toFixed(2) + "%";
                    rast[1] = (rast[1] / (yqLengthArray[1] == 0 ? 1 : yqLengthArray[1])).toFixed(2) + "%";
                } else if (_c_field == "nuvRate") {
                    //if (a.col.field == "avgPage") {
                    //    var t_vc = 0;
                    //    var t_pv = 0;
                    //    option.forEach(function (_row) {
                    //        var _entity = _row.entity;
                    //        if (_entity.vc != "--") {
                    //            t_vc += parseInt(_entity.vc);
                    //        }
                    //        if (_entity.pv != "--") {
                    //            t_pv += parseInt(_entity.pv);
                    //        }
                    //    });
                    //    returnData[0] = (t_pv / (t_vc == 0 ? 1 : t_vc)).toFixed(2);
                    //}
                    //if (a.col.field == "outRate") {
                    //    var t_vc = 0;
                    //    var t_svc = 0;
                    //    option.forEach(function (_row) {
                    //        var _entity = _row.entity;
                    //        if (_entity.vc != "--") {
                    //            t_vc += parseInt(_entity.vc);
                    //        }
                    //        if (_entity.svc != "--") {
                    //            t_svc += parseInt(_entity.svc);
                    //        }
                    //    });
                    //    returnData[0] = (t_svc * 100 / (t_vc == 0 ? 1 : t_vc)).toFixed(2) + "%";
                    //}
                    if (a.col.field == "nuvRate") {
                        // 新访客比率算法。通过总的新访客数除以总的访客数
                        var t_uv = 0;
                        var t_nuv = 0;
                        option.forEach(function (_row) {
                            var _entity = _row.entity;
                            if (_entity.uv != "--") {
                                t_uv += parseInt(_entity.uv);
                            }
                            if (_entity.nuv != "--") {
                                t_nuv += parseInt(_entity.nuv);
                            }
                        });
                        rast[0] = (t_nuv * 100 / (t_uv == 0 ? 1 : t_uv)).toFixed(2) + "%";
                    }

                } else {
                    rast[0] = (rast[0] / option.length).toFixed(2) + (perFieldArray.indexOf(_c_field) != -1 ? "%" : "");
                    rast[1] = (rast[1] / option.length).toFixed(2) + (perFieldArray.indexOf(_c_field) != -1 ? "%" : "");
                }
            }
            var bhl = (((parseFloat(((rast[0] + "").replace("%", ""))) - parseFloat(((rast[1] + "").replace("%", "")))) / parseFloat(((rast[1] + "").replace("%", "")))) * 100 ).toFixed(2) + "%";

            if ((bhl + "").indexOf("NaN") != -1 || (bhl + "").indexOf("Infinity") != -1) {
                bhl = "--";
            }

            switch (number) {
                case 0:
                    return str;
                case 1:
                    return rastString[0] != "" ? (rastString[0] + "").indexOf("NaN") != -1 ? 0 : rastString[0] : (rast[0] + "").indexOf("NaN") != -1 ? 0 : rast[0];
                case 2:
                    return rastString[1] != "" ? (rastString[1] + "").indexOf("NaN") != -1 ? 0 : rastString[1] : (rast[1] + "").indexOf("NaN") != -1 ? 0 : rast[1];
                case 3:
                    return bhlString != "" ? bhlString : bhl;
                default :
                    return "--";
            }
        };
        $scope.getCellDisplayValueReferrer = function (grid, row, number) {
            var a = row.entity.referrer.split(",");
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
        }
        $scope.getCellDisplayValueEntrance = function (grid, row) {
            return row.entity.entrance;
        }
        $scope.getExternalLinksCellValue = function (grid, row, number) {
            var a = row.entity.rf_type;
            if (number == 1) {
                if (a.indexOf("http://") != -1 || a.indexOf("https://") != -1) {
                    return "links";
                } else {
                    return "others";
                }
            } else if (number == 2) {
                return a;
            }
        }
        //得到表格底部数据
        $scope.getFooterData = function (a, option, number) {
            var returnData = [0, 0, 0, 0];
            var spl = 0;
            var newSpl = [0, 0, 0];
            var newitemSplData = [0, 0, 0, 0];
            if (option.length > 0) {
                option.forEach(function (item, i) {
                    var itemSplData = (item.entity[a.col.field] + "").split(",");
                    if (itemSplData.length >= 4) {
                        itemSplData.forEach(function (data, index) {
                            newitemSplData[index] += ((itemSplData[index] + "").replace("%", "") == "--" || (itemSplData[index] + "").replace("%", "") == "　" ? 0.0 : parseFloat(((itemSplData[index] + "").replace("%", ""))));
                        })
                    } else {
                        var tmp = 0;
                        if (item.entity[a.col.field] == "--") {
                            tmp = 0;
                        } else {
                            tmp = item.entity[a.col.field];
                        }
                        returnData[0] += parseFloat((tmp + "").replace("%", ""));
                        if (a.col.field == "avgTime") {
                            if (item.entity[a.col.field] != undefined && item.entity[a.col.field] != 0 && item.entity[a.col.field] != "--") {
                                spl = item.entity[a.col.field].split(":");
                                newSpl[0] += parseInt(spl[0]);
                                newSpl[1] += parseInt(spl[1]);
                                newSpl[2] += parseInt(spl[2]);
                            } else if (item.entity[a.col.field] == 0) {
                                item.entity[a.col.field] = "00:00:00"
                            }
                        }
                    }

                });
                var itemSplDataTow = (option[0].entity[a.col.field] + "").split(",");
                if (itemSplDataTow.length >= 4) {
                    //var itemSplData = (s.entity[a.col.field] + "").split(",");
                    if (a.col.field == "outRate") {
                        newitemSplData.forEach(function (tts, i) {
//                            newitemSplData[i] = (tts / option.length).toFixed(2) + "%"
                            newitemSplData[0] = newitemSplData[0] == "0" ? "0.00%" : (newitemSplData[0] / option.length).toFixed(2) + "%";
                        })
                    }
                    if (a.col.field == "avgPage" || a.col.field == "click") {
                        newitemSplData[0] = newitemSplData[0] == "0" ? "0" : (newitemSplData[0] / option.length).toFixed(2);
                    }
                    returnData = newitemSplData;
                } else {
                    if ((option[0].entity[a.col.field] + "").indexOf("%") != -1 || (option[0].entity[a.col.field] + "").indexOf("(-)") != -1) {
//                        returnData[0] = (returnData[0] / option.length).toFixed(2) + "%";
                        if (window.location.href.split("/")[window.location.href.split("/").length - 1] == "changelist") {
                            var contrastPv = 0;
                            for (var c = 0; c < option.length; c++) {
                                contrastPv += option[c].entity["contrastPv"];
                            }
                            if (contrastPv == 0) {
                                if (returnData[0] > 0) {
                                    returnData[0] = "+" + returnData[0] + "(-)";
                                } else if (returnData[0] < 0) {
                                    returnData[0] = "-" + returnData[0] + "(-)";
                                } else {
                                    returnData[0] = returnData[0] + "(0.00%)";
                                }
                            } else {
                                returnData[0] = returnData[0] == "0" ? "0(0.00%)" : (returnData[0] > 0 ? ("+" + returnData[0]) : returnData[0]) + "(" + (returnData[0] * 100 / contrastPv).toFixed(2) + "%)";
                            }
                        } else {
                            if ($rootScope.tableSwitch.number == 4) {// 搜索词，按照搜索引擎特殊处理
                                returnData[0] = returnData[0] == "0" ? "0.00%" : (returnData[0] / option.length).toFixed(2) + "%";
                            } else {
                                returnData[0] = returnData[0] == "0" ? "0.00%" : (returnData[0] / option.length).toFixed(2) + "%";
                            }
                        }
                    }
                    if (a.col.field == "avgPage") {
                        var t_vc = 0;
                        var t_pv = 0;
                        option.forEach(function (_row) {
                            var _entity = _row.entity;
                            if (_entity.vc != "--") {
                                t_vc += parseInt(_entity.vc);
                            }
                            if (_entity.pv != "--") {
                                t_pv += parseInt(_entity.pv);
                            }
                        });
                        returnData[0] = (t_pv / (t_vc == 0 ? 1 : t_vc)).toFixed(2);
                    }
                    if (a.col.field == "click") {
                        var _ll = 0;
                        for (var _i = 0; _i < option.length; _i++) {
                            if (option[_i].entity.click != "--") {
                                _ll++;
                            }
                        }
                        returnData[0] = returnData[0] == "0" ? "0" : (returnData[0] / (_ll == 0 ? 1 : _ll)).toFixed(2);
                    }
                    if (a.col.field == "uv" && option[0].entity["all_uv"] != undefined && $rootScope.tableSwitch.uv_repeat != undefined && !$rootScope.tableSwitch.uv_repeat) {
                        returnData[0] = option[0].entity["all_uv"]
                    }
                    if (a.col.field == "outRate") {

                        var t_vc = 0;
                        var t_svc = 0;
                        option.forEach(function (_row) {
                            var _entity = _row.entity;
                            if (_entity.vc != "--") {
                                t_vc += parseInt(_entity.vc);
                            }
                            if (_entity.svc != "--") {
                                t_svc += parseInt(_entity.svc);
                            }
                        });
                        returnData[0] = (t_svc * 100 / (t_vc == 0 ? 1 : t_vc)).toFixed(2) + "%";
                    }
                    if (a.col.field == "nuvRate") {
                        // 新访客比率算法。通过总的新访客数除以总的访客数
                        var t_uv = 0;
                        var t_nuv = 0;
                        option.forEach(function (_row) {
                            var _entity = _row.entity;
                            if (_entity.uv != "--") {
                                t_uv += parseInt(_entity.uv);
                            }
                            if (_entity.nuv != "--") {
                                t_nuv += parseInt(_entity.nuv);
                            }
                        });
                        returnData[0] = (t_nuv * 100 / (t_uv == 0 ? 1 : t_uv)).toFixed(2) + "%";
                    }
                    if (a.col.field == "avgTime") {
                        var _ll = 0;
                        for (var _i = 0; _i < option.length; _i++) {
                            if (option[_i].entity.avgTime != "--") {
                                _ll++;
                            }
                        }
                        if (_ll == 0) {
                            _ll = 1;
                        }
                        var atime1 = parseInt(newSpl[0]) * 3600 * 1000;
                        var atime2 = parseInt(newSpl[1]) * 60 * 1000;
                        var atime3 = parseInt(newSpl[2]) * 1000;
                        _ll = _ll * 1000;
                        returnData[0] = MillisecondToDate(parseInt((atime1 + atime2 + atime3) / _ll));
                    }
                }
                if (option[0].entity.period == "暂无数据" || option[0].entity.rf_type == "暂无数据" || option[0].entity.se == "暂无数据" || option[0].entity.kw == "暂无数据" || option[0].entity.rf == "暂无数据" || option[0].entity.loc == "暂无数据" || option[0].entity.region == "暂无数据" || option[0].entity.pm == "暂无数据" || option[0].entity.ct == "暂无数据" || option[0].entity.city == "暂无数据" || option[0].entity.accountName == "搜索推广 (暂无数据 )") {
                    returnData = ["--", "--", "--", "--"]
                }
                switch (number) {
                    case 1:
                        return returnData[0];
                    case 2:
                        return returnData[1] == 0 ? returnData[0] : returnData[1];
                    case 3:
                        return returnData[2];
                    case 4:
                        return returnData[3];
                    case 5:
                        /*仅用于来源变化棒中当页汇总出现的颜色变化*/
                        if (returnData[0] != "--" && returnData[0] != undefined) {
                            if (returnData[0].toString().substring(0, 1) == "+") {
                                document.getElementById("summary").style.color = "#ea1414";
                            } else if (returnData[0].toString().substring(0, 1) == "-") {
                                document.getElementById("summary").style.color = "#07cd2c";
                            } else if (returnData[0] == "0(0.00%)") {
                                document.getElementById("summary").style.color = "#01aeef";
                            }
                        }
                        return returnData[0];
                    default :
                        return returnData[0];
                }
            }
        }
        //得到数据中的url
        $scope.getDataUrlInfo = function (grid, row, number) {
            var a = row.entity.referrer.split(",");
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
                    if (ss == "se" || ss == "rf" || ss == "dm") {
                        return "-";
                    } else {
                        return 1;
                    }
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
        }];

        $rootScope.changeListInit = function (timeData) {
            $scope.gridOpArray = angular.copy(timeData.gridArray);
            $scope.gridOptions.columnDefs = $scope.gridOpArray;

            function filterDataByType(array, type) {
                var _tempData = [];
                if (!array) {
                    return _tempData;
                }
                if (type == 4) {
                    _tempData = array;
                } else if (type == 1) {
                    for (var i = 0; i < array.length; i++) {
                        if (array[i]["percentage"].substring(0, 1) == "+") {
                            _tempData.push(array[i]);
                        }
                    }
                } else if (type == 2) {
                    for (var i = 0; i < array.length; i++) {
                        if (array[i]["percentage"].substring(0, 1) == "-") {
                            _tempData.push(array[i]);
                        }
                    }
                } else if (type == 3) {
                    for (var i = 0; i < array.length; i++) {
                        if (array[i]["percentage"].substring(0, 1) != "+" && array[i]["percentage"].substring(0, 1) != "-") {
                            _tempData.push(array[i]);
                        }
                    }
                }
                return _tempData.splice(0, 100);
            }

            var requestArray = [];
            requestArray.push($http.get("api/changeListTwo?start=" + timeData.start + "&end=" + timeData.end + "&type=" + $rootScope.userType));
            requestArray.push($http.get("api/changeListTwo?start=" + timeData.contrastStart + "&end=" + timeData.contrastEnd + "&type=" + $rootScope.userType));
            $q.all(requestArray).then(function (final_result) {
                var a_tt = final_result[0].data;
                var b_tt = final_result[1].data;
                var data = {};
                var pv_data = [];
                var pathNameArray = [];
                var dataPathName = [];
                var contrastDataPathName = [];
                // 获取全部的来源域名
                for (var i = 0; i < a_tt.length; i++) {
                    var _key = a_tt[i].key;
                    pathNameArray.push(_key);
                    dataPathName.push(_key);
                }
                for (var i = 0; i < b_tt.length; i++) {
                    var _t_key = b_tt[i].key;
                    contrastDataPathName.push(_t_key);
                    if (pathNameArray.indexOf(_t_key) == -1) {
                        pathNameArray.push(_t_key);
                    }
                }
                for (var i = 0; i < pathNameArray.length; i++) {
                    var _d_i = dataPathName.indexOf(pathNameArray[i]);
                    var _c_d_i = contrastDataPathName.indexOf(pathNameArray[i]);
                    var _t_o = {
                        pathName: pathNameArray[i] == "-" ? "直接输入网址或标签" : pathNameArray[i],
                        pv: 0,
                        contrastPv: 0,
                        percentage: "0(0.00%)"
                    };

                    if (_d_i != -1) {
                        _t_o.pv = parseInt(a_tt[_d_i].value_count);
                    }

                    if (_c_d_i != -1) {
                        _t_o.contrastPv = parseInt(b_tt[_c_d_i].value_count);
                    }

                    var percentage = 0;
                    if (_t_o.contrastPv == 0) {
                        if (_t_o.pv == 0) {
                            percentage = "0(0.00%)";
                        } else {
                            percentage = "+" + _t_o.pv + "(-)";
                        }
                    } else {
                        if (_t_o.pv == 0) {
                            percentage = "-" + _t_o.contrastPv + "(-100.00%)";
                        } else {
                            percentage = ((_t_o.pv - _t_o.contrastPv) / _t_o.contrastPv) * 100;
                            if (percentage > 0) {
                                percentage = "+" + (_t_o.pv - _t_o.contrastPv) + "(" + percentage.toFixed(2) + "%)";
                            } else {
                                percentage = (_t_o.pv - _t_o.contrastPv) + "(" + percentage.toFixed(2) + "%)";
                            }
                        }
                    }
                    _t_o.percentage = percentage;
                    pv_data.push(_t_o);
                }

                var sum_pv = 0;
                var contrast_sum_pv = 0;
                pv_data.forEach(function (d) {
                    sum_pv += d["pv"];
                    contrast_sum_pv += d["contrastPv"];
                })
                var percentage = 0;
                if (contrast_sum_pv == 0) {
                    if (sum_pv == 0) {
                        percentage = "0(0.00%)";
                    } else {
                        percentage = "+" + sum_pv + "(-)";
                    }
                } else {
                    if (sum_pv == 0) {
                        percentage = "-" + contrast_sum_pv + "(-100%)";
                    } else {
                        percentage = ((sum_pv - contrast_sum_pv) / contrast_sum_pv) * 100;
                        if (percentage > 0) {
                            percentage = "+" + (sum_pv - contrast_sum_pv) + "(" + percentage.toFixed(2) + "%)";
                        } else {
                            percentage = (sum_pv - contrast_sum_pv) + "(" + percentage.toFixed(2) + "%)";
                        }
                    }
                }

                $rootScope.changeObj = {
                    sum_pv_count: sum_pv,
                    contrast_sum_pv_count: contrast_sum_pv,
                    all_percentage: percentage
                };

                // 数据过滤
                var _tempData = filterDataByType(pv_data, timeData.filterType);

                $rootScope.changeListData = _tempData;
                $scope.gridOptions.data = _tempData;
                $scope.gridOptions.enableSorting = true;

            });
        };

        $scope.$on('parrentData', function (d, data) {
            $scope.changeListInit(data);
        });

        //init
        if ($scope.tableJu != 'html' && $rootScope.historyJu != "NO") {
            $scope.targetSearch();
        }
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
