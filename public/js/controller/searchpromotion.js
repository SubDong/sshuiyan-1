/**
 * Created by john on 2015/3/30.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller("SearchPromotion", function ($timeout, $scope, $rootScope, $http, $q, requestService, SEM_API_URL, $cookieStore) {
        $scope.todayClass = true;
        var user = "perfect2015"/*$cookieStore.get("uname")*/;
        var baiduAccount ="baidu-perfect2151880" /*$rootScope.default*/;
        var esType ="2" /*$rootScope.defaultType*/;

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

        /*    var getHtmlTableData = function () {
         $http({
         method: 'GET',
         url: '/api/realTimeAccess/?filerInfo=' + $rootScope.tableSwitch.tableFilter + "&type=" + esType
         }).success(function (data, status) {
         $scope.gridOptions.data = data;
         }).error(function (error) {
         console.log(error);
         });
         };*/
        if ($rootScope.tableSwitch.number == 1) {
            $scope.gridBtnDivObj = "<div class='table_box'><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' class='table_nextbtn test'></a></div>";
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
            } else {
                if ($rootScope.checkedArray.length >= number) {
                    $rootScope.checkedArray.shift();
                    $rootScope.checkedArray.push(item.name);
                    $rootScope.searchGridArray.shift();

                    $scope.searchGridObj["name"] = item.consumption_name;
                    $scope.searchGridObj["displayName"] = item.consumption_name;
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
                    $scope.gridObjButton["displayName"] = "序列号";
                    $scope.gridObjButton["cellTemplate"] = "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>";
                    $scope.gridObjButton["maxWidth"] = 70;
                    $rootScope.gridArray.unshift($scope.gridObjButton);
                } else {
                    $rootScope.checkedArray.push(item.name);

                    $scope.searchGridObj["name"] = item.consumption_name;
                    $scope.searchGridObj["displayName"] = item.consumption_name;
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
                    $scope.gridObjButton["displayName"] = "序列号";
                    $scope.gridObjButton["cellTemplate"] = "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>";
                    $scope.gridObjButton["maxWidth"] = 70;
                    $rootScope.gridArray.unshift($scope.gridObjButton);
                }
            }
            angular.forEach(entities, function (subscription, index) {
                if (subscription.name == item.name) {
                    $scope.classInfo = 'current';
                }
            });
            // $rootScope.$broadcast("ssh_reload_datashow");
        };
        // 推广概况表格配置项
        $scope.gridOptions = {
            //paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions' style='height:150px;'></div>",
            expandableRowHeight: 150,
            enableColumnMenus: false,
            enablePaginationControls: false,
            enableSorting: true,
            enableGridMenu: false,
            enableHorizontalScrollbar: 0,
            columnDefs: $rootScope.searchGridArray,
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
        }

        //设置来源终端
        $scope.setTerminal = function (a) {
            if (a == 0) $scope.es_filter = null;
            if (a == 1) $scope.es_filter = "[{\"pm\":[0]}]";
            $scope.device = 0;
            if (a == 2) $scope.es_filter = "[{\"pm\":[1]}]";
            $scope.device = 1;
            $scope.isJudge = false;
            $scope.targetSearch();
        };


        $rootScope.targetSearchSpread = function (isClicked) {
            if (isClicked) {
                $rootScope.$broadcast("ssh_dateShow_options_quotas_change", $rootScope.checkedArray);
            }
            var url = SEM_API_URL + user + "/" + baiduAccount + "/" + $rootScope.tableSwitch.promotionSearch.SEMData + "/?startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd + "&device=-1" + ($scope.searchId != undefined || $scope.searchId != "undefined" ? "&" + $scope.searchId : "")
            $http({
                method: 'GET',
                url: url
            }).success(function (dataSEM, status) {
                var dataArray = [];
                dataSEM.forEach(function (item, i) {
                    var searchId = $rootScope.tableSwitch.promotionSearch.SEMData;
                    var filter = "[{\"" + getTableFilter(searchId) + "\":[\"" + item[searchId + "Id"] + "\"]}]";
                    var fieldQuery = $rootScope.tableSwitch.latitude.field;
                    $http({
                        method: 'GET',
                        url: '/api/indextable/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? ($rootScope.tableSwitch.number == 5 ? fieldQuery : null) : fieldQuery )
                        + "&filerInfo=" + filter + "&promotion=" + $rootScope.tableSwitch.promotionSearch + "&formartInfo=" + $rootScope.tableFormat + "&type=" + esType
                    }).success(function (data, status) {
                        var datas = {};
                        if ($rootScope.tableSwitch.number == 5) {
                            data.forEach(function (item, i) {
                                $rootScope.checkedArray.forEach(function (x, y) {
                                    datas[x] = item[x] != undefined ? item[x] : data[0][x];
                                });
                                datas[fieldQuery] = item[fieldQuery] + getTableTitle(fieldQuery, item);
                                dataArray.push(datas)
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
                            dataArray.push(datas)
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
                                $scope.gridOptions.columnDefs = $rootScope.searchGridArray;
                                $scope.gridOptions.data = dataArray;
                            }
                        }
                    }).error(function (error) {
                        console.log(error);
                    });
                });
            });
        };

        //搜索词
        $rootScope.targetSearchSSC = function (isClicked) {
            if (isClicked) $rootScope.$broadcast("ssh_dateShow_options_quotas_change", $rootScope.checkedArray);
            $http({
                method: 'GET',
                url: '/api/indextable/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=kwsid"
                + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&promotion=undefined&formartInfo=" + $rootScope.tableFormat + "&type=" + esType
            }).success(function (data, status) {
                var dataArray = [];
                data.forEach(function (item, i) {
                    var variousId = item.kw.split(",");
                    item.kw = variousId[0];
                    var url = SEM_API_URL + user + "/" + baiduAccount + "/" + $rootScope.tableSwitch.promotionSearch.SEMData + "/" + variousId[3] + "/?startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd + "&device=-1"
                    $http({
                        method: 'GET',
                        url: url
                    }).success(function (dataSEM, status) {
                        var datas = {};
                        if (variousId[3] == 0) {
                            $rootScope.checkedArray.forEach(function (x, y) {
                                datas[x] = (item[x] != undefined ? item[x] : 0);
                                var field = $rootScope.tableSwitch.latitude.field
                                datas[field] = item[field] + ",";
                            })
                        } else {
                            $rootScope.checkedArray.forEach(function (x, y) {
                                datas[x] = (item[x] != undefined ? item[x] : dataSEM[0][x]);
                            })
                            var field = $rootScope.tableSwitch.latitude.field
                            datas[field] = item[field] + getTableTitle(field, dataSEM[0]);
                        }
                        dataArray.push(datas);
                        $scope.gridOptions.rowHeight = 55;
                        $scope.gridOptions.data = dataArray;
                    });
                });
            });
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
                    row.entity.subGridOptions.data = dataArray;
                })
            });
        };


        $scope.getHistoricalTrend = function (b) {
            if ($rootScope.tableSwitch.latitude.field == "campaignName") {
                $rootScope.checkedArray = ["impression", "cost", "cpc", "outRate", "avgTime", "nuvRate"]
                $rootScope.searchGridArray = [
                    {
                        name: "单元",
                        displayName: "单元",
                        field: "adgroupName",
                        cellTemplate: "<a href='javascript:void(0)' target='_blank' style='color:#0965b8;line-height:30px;' ng-click='grid.appScope.getHistoricalTrend(this)'>{{grid.appScope.getDataUrlInfo(grid, row,1)}}</a><br/>{{grid.appScope.getDataUrlInfo(grid, row,2)}}"
                    },
                    {
                        name: "状态",
                        displayName: "状态",
                        cellTemplate: "<div class='table_box'><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' class='table_btn'></a></div>"
                    },
                    {name: "展现", displayName: "展现", field: "impression"},
                    {name: "消费", displayName: "消费", field: "cost"},
                    {name: "平均点击价格", displayName: "平均点击价格", field: "cpc"},
                    {name: "跳出率", displayName: "跳出率", field: "outRate"},
                    {name: "平均访问时长", displayName: "平均访问时长", field: "avgTime"},
                    {name: "新房客比率", displayName: "新房客比率", field: "nuvRate"}
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
                        name: "关键词",
                        displayName: "关键词",
                        field: "keywordName",
                        cellTemplate: "<a href='http://www.baidu.com/s?wd={{grid.appScope.getDataUrlInfo(grid, row,1)}}' target='_blank' style='color:#0965b8;line-height:30px;margin-left: 10px'>{{grid.appScope.getDataUrlInfo(grid, row,1)}}</a><br/>{{grid.appScope.getDataUrlInfo(grid, row,2)}}"
                    },
                    {
                        name: "状态",
                        displayName: "状态",
                        cellTemplate: "<div class='table_box'><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' class='table_btn'></a></div>"
                    },
                    {name: "展现", displayName: "展现", field: "impression"},
                    {name: "消费", displayName: "消费", field: "cost"},
                    {name: "平均点击价格", displayName: "平均点击价格", field: "cpc"},
                    {name: "跳出率", displayName: "跳出率", field: "outRate"},
                    {name: "平均访问时长", displayName: "平均访问时长", field: "avgTime"},
                    {name: "新房客比率", displayName: "新房客比率", field: "nuvRate"}
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
            }
            $rootScope.targetSearchSpread();
        }


        //得到数据中的url
        $scope.getDataUrlInfo = function (grid, row, number) {
            if (number < 3) {
                var a = row.entity[$rootScope.tableSwitch.latitude.field].split(",");
            } else if (number > 3) {
                var a = row.entity[$rootScope.tableSwitch.latitude.field].split(",`");
            } else {
                var a = row.entity[$rootScope.tableSwitch.latitude.field]
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
        //得到序列号
        $scope.getIndex = function (b) {
            return b.$parent.$parent.rowRenderIndex + 1
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
    }

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
        }
    }
});
