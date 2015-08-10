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

        //转化分析表格配置
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
        $rootScope.targetSearchSpread = function (isClicked) {
            $scope.gridOpArray = angular.copy($rootScope.searchGridArray);
            $scope.gridOptions.columnDefs = $scope.gridOpArray;
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
        var eventTable = function (data, transNameIndex, dataIndex, test_url, start, end,analysisAction) {
            $http({
                method: "GET",
                url: "/api/transform/transformAnalysis?start=" + start + "&end=" + end + "&analysisAction="+analysisAction+"&type=1&searchType=queryDataByUrl&showType=total&all_urls=" + test_url[transNameIndex]
            }).success(function (all_urls_data) {
                var temporaryData = data[dataIndex].crate;
                if (all_urls_data[0].crate_pv == 0) {
                    data[dataIndex].crate = 0;
                } else {
                    data[dataIndex].crate = (Number(temporaryData / all_urls_data[0].crate_pv) * 100).toFixed(2);
                }
                $scope.gridOptions.data = data;
            });
        };
        var hasSemEventTable = function (data, transNameIndex, dataIndex, test_url, timeData,sem_data,analysisAction) {
            $http({
                method: "GET",
                url: "/api/transform/transformAnalysis?start=" + timeData.start + "&end=" + timeData.end + "&analysisAction="+analysisAction+"&type=1&searchType=queryDataByUrl&showType=total&all_urls=" + test_url[transNameIndex]
            }).success(function (all_urls_data) {

                    timeData.checkedArray.forEach(function (checked) {
                        switch (checked) {

                            case "crate":
                                var temporaryData = data[dataIndex].crate;
                                if (all_urls_data[0].crate_pv == 0) {
                                    data[dataIndex].crate = 0;
                                } else {
                                    data[dataIndex].crate = (Number(temporaryData / all_urls_data[0].crate_pv) * 100).toFixed(2);
                                }
                                break;
                        }
                    });
                    $scope.gridOptions.data = data;

            });
        };
        $scope.init = function (timeData) {
            $scope.gridOptions.data = [];
            $http.get("/api/transform/transformAnalysis?start=" + timeData.start + "&end=" + timeData.end + "&analysisAction="+timeData.analysisAction+"&type=1&searchType=table&queryOptions=" + timeData.checkedArray).success(function (data) {
                var hasCrate = false;
                for (var o = 0; o < timeData.checkedArray.length; o++) {
                    if (timeData.checkedArray[o] == "crate") {
                        hasCrate = true;
                        break;
                    }
                }
                if (hasCrate) {
                    if (timeData.sem_checkedArray.length != 0) {
                        var test_url = ["http://www.farmer.com.cn/", "http://182.92.227.23:8080/login?url=localhost:8000"];
                        var transName = ["登陆信息", "￧ﾙﾻ￩ﾙﾆ￤﾿ﾡ￦ﾁﾯ"];
                        var semRequest = "";
                        semRequest = $http.get(SEM_API_URL + "/sem/report/campaign?a=" + $rootScope.user + "&b=" + $rootScope.baiduAccount + "&startOffset=" + timeData.start + "&endOffset=" + timeData.end + "&q=cost");
                        $q.all([semRequest]).then(function (sem_data) {
                            var cost = 0;
                            for (var k = 0; k < sem_data.length; k++) {
                                for (var c = 0; c < sem_data[k].data.length; c++) {
                                    cost += Number(sem_data[k].data[c].cost);
                                }
                            }
                            timeData.checkedArray.forEach(function(checked){
                                var k =0;
                                switch(checked){
                                    case "avgCost":
                                        var avgCost_all = 0;
                                        for (k = 0; k < data.length; k++) {
                                            avgCost_all += data[k].avgCost;
                                        }
                                        if (avgCost_all == 0) {
                                            for (k = 0; k < data.length; k++) {
                                                data[k].avgCost = 0;
                                            }
                                        } else {
                                            var avgCost_avg = (cost / avgCost_all).toFixed(2).toString();
                                            for (k = 0; k < data.length; k++) {
                                                data[k].avgCost = avgCost_avg;
                                            }
                                        }
                                        break;
                                    case "profit":
                                        var profit_all = 0;
                                        for (k = 0; k < data.length; k++) {
                                            profit_all += Number(data[k].profit);
                                        }
                                        var profit_avg = (profit_all - cost).toFixed(2).toString();
                                        for (k = 0; k < data.length; k++) {
                                            data[k].profit = profit_avg;
                                        }
                                        break;
                                    case "transformCost":
                                        var transformCost_all = 0;
                                        for (k = 0; k < data.length; k++) {
                                            transformCost_all += data[k].transformCost;
                                        }
                                        if (transformCost_all == 0) {
                                            for (k = 0; k < data.length; k++) {
                                                data[k].transformCost = 0;
                                            }
                                        } else {
                                            var transformCost_avg = (cost / transformCost_all).toFixed(2).toString();
                                            for (k = 0; k < data.length; k++) {
                                                data[k].transformCost = transformCost_avg;
                                            }
                                        }
                                        break;
                                }
                            });

                            for (var p = 0; p < transName.length; p++) {
                                for (var i = 0; i < data.length; i++) {
                                    if (transName[p] == data[i].campaignName) {
                                        hasSemEventTable(data, p, i, test_url, timeData,sem_data,timeData.analysisAction);
                                    }
                                }
                            }
                        });
                    } else {
                        var test_url = ["http://www.farmer.com.cn/", "http://182.92.227.23:8080/login?url=localhost:8000"];
                        var transName = ["登陆信息", "￧ﾙﾻ￩ﾙﾆ￤﾿ﾡ￦ﾁﾯ"];
                        for (var p = 0; p < transName.length; p++) {
                            for (var i = 0; i < data.length; i++) {
                                if (transName[p] == data[i].campaignName) {
                                    eventTable(data, p, i, test_url, timeData.start, timeData.end,timeData.analysisAction);
                                }
                            }
                        }
                    }
                } else {
                    if (timeData.sem_checkedArray.length != 0) {
                        var semRequest = "";
                        semRequest = $http.get(SEM_API_URL + "/sem/report/campaign?a=" + $rootScope.user + "&b=" + $rootScope.baiduAccount + "&startOffset=" + timeData.start + "&endOffset=" + timeData.end + "&q=cost");
                        $q.all([semRequest]).then(function (sem_data) {
                            var cost = 0;
                            for (var k = 0; k < sem_data.length; k++) {
                                for (var c = 0; c < sem_data[k].data.length; c++) {
                                    cost += Number(sem_data[k].data[c].cost);
                                }
                            }
                            timeData.sem_checkedArray.forEach(function (checked, index) {
                                var k = 0;
                                switch (timeData.sem_checkedArray[index]) {
                                    case "avgCost":
                                        var avgCost_all = 0;
                                        for (k = 0; k < data.length; k++) {
                                            avgCost_all += data[k].avgCost;
                                        }
                                        if (avgCost_all == 0) {
                                            for (k = 0; k < data.length; k++) {
                                                data[k].avgCost = 0;
                                            }
                                        } else {
                                            var avgCost_avg = (cost / avgCost_all).toFixed(2).toString();
                                            for (k = 0; k < data.length; k++) {
                                                data[k].avgCost = avgCost_avg;
                                            }
                                        }
                                        break;
                                    case "profit":
                                        var profit_all = 0;
                                        for (k = 0; k < data.length; k++) {
                                            profit_all += Number(data[k].profit);
                                        }
                                        var profit_avg = (profit_all - cost).toFixed(2).toString();
                                        for (k = 0; k < data.length; k++) {
                                            data[k].profit = profit_avg;
                                        }
                                        break;
                                    case "transformCost":
                                        var transformCost_all = 0;
                                        for (k = 0; k < data.length; k++) {
                                            transformCost_all += data[k].transformCost;
                                        }
                                        if (transformCost_all == 0) {
                                            for (k = 0; k < data.length; k++) {
                                                data[k].transformCost = 0;
                                            }
                                        } else {
                                            var transformCost_avg = (cost / transformCost_all).toFixed(2).toString();
                                            for (k = 0; k < data.length; k++) {
                                                data[k].transformCost = transformCost_avg;
                                            }
                                        }
                                        break;
                                }
                            });
                            $scope.gridOptions.data = data;
                        });
                    } else {
                        $scope.gridOptions.data = data;
                    }
                }

            });
        };
        $scope.$on("transformData", function (e, msg) {
            $scope.init(msg)
        });
        $scope.$on("transformData_ui_grid", function (e, msg) {
            $rootScope.searchGridArray[1].footerCellTemplate = "<div class='ui-grid-cell-contents'>当页汇总</div>";
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
                    case "terminal_type":
                        switch (msg.checkedData[i].name) {
                            case "计算机":
                                query += "terminal_type:0,";
                                break;
                            case "移动设备":
                                query += "terminal_type:1,";
                                break;
                            default :
                                query += "terminal_type:all,";
                                break;
                        }
                        break;
                }

            }
            query = query.substring(0, query.length - 1);
            $scope.gridOptions.data = [];
            $http.get("/api/transform/transformAnalysis?start=" + msg.start + "&end=" + msg.end + "&analysisAction="+msg.analysisAction+"&type=1&searchType=advancedTable&queryOptions={" + query + "}&aggsOptions=" + msg.checkedArray).success(function (data) {
                var hasCrate = false;
                for (var o = 0; o < msg.checkedArray.length; o++) {
                    if (msg.checkedArray[o] == "crate") {
                        hasCrate = true;
                        break;
                    }
                }
                if(hasCrate){
                    if (msg.sem_checkedArray.length != 0) {
                        var test_url = ["http://www.farmer.com.cn/", "http://182.92.227.23:8080/login?url=localhost:8000"];
                        var transName = ["登陆信息", "￧ﾙﾻ￩ﾙﾆ￤﾿ﾡ￦ﾁﾯ"];
                        var semRequest = "";
                        semRequest = $http.get(SEM_API_URL + "/sem/report/campaign?a=" + $rootScope.user + "&b=" + $rootScope.baiduAccount + "&startOffset=" + msg.start + "&endOffset=" + msg.end + "&q=cost");
                        $q.all([semRequest]).then(function (sem_data) {
                            var cost = 0;
                            for (var k = 0; k < sem_data.length; k++) {
                                for (var c = 0; c < sem_data[k].data.length; c++) {
                                    cost += Number(sem_data[k].data[c].cost);
                                }
                            }
                            msg.checkedArray.forEach(function(checked){
                                var k =0;
                                switch(checked){
                                    case "avgCost":
                                        var avgCost_all = 0;
                                        for (k = 0; k < data.length; k++) {
                                            avgCost_all += data[k].avgCost;
                                        }
                                        if (avgCost_all == 0) {
                                            for (k = 0; k < data.length; k++) {
                                                data[k].avgCost = 0;
                                            }
                                        } else {
                                            var avgCost_avg = (cost / avgCost_all).toFixed(2).toString();
                                            for (k = 0; k < data.length; k++) {
                                                data[k].avgCost = avgCost_avg;
                                            }
                                        }
                                        break;
                                    case "profit":
                                        var profit_all = 0;
                                        for (k = 0; k < data.length; k++) {
                                            profit_all += Number(data[k].profit);
                                        }
                                        var profit_avg = (profit_all - cost).toFixed(2).toString();
                                        for (k = 0; k < data.length; k++) {
                                            data[k].profit = profit_avg;
                                        }
                                        break;
                                    case "transformCost":
                                        var transformCost_all = 0;
                                        for (k = 0; k < data.length; k++) {
                                            transformCost_all += data[k].transformCost;
                                        }
                                        if (transformCost_all == 0) {
                                            for (k = 0; k < data.length; k++) {
                                                data[k].transformCost = 0;
                                            }
                                        } else {
                                            var transformCost_avg = (cost / transformCost_all).toFixed(2).toString();
                                            for (k = 0; k < data.length; k++) {
                                                data[k].transformCost = transformCost_avg;
                                            }
                                        }
                                        break;
                                }
                            });

                            for (var p = 0; p < transName.length; p++) {
                                for (var i = 0; i < data.length; i++) {
                                    if (transName[p] == data[i].campaignName) {
                                        hasSemEventTable(data, p, i, test_url, msg,sem_data,msg.analysisAction);
                                    }
                                }
                            }
                        });
                    } else {
                        var test_url = ["http://www.farmer.com.cn/", "http://182.92.227.23:8080/login?url=localhost:8000"];
                        var transName = ["登陆信息", "￧ﾙﾻ￩ﾙﾆ￤﾿ﾡ￦ﾁﾯ"];
                        for (var p = 0; p < transName.length; p++) {
                            for (var i = 0; i < data.length; i++) {
                                if (transName[p] == data[i].campaignName) {
                                    eventTable(data, p, i, test_url, msg.start, msg.end,msg.analysisAction);
                                }
                            }
                        }
                    }
                }else{
                    if (msg.sem_checkedArray.length != 0) {
                        var semRequest = "";
                        semRequest = $http.get(SEM_API_URL + "/sem/report/campaign?a=" + $rootScope.user + "&b=" + $rootScope.baiduAccount + "&startOffset=" + msg.start + "&endOffset=" + msg.end + "&q=cost");
                        $q.all([semRequest]).then(function (sem_data) {
                            var cost = 0;
                            var k = 0;
                            for (k = 0; k < sem_data.length; k++) {
                                for (var c = 0; c < sem_data[k].data.length; c++) {
                                    cost += Number(sem_data[k].data[c].cost);
                                }
                            }
                            msg.sem_checkedArray.forEach(function (checked, index) {
                                var k = 0;
                                switch (msg.sem_checkedArray[index]) {
                                    case "avgCost":
                                        var avgCost_all = 0;
                                        for (k = 0; k < data.length; k++) {
                                            avgCost_all += data[k].avgCost;
                                        }
                                        if (avgCost_all == 0) {
                                            for (k = 0; k < data.length; k++) {
                                                data[k].avgCost = 0;
                                            }
                                        } else {
                                            var avgCost_avg = (cost / avgCost_all).toFixed(2).toString();
                                            for (k = 0; k < data.length; k++) {
                                                data[k].avgCost = avgCost_avg;
                                            }
                                        }
                                        break;
                                    case "profit":
                                        var profit_all = 0;
                                        for (k = 0; k < data.length; k++) {
                                            profit_all += Number(data[k].profit);
                                        }
                                        var profit_avg = (profit_all - cost).toFixed(2).toString();
                                        for (k = 0; k < data.length; k++) {
                                            data[k].profit = profit_avg;
                                        }
                                        break;
                                    case "transformCost":
                                        var transformCost_all = 0;
                                        for (k = 0; k < data.length; k++) {
                                            transformCost_all += data[k].transformCost;
                                        }
                                        if (transformCost_all == 0) {
                                            for (k = 0; k < data.length; k++) {
                                                data[k].transformCost = 0;
                                            }
                                        } else {
                                            var transformCost_avg = (cost / transformCost_all).toFixed(2).toString();
                                            for (k = 0; k < data.length; k++) {
                                                data[k].transformCost = transformCost_avg;
                                            }
                                        }
                                }
                            });
                            $scope.gridOptions.data = data;
                        });

                    } else {
                        $scope.gridOptions.data = data;
                    }
                }
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
        }
    };
})
;
