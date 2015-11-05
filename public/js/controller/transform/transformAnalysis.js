/**
 * Created by perfection on 15-7-07.
 */
define(["./module"], function (ctrs) {
    "use strict";
    ctrs.controller('transformAnalysisctr', function ($scope, $rootScope, $q, requestService, areaService, $http, SEM_API_URL, uiGridConstants, $cookieStore) {
            $scope.allBrowsers = angular.copy($rootScope.browsers);
            $scope.city.selected = {"name": "全部"};
            $scope.todayClass = true;
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.tableFormat = null;
            $scope.send = true;//显示发送
            $scope.isCompared = false;

            //        高级搜索提示
            $scope.sourceSearch = "";
            $scope.visitorSearch = "";
            $scope.areaSearch = "";
            $scope.browserselect = true;
//        取消显示的高级搜索的条件
            $scope.removeSourceSearch = function (obj) {
                $scope.browserselect = true;
                $scope.souce.selected = {"name": "全部"};
                $scope.browser.selected = {"name": "全部"};
                $rootScope.$broadcast("loadAllSource");
                obj.sourceSearch = "";
                $rootScope.tableSwitch.seFilter = null
                $rootScope.tableSwitch.eginFilter = null
                $rootScope.refreshData(false)
            }
            $scope.removeVisitorSearch = function (obj) {
//                $rootScope.$broadcast("loadAllVisitor");
                var inputArray = $(".chart_top2 .styled");
                inputArray.each(function (i, o) {
                    $(o).prev("span").css("background-position", "0px 0px");
                    $(o).prop("checked", false);
                });
                $(inputArray[0]).prev("span").css("background-position", "0px -51px");
                obj.visitorSearch = "";
                $rootScope.tableSwitch.visitorFilter = null
                $rootScope.refreshData(false)
            }

            $scope.removeAreaSearch = function (obj) {
                $scope.city.selected = {"name": "全部"};
//                $rootScope.$broadcast("loadAllArea");
                obj.areaSearch = "";
                $rootScope.tableSwitch.areaFilter = null
                $rootScope.refreshData(false)
            }

            //sem
            $scope.es_checkArray = ["pv", "uv", "vc", "ip", "nuv", "nuvRate", "conversions", "crate", "transformCost", "clickTotal", "visitNum"];
            $scope.sem_checkArray = ["transformCost"];

            $rootScope.tableTimeStart = -1;//开始时间
            $rootScope.tableTimeEnd = -1;//结束时间、
            $rootScope.tableFormat = null;

            //配置默认指标
            $rootScope.checkedArray = ["pv", "uv", "ip", "clickTotal", "conversions", "crate"];
            $scope.getEventName = function (grid, row, index) {
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
                    name: "事件名称",
                    displayName: "事件名称",
                    field: "eventName",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                    maxWidth: 150
                },
                {
                    name: "页面URL",
                    displayName: "页面URL",
                    field: "loc",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>--</div>"
                },
                {
                    name: "浏览量(PV)",
                    displayName: "浏览量(PV)",
                    field: "pv",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getEventRootData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "访客数(UV)",
                    displayName: "访客数(UV)",
                    field: "uv",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getEventRootData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "IP数",
                    displayName: "IP数",
                    field: "ip",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getEventRootData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "事件点击总数",
                    displayName: "事件点击总数",
                    field: "clickTotal",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getEventRootData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "转化次数",
                    displayName: "转化次数",
                    field: "conversions",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getEventRootData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "转化率",
                    displayName: "转化率",
                    field: "crate",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getEventRootData(this,grid.getVisibleRows())}}</div>"
                }
            ];
            $rootScope.tableSwitch = {
                latitude: {name: "事件名称", displayName: "事件名称", field: "eventName"},
                tableFilter: null,
                dimen: false,
                number: 6,
                arrayClear: false, //是否清空指标array
                promotionSearch: {
                    turnOn: true, //是否开启推广中sem数据
                    SEMData: "campaign" //查询类型
                }
            };
            //$scope.searchIndicators = function (item, entities, number) {
            //    $rootScope.gridArray.shift();
            //    $rootScope.gridArray.shift();
            //    $rootScope.tableSwitch.number != 0 ? $scope.gridArray.shift() : "";
            //    $scope.searchGridObj = {};
            //    $scope.searchGridObjButton = {};
            //    var a = $rootScope.checkedArray.indexOf(item.name);
            //    if (a != -1) {
            //        $rootScope.checkedArray.splice(a, 1);
            //        $rootScope.gridArray.splice(a, 1);
            //
            //        if ($rootScope.tableSwitch.number != 0) {
            //            $scope.searchGridObjButton["name"] = " ";
            //            $scope.searchGridObjButton["cellTemplate"] = $scope.gridBtnDivObj;
            //            $rootScope.gridArray.unshift($scope.searchGridObjButton);
            //        }
            //        $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude);
            //        $scope.gridObjButton = {};
            //        $scope.gridObjButton["name"] = "xl";
            //        $scope.gridObjButton["displayName"] = "";
            //        $scope.gridObjButton["cellTemplate"] = "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>";
            //        $scope.gridObjButton["maxWidth"] = 10;
            //        $rootScope.gridArray.unshift($scope.gridObjButton);
            //    } else {
            //        if ($rootScope.checkedArray.length >= number) {
            //            $rootScope.checkedArray.shift();
            //            $rootScope.checkedArray.push(item.name);
            //            $rootScope.gridArray.shift();
            //
            //            $scope.searchGridObj["name"] = item.consumption_name;
            //            $scope.searchGridObj["displayName"] = item.consumption_name;
            //            $scope.searchGridObj["footerCellTemplate"] = "<div class='ui-grid-cell-contents'>{{grid.appScope.getEventRootData(this,grid.getVisibleRows())}}</div>";
            //            $scope.searchGridObj["field"] = item.name;
            //
            //            $rootScope.gridArray.push($scope.searchGridObj);
            //
            //            if ($rootScope.tableSwitch.number != 0) {
            //                $scope.searchGridObjButton["name"] = " ";
            //                $scope.searchGridObjButton["cellTemplate"] = $scope.gridBtnDivObj;
            //                $rootScope.gridArray.unshift($scope.searchGridObjButton);
            //            }
            //
            //            $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude);
            //            $scope.gridObjButton = {};
            //            $scope.gridObjButton["name"] = "xl";
            //            $scope.gridObjButton["displayName"] = "";
            //            $scope.gridObjButton["cellTemplate"] = "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>";
            //            $scope.gridObjButton["maxWidth"] = 10;
            //            $rootScope.gridArray.unshift($scope.gridObjButton);
            //        }
            //        else {
            //            $rootScope.checkedArray.push(item.name);
            //
            //            $scope.searchGridObj["name"] = item.consumption_name;
            //            $scope.searchGridObj["displayName"] = item.consumption_name;
            //            $scope.searchGridObj["footerCellTemplate"] = "<div class='ui-grid-cell-contents'>{{grid.appScope.getEventRootData(this,grid.getVisibleRows())}}</div>";
            //            $scope.searchGridObj["field"] = item.name;
            //            $rootScope.gridArray.push($scope.searchGridObj);
            //
            //            if ($rootScope.tableSwitch.number != 0) {
            //                $scope.searchGridObjButton["name"] = " ";
            //                $scope.searchGridObjButton["cellTemplate"] = $scope.gridBtnDivObj;
            //                $rootScope.gridArray.unshift($scope.searchGridObjButton);
            //            }
            //            $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude);
            //            $scope.gridObjButton = {};
            //            $scope.gridObjButton["name"] = "xl";
            //            $scope.gridObjButton["displayName"] = "";
            //            $scope.gridObjButton["cellTemplate"] = "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>";
            //            $scope.gridObjButton["maxWidth"] = 10;
            //            $rootScope.gridArray.unshift($scope.gridObjButton);
            //        }
            //    }
            //    angular.forEach(entities, function (subscription, index) {
            //        if (subscription.name == item.name) {
            //            $scope.classInfo = 'current';
            //        }
            //    });
            //};
            $scope.selectedQuota = ["click", "impression"];
            $scope.onLegendClickListener = function (radio, chartInstance, config, checkedVal) {
                $scope.charts[0].config.legendDefaultChecked = [];
                var checkData = [];
                for (var k = 0; k < checkedVal.length; k++) {
                    for (var i = 0; i < $scope.queryOption_all.length; i++) {
                        if ($scope.queryOption_all[i] == checkedVal[k]) {
                            checkData.push(i);
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
            $scope.queryOption_all = ["pv", "uv", "ip", "vc", "conversions", "crate", "transformCost", "clickTotal", "visitNum"];
            $scope.queryOptions = ["pv", "uv"];
            $scope.charts = [
                {
                    config: {
                        legendId: "indicators_charts_legend",
                        legendData: ["浏览量(PV)", "访客数(UV)", "IP数", "访问次数", "转化次数", "转化率", "平均转化成本(事件)","事件点击总数","唯一访客事件数"],//显示几种数据
                        //legendMultiData: $rootScope.lagerMulti,
                        legendAllowCheckCount: 2,
                        legendClickListener: $scope.onLegendClickListener,
                        legendDefaultChecked: [0, 1],
                        allShowChart: 4,
                        min_max: false,
                        bGap: true,
                        autoInput: 20,
                        //auotHidex: true,
                        id: "indicators_charts",
                        chartType: "bar",//图表类型
                        keyFormat: 'eq',
                        noFormat: true,
                        dataKey: "key",//传入数据的key值
                        dataValue: "quota"//传入数据的value值
                    }
                }
            ];
            $scope.advancedQuery = function () {
                //来源过滤样式初始化
                $scope.souce.selected = "";
                $scope.browser.selected = "";
                //访客过滤样式初始化
                var inputArray = $(".chart_top2 .styled");
                inputArray.each(function (i, o) {
                    $(o).prev("span").css("background-position", "0px 0px");
                    $(o).prop("checked", false);
                });
                $(inputArray[0]).prev("span").css("background-position", "0px -51px");
                $(".chart_top2 .styled:eq(" + 0 + ")").prop("checked", true);
                //地狱过滤样式数据初始化
                $scope.city.selected = "";
            };
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

            $scope.$on("ssh_refresh_charts", function (e, msg) {
                $scope.charts[0].config.legendDefaultChecked = [0, 1];
                $scope.refreshData(false);
                init_transformData();
            });
            //$scope.initMap();
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
                $rootScope.refreshData(false);
                init_transformData();
            };
            //$rootScope.datepickerClickTow = function (start, end, label) {
            //    var time = chartUtils.getTimeOffset(start, end);
            //    $scope.start = time[0];
            //    $scope.end = time[1];
            //    //$rootScope.refreshData(false);
            //    //init_transformData();
            //};
            function GetDateStr(AddDayCount) {
                var dd = new Date();
                dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
                var y = dd.getFullYear();
                var m = dd.getMonth() + 1;//获取当前月份的日期
                var d = dd.getDate();
                return y + "-" + m + "-" + d;
            }

            //刷新
            $scope.page_refresh = function () {
                $rootScope.start = 0;
                $rootScope.end = 0;
                $rootScope.tableTimeStart = 0;//开始时间
                $rootScope.tableTimeEnd = 0;//结束时间、
                $rootScope.tableFormat = null;
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


            $rootScope.getFilters = function () {
                var filters = []
                //////console.log( JSON.stringify($rootScope.tableSwitch.seFilter)+"  "+JSON.stringify($rootScope.tableSwitch.eginFilter)+"  "+ JSON.stringify($rootScope.tableSwitch.visitorFilter)+" " +JSON.stringify($rootScope.tableSwitch.areaFilter))
                if ($rootScope.tableSwitch.eginFilter != undefined && $rootScope.tableSwitch.eginFilter != null) {
                    filters.push($rootScope.tableSwitch.eginFilter)
                }
                if ($rootScope.tableSwitch.visitorFilter != undefined && $rootScope.tableSwitch.visitorFilter != null) {
                    filters.push($rootScope.tableSwitch.visitorFilter)
                }
                if ($rootScope.tableSwitch.areaFilter != undefined && $rootScope.tableSwitch.areaFilter != null && $rootScope.tableSwitch.areaFilter.length > 0) {
                    $rootScope.tableSwitch.areaFilter.forEach(function (area) {
                        filters.push(area)
                    })
                }
                if ($rootScope.tableSwitch.seFilter != undefined && $rootScope.tableSwitch.seFilter != null) {
                        filters.push($rootScope.tableSwitch.seFilter)
                }
                //console.log("过滤内容="+JSON.stringify(filters))
                return JSON.stringify(filters)
            }
            $rootScope.curEventConfs = [];
            $rootScope.curEventPVs = []
            $rootScope.curEventInfos = []

            $rootScope.refreshData = function (isContrastDataByTime) {//isContrastDataByTime 是否按时间对比
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
                            event_target: elem.event_target,
                        })
                    })
                    $rootScope.curEventConfs = eventParams;
                    var purl = "/api/transform/getEventPVs?start=" + $rootScope.start + "&end=" + $rootScope.end + "&type=" + $rootScope.userType + "&queryOptions=" + $scope.es_checkArray + "&events=" + JSON.stringify(eventParams) + "&showType=day" + "&filters=" + $rootScope.getFilters()
                    $http.get(purl).success(function (pvs) {
                        if (pvs != null || pvs != "") {//PV 信息若不存在 则事件信息认为一定不存在
                            $rootScope.curEventPVs = pvs
                            var esurl = "/api/transform/getConvEvents?start=" + $rootScope.start + "&end=" + $rootScope.end + "&type=" + $rootScope.userType + "&eventPages=" + JSON.stringify(eventParams) + "&showType=day" + "&filters=" + $rootScope.getFilters()
                            $http.get(esurl).success(function (eventInfos) {
                                $rootScope.curEventInfos = eventInfos
                                var results = [];
                                events.forEach(function (event, index) {
                                    var data = pvs[index]
                                    data["eventName"] = event.event_name
                                    data["eventId"] = event.event_id
                                    data["loc"] = event.event_page
                                    for (var i = 0; i < $scope.es_checkArray.length; i++) {
                                        if ($scope.es_checkArray[i] == "crate") {
                                            if (eventInfos[event.event_page + "_" + event.event_id] != undefined && Number(data["pv"]) != 0) {
                                                data["crate"] = (Number(eventInfos[event.event_page + "_" + event.event_id].convCount / Number(data["pv"])) * 100).toFixed(2) + "%";
                                            } else {
                                                data["crate"] = "0%";
                                            }
                                        } else if ($scope.es_checkArray[i] == "transformCost") {
                                            //var add_i = i;
                                            //var semRequest = "";
                                            //semRequest = $http.get(SEM_API_URL + "/sem/report/campaign?a=" + $rootScope.user + "&b=" + $rootScope.baiduAccount + "&startOffset=" + $rootScope.start + "&endOffset=" + $rootScope.end + "&q=cost");
                                            //$q.all([semRequest]).then(function (sem_data) {
                                            //    var cost = 0;
                                            //    for (var k = 0; k < sem_data.length; k++) {
                                            //        for (var c = 0; c < sem_data[k].data.length; c++) {
                                            //            cost += Number(sem_data[k].data[c].cost);
                                            //        }
                                            //    }
                                                data["transformCost"] = /*(cost / Number(data["transformCost"])).toFixed(2).toString()*/ + "0元";
                                            //});
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
                                    results.push(data)
                                })
                                $rootScope.gridData = results;
                                $rootScope.targetSearch(true)

                                //刷新概况信息
                                var hashloc = {}, maxvalues = {}
                                $scope.setShowArray();
                                var tempPv = 0;
                                var tempConv = 0;
                                events.forEach(function (event, index) {
                                    $scope.dateShowArray.forEach(function (item) {
                                        maxvalues[item.label] = maxvalues[item.label] == undefined ? pvs[index][item.label] : (maxvalues[item.label] > pvs[index][item.label] ? maxvalues[item.label] : pvs[index][item.label])
                                        if (item.label == "crate") {
                                        } else if (item.label == "transformCost") {
                                        } else if (item.label == "clickTotal") {
                                            item.value += eventInfos[event.event_page + "_" + event.event_id] != undefined ? eventInfos[event.event_page + "_" + event.event_id].eventCount : 0;

                                        } else if (item.label == "conversions") {
                                            if (eventInfos[event.event_page + "_" + event.event_id] != undefined) {
                                                item.value += eventInfos[event.event_page + "_" + event.event_id].convCount;
                                            }
                                        } else {
                                            item.value = hashloc[event.event_page] == undefined ? (pvs[index][item.label] + item.value) : (maxvalues[item.label] < pvs[index][item.label] ? (item.value + pvs[index][item.label] - maxvalues[item.label]) : item.value)
                                            if (item.label == "pv") {
                                                tempPv = item.value;
                                            }
                                        }
                                    })
                                    //计算全部的PV
                                    tempPv = hashloc[event.event_page] == undefined ? pvs[index]["pv"] : (maxvalues["pv"] < pvs[index]["pv"] ? (item.value + pvs[index]["pv"] - maxvalues["pv"]) : tempPv)
                                    //计算全部的转化次数
                                    if (eventInfos[event.event_page + "_" + event.event_id] != undefined) {
                                        tempConv += eventInfos[event.event_page + "_" + event.event_id].convCount;
                                    }
                                    if (!hashloc[event.event_page]) {
                                        hashloc[event.event_page] = true;
                                    }
                                })

                                $scope.dateShowArray.forEach(function (item) {
                                    if (item.label == "crate" && tempPv != 0) {
                                        item.value = Number(tempConv / tempPv).toFixed(4)*100+"%"
                                    }
                                })
                                //刷新图表
                                if (isContrastDataByTime) {
                                    $scope.DateNumbertwo = false;
                                    $scope.DateLoading = false;
                                    $scope.charts[0].config.legendDefaultChecked = [0];
                                    $scope.charts[0].config.legendAllowCheckCount = 1;
                                    $scope.dataTable(isContrastDataByTime, "day", ["pv"], true);
                                } else {
                                    $scope.charts[0].config.legendDefaultChecked = [0, 1];
                                    $scope.charts[0].config.legendAllowCheckCount = 2;
                                    $scope.dataTable(isContrastDataByTime, "day", ["pv", "uv"], false);
                                }
                                if (isContrastDataByTime) {
                                    $scope.DateNumbertwo = true;
                                    $scope.DateLoading = true;
                                }
                                $scope.DateNumber = true;
                                $scope.DateLoading = true;
                            })

                        }
                    });
                })

            };
            var aggs_time = function (start, end, contrast_start, contrast_end) {
                var aggs_start = Number(start) > Number(contrast_start) ? Number(contrast_start) : Number(start);
                var aggs_end = Number(end) > Number(contrast_end) ? Number(contrast_end) : Number(end);
                return {start: aggs_start, end: aggs_end};
            }
            /**
             * @param isContrastTime　是否为对比数据
             * @param showType　显示横轴方式　有四种：hour小时为单位，显示一天24小时的数据；day天为单位，显示数天的数据，week周为单位，显示数周的数据；month月为单位，显示数月的数据
             * @param queryOption　查询条件指标　事件转化：指标："浏览量(pv)", "访客数(uv)", "转化次数(conversions)", "转化率(crate)", "平均转化成本(transformCost)"
             */
            $scope.dataTable = function (isContrastTime, showType, queryOptions, renderLegend) {
                var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
                util.renderLegend(chart, $scope.charts[0].config);
                var barDatas =   []
                var temConvs=[]
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
                                bdata.key.push(gdata.eventName)
                                if(bdata.option=="crate"){
                                    bdata.quota.push(gdata[bdata.option]==undefined?0:Number(gdata[bdata.option].replace("%","")))
                                }else{
                                    bdata.quota.push(gdata[bdata.option]==undefined?0:gdata[bdata.option])
                                }

                            })
                            temConvs.push(gdata.conversions)
                        } else {
                            var minIndex = -1
                            var conversions = gdata.conversions
                            temConvs.forEach(function(convs,cindex){
                                if(convs<conversions){
                                    minIndex=cindex
                                }
                            })
                            if(minIndex>-1){
                                barDatas.forEach(function (bdata, oindex) {
                                    bdata.key[minIndex]=gdata.eventName
                                    if(bdata.option=="crate"){
                                        bdata.quota[minIndex]=gdata[bdata.option]==undefined?0:Number(gdata[bdata.option].replace("%",""))
                                    }else{
                                        bdata.quota[minIndex]=gdata[bdata.option]==undefined?0:gdata[bdata.option]
                                    }
                                })
                                temConvs[minIndex]=conversions
                            }
                        }
                    }
                    ////console.log(barDatas)
                })
                cf.renderChart(barDatas, $scope.charts[0].config);
                Custom.initCheckInfo();
            };
            $scope.targetSearchSpreadTransform = function (isClicked) {
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
                if (isClicked) {
                    init_transformData()
                    $scope.setShowArray();
                    $rootScope.refreshData(false);
                    //$scope.$broadcast("transformData_ui_grid", {
                    //    start: $rootScope.start,
                    //    end: $rootScope.end,
                    //    checkedArray: $scope.es_checkedArray,
                    //    sem_checkedArray: $scope.sem_checkedArray,
                    //    all_checked: $rootScope.checkedArray,
                    //    analysisAction: "event",
                    //    convert_url_all: $scope.convert_url_all
                    //});
                }
                else {
                    //访客过滤数据获取
                    var inputArray = $(".chart_top2 .styled");
                    inputArray.each(function (i, o) {
                        if ($(o).prop("checked")) {
                            $scope.uv_selected = $(o).prop("value");
                        }
                    });
                    var checkedData = [];
                    if (($scope.souce.selected == "" && $scope.browser.selected == "") || ($scope.souce.selected.name == "全部" && $scope.browser.selected.name == "全部")) {
                        checkedData.push({
                            field: "all_rf",
                            name: "所有来源"
                        });
                    }
                    if ($scope.souce.selected != "") {
                        if ($scope.souce.selected.name != "全部") {
                            checkedData.push({
                                field: "souce",
                                name: $scope.souce.selected.name
                            });
                        }
                    }
                    if ($scope.browser.selected != "") {
                        if ($scope.browser.selected.name != "全部") {
                            checkedData.push({
                                field: "browser",
                                name: $scope.browser.selected.name
                            });
                        }
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
                        analysisAction: "event",
                        convert_url_all: $scope.convert_url_all
                    });
                }
                //$scope.setShowArray();
                //////console.log($scope.city)
                //////console.log($scope.souce)
                //////console.log($scope.visitNum)
                //$rootScope.refreshData(true);
            };

            init_transformData();
            $rootScope.refreshData(false);

            // 配置邮件
            $rootScope.initMailData = function () {
                $http.get("api/saveMailConfig?rt=read&rule_url=" + $rootScope.mailUrl[13] + "").success(function (result) {
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
                    formData.rule_url = $rootScope.mailUrl[13];
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
                        text: "Event transformation data report",
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
