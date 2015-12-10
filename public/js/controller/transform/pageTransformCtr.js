/**
 * Created by perfection on 15-7-22.
 */
define(["./module"], function (ctrs) {
    "use strict";
    ctrs.controller('pageTransformCtr', function ($scope, $rootScope, $q, requestService, areaService, $http, SEM_API_URL, uiGridConstants, $cookieStore) {
            $scope.city.selected = {"name": "全部"};
            $scope.todayClass = true;
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.tableFormat = null;
            $scope.send = true;//显示发送
            $scope.isCompared = false;
            $rootScope.tableTimeStart = -1;//开始时间
            $rootScope.tableTimeEnd = -1;//结束时间、
            $rootScope.tableFormat = null;
            //自定义指标显示
            var init_transformData = function () {
                $scope.es_checkArray = ["pv", "uv", "vc", "ip", "nuv", "nuvRate", "conversions", "crate", "transformCost", "clickTotal", "visitNum"];
                $scope.sem_checkArray = ["transformCost"];
                $scope.es_checkedArray = [];
                $scope.sem_checkedArray = [];
                for (var i = 0; i < $rootScope.checkedArray.length; i++) {
                    for (var k = 0; k < $scope.es_checkArray.length; k++) {
                        if ($rootScope.checkedArray[i] == $scope.es_checkArray[k]) {
                            $scope.es_checkedArray.push($rootScope.checkedArray[i]);
                        }
                    }
                    for (var k = 0; k < $scope.sem_checkArray.length; k++) {
                        if ($rootScope.checkedArray[i] == $scope.sem_checkArray[k]) {
                            $scope.sem_checkedArray.push($rootScope.checkedArray[i]);
                        }
                    }
                }
                $scope.$broadcast("transformData", {
                    start: $rootScope.start,
                    end: $rootScope.end,
                    checkedArray: $scope.es_checkedArray,
                    sem_checkedArray: $scope.sem_checkedArray,
                    all_checked: $rootScope.checkedArray,
                    analysisAction: "event",
                    convert_url_all: $scope.convert_url_all
                });
            };
            $scope.es_checkArray = ["pv", "uv", "vc", "ip", "nuv", "nuvRate", "conversions", "crate", /*"avgCost",*/ "orderNum", /*"benefit", "profit",*/ "orderNum", "orderNumRate"];
            $scope.sem_checkArray = ["avgCost", "profit", "orderMoney"];
            //配置默认指标
            $rootScope.checkedArray = ["pv", "uv", "vc", "ip", "conversions", "crate"]
            $rootScope.selectedPageConvIndex = 0
            /**
             * 展示第二级数据
             * @param grid
             * @param row
             */

            $rootScope.rowEntity =null;
            $rootScope.showPageSeDetail = function(grid,row){
                if( $rootScope.expandInex != 2){
                    $rootScope.rowEntity = row.entity
                    $rootScope.initPageSeDetail()
                }
            }
            $rootScope.initPageSeDetail = function (selectedPageConv) {
                if ($rootScope.pageConfigs != undefined && $rootScope.pageConfigs.length > 0) {
                    var filterPageConf = []
                    if (  $rootScope.selectedPageConvIndex == 0) {
                        filterPageConf = $rootScope.pageConfigs
                    } else {
                        $rootScope.pageConfigs.forEach(function (conf) {
                            if (conf.targetName == $rootScope.extendways[$rootScope.selectedPageConvIndex].name) {
                                filterPageConf.push(conf)
                            }
                        })
                    }
                    $rootScope.expandInex = 2
                    //修改列名称
                    $rootScope.gridOptions.columnDefs[1] = {
                        name: "来源",
                        displayName: "来源",
                        field: "campaignName",
                        //cellTemplate: "<div><a href='javascript:void(0)' style='color:#0965b8;line-height:30px'>{{grid.appScope.getDataUrlInfo(grid, row,3)}}</a></div>",
                        footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                        enableSorting: false
                    }
                    var tCheckedArray = ["pv", "uv", "vc", "ip", "nuv", "nuvRate"]
                    var pvurl = "/api/transform/getPageSePVs?start=" + $rootScope.start + "&end=" + $rootScope.end + "&type=" + $rootScope.userType + "&rfType=" + $rootScope.rowEntity.rf_type + "&queryOptions=" + tCheckedArray + "&pages=" + JSON.stringify(filterPageConf) + "&showType=day" + "&filters=" + $rootScope.getFilters()
                    $http.get(pvurl).success(function (pvdatas) {
                        var isPConv = false;
                        for (var index = 0; index < $rootScope.checkedArray.length; index++) {
                            isPConv = true;
                            $rootScope.bases.forEach(function (base) {
                                if (base.name == $rootScope.checkedArray[index]) {
                                    isPConv = false
                                }
                            })
                            if (isPConv)
                                break;
                        }
                        $rootScope.gridOptions.data = pvdatas
                        if (isPConv) {
                            //查询转化的数据
                            var tPageInfoArr = ["conversions", "benefit"]
                            var pageurl = "/api/transform/getPageBaseInfo?start=" + $rootScope.start + "&end=" + $rootScope.end + "&type=" + $rootScope.userType + "&rfType=" + $rootScope.rowEntity.rf_type + "&queryOptions=" + tPageInfoArr + "&pages=" + JSON.stringify(filterPageConf) + "&showType=day" + "&filters=" + $rootScope.getFilters()

                            $http.get(pageurl).success(function (pagedatas) {
                                $rootScope.gridOptions.data.forEach(function (data, index) {
                                    $rootScope.checkedArray.forEach(function (attr) {
                                        switch (attr) {
                                            case "conversions"://转化次数
                                                data["conversions"] = pagedatas[$rootScope.rowEntity.campaignName] != undefined && pagedatas[$rootScope.rowEntity.campaignName].conversions != undefined ? pagedatas[$rootScope.rowEntity.campaignName].conversions.value : 0
                                                break;
                                            case "crate"://转化率
                                                data["crate"] = (pagedatas[$rootScope.rowEntity.campaignName] != undefined && data.pv > 0 ? ((Number(pagedatas[$rootScope.rowEntity.campaignName]["conversions"].value) / Number(data.pv)) * 100).toFixed(2) : (0).toFixed(2)) + "%"
                                                break;
                                            case "benefit"://收益
                                                data["benefit"] = pagedatas[$rootScope.rowEntity.campaignName] != undefined && pagedatas[$rootScope.rowEntity.campaignName].benefit != undefined ? pagedatas[$rootScope.rowEntity.campaignName].benefit.value : 0
                                                break;
                                            case "orderNum"://订单数量
                                                data["orderNum"] = pagedatas[$rootScope.rowEntity.campaignName] != undefined && pagedatas[$rootScope.rowEntity.campaignName].orderNum != undefined ? pagedatas[$rootScope.rowEntity.campaignName].orderNum.value : 0
                                                break;
                                            case "orderNumRate"://订单转化率
                                                data["orderNumRate"] = (pagedatas[$rootScope.rowEntity.campaignName] != undefined && pagedatas[$rootScope.rowEntity.campaignName].orderNum != undefined && data.pv > 0 ? ((Number(pagedatas[$rootScope.rowEntity.campaignName].orderNum.value) / Number(data.pv)) * 100).toFixed(2) : (0).toFixed(2)) + "%"
                                                break;
                                            default :
                                                break;
                                        }
                                    })
                                    data["rf_type"] = $rootScope.rowEntity.rf_type
                                })
                            })
                        } else {
                            $rootScope.gridOptions.data.forEach(function (data) {
                                $scope.dateShowArray.forEach(function (attr) {
                                    if (data[attr.label] != undefined)
                                        attr.value += data[attr.label]
                                })
                                data["rf_type"] = $rootScope.rowEntity.rf_type
                            })
                        }
                    })
                }
            }

            $rootScope.gridArray = [
                {
                    name: "xl",
                    displayName: "",
                    cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                    maxWidth: 10,
                    enableSorting: false
                },
                {
                    name: "来源",
                    displayName: "来源",
                    field: "campaignName",
                    cellTemplate: "<div><a href='javascript:void(0)' style='color:#0965b8;line-height:30px' ng-click='grid.appScope.showPageSeDetail(grid.options.data,row)'>{{grid.appScope.getDataUrlInfo(grid, row,3)}}</a></div>",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                    enableSorting: false
                },
                {
                    name: "浏览量(PV)",
                    displayName: "浏览量(PV)",
                    field: "pv",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>",
                    sort: {
                        direction: uiGridConstants.ASC,
                        priority: 0
                    }
                },
                {
                    name: "访客数(UV)",
                    displayName: "访客数(UV)",
                    field: "uv",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "访问次数",
                    displayName: "访问次数",
                    field: "vc",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "IP数",
                    displayName: "IP数",
                    field: "ip",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "转化次数",
                    displayName: "转化次数",
                    field: "conversions",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "转化率",
                    displayName: "转化率",
                    field: "crate",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                }
            ];

            $rootScope.subGridArray = [
                {
                    name: "xl",
                    displayName: "",
                    cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                    maxWidth: 10,
                    enableSorting: false
                },
                {
                    name: "来源",
                    displayName: "来源",
                    field: "campaignName",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                    enableSorting: false
                },
                {
                    name: "浏览量(PV)",
                    displayName: "浏览量(PV)",
                    field: "pv",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>",
                    sort: {
                        direction: uiGridConstants.ASC,
                        priority: 0
                    }
                },
                {
                    name: "访客数(UV)",
                    displayName: "访客数(UV)",
                    field: "uv",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "访问次数",
                    displayName: "访问次数",
                    field: "vc",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "IP数",
                    displayName: "IP数",
                    field: "ip",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "转化次数",
                    displayName: "转化次数",
                    field: "conversions",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "转化率",
                    displayName: "转化率",
                    field: "crate",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                }
            ];

            $rootScope.tableSwitch = {
                latitude: {
                    name: "来源",
                    displayName: "来源",
                    field: "campaignName",
                    cellTemplate: "<div><a href='javascript:void(0)' style='color:#0965b8;line-height:30px' ng-click='grid.appScope.showPageSeDetail(grid.options.data,row)'>{{grid.appScope.getDataUrlInfo(grid, row,3)}}</a></div>",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                    enableSorting: false
                },
                tableFilter: null,
                dimen: false,
                number: 1,
                arrayClear: false, //是否清空指标array
                promotionSearch: {
                    turnOn: true, //是否开启推广中sem数据
                    SEMData: "campaign" //查询类型
                }
            };
            /*  $scope.isShowExpandable = function (e) {
             return true
             };*/
            $scope.searchIndicators = function (item, entities, number) {
                $rootScope.gridArray.shift();
                $rootScope.gridArray.shift();
                $rootScope.tableSwitch.number != 0 ? $scope.gridArray.shift() : "";
                $scope.searchGridObj = {};
                $scope.searchGridObjButton = {};
                var a = $rootScope.checkedArray.indexOf(item.name);
                if (a != -1) {
                    $rootScope.checkedArray.splice(a, 1);
                    $rootScope.gridArray.splice(a, 1);

                    if ($rootScope.tableSwitch.number != 0) {
                        $scope.searchGridObjButton["name"] = " ";
                        $scope.searchGridObjButton["cellTemplate"] = $scope.gridBtnDivObj;
                        $rootScope.gridArray.unshift($scope.searchGridObjButton);
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

                        $scope.searchGridObj["name"] = item.consumption_name;
                        $scope.searchGridObj["displayName"] = item.consumption_name;
                        $scope.searchGridObj["footerCellTemplate"] = "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>";
                        $scope.searchGridObj["field"] = item.name;

                        $rootScope.gridArray.push($scope.searchGridObj);

                        if ($rootScope.tableSwitch.number != 0) {
                            $scope.searchGridObjButton["name"] = " ";
                            $scope.searchGridObjButton["cellTemplate"] = $scope.gridBtnDivObj;
                            $rootScope.gridArray.unshift($scope.searchGridObjButton);
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

                        $scope.searchGridObj["name"] = item.consumption_name;
                        $scope.searchGridObj["displayName"] = item.consumption_name;
                        $scope.searchGridObj["footerCellTemplate"] = "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>";
                        $scope.searchGridObj["field"] = item.name;
                        $rootScope.gridArray.push($scope.searchGridObj);

                        if ($rootScope.tableSwitch.number != 0) {
                            $scope.searchGridObjButton["name"] = " ";
                            $scope.searchGridObjButton["cellTemplate"] = $scope.gridBtnDivObj;
                            $rootScope.gridArray.unshift($scope.searchGridObjButton);
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
            };
            $scope.selectedQuota = ["click", "impression"];
            $scope.onLegendClickListener = function (radio, chartInstance, config, checkedVal) {
                $scope.charts[0].config.legendDefaultChecked = [];
                var checkData = [];
                for (var k = 0; k < checkedVal.length; k++) {
                    for (var i = 0; i < $scope.queryOption_all.length; i++) {
                        if ($scope.queryOption_all[i] == checkedVal[k]) {
                            checkData.push(i)
                        }
                    }
                }
                $scope.charts[0].config.legendDefaultChecked = checkData;
                if (checkedVal.length) {
                    $scope.dataTable($scope.isCompared, "day", checkedVal, false);
                } else {
                    def.defData($scope.charts[0].config);
                }
            };
            $scope.queryOption_all = ["pv", "uv", "vc", "ip", "nuv", "nuvRate", "conversions", "crate", /*"avgCost",*/ "benefit", /* "profit",*/ "orderNum"/*, "orderMoney"*/, "orderNumRate"];
            $scope.charts = [
                {
                    config: {
                        legendId: "indicators_charts_legend",
                        legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "IP数", "新访客数", "新访客比率", "转化次数", "转化率", /*"平均转化成本(页面)",*/ "收益", /*"利润",*/ "订单数"/*, "订单金额"*/, "订单转化率"],//显示几种数据
                        legendClickListener: $scope.onLegendClickListener,
                        legendAllowCheckCount: 2,
                        legendDefaultChecked: [0, 1],
                        min_max: false,
                        bGap: true,
                        id: "indicators_charts",
                        chartType: "bar",//图表类型
                        keyFormat: 'eq',
                        noFormat: true,
                        auotHidex: true,
                        dataKey: "key",//传入数据的key值
                        dataValue: "quota"//传入数据的value值

                    },
                    types: ["pv", "vc"],
                    dimension: ["pm"],
                    interval: $rootScope.interval,
                    url: "/api/charts",
                    cb: $scope.pieFormat
                }
            ];
            $scope.$on("ssh_refresh_charts", function (e, msg) {
                $rootScope.initPageConfig();
            });
            //点击显示指标
            $scope.select = function () {
                $scope.visible = false;
            };
            $scope.clear = function () {
                $scope.page.selected = "";
                $scope.city.selected = "";
                $scope.country.selected = "";
                $scope.continent.selected = "";
            };
            //日历
            this.selectedDates = [new Date().setHours(0, 0, 0, 0)];
            $scope.$on("update", function (e, datas) {
                // 选择时间段后接收的事件
                datas.sort();
                var startTime = datas[0];
                var endTime = datas[datas.length - 1];
                $scope.startOffset = (startTime - today_start()) / 86400000;
                $scope.endOffset = (endTime - today_start()) / 86400000;
            });
            $rootScope.datepickerClick = function (start, end, label) {
                $scope.charts[0].config.legendDefaultChecked = [0, 1];
                var time = chartUtils.getTimeOffset(start, end);
                var offest = time[1] - time[0];
                $scope.reset();
                $rootScope.start = time[0];
                $rootScope.end = time[1];
                //时间段选择执行数据查询
                init_transformData();
            };
            $rootScope.datepickerClickTow = function (start, end, label) {
                $rootScope.gridOptions.showColumnFooter = !$rootScope.gridOptions.showColumnFooter;
                var gridArrayOld = angular.copy($rootScope.gridArray);
                var latitudeOld = angular.copy($rootScope.tableSwitch.latitude);
                $rootScope.gridArray.forEach(function (item, i) {
                    var a = item["field"];
                    if (item["cellTemplate"] == undefined) {
                        item["cellTemplate"] = "<ul class='contrastlist'><li>{{grid.appScope.getContrastInfo(grid, row,0,'" + a + "')}}</li><li>{{grid.appScope.getContrastInfo(grid, row,1,'" + a + "')}}</li><li>{{grid.appScope.getContrastInfo(grid, row,2,'" + a + "')}}</li><li>{{grid.appScope.getContrastInfo(grid, row,3,'" + a + "')}}</li></ul>";
                        item["footerCellTemplate"] = "<ul class='contrastlist'><li>{{grid.appScope.getCourFooterData(this,grid.getVisibleRows(),0)}}</li><li>{{grid.appScope.getCourFooterData(this,grid.getVisibleRows(),1)}}</li><li>{{grid.appScope.getCourFooterData(this,grid.getVisibleRows(),2)}}</li><li>{{grid.appScope.getCourFooterData(this,grid.getVisibleRows(),3)}}</li></ul>";
                    }
                });
                //getSearchFooterData
                $rootScope.gridOptions.rowHeight = 95;
                $rootScope.gridOptions.columnFooterHeight = 95;
                var time = chartUtils.getTimeOffset(start, end);
                var startTime = time[0];
                var endTime = time[0] + ($rootScope.tableTimeEnd - $rootScope.tableTimeStart);
                $rootScope.$broadcast("ssh_load_compare_datashow", startTime, endTime);
                var dateTime1 = chartUtils.getSetOffTime($rootScope.tableTimeStart, $rootScope.tableTimeEnd);
                var dateTime2 = chartUtils.getSetOffTime(startTime, endTime);
                $scope.targetDataContrast(null, null, function (item) {
                    var target = $rootScope.tableSwitch.latitude.field;
                    var dataArray = [];
                    var is = 1;
                    $scope.targetDataContrast(startTime, endTime, function (contrast) {
                        item.forEach(function (a, b) {
                            var dataObj = {};
                            for (var i = 0; i < contrast.length; i++) {
                                if (a[target] == contrast[i][target]) {
                                    $rootScope.checkedArray.forEach(function (tt, aa) {
                                        var bili = ((parseInt(a[tt] + "".replace("%")) - parseInt((contrast[i][tt] + "").replace("%"))) / (parseInt((contrast[i][tt] + "").replace("%")) == 0 ? parseInt(a[tt] + "".replace("%")) : parseInt((contrast[i][tt] + "").replace("%"))) * 100).toFixed(2);
                                        dataObj[tt] = (isNaN(bili) ? 0 : bili) + "%";
                                        a[tt] = "　" + "," + a[tt] + "," + contrast[i][tt] + "," + dataObj[tt]
                                    });
                                    a[target] = a[target] + "," + ($rootScope.startString != undefined ? $rootScope.startString : dateTime1[0] == dateTime1[1] ? dateTime1[0] + "," + dateTime2[0] + "," + "变化率" : dateTime1[0] + " 至 " + dateTime1[1]) + "," + (dateTime2[0] + " 至 " + dateTime2[1]) + "," + "变化率";

                                    dataArray.push(a);
                                    is = 0;
                                    return;
                                } else {
                                    is = 1
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
                        $rootScope.gridOptions.showColumnFooter = !$rootScope.gridOptions.showColumnFooter;
                    });
                    $rootScope.gridOptions.data = dataArray;
                    $rootScope.tableSwitch.latitude = latitudeOld;
                    $rootScope.gridArray = gridArrayOld;
                })
            };
            $scope.targetDataContrast = function (startInfoTime, endInfoTime, cabk) {
                $rootScope.gridOpArray = angular.copy($rootScope.gridArray);
                $rootScope.gridOptions.columnDefs = $rootScope.gridOpArray;
                if ($rootScope.tableSwitch.isJudge == undefined) $scope.isJudge = true;
                if ($rootScope.tableSwitch.isJudge) $rootScope.tableSwitch.tableFilter = undefined;
                var url = "/config/page_conv?type=search&query=" + JSON.stringify({
                        uid: $cookieStore.get("uid"),
                        site_id: $rootScope.siteId
                    });
                $http({
                    method: 'GET',
                    url: url
                }).success(function (dataConfig, status) {
                    if (dataConfig != undefined && dataConfig.length > 0) {
                        var turls = []
                        dataConfig.forEach(function (data) {
                            var urls = []
                            if (data.target_urls != undefined && data.target_urls.length > 0) {
                                data.target_urls.forEach(function (item) {
                                    urls.push(item.url)
                                })
                            }
                            turls.push({updateTime: data.update_time, page_urls: urls})
                        })
                        var tCheckedArray = ["pv", "uv", "vc", "ip", "nuv", "nuvRate"]
                        var pvurl = "/api/transform/getPageBasePVs?start=" + (startInfoTime == undefined || startInfoTime == null ? $rootScope.start : startInfoTime) + "&end=" + (endInfoTime == undefined || endInfoTime == null ? $rootScope.end : endInfoTime) + "&type=" + $rootScope.userType + "&queryOptions=" + tCheckedArray + "&pages=" + JSON.stringify(turls) + "&showType=day" + "&filters=" + $rootScope.getFilters()
                        $http.get(pvurl).success(function (pvdatas) {
                            var isPConv = false;
                            for (var index = 0; index < $rootScope.checkedArray.length; index++) {
                                isPConv = true;
                                $rootScope.bases.forEach(function (base) {
                                    if (base.name == $rootScope.checkedArray[index]) {
                                        isPConv = false
                                    }
                                })
                                if (isPConv)
                                    break;
                            }
                            var results = pvdatas

                            //查询转化的数据
                            var tPageInfoArr = ["conversions", "benefit"]
                            var pageurl = "/api/transform/getPageBaseInfo?start=" + (startInfoTime == undefined || startInfoTime == null ? $rootScope.start : startInfoTime) + "&end=" + (endInfoTime == undefined || endInfoTime == null ? $rootScope.end : endInfoTime) + "&type=" + $rootScope.userType + "&queryOptions=" + tPageInfoArr + "&pages=" + JSON.stringify(turls) + "&showType=day" + "&filters=" + $rootScope.getFilters()
                            $http.get(pageurl).success(function (pagedatas) {
                                results.forEach(function (data, index) {
                                    $rootScope.checkedArray.forEach(function (attr) {
                                        switch (attr) {
                                            case "conversions"://转化次数
                                                data["conversions"] = pagedatas[data.campaignName] != undefined && pagedatas[data.campaignName].conversions != undefined ? pagedatas[data.campaignName].conversions.value : 0
                                                break;
                                            case "crate"://转化率
                                                data["crate"] = (pagedatas[data.campaignName] != undefined && data.vc > 0 ? ((Number(pagedatas[data.campaignName]["conversions"].value) / Number(data.vc)) * 100).toFixed(2) : (0).toFixed(2)) + "%"
                                                break;
                                            //case"avgCost"://平均转化成本
                                            //    $http.get(SEM_API_URL + "/sem/report/account?a=" + $rootScope.user + "&b=" + $rootScope.baiduAccount + "&startOffset=" + $rootScope.start + "&endOffset=" + $rootScope.end).success(function (SEMDdatas) {
                                            //        if(SEMDdatas==null){
                                            //
                                            //        }
                                            //    });
                                            //    break;
                                            case "benefit"://收益
                                                data["benefit"] = pagedatas[data.campaignName] != undefined && pagedatas[data.campaignName].benefit != undefined ? pagedatas[data.campaignName].benefit.value : 0
                                                break;
                                            case "orderNum"://订单数量
                                                data["orderNum"] = pagedatas[data.campaignName] != undefined && pagedatas[data.campaignName].orderNum != undefined ? pagedatas[data.campaignName].orderNum.value : 0
                                                break;
                                            case "orderNumRate"://订单转化率
                                                data["orderNumRate"] = (pagedatas[data.campaignName] != undefined && pagedatas[data.campaignName].orderNum != undefined && data.vc > 0 ? ((Number(pagedatas[data.campaignName].orderNum.value) / Number(data.vc)) * 100).toFixed(2) : (0).toFixed(2)) + "%"
                                                break;
                                            default :
                                                break;
                                        }
                                    })
                                })
                                cabk(results)
                            })
                        })
                    }
                });
            }

            $scope.getCourFooterData = function (a, option, number) {
                var rast = [0.0, 0.0];
                var rastString = ["", ""];
                var bhlString = "";
                option.forEach(function (items, x) {
                    var itemSplDatas = (items.entity[a.col.field] + "").split(",");
                    if (itemSplDatas[3] == "变化率") {
                        rastString[0] = itemSplDatas[1];
                        rastString[1] = itemSplDatas[2];
                        bhlString = "变化率";
                    } else {
                        rast[0] += ((itemSplDatas[1] + "").replace("%", "") == "--" || (itemSplDatas[1] + "").replace("%", "") == "　" ? 0.0 : parseFloat(((itemSplDatas[1] + "").replace("%", ""))));
                        rast[1] += ((itemSplDatas[2] + "").replace("%", "") == "--" || (itemSplDatas[2] + "").replace("%", "") == "　" ? 0.0 : parseFloat(((itemSplDatas[2] + "").replace("%", ""))));
                    }
                });
                var str
                if (a.renderIndex == 1) {
                    str = "当页汇总";
                } else {
                    str = " ";
                }
                if (a.col.field == "pv" || a.col.field == "uv" || a.col.field == "ip" || a.col.field == "vc" || a.col.field == "nuv") {
                    //
                } else {
                    rast[0] = ((rast[0] / option.length) * 100).toFixed(2) + (a.col.field == "outRate" || a.col.field == "nuvRate" || a.col.field == "arrivedRate" ? "%" : "");
                    rast[1] = ((rast[0] / option.length) * 100).toFixed(2) + (a.col.field == "outRate" || a.col.field == "nuvRate" || a.col.field == "arrivedRate" ? "%" : "");
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
            //刷新
            $scope.page_refresh = function () {
                $rootScope.start = 0;
                $rootScope.end = 0;
                $rootScope.tableTimeStart = 0;//开始时间
                $rootScope.tableTimeEnd = 0;//结束时间、
                $scope.reloadByCalendar("today");
                $('#reportrange span').html(GetDateStr(-1));
                //其他页面表格
                //classcurrent
                $scope.reset();
                $scope.todayClass = true;
            };
            $scope.setShowArray = function () {
                var tempArray = [];
                angular.forEach($scope.checkedArray, function (q_r) {
                    tempArray.push({"label": q_r, "value": 0, "cValue": 0, "count": 0, "cCount": 0});
                });
                $scope.dateShowArray = $rootScope.copy(tempArray);
            };
            $scope.setShowArray();
            $scope.setAreaFilterTran = function (area) {
                $scope.areaSearch = area == "全部" ? "" : area;
                if (area == "北京" || area == "上海" || area == "广州") {
                    if ($scope.city.selected != undefined) {
                        $scope.city.selected.name = area;
                    } else {
                        $scope.city.selected = {};
                        $scope.city.selected["name"] = area;
                    }
                }
            };
            $scope.advancedQuery = function () {
                //设备过滤样式初始化
                var input_terminal_Array = $(".chart_top2 .terminal_class");
                input_terminal_Array.each(function (i, o) {
                    $(o).prev("span").css("background-position", "0px 0px");
                    $(o).prop("checked", false);
                });
                $(input_terminal_Array[0]).prev("span").css("background-position", "0px -51px");
                $(".chart_top2 .terminal:eq(" + 0 + ")").prop("checked", true);
                //访客过滤样式初始化
                var input_uv_Array = $(".chart_top2 .uv_class");
                input_uv_Array.each(function (i, o) {
                    $(o).prev("span").css("background-position", "0px 0px");
                    $(o).prop("checked", false);
                });
                $(input_uv_Array[0]).prev("span").css("background-position", "0px -51px");
                $(".chart_top2 .uv_class:eq(" + 0 + ")").prop("checked", true);
                //地狱过滤样式数据初始化
                $scope.city.selected = "";
            };


            $rootScope.pageConfigs = [];
            $rootScope.initPageConfig = function () {

                var url = "/config/page_conv?type=search&query=" + JSON.stringify({
                        uid: $cookieStore.get("uid"),
                        site_id: $rootScope.siteId
                    });
                $http({
                    method: 'GET',
                    url: url
                }).success(function (dataConfig, status) {
                    if (dataConfig != undefined && dataConfig.length > 0) {
                        $rootScope.selectedPageConvIndex=0
                        $rootScope.extendways = [{index:0,name:"全部页面转化目标"}]
                        $rootScope.pageConfigs = [];
                        dataConfig.forEach(function (data, i) {
                            var urls = []
                            if (data.target_urls != undefined && data.target_urls.length > 0) {
                                data.target_urls.forEach(function (item) {
                                    urls.push(item.url)
                                })
                            }
                            $rootScope.extendways.push({index: i + 1, name: data.target_name})
                            $rootScope.pageConfigs.push({
                                targetName: data.target_name,
                                updateTime: data.update_time,
                                page_urls: urls
                            })
                        })
                        $rootScope.refreshData("")
                    }
                })
            }
            $rootScope.refreshData = function (selectedPageConv) {
                if ($rootScope.pageConfigs != undefined && $rootScope.pageConfigs.length > 0) {
                    var filterPageConf = []
                    if (selectedPageConv == undefined || selectedPageConv == "") {
                        filterPageConf = $rootScope.pageConfigs
                    } else {
                        $rootScope.pageConfigs.forEach(function (conf) {
                            if (conf.targetName == selectedPageConv) {
                                filterPageConf.push(conf)
                            }
                        })
                    }
                    if (filterPageConf.length > 0) {
                        var tCheckedArray = ["pv", "uv", "vc", "ip", "nuv", "nuvRate"];
                        var pvurl = "/api/transform/getPageBasePVs?start=" + $rootScope.start + "&end=" + $rootScope.end + "&type=" + $rootScope.userType + "&queryOptions=" + tCheckedArray + "&pages=" + JSON.stringify(filterPageConf) + "&showType=day" + "&filters=" + $rootScope.getFilters()
                        $http.get(pvurl).success(function (pvdatas) {
                            var isPConv = false;
                            for (var index = 0; index < $rootScope.checkedArray.length; index++) {
                                isPConv = true;
                                $rootScope.bases.forEach(function (base) {
                                    if (base.name == $rootScope.checkedArray[index]) {
                                        isPConv = false
                                    }
                                })
                                if (isPConv)
                                    break;
                            }
                            $rootScope.gridOptions.data = pvdatas
                            if (isPConv) {
                                //查询转化的数据
                                var tPageInfoArr = ["conversions", "benefit"]
                                var pageurl = "/api/transform/getPageBaseInfo?start=" + $rootScope.start + "&end=" + $rootScope.end + "&type=" + $rootScope.userType + "&queryOptions=" + tPageInfoArr + "&pages=" + JSON.stringify(filterPageConf) + "&showType=day" + "&filters=" + $rootScope.getFilters()
                                $http.get(pageurl).success(function (pagedatas) {
                                    var sumCrate = 0
                                    $rootScope.gridOptions.data.forEach(function (data, index) {
                                        $rootScope.checkedArray.forEach(function (attr) {
                                            switch (attr) {
                                                case "conversions"://转化次数
                                                    data["conversions"] = pagedatas[data.campaignName] != undefined && pagedatas[data.campaignName].conversions != undefined ? pagedatas[data.campaignName].conversions.value : 0
                                                    break;
                                                case "crate"://转化率
                                                    var tCrate = pagedatas[data.campaignName] != undefined && data.vc > 0 ? ((Number(pagedatas[data.campaignName]["conversions"].value) / Number(data.vc)) * 100) : 0
                                                    sumCrate += tCrate
                                                    data["crate"] = tCrate.toFixed(2) + "%";
                                                    break;
                                                case "benefit"://收益
                                                    data["benefit"] = pagedatas[data.campaignName] != undefined && pagedatas[data.campaignName].benefit != undefined ? pagedatas[data.campaignName].benefit.value : 0
                                                    break;
                                                case "orderNum"://订单数量
                                                    data["orderNum"] = pagedatas[data.campaignName] != undefined && pagedatas[data.campaignName].orderNum != undefined ? pagedatas[data.campaignName].orderNum.value : 0
                                                    break;
                                                case "orderNumRate"://订单转化率
                                                    data["orderNumRate"] = (pagedatas[data.campaignName] != undefined && pagedatas[data.campaignName].orderNum != undefined && data.vc > 0 ? ((Number(pagedatas[data.campaignName].orderNum.value) / Number(data.vc)) * 100).toFixed(2) : (0).toFixed(2)) + "%"
                                                    break;
                                                default :
                                                    break;
                                            }
                                        })
                                    })
                                    $rootScope.gridData = $rootScope.gridOptions.data
                                    //概况
                                    $scope.setShowArray();
                                    var sumNuv = 0, sumUv = 0, sumPv = 0, sumConv = 0, sumOrder = 0
                                    $rootScope.gridOptions.data.forEach(function (data, index) {
                                        sumPv += data["pv"] == undefined ? 0 : data["pv"]
                                        $scope.dateShowArray.forEach(function (attr) {
                                            if (data[attr.label] != undefined) {
                                                if (attr.label == "crate") {
                                                    //attr.value = sumCrate.toFixed(2) + "%"
                                                    sumConv += data["conversions"] == undefined ? 0 : data["conversions"]
                                                    if (index == ($rootScope.gridOptions.data.length - 1)) {
                                                        attr.value = sumPv > 0 ? (((sumConv / sumPv) * 100).toFixed(2) + "%") : "0.00%"
                                                    }
                                                } else if (attr.label == "nuvRate") {
                                                    sumNuv += data["nuv"] == undefined ? 0 : data["nuv"]
                                                    sumUv += data["uv"] == undefined ? 0 : data["uv"]
                                                    //if(index==($rootScope.gridOptions.data.length-1)){
                                                    attr.value = sumUv > 0 ? (((sumNuv / sumUv) * 100).toFixed(2) + "%") : "0.00%"
                                                    //}
                                                } else if (attr.label == "orderNumRate") {
                                                    sumOrder += data["orderNum"] == undefined ? 0 : data["orderNum"]
                                                    //if(index==($rootScope.gridOptions.data.length-1)){
                                                    attr.value = sumPv > 0 ? (((sumOrder / sumPv) * 100).toFixed(2) + "%") : "0.00%"
                                                    //}
                                                }
                                                else {
                                                    attr.value += data[attr.label]
                                                }
                                            }
                                        })
                                    })
                                    //刷新图表
                                    $scope.charts[0].config.legendDefaultChecked = [0, 1];
                                    $scope.charts[0].config.legendAllowCheckCount = 2;
                                    $scope.DateNumbertwo = true;
                                    $scope.DateLoading = true;
                                    $scope.DateNumber = true;
                                    $scope.DateLoading = true;
                                    $scope.dataTable(true, "day", ["pv", "uv"], false);
                                })
                            }
                            else {
                                $rootScope.gridOptions.data.forEach(function (data) {
                                    $scope.dateShowArray.forEach(function (attr) {
                                        if (data[attr.label] != undefined) {
                                            if (attr.label == "crate") {
                                                attr.value = Number(data[attr.label]) + Number(attr.value) + "%"
                                            } else {
                                                attr.value += data[attr.label]
                                            }
                                        }
                                    })
                                })
                                $scope.dataTable(true, "day", ["pv", "uv"], false);
                            }
                        })
                    }
                }
            };
            /**
             * @param isContrastTime　是否为对比数据
             * @param showType　显示横轴方式　有四种：hour小时为单位，显示一天24小时的数据；day天为单位，显示数天的数据，week周为单位，显示数周的数据；month月为单位，显示数月的数据
             * @param queryOption　查询条件指标　事件转化：指标："浏览量(pv)", "访客数(uv)", "转化次数(conversions)", "转化率(crate)", "平均转化成本(transformCost)"
             */
            $scope.dataTable = function (isContrastTime, showType, queryOptions, renderLegend) {
                var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
                util.renderLegend(chart, $scope.charts[0].config);
                var barDatas = []
                var temConvs = []
                queryOptions.forEach(function (option, oindex) {
                    barDatas.push({
                        label: chartUtils.convertChinese(option),
                        key: [],
                        option: option,
                        quota: [],
                    })
                })
                $rootScope.gridData.forEach(function (gdata, dindex) {
                    if (gdata.conversions != undefined) {
                        if (temConvs.length < 10) {
                            barDatas.forEach(function (bdata, oindex) {
                                bdata.key.push(gdata.campaignName)
                                if (bdata.option == "crate" || bdata.option == "nuvRate" || bdata.option == "orderNumRate") {
                                    bdata.quota.push((gdata[bdata.option] == undefined ? 0 : Number((gdata[bdata.option] + "").replace("%", ""))).toFixed(2))
                                } else {
                                    bdata.quota.push(gdata[bdata.option] == undefined ? 0 : gdata[bdata.option])
                                }
                            })
                            temConvs.push(gdata.conversions)
                        } else {
                            var minIndex = -1
                            var conversions = gdata.conversions
                            temConvs.forEach(function (convs, cindex) {
                                if (convs < conversions) {
                                    minIndex = cindex
                                }
                            })
                            if (minIndex > -1) {
                                barDatas.forEach(function (bdata, oindex) {
                                    bdata.key[minIndex] = gdata.campaignName
                                    if (bdata.option == "crate" || bdata.option == "nuvRate" || bdata.option == "orderNumRate") {
                                        bdata.quota[minIndex] = (gdata[bdata.option] == undefined ? 0 : Number((gdata[bdata.option] + "").replace("%", ""))).toFixed(2)
                                    } else {
                                        bdata.quota[minIndex] = gdata[bdata.option] == undefined ? 0 : gdata[bdata.option]
                                    }
                                })
                                temConvs[minIndex] = conversions
                            }
                        }
                    }
                })
                cf.renderChart(barDatas, $scope.charts[0].config);
                Custom.initCheckInfo();
            };


            $scope.targetSearchSpreadPage = function (isClicked) {
                $rootScope.expandInex = 1
                $scope.es_checkArray = ["pv", "uv", "vc", "ip", "nuv", "nuvRate", "conversions", "crate", "avgCost", "orderNum", "benefit", "profit", "orderNumRate"];
                $scope.sem_checkArray = ["avgCost", "benefit", "profit", "orderMoney"];
                $scope.es_checkedArray = [];
                $scope.sem_checkedArray = [];
                for (var i = 0; i < $rootScope.checkedArray.length; i++) {
                    for (var k = 0; k < $scope.es_checkArray.length; k++) {
                        if ($rootScope.checkedArray[i] == $scope.es_checkArray[k]) {
                            $scope.es_checkedArray.push($rootScope.checkedArray[i]);
                        }
                    }
                    for (var k = 0; k < $scope.sem_checkArray.length; k++) {
                        if ($rootScope.checkedArray[i] == $scope.sem_checkArray[k]) {
                            $scope.sem_checkedArray.push($rootScope.checkedArray[i]);
                        }
                    }
                }
                if (isClicked) {
                    $rootScope.initPageConfig("")
                    $scope.$broadcast("transformData_ui_grid", {
                        start: $rootScope.start,
                        end: $rootScope.end,
                        checkedArray: $scope.es_checkedArray,
                        sem_checkedArray: $scope.sem_checkedArray,
                        all_checked: $rootScope.checkedArray,
                        analysisAction: "pageConversion",
                        convert_url_all: $scope.convert_url_all
                    });
                } else {
                    //访客过滤数据获取
                    var input_uv_Array = $(".chart_top2 .uv_class");
                    input_uv_Array.each(function (i, o) {
                        if ($(o).prop("checked")) {
                            $scope.uv_selected = $(o).prop("value");
                        }
                    });
                    var input_terminal_Array = $(".chart_top2 .terminal_class");
                    input_terminal_Array.each(function (i, o) {
                        if ($(o).prop("checked")) {
                            $scope.terminal_selected = $(o).prop("value");
                        }
                    });
                    var checkedData = [];
                    if ($scope.terminal_selected != "全部") {
                        checkedData.push({
                            field: "terminal_type",
                            name: $scope.terminal_selected
                        });
                    } else {
                        checkedData.push({
                            field: "terminal_type",
                            name: "所有设备"
                        });
                    }
                    if ($scope.uv_selected != "全部") {
                        checkedData.push({
                            field: "uv_type",
                            name: $scope.uv_selected
                        });
                    } else {
                        checkedData.push({
                            field: "uv_type",
                            name: "所有访客"
                        });
                    }
                    if ($scope.city.selected != "") {
                        checkedData.push({
                            field: "city",
                            name: $scope.city.selected.name
                        });
                    } else {
                        checkedData.push({
                            field: "city",
                            name: "所有地域"
                        });
                    }
                    $scope.$broadcast("transformAdvancedData_ui_grid", {
                        start: $rootScope.start,
                        end: $rootScope.end,
                        checkedData: checkedData,
                        checkedArray: $scope.es_checkedArray,
                        sem_checkedArray: $scope.sem_checkedArray,
                        all_checked: $rootScope.checkedArray,
                        analysisAction: "pageConversion",
                        convert_url_all: $scope.convert_url_all
                    });
                }
            };

            $rootScope.getFilters = function () {
                var filters = []
                if ($rootScope.tableSwitch.terminalFilter != undefined && $rootScope.tableSwitch.terminalFilter != null) {
                    filters.push($rootScope.tableSwitch.terminalFilter)
                }
                if ($rootScope.tableSwitch.visitorFilter != undefined && $rootScope.tableSwitch.visitorFilter != null) {
                    filters.push($rootScope.tableSwitch.visitorFilter)
                }
                if ($rootScope.tableSwitch.areaFilter != undefined && $rootScope.tableSwitch.areaFilter != null) {
                    filters.push($rootScope.tableSwitch.areaFilter)
                }
                return JSON.stringify(filters)
            };

            $rootScope.choosePageConv = function (index, sname) {
                $rootScope.selectedPageConvIndex=index
                if ($rootScope.expandInex == undefined || $rootScope.expandInex == 1)
                    $rootScope.refreshData(index == 0 ? "" : sname)
                else
                    $rootScope.initPageSeDetail(index == 0 ? "" : sname)
            }

            // 配置邮件
            $rootScope.initMailData = function () {
                $http.get("api/saveMailConfig?rt=read&rule_url=" + $rootScope.mailUrl[17] + "").success(function (result) {
                    if (result) {
                        var ele = $("ul[name='sen_form']");
                        formUtils.rendererMailData(result, ele);
                    }
                });
            };

            $scope.sendConfig = function () {
                var formData = formUtils.vaildateSubmit($("ul[name='sen_form']"));
                var result = formUtils.validateEmail(formData.mail_address, formData);
                if (result.ec) {
                    alert(result.info);
                } else {
                    formData.rule_url = $rootScope.mailUrl[17];
                    formData.uid = $cookieStore.get('uid');
                    formData.site_id = $rootScope.siteId;
                    formData.type_id = $rootScope.userType;
                    formData.schedule_date = $scope.mytime.time.Format('hh:mm');
                    formData.result_data = angular.copy($rootScope.gridApi2.grid.options.data);
                    formData.result_head_data = angular.copy($rootScope.gridApi2.grid.options.columnDefs);
                    $http({
                        method: 'POST',
                        url: 'api/saveMailConfig',
                        headers: {
                            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                            'Content-type': 'text/csv; charset=utf-8'
                        },
                        data: {
                            data: formData
                        }
                    }).success(function (data, status, headers, config) {
                        var result = JSON.parse(eval("(" + data + ")").toString());
                        if (result.ok == 1) {
                            alert("操作成功!");
                            $http.get("/api/initSchedule");
                        } else {
                            alert("操作失败!");
                        }
                    });
                }
            };

            $scope.generateCSVData = function (_dataHead, _dataArray) {
                var _t_data_arr = [];
                _dataArray.forEach(function (_data_item, x) {
                    var _obj = {};
                    _dataHead.forEach(function (item, i) {
                        if (item.field != undefined) {
                            _obj[item.displayName] = _data_item[item.field];
                        }
                    });
                    _t_data_arr.push(_obj);
                });
                if (_t_data_arr.length == 0) {
                    var _obj = {};
                    _dataHead.forEach(function (item, i) {
                        if (item.field != undefined) {
                            _obj[item.displayName] = "--";
                        }
                    });
                    _t_data_arr.push(_obj);
                }
                return JSON.stringify(_t_data_arr);
            };

            $scope.generatePDFMakeData = function (cb) {
                var dataInfo = angular.copy($rootScope.gridApi2.grid.options.data);
                var dataHeadInfo = angular.copy($rootScope.gridApi2.grid.options.columnDefs);
                var _tableBody = [];
                var tableHeadObj = [];
                for (var i = 0; i < dataHeadInfo.length; i++) {
                    if (dataHeadInfo[i].field != undefined) {
                        tableHeadObj.push(dataHeadInfo[i].field);
                    }
                }
                _tableBody.push(tableHeadObj);
                for (var i = 0; i < dataInfo.length; i++) {
                    var _array = [];
                    for (var j = 0; j < dataHeadInfo.length; j++) {
                        if (dataHeadInfo[j].field != undefined) {
                            var _t = dataInfo[i][dataHeadInfo[j].field];
                            if (_t["text"]) {
                                _array.push(dataInfo[i][dataHeadInfo[j].field]["text"] + "");
                            } else {
                                _array.push(dataInfo[i][dataHeadInfo[j].field] + "");
                            }
                        }
                    }
                    _tableBody.push(_array);
                }
                var docDefinition = {
                    header: {
                        text: "Page transformation data report",
                        style: "header",
                        alignment: 'center'
                    },
                    content: [
                        {
                            table: {
                                headerRows: 1,
                                body: _tableBody
                            }
                        },
                        {text: '\nPower by www.best-ad.cn', style: 'header'}
                    ],
                    styles: {
                        header: {
                            fontSize: 20,
                            fontName: "标宋",
                            alignment: 'justify',
                            bold: true
                        }
                    }
                };
                cb(docDefinition);
            };
        }
    );
});
