/**
 * Created by perfection on 15-7-22.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller("transformSearchPromotion", function ($timeout, $scope, $rootScope, $http, $q, requestService, SEM_API_URL, $cookieStore, uiGridConstants) {
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
            {consumption_name: '收益', name: 'benefit'},
            //{consumption_name: '利润', name: 'profit'}
        ];
        $rootScope.order = [
            {consumption_name: "订单数", name: "orderNum"},
            //{consumption_name: "订单金额", name: "orderMoney"},
            {consumption_name: "订单转化率", name: "orderNumRate"}
        ];

        //        高级搜索提示
        $scope.sourceSearch = "";
        $scope.terminalSearch = "";
        $scope.areaSearch = "";
//        取消显示的高级搜索的条件
        $scope.removeSourceSearch = function (obj) {
            $scope.souce.selected = {"name": "全部"};
//            $rootScope.$broadcast("loadAllSource");
            obj.sourceSearch = "";
        }
        $scope.removeTerminalSearch = function (obj) {
//            $rootScope.$broadcast("loadAllTerminal");
            obj.sourceSearch = "";
        }

        $scope.removeAreaSearch = function (obj) {
            $scope.city.selected = {"name": "全部"};
//            $rootScope.$broadcast("loadAllArea");
            obj.areaSearch = "";
        }

        var griApihtml = function (gridApi) {
            gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                row.entity.subGridOptions = {
                    appScopeProvider: $scope.subGridScope,
                    expandableRowHeight: 360,
                    enableHorizontalScrollbar: 1,
                    enableVerticalScrollbar: 1,
                    showHeader: false,
                    columnDefs: $rootScope.searchGridArray
                };
            });
        };
        $rootScope.expandInex=1
        $rootScope.expandRowData = function (pGridApi) {
            //展开操作
            pGridApi.expandable.on.rowExpandedStateChanged($scope, function (pRow) {
                if( $rootScope.expandInex==1){
                    pRow.entity.subGridOptions = {
                        enableColumnMenus: false,
                        enablePaginationControls: false,
                        enableExpandableRowHeader: false,
                        enableGridMenu: false,
                        enableHorizontalScrollbar: 0,
                        enableSorting: false,
                        //expandableRowHeight: 30,
                        expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions' class='grid clearfix secondary_table' ui-grid-exporter ui-grid-auto-resize ></div>",
                        //columnDefs: $rootScope.searchGridArray,
                        data: [],
                    }
                }else{
                    var tPageInfoArr = ["conversions", "benefit"]
                    var pageurl = "/api/transform/getPageConvInfo?start=" + $rootScope.start + "&end=" + $rootScope.end + "&type=" + $rootScope.userType + "&rfType=" + pRow.entity.rf_type + "&se=" + pRow.entity.se + "&queryOptions=" + tPageInfoArr
                    $http.get(pageurl).success(function (pagedatas) {
                        var datas = []
                        pagedatas.forEach(function (pdata, index) {
                            var data = angular.copy(pRow.entity)
                            $rootScope.checkedArray.forEach(function (attr) {
                                switch (attr) {
                                    case "conversions"://转化次数
                                        data["conversions"] = pdata[attr] != undefined ? pdata[attr].value : 0
                                        break;
                                    case "crate"://转化率
                                        data["crate"] = pdata["conversions"] != undefined && pRow.entity.pv > 0 ? (Number(pdata["conversions"].value) / Number(pRow.entity.pv)) : 0
                                        break;
                                    case "benefit"://收益
                                        data["benefit"] = pdata[attr] != undefined ? pdata[attr].value : 0
                                        break;
                                    case "orderNum"://订单数量
                                        data["orderNum"] = pdata[attr] != undefined ? pdata[attr].value : 0
                                        break;
                                    case "orderNumRate"://订单转化率
                                        data["orderNumRate"] = pdata["orderNum"] != undefined ? (Number(pdata["orderNum"].value) / Number(pRow.entity.pv)) : 0
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
                    })
                    pRow.entity.subGridOptions = {
                        enableColumnMenus: false,
                        enablePaginationControls: false,
                        enableExpandableRowHeader: false,
                        enableExpandable: true,
                        enableGridMenu: false,
                        enableHorizontalScrollbar: 0,
                        enableSorting: false,
                        expandableRowHeight: 30,
                        showHeader:false,
                        columnDefs: $rootScope.searchGridArray,
                        expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions' class='grid clearfix secondary_table' ui-grid-exporter ui-grid-auto-resize ></div>",
                        data: [],
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
                $rootScope.gridApiAdmin = gridApi;
                $rootScope.expandRowData(gridApi)
            }
        };
        $rootScope.targetSearchSpread = function (isClicked) {
            $scope.gridOpArray = angular.copy($rootScope.searchGridArray);
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
                    var returnCtr = (dataInfoIpmr == 0 ? "0%" : ((dataInfoClick / dataInfoIpmr) * 100).toFixed(2) + "%");
                    return returnCtr;
                }
                if ((option[0].entity[a.col.field] + "").indexOf("%") != -1) {
                    returnData = (returnData / option.length).toFixed(2) + "%";
                }
                if (a.col.field == "avgPage") {
                    returnData = (returnData / option.length).toFixed(2);
                }
                if (a.col.field == "outRate" || a.col.field == "nuvRate") {
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
        $rootScope.refreshData()
        $scope.$on("transformData", function (e, msg) {
            $(msg)
        });
        $scope.$on("transformData_ui_grid", function (e, msg) {
            $rootScope.searchGridArray[1].footerCellTemplate = "<div class='ui-grid-cell-contents'>当页汇总</div>";
            $rootScope.searchGridArray[2].footerCellTemplate = "<div class='ui-grid-cell-contents'>--</div>";
            $rootScope.searchGridArray[3].footerCellTemplate = "<div class='ui-grid-cell-contents'>--</div>";
            for (var i = 0; i < msg.checkedArray.length; i++) {
                $rootScope.searchGridArray[i + 2].displayName = chartUtils.convertChinese(msg.checkedArray[i]);
                $rootScope.searchGridArray[i + 2].field = msg.checkedArray[i];
                $rootScope.searchGridArray[i + 2].footerCellTemplate = "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>";
                $rootScope.searchGridArray[i + 2].name = chartUtils.convertChinese(msg.checkedArray[i]);
            }
            $scope.gridOpArray = angular.copy($rootScope.searchGridArray);
            $rootScope.gridOptions.columnDefs = $scope.gridOpArray;
            $rootScope.refreshData(msg)
        });
        $scope.$on("transformAdvancedData_ui_grid", function (e, msg) {
            $scope.advancedInit(msg)
        });
    });
});
