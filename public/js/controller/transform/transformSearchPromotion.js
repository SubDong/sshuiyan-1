/**
 * Created by perfection on 15-7-22.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller("transformSearchPromotion", function ($timeout, $scope, $rootScope, $http, $q, $location, requestService, SEM_API_URL, $cookieStore, uiGridConstants) {
        $scope.todayClass = true;
        var user = $rootScope.user
        var baiduAccount = $rootScope.baiduAccount;
        var esType = $rootScope.userType;
        var trackid = $rootScope.siteTrackId;
        $rootScope.bases = [
            {consumption_name: "浏览量(PV)", name: "pv"},
            {consumption_name: "访客数(UV)", name: "uv"},
            {consumption_name: "访问次数", name: "vc"},
            {consumption_name: "IP数", name: "ip"},
            {consumption_name: "新访客数", name: "nuv"},
            {consumption_name: "新访客比率", name: "nuvRate"}
        ];
        $rootScope.transform = [
            {consumption_name: '转化次数', name: 'conversions'},
            {consumption_name: '转化率', name: 'crate'},
            //{consumption_name: '平均转化成本(页面)', name: 'avgCost'},
            {consumption_name: '收益', name: 'benefit'}
            //{consumption_name: '利润', name: 'profit'}
        ];
        $rootScope.order = [
            {consumption_name: "订单数", name: "orderNum"},
            //{consumption_name: "订单金额", name: "orderMoney"},
            {consumption_name: "订单转化率", name: "orderNumRate"}
        ];

        $rootScope.extendways = [{index:0,name:"全部页面转化目标"}]
        //        高级搜索提示
        $scope.sourceSearch = "";
        $scope.terminalSearch = "";
        $scope.areaSearch = "";
//        取消显示的高级搜索的条件
        $scope.removeTerminalSearch = function (obj) {
            //$rootScope.$broadcast("loadAllTerminal");
            var inputArray = $(".areaTerm .styled");
            inputArray.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop("checked", false);
            });
            $(inputArray[0]).prev("span").css("background-position", "0px -51px");
            obj.terminalSearch = "";
            $rootScope.tableSwitch.terminalFilter = null;
            $rootScope.initPageConfig(false)
        }
        $scope.removeAreaSearch = function (obj) {
            $scope.city.selected = {"name": "全部"};
            //$rootScope.$broadcast("loadAllArea");
            obj.areaSearch = "";
            $rootScope.tableSwitch.areaFilter = null
            $rootScope.initPageConfig(false)
        }
        $scope.removeVisitorSearch = function (obj) {
//                $rootScope.$broadcast("loadAllVisitor");
            var inputArray = $(".areaVisitor .styled");
            inputArray.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop("checked", false);
            });
            $(inputArray[0]).prev("span").css("background-position", "0px -51px");
            obj.visitorSearch = "";
            $rootScope.tableSwitch.visitorFilter = null
            $rootScope.initPageConfig(false)
        }

        //var griApihtml = function (gridApi) {
        //    gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
        //        row.entity.subGridOptions = {
        //            appScopeProvider: $scope.subGridScope,
        //            expandableRowHeight: 360,
        //            enableHorizontalScrollbar: 1,
        //            enableVerticalScrollbar: 1,
        //            showHeader: false,
        //            columnDefs: $rootScope.gridArray
        //        };
        //    });
        //};
        $rootScope.expandInex = 1
        $rootScope.expandRowData = function (pGridApi) {
            //展开操作
            pGridApi.expandable.on.rowExpandedStateChanged($scope, function (pRow) {
                if ($rootScope.expandInex == 1) {
                    pRow.entity.subGridOptions = {
                        enableColumnMenus: false,
                        enablePaginationControls: false,
                        enableExpandableRowHeader: false,
                        enableGridMenu: false,
                        enableHorizontalScrollbar: 0,
                        enableSorting: false,
                        expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions' class='grid clearfix secondary_table' ui-grid-exporter ui-grid-auto-resize ></div>",
                        data: []
                    }
                } else {
                    //查询转化的数据
                    if ($rootScope.pageConfigs != undefined && $rootScope.pageConfigs.length > 0) {
                        var filterPageConf = []
                        if ( $rootScope.selectedPageConvIndex == 0 ) {
                            filterPageConf = $rootScope.pageConfigs
                        } else {
                            $rootScope.pageConfigs.forEach(function (conf) {
                                if (conf.targetName == $rootScope.extendways[$rootScope.selectedPageConvIndex]["name"]) {
                                    filterPageConf.push(conf)
                                }
                            })
                        }
                        var tPageInfoArr = ["conversions", "benefit"]
                        var pageurl = "/api/transform/getPageConvInfo?start=" + $rootScope.start + "&end=" + $rootScope.end + "&type=" + $rootScope.userType + "&rfType=" + $rootScope.rowEntity.rf_type + "&se=" + pRow.entity.se + "&queryOptions=" + tPageInfoArr+"&pages=" + JSON.stringify(filterPageConf)+ "&filters=" + $rootScope.getFilters()
                        $http.get(pageurl).success(function (pagedatas) {
                            if(pagedatas!=undefined&&pagedatas.length>0){
                                var datas = []
                                pagedatas.forEach(function (pdata, index) {
                                    var data = angular.copy(pRow.entity)
                                    $rootScope.checkedArray.forEach(function (attr) {
                                        switch (attr) {
                                            case "conversions"://转化次数
                                                data["conversions"] = pdata[attr] != undefined ? pdata[attr].value : 0
                                                break;
                                            case "crate"://转化率
                                                data["crate"] = (pdata["conversions"] != undefined && pRow.entity.pv > 0 ? ((Number(pdata["conversions"].value) / Number(pRow.entity.pv)) * 100).toFixed(2) : (0).toFixed(2)) + "%"
                                                break;
                                            case "benefit"://收益
                                                data["benefit"] = pdata[attr] != undefined ? pdata[attr].value : 0
                                                break;
                                            case "orderNum"://订单数量
                                                data["orderNum"] = pdata[attr] != undefined ? pdata[attr].value : 0
                                                break;
                                            case "orderNumRate"://订单转化率
                                                data["orderNumRate"] = ( pdata["orderNum"] != undefined ? ((Number(pdata["orderNum"].value) / Number(pRow.entity.pv)) * 100).toFixed(2) : (0).toFixed(2)) + "%"
                                                break;
                                            default :
                                                if (pRow.entity[attr] != undefined)
                                                    data[attr] = pRow.entity[attr]
                                                break;

                                        }
                                    })
                                    data["campaignName"] = pdata["key"]
                                    datas.push(data)
                                })
                                pRow.entity.subGridOptions.data = datas
                            }else{
                                pRow.entity.subGridOptions.data = []
                            }
                        })
                    }
                    $rootScope.subGridArray = angular.copy($rootScope.gridArray)
                    $rootScope.subGridArray[1] = {
                        name: "来源",
                        displayName: "来源",
                        field: "campaignName",
                        footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                        enableSorting: false
                    }
                    pRow.entity.subGridOptions = {
                        enableColumnMenus: false,
                        enablePaginationControls: false,
                        enableExpandableRowHeader: false,
                        enableExpandable: true,
                        enableGridMenu: false,
                        enableHorizontalScrollbar: 0,
                        enableSorting: false,
                        expandableRowHeight: 30,
                        showHeader: false,
                        columnDefs: $rootScope.subGridArray,
                        expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions' class='grid clearfix secondary_table' ui-grid-exporter ui-grid-auto-resize ></div>",
                        data: []
                    }

                }
            })
        }
        //转化分析表格配置
        $rootScope.gridOptions = {
            //paginationPageSize: 20,
            expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions'></div>",
            enableExpandableRowHeader: true,
            enableExpandable: true,
            enableColumnMenus: false,
            showColumnFooter: true,
            //enablePaginationControls: true,
            enableSorting: true,
            enableGridMenu: false,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            onRegisterApi: function (gridApi) {
                $rootScope.gridApi2 = gridApi;
                /*页面转化中分页显示需要#609*/
                $rootScope.gridApiAdmin = gridApi;
                $rootScope.expandRowData(gridApi)
            }
        };
        $rootScope.targetSearchSpread = function (isClicked) {
            $scope.gridOpArray = angular.copy($rootScope.gridArray);
            $rootScope.gridOptions.columnDefs = $scope.gridOpArray;
        };

        $scope.page = "";
        $scope.pagego = function (pagevalue) {
            pagevalue.pagination.seek(Number($scope.page));
        };
        $rootScope.targetSearchSpread(true);
        //得到表格底部数据
        $scope.getSearchFooterData = function (a, option, number) {
            var returnData = 0;
            var spl = 0;
            var newSpl = [0, 0, 0];
            if (option.length > 0) {
                option.forEach(function (item, i) {
                    returnData += parseFloat((item.entity[a.col.field] + "").replace("%", ""));
                    if (a.col.field == "avgTime") {
                        if (item.entity[a.col.field] != undefined) {
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
                    var returnCtr = (dataInfoIpmr == 0 ? "0.00%" : ((dataInfoClick / dataInfoIpmr) * 100).toFixed(2) + "%");
                    return returnCtr;
                }
                if ((option[0].entity[a.col.field] + "").indexOf("%") != -1) {
                    returnData = (returnData / option.length).toFixed(2) + "%";
                }
                if (a.col.field == "avgPage") {
                    returnData = (returnData / option.length).toFixed(2);
                }
                if (a.col.field == "outRate") {
                    returnData = returnData == "0.00%" ? "0%" : (returnData / option.length).toFixed(2) + "%";
                }
                if (a.col.field == "avgTime") {
                    var atime1 = parseInt(newSpl[0] / option.length) + "";
                    var atime2 = parseInt(newSpl[1] / option.length) + "";
                    var atime3 = parseInt(newSpl[2] / option.length) + "";
                    returnData = (atime1.length == 1 ? "0" + atime1 : atime1) + ":" + (atime2.length == 1 ? "0" + atime2 : atime2) + ":" + (atime3.length == 1 ? "0" + atime3 : atime3);
                }
                if (a.col.field == "cpc" || a.col.field == "cost") {
                    returnData = (returnData + "").substring(0, (returnData + "").indexOf(".") + 3);
                }
                if (a.col.field == "nuvRate") {
                    var sumNuv= 0,sumUv =0
                    option.forEach(function (item) {
                        sumNuv+= item.entity["nuv"]==undefined?0: item.entity["nuv"]
                        sumUv+= item.entity["uv"]==undefined?0: item.entity["uv"]
                    })
                    returnData = sumNuv>0?(((sumNuv/sumUv)*100).toFixed(2)+"%"):"0.00%"
                }
                if (a.col.field == "crate") {
                    var sumNuv= 0,sumpv =0
                    option.forEach(function (item) {
                        sumNuv+= item.entity["conversions"]==undefined?0: item.entity["conversions"]
                        sumpv+= item.entity["pv"]==undefined?0: item.entity["pv"]
                    })
                    returnData = sumpv>0?(((sumNuv/sumpv)*100).toFixed(2)+"%"):"0.00%"
                }
                if (a.col.field == "orderNumRate") {
                    var sumOrder= 0,sumpv =0
                    option.forEach(function (item) {
                        sumOrder+= item.entity["orderNum"]==undefined?0: item.entity["orderNum"]
                        sumpv+= item.entity["pv"]==undefined?0: item.entity["pv"]
                    })
                    returnData = sumpv>0?(((sumOrder/sumpv)*100).toFixed(2)+"%"):"0.00%"
                }
            } else {
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
        //初始化数据
        $rootScope.initPageConfig()//初始化查询ES
        $scope.$on("transformData", function (e, msg) {
            $(msg)
        });
        $scope.$on("transformData_ui_grid", function (e, msg) {
            $rootScope.gridArray[1].footerCellTemplate = "<div class='ui-grid-cell-contents'>当页汇总</div>";
            $rootScope.gridArray[2].footerCellTemplate = "<div class='ui-grid-cell-contents'>--</div>";
            $rootScope.gridArray[3].footerCellTemplate = "<div class='ui-grid-cell-contents'>--</div>";
            for (var i = 0; i < msg.checkedArray.length; i++) {
                $rootScope.gridArray[i + 2].displayName = chartUtils.convertChinese(msg.checkedArray[i]);
                $rootScope.gridArray[i + 2].field = msg.checkedArray[i];
                $rootScope.gridArray[i + 2].footerCellTemplate = "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>";
                $rootScope.gridArray[i + 2].name = chartUtils.convertChinese(msg.checkedArray[i]);
            }
            $scope.gridOpArray = angular.copy($rootScope.gridArray);
            $rootScope.gridOptions.columnDefs = $scope.gridOpArray;
            $rootScope.initPageConfig(msg)
        });
        $scope.$on("transformAdvancedData_ui_grid", function (e, msg) {
            $scope.advancedInit(msg)
        });


        ////////////过滤////////////
        //设置来源终端
        var evTimeStamp = 0;
        $scope.setTerminal = function (a) {
            var now = +new Date();
            if (now - evTimeStamp < 100) {
                return;
            }
            evTimeStamp = now;
            var inputArray = $(".areaTerm .styled");
            inputArray.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop("checked", false);
            });
            $(inputArray[a]).prev("span").css("background-position", "0px -51px");

            var _pmFilter = "";
            var _pmFilterRealTime = "";

            if (a == 0) {
                $scope.terminalSearch = "";
                $rootScope.tableSwitch.terminalFilter = null
            }
            if (a == 1) {
                _pmFilter = JSON.parse("{\"pm\":[0]}");
                _pmFilterRealTime = JSON.parse("{\"pm\":\"0\"}");
                $scope.terminalSearch = "计算机";
                $rootScope.tableSwitch.terminalFilter = {pm: 0}
            }
            if (a == 2) {
                _pmFilter = JSON.parse("{\"pm\":[1]}");
                _pmFilterRealTime = JSON.parse("{\"pm\":\"1\"}");
                $scope.terminalSearch = "移动设备";
                $rootScope.tableSwitch.terminalFilter = {pm: 1}
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
                $rootScope.initPageConfig(false)
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

                //获取所有过滤条件
                var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
                _allFilters = filterUtil.filter(_allFilters, "rf_type", _rfFilter);
                _allFilters = filterUtil.filter(_allFilters, "region", "");
                $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);
                $rootScope.tableSwitch.areaFilter = null
            } else {
                $rootScope.tableSwitch.areaFilter = {region: area}
                $scope.areaSearch = area;
                var _rfFilter = JSON.parse("{\"rf_type\":[2]}");
                var _areaFilter = JSON.parse("{\"region\":[\"" + area + "\"]}");

                if ($rootScope.tableSwitch.number == 6) {
                    $scope.curArea = area;
                    $scope.showArea = true
                    $rootScope.tableSwitch.areaFilter = {region: area}
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
            $rootScope.initPageConfig()
            $scope.allCitys = angular.copy($rootScope.citys);
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
            var inputArray = $(".areaVisitor .styled");
            inputArray.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop("checked", false);
            });
            $(inputArray[a]).prev("span").css("background-position", "0px -51px");

            //访客过滤条件
            var _viFilter = "";
            if (a == 0) {
                $scope.visitorSearch = "", $scope.showVisitor = false
                $rootScope.tableSwitch.visitorFilter = null
            } else if (a == 1) {
                _viFilter = JSON.parse("{\"ct\":[0]}"), $scope.visitorSearch = "新访客", $scope.showVisitor = true
                $rootScope.tableSwitch.visitorFilter = {ct: 0}
            } else if (a == 2) {
                _viFilter = JSON.parse("{\"ct\":[1]}"), $scope.visitorSearch = "老访客", $scope.showVisitor = true
                $rootScope.tableSwitch.visitorFilter = {ct: 1}
            }
            var _allFilters = JSON.parse($rootScope.tableSwitch.tableFilter);
            //获取所有过滤条件
            _allFilters = filterUtil.filter(_allFilters, "ct", _viFilter);
            $rootScope.tableSwitch.tableFilter = JSON.stringify(_allFilters);
            $rootScope.$broadcast("ssh_data_show_refresh");
            //$rootScope.showPageSeDetail=0
            $rootScope.initPageConfig()
        };
    });
});
