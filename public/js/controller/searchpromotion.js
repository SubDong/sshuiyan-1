/**
 * Created by john on 2015/3/30.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller("SearchPromotion", function ($timeout, $scope, $rootScope, $http, $q, requestService, SEM_API_URL, $cookieStore, uiGridConstants) {
        $scope.todayClass = true;
        var user = $rootScope.user
        var baiduAccount = $rootScope.baiduAccount;
        var esType = $rootScope.userType;
        var trackid = $rootScope.siteTrackId;

        //sem
        $scope.target = [
            {consumption_name: "展现量", name: "impression"},
            {consumption_name: "点击量", name: "click"},
            {consumption_name: "消费", name: "cost"},
            {consumption_name: "点击率", name: "ctr"},
            {consumption_name: "平均点击价格", name: "cpc"}
        ];
        //
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
            //{consumption_name: "抵达率", name: "arrivedRate"}
        ];

        if ($rootScope.tableSwitch.number == 1) {
            $scope.gridBtnDivObj = "<div class='table_box'><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' class='table_nextbtn test'  title='查看历史趋势'></a></div>";
        } else if ($rootScope.tableSwitch.number == 2) {
            $scope.gridBtnDivObj = "<div class='table_box'><button onmousemove='getMyButton(this)' class='table_btn'></button><div class='table_win'><ul style='color: #45b1ec'>" + $rootScope.tableSwitch.coding + "</ul></div></div>";
        }
        if ($scope.tableSwitch.arrayClear)$rootScope.checkedArray = new Array();
        if ($scope.tableSwitch.arrayClear)$rootScope.searchGridArray = new Array();


        $rootScope.searchIndicators = function (item, entities, number, refresh) {
            $rootScope.searchGridArray.shift();
            $rootScope.searchGridArray.shift();
            if (refresh == "refresh") {
                $rootScope.searchGridArray.unshift($rootScope.tableSwitch.latitude);
                return
            }
            $rootScope.tableSwitch.number != 0 ? $scope.searchGridArray.shift() : "";
            $scope.searchGridObj = {};
            $scope.searchGridObjButton = {};
            var a = $rootScope.checkedArray.indexOf(item.name);
            if (a != -1) {
                $rootScope.checkedArray.splice(a, 1);
                $rootScope.searchGridArray.splice(a, 1);

                if ($rootScope.tableSwitch.number != 0) {
                    $scope.searchGridObjButton["name"] = " ";
                    $scope.searchGridObjButton["cellTemplate"] = $scope.gridBtnDivObj;
                    $rootScope.searchGridArray.unshift($scope.searchGridObjButton);
                }
                $rootScope.searchGridArray.unshift($rootScope.tableSwitch.latitude);
                $scope.gridObjButton = {};
                $scope.gridObjButton["name"] = "xl";
                $scope.gridObjButton["displayName"] = "";
                $scope.gridObjButton["cellTemplate"] = "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>";
                $scope.gridObjButton["maxWidth"] = 10;
                $rootScope.searchGridArray.unshift($scope.gridObjButton);
            } else {
                if ($rootScope.checkedArray.length >= number) {
                    $rootScope.checkedArray.shift();
                    $rootScope.checkedArray.push(item.name);
                    $rootScope.searchGridArray.shift();

                    $scope.searchGridObj["name"] = item.consumption_name;
                    $scope.searchGridObj["displayName"] = item.consumption_name;
                    $scope.searchGridObj["footerCellTemplate"] = "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>";
                    $scope.searchGridObj["field"] = item.name;

                    $rootScope.searchGridArray.push($scope.searchGridObj);

                    if ($rootScope.tableSwitch.number != 0) {
                        $scope.searchGridObjButton["name"] = " ";
                        $scope.searchGridObjButton["cellTemplate"] = $scope.gridBtnDivObj;
                        $rootScope.searchGridArray.unshift($scope.searchGridObjButton);
                    }

                    $rootScope.searchGridArray.unshift($rootScope.tableSwitch.latitude);
                    $scope.gridObjButton = {};
                    $scope.gridObjButton["name"] = "xl";
                    $scope.gridObjButton["displayName"] = "";
                    $scope.gridObjButton["cellTemplate"] = "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>";
                    $scope.gridObjButton["maxWidth"] = 10;
                    $rootScope.searchGridArray.unshift($scope.gridObjButton);
                } else {
                    $rootScope.checkedArray.push(item.name);

                    $scope.searchGridObj["name"] = item.consumption_name;
                    $scope.searchGridObj["displayName"] = item.consumption_name;
                    $scope.searchGridObj["footerCellTemplate"] = "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>";
                    $scope.searchGridObj["field"] = item.name;
                    $rootScope.searchGridArray.push($scope.searchGridObj);

                    if ($rootScope.tableSwitch.number != 0) {
                        $scope.searchGridObjButton["name"] = " ";
                        $scope.searchGridObjButton["cellTemplate"] = $scope.gridBtnDivObj;
                        $rootScope.searchGridArray.unshift($scope.searchGridObjButton);
                    }
                    $rootScope.searchGridArray.unshift($rootScope.tableSwitch.latitude);
                    $scope.gridObjButton = {};
                    $scope.gridObjButton["name"] = "xl";
                    $scope.gridObjButton["displayName"] = "";
                    $scope.gridObjButton["cellTemplate"] = "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>";
                    $scope.gridObjButton["maxWidth"] = 10;
                    $rootScope.searchGridArray.unshift($scope.gridObjButton);
                }
            }
            angular.forEach(entities, function (subscription, index) {
                if (subscription.name == item.name) {
                    $scope.classInfo = 'current';
                }
            });
            // $rootScope.$broadcast("ssh_reload_datashow");
        };
        // 百度推广表格配置项
        $scope.gridOptions = {
            paginationPageSize: 20,
            paginationPageSizes: [20, 50, 100],
            expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions' style='height:150px;'></div>",
            expandableRowHeight: 150,
            enableColumnMenus: false,
            showColumnFooter: true,
            enablePaginationControls: true,
            enableSorting: true,
            enableGridMenu: false,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: false,
            enableScrollbars: false,
            onRegisterApi: function (gridApi) {
                $scope.gridApi2 = gridApi;
                if ($rootScope.tableSwitch.dimen) {
                    griApiInfo(gridApi);
                }

            }
        };
        $scope.page = "";
        $scope.pagego = function (pagevalue) {
            pagevalue.pagination.seek(Number($scope.page));
        };

        //设置来源终端
        $rootScope.$on("searchLoadAllTerminal", function () {
            $scope.setSearchTerminalData(0);
        });
        var evTimeStamp = 0;
        $scope.device = -1;
        $scope.setSearchTerminalData = function (a) {
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
            if (a == 0) {
                $scope.es_filter = null;
                $scope.device = -1;
                $scope.terminalSearch = "";
            }
            if (a == 1) {
                $scope.es_filter = "[{\"pm\":[0]}]";
                $scope.device = 0;
                $scope.terminalSearch = "计算机";
            }
            if (a == 2) {
                $scope.es_filter = "[{\"pm\":[1]}]";
                $scope.device = 1;
                $scope.terminalSearch = "移动设备";
            }
            $scope.targetSearchSpread();
        };
        //搜索推广地域过滤
        $rootScope.$on("searchLoadAllArea", function () {
            $scope.setAreaFilter("全部", 'plain');
        })
        $scope.setAreaFilter = function (area, id) {
            $scope.areaSearch = area == "全部" ? "" : area;
            if (area == "北京" || area == "上海" || area == "广州") {
                if ($scope.city.selected != undefined) {
                    $scope.city.selected.name = area;
                } else {
                    $scope.city.selected = {};
                    $scope.city.selected["name"] = area;
                }
            }
            $scope.allCitys = angular.copy($rootScope.citys);
            $scope.gridOptions.data = [];
            $scope.gridOpArray = angular.copy($rootScope.searchGridArray);
            $scope.gridOptions.columnDefs = $scope.gridOpArray;
            var url = SEM_API_URL + "/sem/report/" + (area == "全部" ? $rootScope.tableSwitch.promotionSearch.SEMData : "region") + "?a=" + user + "&b=" + baiduAccount + "&startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd + "&device=-1" + (area == "全部" ? "" : "&rgna=" + area);

            $http({
                method: 'GET',
                url: url
            }).success(function (dataSEM, status) {
                var dataArray = [];
                dataSEM.forEach(function (item, i) {
                    var searchId = $rootScope.tableSwitch.promotionSearch.SEMData;
                    var filter = "[{\"" + getTableFilter(searchId) + "\":[\"" + item[searchId + "Id"] + "\"]}]";
                    var fieldQuery = $rootScope.tableSwitch.latitude.field;
                    var esurl = '/api/indextable/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? ($rootScope.tableSwitch.number == 5 ? fieldQuery : null) : fieldQuery )
                        + "&filerInfo=" + filter + "&promotion=" + $rootScope.tableSwitch.promotionSearch + "&formartInfo=" + $rootScope.tableFormat + "&type=" + esType;
                    $http({
                        method: 'GET',
                        url: esurl
                    }).success(function (data, status) {
                        var datas = {};
                        if ($rootScope.tableSwitch.number == 5) {
                            data.forEach(function (item, i) {
                                $rootScope.checkedArray.forEach(function (x, y) {
                                    datas[x] = item[x] != undefined ? item[x] : data[0][x];
                                });
                                datas[fieldQuery] = item[fieldQuery] + getTableTitle(fieldQuery, item);
                                item["impression"] != undefined ? datas["impression"] = item["impression"] : "";
                                item["click"] != undefined ? datas["click"] = item["click"] : "";
                                item["cost"] != undefined ? datas["cost"] = item["cost"] : "";
                                item["cpc"] != undefined ? datas["cpc"] = item["cpc"] : "";
                                dataArray.push(datas);
                                if ((dataSEM.length - 1) == i) {
                                    $scope.gridOptions.data = dataArray;
                                }
                            })
                        } else {
                            $rootScope.checkedArray.forEach(function (x, y) {
                                datas[x] = item[x] != undefined ? item[x] : data[0][x];
                            });
                            var field = $rootScope.tableSwitch.latitude.field;
                            datas[field] = item[field] + getTableTitle(field, item);
                            datas["id"] = item[searchId + "Id"];
                            item["impression"] != undefined ? datas["impression"] = item["impression"] : "";
                            item["click"] != undefined ? datas["click"] = item["click"] : "";
                            item["cost"] != undefined ? datas["cost"] = item["cost"] : "";
                            item["cpc"] != undefined ? datas["cpc"] = item["cpc"] : "";
                            dataArray.push(datas);
                            if ((dataSEM.length - 1) == i) {
                                if (field == "adgroupName" || field == "keywordName") {
                                    $scope.gridOptions.rowHeight = 55;
                                } else {
                                    if (field == "description1") {
                                        $scope.gridOptions.rowHeight = 100;
                                    } else {
                                        $scope.gridOptions.rowHeight = 32;
                                    }
                                }
                                $scope.gridOptions.columnDefs = $scope.gridOpArray;
                                $scope.gridOptions.data = dataArray;
                            }
                        }
                    }).error(function (error) {
                        console.log(error);
                    });
                });
            });
        };

        $rootScope.targetSearchSpread = function (isClicked) {
            $scope.gridOpArray = angular.copy($rootScope.searchGridArray);
            $scope.gridOptions.columnDefs = $scope.gridOpArray;
            $rootScope.$broadcast("ssh_dateShow_options_quotas_change", $rootScope.checkedArray);
            if ($rootScope.tableSwitch.promotionSearch != undefined && $rootScope.tableSwitch.promotionSearch.NMS != undefined) {
                var url = SEM_API_URL + "/sem/report/nms/" + $rootScope.tableSwitch.promotionSearch.SEMData + "?a=" + user + "&b=" + baiduAccount + "&startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd + ($scope.searchNmsId != undefined ? "&" + $scope.searchNmsId : "");
                $http({
                    method: 'GET',
                    url: url
                }).success(function (dataNMS, status) {
                    var dataArray = [];
                    dataNMS.forEach(function (item, i) {
                        var searchId = $rootScope.tableSwitch.promotionSearch.SEMData;
                        var filter = "[{\"" + getTableFilter(searchId) + "\":[\"" + item[searchId + "Id"] + "\"]}]";
                        var fieldQuery = $rootScope.tableSwitch.latitude.field;
                        $http({
                            method: 'GET',
                            url: '/api/indextable/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? ($rootScope.tableSwitch.number == 5 ? fieldQuery : null) : fieldQuery )
                            + "&filerInfo=" + filter + "&promotion=" + JSON.stringify($rootScope.tableSwitch.promotionSearch) + "&formartInfo=" + $rootScope.tableFormat + "&type=" + esType
                        }).success(function (data, status) {
                            var datas = {};
                            $rootScope.checkedArray.forEach(function (x, y) {
                                datas[x] = item[x] != undefined ? item[x] : (data[0] == undefined ? "--" : data[0][x]);
                                if ((x == "ctr" || x == "arrivedRate") && datas[x] != "--") {
                                    if (datas[x] == "-1") {
                                        datas[x] = "--"
                                    } else {
                                        datas[x] += "%";
                                    }

                                }
                            });
                            var field = $rootScope.tableSwitch.latitude.field;
                            datas[field] = item[field == "adgroupName" ? "groupName" : field] + getTableTitle(field, item);
                            datas["id"] = item[searchId + "Id"];
                            item["impression"] != undefined ? datas["impression"] = item["impression"] == '-1' ? "--" : item["impression"] : "";
                            item["click"] != undefined ? datas["click"] = item["click"] == '-1' ? "--" : item["click"] : "";
                            item["cost"] != undefined ? datas["cost"] = item["cost"] == '-1' ? "--" : item["cost"] : "";
                            item["acp"] != undefined ? datas["acp"] = item["acp"] == '-1' ? "--" : item["acp"] : "";
                            dataArray.push(datas);
                            if ((dataNMS.length - 1) == i) {
                                if (field == "adgroupName" || field == "keywordName") {
                                    $scope.gridOptions.rowHeight = 55;
                                } else {
                                    if (field == "description1") {
                                        $scope.gridOptions.rowHeight = 100;
                                    } else {
                                        $scope.gridOptions.rowHeight = 32;
                                    }
                                }
                                $scope.gridOptions.columnDefs = $scope.gridOpArray;
                                $scope.gridOptions.data = dataArray;
                            }
                        })
                    });
                });
            } else {
                var url = SEM_API_URL + "/sem/report/" + $rootScope.tableSwitch.promotionSearch.SEMData + "?a=" + user + "&b=" + baiduAccount + "&startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd + "&device=" + $scope.device + ($scope.searchId != undefined && $scope.searchId != "undefined" ? "&" + $scope.searchId : "")
                $http({
                    method: 'GET',
                    url: url
                }).success(function (dataSEM, status) {
                    $rootScope.$broadcast("LoadDateShowSEMDataFinish", dataSEM);
                    var dataArray = [];
                    dataSEM.forEach(function (item, i) {
                        var searchId = $rootScope.tableSwitch.promotionSearch.SEMData;

                        var filter = "[{\"" + getTableFilter(searchId) + "\":[\"" + item[searchId + "Id"] + "\"]}]";
                        var fieldQuery = $rootScope.tableSwitch.latitude.field;

                        var turl = '/api/indextable/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? ($rootScope.tableSwitch.number == 5 ? fieldQuery : null) : fieldQuery )
                            + "&filerInfo=" + filter + "&promotion=" + JSON.stringify($rootScope.tableSwitch.promotionSearch) + "&formartInfo=" + $rootScope.tableFormat + "&type=" + esType;
                        $http({
                            method: 'GET',
                            url: '/api/indextable/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? ($rootScope.tableSwitch.number == 5 ? fieldQuery : null) : fieldQuery )
                            + "&filerInfo=" + filter + "&promotion=" + JSON.stringify($rootScope.tableSwitch.promotionSearch) + "&formartInfo=" + $rootScope.tableFormat + "&type=" + esType
                        }).success(function (data, status) {
                            var datas = {};
                            if ($rootScope.tableSwitch.number == 5) {
                                data.forEach(function (item, i) {
                                    $rootScope.checkedArray.forEach(function (x, y) {
//                                    datas[x] = item[x] != undefined ? item[x] : (data[0] == undefined ? (x == "avgTime" ? "00:00:00" : 0) : data[0][x]);
                                        datas[x] = item[x] != undefined ? item[x] : (data[0] == undefined ? "--" : data[0][x]);
                                        if ((x == "ctr" || x == "arrivedRate") && datas[x] != "--") {
                                            datas[x] += "%";
                                        }
                                    });
                                    datas[fieldQuery] = item[fieldQuery] + getTableTitle(fieldQuery, item);
                                    item["impression"] != undefined ? datas["impression"] = item["impression"] : "";
                                    item["click"] != undefined ? datas["click"] = item["click"] : "";
                                    item["cost"] != undefined ? datas["cost"] = item["cost"] : "";
                                    item["cpc"] != undefined ? datas["cpc"] = item["cpc"] : "";
                                    dataArray.push(datas);
                                    if ((dataSEM.length - 1) == i) {
                                        $scope.gridOptions.data = dataArray;
                                    }
                                })
                            } else {
                                $rootScope.checkedArray.forEach(function (x, y) {
//                                datas[x] = item[x] != undefined ? item[x] : (data[0] == undefined ? (x == "avgTime" ? "00:00:00" : 0) : data[0][x]);
                                    datas[x] = item[x] != undefined ? item[x] : (data[0] == undefined ? "--" : data[0][x]);
                                    if ((x == "ctr" || x == "arrivedRate") && datas[x] != "--") {
                                        datas[x] += "%";
                                    }
                                });
                                var field = $rootScope.tableSwitch.latitude.field;
                                datas[field] = item[field] + getTableTitle(field, item);
                                datas["id"] = item[searchId + "Id"];
                                item["impression"] != undefined ? datas["impression"] = item["impression"] : "";
                                item["click"] != undefined ? datas["click"] = item["click"] : "";
                                item["cost"] != undefined ? datas["cost"] = item["cost"] : "";
                                item["cpc"] != undefined ? datas["cpc"] = item["cpc"] : "";
                                dataArray.push(datas);
                                if ((dataSEM.length - 1) == i) {
                                    if (field == "adgroupName" || field == "keywordName") {
                                        $scope.gridOptions.rowHeight = 55;
                                    } else {
                                        if (field == "description1") {
                                            $scope.gridOptions.rowHeight = 100;
                                        } else {
                                            $scope.gridOptions.rowHeight = 32;
                                        }
                                    }
                                    $scope.gridOptions.columnDefs = $scope.gridOpArray;
                                }
                            }
                        }).error(function (error) {
                            console.log(error);
                        });
                    });
                    if ($rootScope.tableSwitch.number != 5) {
                        $scope.gridOptions.data = dataArray;
                    }
                });
            }
        };

        //搜索词
        $rootScope.targetSearchSSC = function (isClicked) {
            $scope.gridOpArray = angular.copy($rootScope.searchGridArray);
            $scope.gridOptions.columnDefs = $scope.gridOpArray;
            if (isClicked) $rootScope.$broadcast("ssh_dateShow_options_quotas_change", $rootScope.checkedArray);
            $http({
                method: 'GET',
                url: '/api/indextable/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=kwsid"
                + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&promotion=ssc&formartInfo=" + $rootScope.tableFormat + "&type=" + esType
            }).success(function (data, status) {
                var dataArray = [];
                $rootScope.$broadcast("LoadDateShowDataFinish", data);
                if (data != null && data.length > 0) {

                    data.forEach(function (item, i) {
                        var variousId = item.kw.split(",");
                        item.kw = variousId[0];
                        var url = SEM_API_URL + "/sem/report/" + $rootScope.tableSwitch.promotionSearch.SEMData + "?a=" + user + "&b=" + baiduAccount + "&kwid=" + variousId[3] + "&startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd + "&device=-1"
                        $http({
                            method: 'GET',
                            url: url
                        }).success(function (dataSEM, status) {
                            var datas = {};
                            if (variousId[3] == 0) {
                                $rootScope.checkedArray.forEach(function (x, y) {
                                    datas[x] = (item[x] != undefined ? item[x] : "--");
                                    var field = $rootScope.tableSwitch.latitude.field
                                    datas[field] = item[field] + ",";
                                })
                            } else {
                                $rootScope.checkedArray.forEach(function (x, y) {
                                    datas[x] = (item[x] != undefined ? item[x] : dataSEM[0][x]);
                                });
                                var field = $rootScope.tableSwitch.latitude.field
                                datas[field] = item[field] + getTableTitle(field, dataSEM[0]);
                            }
                            dataArray.push(datas);

                        });
                    });
                }
                $scope.gridOptions.rowHeight = 55;
                $scope.gridOptions.data = dataArray;

            });
        };

        $rootScope.targetSearch = function (isClicked) {
            if ($rootScope.tableSwitch.promotionSearch.turnOn == "ssc") {
                $rootScope.targetSearchSSC(true);
            } else {
                $rootScope.targetSearchSpread(true);
            }
        };
        //init
        if ($rootScope.tableSwitch.promotionSearch.turnOn == "ssc") {
            $rootScope.targetSearchSSC(true);
        } else {
            $rootScope.targetSearchSpread(true);
        }


        //表格数据展开项
        var griApiInfo = function (gridApi) {
            gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                var filter = "[{\"kwid\":[\"" + row.entity.id + "\"]}]";
                row.entity.subGridOptions = {
                    enableColumnMenus: false,
                    enablePaginationControls: false,
                    enableHorizontalScrollbar: 0,
                    enableVerticalScrollbar: 0,
                    //expandableRowHeight: 61,
                    columnDefs: [{name: "kw", displayName: "触发关键词搜索词", field: "kw"}]
                };
                $http({
                    method: 'GET',
                    url: '/api/indextable/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=kw"
                    + "&filerInfo=" + filter + "&formartInfo=" + $rootScope.tableFormat + "&type=" + esType
                }).success(function (data, status) {

                    var dataArray = [];
                    if (data[0] != undefined) {
                        dataArray.push({kw: data[0].kw})
                    } else {
                        dataArray.push({kw: "无"})
                    }
                    row.entity.subGridOptions.expandableRowHeight = (row.entity.subGridOptions.data.length == 0 ? 1 * 60 : row.entity.subGridOptions.data.length * 60) + 1;
                    row.entity.subGridOptions.data = dataArray;

                })
            });
        };
        //网盟数据点击
        $scope.getNmsHistoricalTrend = function (b) {
            $rootScope.checkedArray = ["impression", "cost", "acp", "outRate", "avgTime", "nuvRate"];
            $rootScope.searchGridArray = [
                {
                    name: "xl",
                    displayName: "",
                    cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                    maxWidth: 10,
                    enableSorting: false
                },
                {
                    name: "组",
                    displayName: "组",
                    field: "adgroupName",
                    cellTemplate: "<div><a href='javascript:void(0)' style='color:#0965b8;line-height:30px' ng-click='grid.appScope.getNmsHistoricalTrend(this)'>{{grid.appScope.getDataUrlInfo(grid, row,1)}}</a><br/>{{grid.appScope.getDataUrlInfo(grid, row,2)}}</div>"
                    , footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                    enableSorting: false
                },
                {
                    name: "展现量",
                    displayName: "展现量",
                    field: "impression",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>",
                    sort: {
                        direction: uiGridConstants.DESC,
                        priority: 1
                    }
                },
                {
                    name: "消费",
                    displayName: "消费",
                    field: "cost",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "平均点击价格",
                    displayName: "平均点击价格",
                    field: "acp",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "跳出率",
                    displayName: "跳出率",
                    field: "outRate",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "平均访问时长",
                    displayName: "平均访问时长",
                    field: "avgTime",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "新访客比率",
                    displayName: "新访客比率",
                    field: "nuvRate",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                }
            ];
            $rootScope.tableSwitch = {
                latitude: {
                    name: "组",
                    displayName: "组",
                    field: "adgroupName"
                },
                tableFilter: null,
                dimen: false,
                // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
                number: 0,
                //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
                coding: false,
                //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
                arrayClear: false, //是否清空指标array
                promotionSearch: {
                    NMS: true,//是否开启网盟数据
                    //turnOn: true, //是否开始推广中sem数据
                    SEMData: "group" //查询类型
                }
            };
            $scope.searchNmsId = "cid=" + b.$parent.$parent.row.entity.id;
            $rootScope.targetSearchSpread();
        };

        //SEM数据点击
        $scope.getHistoricalTrend = function (b) {
            document.getElementById('areadiv').style.display = "";
            if ($rootScope.tableSwitch.latitude.field == "campaignName") {
                $rootScope.checkedArray = ["impression", "cost", "cpc", "outRate", "avgTime", "nuvRate"]
                $rootScope.searchGridArray = [
                    {
                        name: "xl",
                        displayName: "",
                        cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                        maxWidth: 10,
                        enableSorting: false
                    },
                    {
                        name: "单元",
                        displayName: "单元",
                        field: "adgroupName",
                        cellTemplate: "<div><a href='javascript:void(0)' target='_blank' style='color:#0965b8;line-height:30px;' ng-click='grid.appScope.getHistoricalTrend(this)'>{{grid.appScope.getDataUrlInfo(grid, row,1)}}</a><br/>{{grid.appScope.getDataUrlInfo(grid, row,2)}}</div>",
                        footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                        enableSorting: false
                    },
                    {
                        name: "展现",
                        displayName: "展现",
                        field: "impression",
                        footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>",
                        sort: {
                            direction: uiGridConstants.DESC,
                            priority: 1
                        }
                    },
                    {
                        name: "消费",
                        displayName: "消费",
                        field: "cost",
                        footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                    },
                    {
                        name: "平均点击价格",
                        displayName: "平均点击价格",
                        field: "cpc",
                        footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                    },
                    {
                        name: "跳出率",
                        displayName: "跳出率",
                        field: "outRate",
                        footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                    },
                    {
                        name: "平均访问时长",
                        displayName: "平均访问时长",
                        field: "avgTime",
                        footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                    },
                    {
                        name: "新访客比率",
                        displayName: "新访客比率",
                        field: "nuvRate",
                        footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                    }
                ];
                $rootScope.tableSwitch = {
                    latitude: {name: "单元", displayName: "单元", field: "adgroupName"},
                    tableFilter: null,
                    dimen: false,
                    // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
                    number: 1,
                    //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
                    coding: false,
                    //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
                    arrayClear: false, //是否清空指标array
                    promotionSearch: {
                        turnOn: true, //是否开始推广中sem数据
                        SEMData: "adgroup" //查询类型
                    }
                };
                $scope.searchId = "cid=" + b.$parent.$parent.row.entity.id;
            } else if ($rootScope.tableSwitch.latitude.field == "adgroupName") {
                $rootScope.checkedArray = ["impression", "cost", "cpc", "outRate", "avgTime", "nuvRate"]
                $rootScope.searchGridArray = [
                    {
                        name: "xl",
                        displayName: "",
                        cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                        maxWidth: 10
                    },
                    {
                        name: "关键词",
                        displayName: "关键词",
                        field: "keywordName",
                        cellTemplate: "<div><a href='http://www.baidu.com/s?wd={{grid.appScope.getDataUrlInfo(grid, row,1)}}' target='_blank' style='color:#0965b8;line-height:30px;margin-left: 10px'>{{grid.appScope.getDataUrlInfo(grid, row,1)}}</a><br/>{{grid.appScope.getDataUrlInfo(grid, row,2)}}</div>",
                        footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>"
                    },
                    {
                        name: "展现",
                        displayName: "展现",
                        field: "impression",
                        footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                    },
                    {
                        name: "消费",
                        displayName: "消费",
                        field: "cost",
                        footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                    },
                    {
                        name: "平均点击价格",
                        displayName: "平均点击价格",
                        field: "cpc",
                        footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                    },
                    {
                        name: "跳出率",
                        displayName: "跳出率",
                        field: "outRate",
                        footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                    },
                    {
                        name: "平均访问时长",
                        displayName: "平均访问时长",
                        field: "avgTime",
                        footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                    },
                    {
                        name: "新访客比率",
                        displayName: "新访客比率",
                        field: "nuvRate",
                        footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                    }
                ];
                $rootScope.tableSwitch = {
                    latitude: {name: "关键词", displayName: "关键词", field: "keywordName"},
                    tableFilter: null,
                    dimen: "city",
                    // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
                    number: 1,
                    //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
                    coding: false,
                    //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
                    arrayClear: false, //是否清空指标array
                    promotionSearch: {
                        turnOn: true, //是否开始推广中sem数据
                        SEMData: "keyword" //查询类型
                    }
                };
                $scope.searchId = "agid=" + b.$parent.$parent.row.entity.id;
                document.getElementById('areadiv').style.display = "none";
            }
            $rootScope.targetSearchSpread();
        };


        //得到表格底部数据
        $scope.getSearchFooterData = function (a, option, number) {
            var returnData = 0;
            var spl = 0;
            var newSpl = [0, 0, 0];
            if (option.length > 0) {
                option.forEach(function (item, i) {
                    var tmp = 0;
                    if (item.entity[a.col.field] == "--") {
                        tmp = 0;
                    } else {
                        tmp = item.entity[a.col.field];
                    }
                    returnData += parseFloat((tmp + "").replace("%", ""));
                    if (a.col.field == "avgTime") {
                        if (item.entity[a.col.field] != undefined && item.entity[a.col.field] != "--") {
                            spl = (item.entity[a.col.field] + "").split(":");
                            newSpl[0] += parseInt(spl[0]);
                            newSpl[1] += parseInt(spl[1]);
                            newSpl[2] += parseInt(spl[2]);
                        }
                    }
                });
                if (a.col.field == "ctr") {
                    var dataInfoClick = 0;
                    var dataInfoIpmr = 0;
                    var page = option[0].grid.options.paginationCurrentPage;
                    var pageSize = option[0].grid.options.paginationPageSize
                    var maxIndex = (page * pageSize) - 1
                    var minIndex = (page - 1) * pageSize
                    for (var i = minIndex; i <= maxIndex; i++) {
                        if (i < option.length) {
                            dataInfoClick += option[i].entity["click"];
                            dataInfoIpmr += option[i].entity["impression"];
                        }
                    }
                    var returnCtr = (dataInfoIpmr == 0 ? "0%" : ((dataInfoClick / dataInfoIpmr)).toFixed(2) + "%");
                    return returnCtr;
                }
                if ((option[0].entity[a.col.field] + "").indexOf("%") != -1) {
                    returnData = (returnData / option.length).toFixed(2) + "%";
                }
                if (a.col.field == "avgPage") {
                    returnData = (returnData / option.length).toFixed(2);
                }
                if (a.col.field == "outRate" || a.col.field == "nuvRate") {
                    returnData = (returnData == "0.00%" ? "0%" : (parseInt(returnData) / option.length).toFixed(2) + "%");
                }
                if (a.col.field == "avgTime") {
                    var atime1 = parseInt(newSpl[0] / option.length) + "";
                    var atime2 = parseInt(newSpl[1] / option.length) + "";
                    var atime3 = parseInt(newSpl[2] / option.length) + "";
                    returnData = (atime1.length == 1 ? "0" + atime1 : atime1) + ":" + (atime2.length == 1 ? "0" + atime2 : atime2) + ":" + (atime3.length == 1 ? "0" + atime3 : atime3);
                }
                /**
                 * TODO  ...
                 */
                if (a.col.field == "acp") {
                    returnData = (returnData / option.length).toFixed(2);
                }
                if (a.col.field == "cpc" || a.col.field == "cost") {
                    returnData = (returnData + "").substring(0, (returnData + "").indexOf(".") + 3);
                }
            }else{
                returnData = "--"
            }
            return returnData;
        }


        //得到数据中的url
        $scope.getDataUrlInfo = function (grid, row, number) {
            var data = row.entity[$rootScope.tableSwitch.latitude.field] + "";
            if (data != undefined && data != "" && data != "undefined") {
                if (number < 3) {
                    var a = data.split(",");
                } else if (number > 3) {
                    var a = data.split(",`");
                } else {
                    var a = data
                }
                if (number == 1) {
                    return a[0];
                } else if (number == 2) {
                    return a[1];
                } else if (number == 3) {
                    return a;
                } else if (number == 4) {
                    return a[0]
                } else if (number == 5) {
                    return a[1]
                } else if (number == 6) {
                    return a[2]
                }
            }
        };
        //得到序列号
        $scope.getIndex = function (b) {
            return b.$parent.$parent.rowRenderIndex + 1
        };
        $scope.init = function (timeData) {
            $scope.gridOptions.data = [];
            $http.get("/api/transform/transformAnalysis?start=" + timeData.start + "&end=" + timeData.end + "&action=event&type=1&searchType=table&queryOptions=" + timeData.checkedArray).success(function (data) {
                //console.log(data)
                //$http.get(SEM_API_URL+"/sem/report/campaign?a="+$rootScope.user+"&b="+$rootScope.baiduAccount+"&cid=&startOffset="+timeData.start+"&endOffset="+timeData.end+"&device=0&q=cost").success(function(data1){
                //    console.log(data1)
                //});
                $scope.gridOptions.data = data;
            });
        };
        $scope.$on("transformData", function (e, msg) {
            $scope.init(msg)
        });
        $scope.$on("transformData_ui_grid", function (e, msg) {
            for (var i = 0; i < msg.checkedArray.length; i++) {
                $rootScope.searchGridArray[i + 2].displayName = chartUtils.convertChinese(msg.checkedArray[i]);
                $rootScope.searchGridArray[i + 2].field = msg.checkedArray[i];
                $rootScope.searchGridArray[i + 2].footerCellTemplate = "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>";
                $rootScope.searchGridArray[i + 2].name = chartUtils.convertChinese(msg.checkedArray[i]);
            }
            $scope.gridOpArray = angular.copy($rootScope.searchGridArray);
            $scope.gridOptions.columnDefs = $scope.gridOpArray;
            $scope.init(msg)
        });
        $scope.$on("transformAdvancedData_ui_grid", function (e, msg) {
            $scope.advancedInit(msg)
        });
        $scope.advancedInit = function (msg) {
            var query = "";
            for (var i = 0; i < msg.checkedData.length; i++) {
                switch (msg.checkedData[i].field) {
                    case "all_rf":
                        query += msg.checkedData[i].field + ":all,";
                        break;
                    case "souce":
                        switch (msg.checkedData[i].name) {
                            case "直接访问":
                                query += "souce:3,";
                                break;
                            case "搜索引擎":
                                query += "souce:2,";
                                break;
                            case "外部链接":
                                query += "souce:1,";
                                break;
                        }
                        break;
                    case "browser":
                        switch (msg.checkedData[i].name) {
                            case "其他":
                                query += "browser:other,";
                                break;
                            case "全部":
                                break;
                            default :
                                query += "browser:" + msg.checkedData[i].name + ",";
                                break;
                        }
                        break;
                    case "uv_type":
                        switch (msg.checkedData[i].name) {
                            case "新访客":
                                query += "uv_type:0,";
                                break;
                            case "老访客":
                                query += "uv_type:1,";
                                break;
                            default :
                                query += "uv_type:all,";
                                break;
                        }
                        break;
                    case "city":
                        switch (msg.checkedData[i].name) {
                            case "所有地域":
                                query += "city:all,";
                                break;
                            case "全部":
                                query += "city:all,";
                                break;
                            default :
                                query += "city:" + msg.checkedData[i].name + ",";
                                break;
                        }
                        break;
                }

            }
            query = query.substring(0, query.length - 1);
            $scope.gridOptions.data = [];
            $http.get("/api/transform/transformAnalysis?start=" + msg.start + "&end=" + msg.end + "&action=event&type=1&searchType=advancedTable&queryOptions={" + query + "}&aggsOptions=" + msg.checkedArray).success(function (data) {
                $scope.gridOptions.data = data;
            });
        };
    });

//得到tableFilter key
    var getTableFilter = function (a) {
        switch (a) {
            case "campaign":
                return "cid";
            case "adgroup":
                return "agid";
            case "keyword":
                return "kwid";
            default :
                return "cid";
        }
    };


    var getTableTitle = function (a, b) {
        switch (a) {
            case "campaignName":
                return "";
            case "adgroupName":
                return ",[" + b['campaignName'] + "]";
            case "keywordName":
                return ",[" + b['campaignName'] + "]" + "  [" + b['adgroupName'] + "]";
            case "kw":
                return ",[" + b['campaignName'] + "]" + "  [" + b['adgroupName'] + "]";
            case "description1":
                var returnData = ",`" + (b['creativeTitle'].length > 25 ? b['creativeTitle'].substring(0, 25) + "..." : b['creativeTitle']) + ",`" + b['showUrl']
                return returnData;
            case "adTitle":
                return "";
        }
    };
})
;
