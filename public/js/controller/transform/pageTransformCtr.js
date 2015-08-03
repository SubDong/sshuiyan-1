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
            $scope.getRedisConvertData_url = function () {
                var uid = $cookieStore.get("uid");
                $http({
                    method: "GET",
                    url: "/config/page_conv?type=search&query=" + JSON.stringify({uid: uid})
                }).success(function (data) {
                    var url_convert_info = [];
                    for (var i = 0; i < data.length; i++) {
                        var all_urls = []
                        for (var k = 0; k < data[i].target_urls.length; k++) {//获取目标路径
                            all_urls.push(data[i].target_urls[k].url);
                        }
                        for (var k = 0; k < data[i].paths.length; k++) {//以转化路线分组获取url
                            for (var c = 0; c < data[i].paths[k].steps.length; c++) {//获取步骤路径
                                for (var l = 0; l < data[i].paths[k].steps[c].step_urls.length; l++) {
                                    all_urls.push(data[i].paths[k].steps[c].step_urls[l].url);
                                }
                            }
                        }
                        url_convert_info.push({
                            pathName: data[i].target_name,
                            all_urls: all_urls
                        });
                    }
                    $scope.convert_url_all = url_convert_info;
                });
            };
            $scope.getRedisConvertData_url();
            //自定义指标显示
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
                {consumption_name: '平均转化成本(页面)', name: 'avgCost'},
                {consumption_name: '收益', name: 'benefit'},
                {consumption_name: '利润', name: 'profit'}
            ];
            $scope.order = [
                {consumption_name: "订单数", name: "orderNum"},
                {consumption_name: "订单金额", name: "orderMoney"},
                {consumption_name: "订单转化率", name: "orderNumRate"}
            ];
            $scope.es_checkArray = ["pv", "uv", "vc", "ip", "nuv", "nuvRate", "conversions", "crate", "avgCost", "orderNum", "benefit", "profit", "orderNumRate"];
            $scope.sem_checkArray = ["avgCost", "profit", "orderMoney"];
            //配置默认指标
            $rootScope.checkedArray = ["pv", "uv", "ip", "conversions", "vc", "crate"];
            $rootScope.searchGridArray = [
                {
                    name: "xl",
                    displayName: "",
                    cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                    maxWidth: 10,
                    enableSorting: false
                },
                {
                    name: "页面转化目标名称",
                    displayName: "页面转化目标名称",
                    field: "campaignName",
                    cellTemplate: "<div><a href='javascript:void(0)' style='color:#0965b8;line-height:30px' ng-click='grid.appScope.getHistoricalTrend(this)'>{{grid.appScope.getDataUrlInfo(grid, row,3)}}</a></div>"
                    , footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
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
                    name: "访问次数",
                    displayName: "访问次数",
                    field: "vc",
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
                latitude: {name: "页面转化目标", displayName: "页面转化目标", field: "campaignName"},
                tableFilter: null,
                dimen: false,
                arrayClear: false, //是否清空指标array
                promotionSearch: {
                    turnOn: true, //是否开启推广中sem数据
                    SEMData: "campaign" //查询类型
                }
            };
            $scope.searchIndicators = function (item, entities, number) {
                $rootScope.searchGridArray.shift();
                $rootScope.searchGridArray.shift();
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

            $scope.queryOption_all = ["pv", "uv", "vc", "nuv", "conversions", "crate", "avgCost", "benefit", "profit", "orderNum", "orderMoney", "orderNumRate"];
            $scope.charts = [
                {
                    config: {
                        legendId: "indicators_charts_legend",
                        legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "新访客数", "转化次数", "转化率", "平均转化成本(页面)", "收益", "利润", "订单数", "订单金额", "订单转化率"],//显示几种数据
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
            $scope.$on("ssh_refresh_charts", function (e, msg) {
                $scope.page_init(false);
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
                $scope.page_init(false);
            };
            $rootScope.datepickerClickTow = function (start, end, label) {
                var time = chartUtils.getTimeOffset(start, end);
                $scope.start = time[0];
                $scope.end = time[1];
                $scope.page_init(true);
            };
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
            var page_crate = function (isContrastDataByTime, start, end, data, all_urls_data) {
                if ($scope.sem_checkedArray.length != 0) {
                    var semRequest = "";
                    semRequest = $http.get(SEM_API_URL + "/sem/report/campaign?a=" + $rootScope.user + "&b=" + $rootScope.baiduAccount + "&startOffset=" + start + "&endOffset=" + end + "&q=cost");
                    $q.all([semRequest]).then(function (sem_data) {
                        var cost = 0;
                        var k = 0;
                        for (k = 0; k < sem_data.length; k++) {
                            for (var c = 0; c < sem_data[k].data.length; c++) {
                                cost += Number(sem_data[k].data[c].cost);
                            }
                        }
                        $scope.dateShowArray.forEach(function (checked, index) {
                            switch ($scope.dateShowArray[index].label) {
                                case "avgCost":
                                    for (var key in data) {
                                        if ("avgCost" == key) {
                                            if (isContrastDataByTime) {
                                                if (Number(data["avgCost"] != 0)) {
                                                    $scope.dateShowArray[index].cValue = (cost / Number(data["avgCost"])).toFixed(2).toString();
                                                } else {
                                                    $scope.dateShowArray[index].cValue = "0";
                                                }
                                            } else {
                                                if (Number(data["avgCost"] != 0)) {
                                                    $scope.dateShowArray[index].value = (cost / Number(data["avgCost"])).toFixed(2).toString();
                                                } else {
                                                    $scope.dateShowArray[index].value = "0";
                                                }
                                            }
                                        }
                                    }
                                    break;
                                case "profit":
                                    for (var key in data) {
                                        if ("profit" == key) {
                                            if (isContrastDataByTime) {
                                                $scope.dateShowArray[index].cValue = (Number(data["profit"]) - cost);
                                            } else {
                                                $scope.dateShowArray[index].value = (Number(data["profit"]) - cost);
                                            }
                                        }
                                    }
                                    break;
                                case "crate":
                                    for (var key in data) {
                                        if ("crate" == key) {
                                            if (isContrastDataByTime) {
                                                $scope.dateShowArray[index].cValue = ((Number(data["crate"]) / Number(all_urls_data.crate_pv)) * 100).toFixed(2);
                                            } else {
                                                $scope.dateShowArray[index].value = ((Number(data["crate"]) / Number(all_urls_data.crate_pv)) * 100).toFixed(2);
                                            }
                                        }
                                    }
                                    break;
                                default :
                                    for (var key in data) {
                                        if ($scope.dateShowArray[index].label == key) {
                                            if (isContrastDataByTime) {
                                                $scope.dateShowArray[index].cValue = data[key];

                                            } else {
                                                $scope.dateShowArray[index].value = data[key];
                                            }
                                        }
                                    }
                                    break;
                            }
                        });

                    });
                } else {
                    for (var c = 0; c < $scope.dateShowArray.length; c++) {
                        for (var key in data) {
                            if ($scope.dateShowArray[c].label == key) {
                                if ("crate" == key) {
                                    if (isContrastDataByTime) {
                                        $scope.dateShowArray[c].cValue = ((Number(data["crate"]) / Number(all_urls_data.crate_pv)) * 100).toFixed(2) + "%";
                                    } else {
                                        $scope.dateShowArray[c].value = ((Number(data["crate"]) / Number(all_urls_data.crate_pv)) * 100).toFixed(2) + "%";
                                    }
                                } else {
                                    if (isContrastDataByTime) {
                                        $scope.dateShowArray[c].cValue = data[key];
                                    } else {
                                        $scope.dateShowArray[c].value = data[key];
                                    }
                                }
                            }
                        }
                    }
                }
            };
            $scope.page_init = function (isContrastDataByTime) {
                $scope.es_checkArray = ["pv", "uv", "vc", "ip", "nuv", "nuvRate", "conversions", "crate", "avgCost", "orderNum", "benefit", "profit", "orderNumRate"];
                $scope.sem_checkArray = ["avgCost", "profit", "orderMoney"];
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
                    all_checked: $rootScope.checkedArray
                });
                var start = 0;
                var end = 0;
                if (isContrastDataByTime) {
                    start = $scope.start;
                    end = $scope.end;
                    $scope.DateNumbertwo = false;
                    $scope.DateLoading = false;
                    $scope.charts[0].config.legendDefaultChecked = [0];
                    $scope.charts[0].config.legendAllowCheckCount = 1;
                    $scope.dataTable(isContrastDataByTime, "day", ["pv"], true);
                } else {
                    start = $rootScope.start;
                    end = $rootScope.end;
                    $scope.charts[0].config.legendDefaultChecked = [0, 1];
                    $scope.charts[0].config.legendAllowCheckCount = 2;
                    $scope.dataTable(isContrastDataByTime, "day", ["pv", "uv"]);
                }
                $scope.isCompared = isContrastDataByTime;
                $http.get("/api/transform/transformAnalysis?start=" + start + "&end=" + end + "&action=event&type=1&searchType=initAll&queryOptions=" + $scope.es_checkedArray).success(function (data) {
                        if (data != null || data != "") {
                            var hasCrate = false;
                            for (var i = 0; i < $scope.es_checkedArray.length; i++) {
                                if ($scope.es_checkedArray[i] == "crate") {
                                    hasCrate = true;
                                    break;
                                }
                            }
                            if (hasCrate) {//针对转化率做特殊处理
                                if ($scope.convert_url_all.length != 0) {
                                    var all_urls = [];
                                    for (var k = 0; k < $scope.convert_url_all.length; k++) {
                                        for (var c = 0; c < $scope.convert_url_all[k].all_urls.length; c++) {
                                            if ($scope.convert_url_all[k].all_urls[c].split("/").length != 0) {
                                                all_urls.push("http://" + $scope.convert_url_all[k].all_urls[c]);
                                            } else {
                                                all_urls.push("http://" + $scope.convert_url_all[k].all_urls[c] + "/");
                                            }
                                        }
                                    }
                                    var test_url = ["http://www.farmer.com.cn/", "http://182.92.227.23:8080/login?url=localhost:8000"];
                                    $http({
                                        method: "GET",
                                        url: "/api/transform/transformAnalysis?start=" + start + "&end=" + end + "&action=event&type=1&searchType=queryDataByUrl&showType=total&all_urls=" + test_url
                                    }).success(function (all_urls_data) {
                                            page_crate(isContrastDataByTime, start, end, data, all_urls_data[0]);
                                        }
                                    );
                                }
                                else {
                                    $scope.getRedisConvertData_url();
                                    $http({
                                        method: "GET",
                                        url: "/api/transform/transformAnalysis?start=" + start + "&end=" + end + "&action=event&type=1&searchType=queryDataByUrl&showType=total&all_urls=" + test_url
                                    }).success(function (all_urls_data) {
                                        page_crate(isContrastDataByTime, start, end, data, all_urls_data);
                                    });
                                }
                            } else {
                                if ($scope.sem_checkedArray.length != 0) {
                                    var semRequest = "";
                                    semRequest = $http.get(SEM_API_URL + "/sem/report/campaign?a=" + $rootScope.user + "&b=" + $rootScope.baiduAccount + "&startOffset=" + start + "&endOffset=" + end + "&q=cost");
                                    $q.all([semRequest]).then(function (sem_data) {
                                        var cost = 0;
                                        var k = 0;
                                        for (k = 0; k < sem_data.length; k++) {
                                            for (var c = 0; c < sem_data[k].data.length; c++) {
                                                cost += Number(sem_data[k].data[c].cost);
                                            }
                                        }
                                        $scope.dateShowArray.forEach(function (checked, index) {
                                            switch ($scope.dateShowArray[index].label) {
                                                case "avgCost":
                                                    for (var key in data) {
                                                        if ("avgCost" == key) {
                                                            if (isContrastDataByTime) {
                                                                if (Number(data["avgCost"] != 0)) {
                                                                    $scope.dateShowArray[index].cValue = (cost / Number(data["avgCost"])).toFixed(2).toString();
                                                                } else {
                                                                    $scope.dateShowArray[index].cValue = "0";
                                                                }
                                                            } else {
                                                                if (Number(data["avgCost"] != 0)) {
                                                                    $scope.dateShowArray[index].value = (cost / Number(data["avgCost"])).toFixed(2).toString();
                                                                } else {
                                                                    $scope.dateShowArray[index].value = "0";
                                                                }
                                                            }
                                                        }
                                                    }
                                                    break;
                                                case "profit":
                                                    for (var key in data) {
                                                        if ("profit" == key) {
                                                            if (isContrastDataByTime) {
                                                                $scope.dateShowArray[index].cValue = (Number(data["profit"]) - cost);
                                                            } else {
                                                                $scope.dateShowArray[index].value = (Number(data["profit"]) - cost);
                                                            }
                                                        }
                                                    }
                                                    break;
                                                default :
                                                    for (var key in data) {
                                                        if ($scope.dateShowArray[index].label == key) {
                                                            if (isContrastDataByTime) {
                                                                $scope.dateShowArray[index].cValue = data[key];

                                                            } else {
                                                                $scope.dateShowArray[index].value = data[key];
                                                            }
                                                        }
                                                    }
                                                    break;
                                            }
                                        });

                                    });
                                } else {
                                    for (var c = 0; c < $scope.dateShowArray.length; c++) {
                                        for (var key in data) {
                                            if ($scope.dateShowArray[c].label == key) {
                                                if (isContrastDataByTime) {
                                                    $scope.dateShowArray[c].cValue = data[key];
                                                } else {
                                                    $scope.dateShowArray[c].value = data[key];
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (isContrastDataByTime) {
                                $scope.DateNumbertwo = true;
                                $scope.DateLoading = true;
                            }
                            $scope.DateNumber = true;
                            $scope.DateLoading = true;
                        }

                    }
                )
                ;
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
                if (isContrastTime) {
                    var crate_time = aggs_time($rootScope.start, $rootScope.end, $scope.start, $scope.end);
                    $http.get("/api/transform/transformAnalysis?start=" + $rootScope.start + "&end=" + $rootScope.end + "&action=event&type=1&searchType=contrastData&showType=" + showType + "&queryOptions=" + queryOptions + "&contrastStart=" + $scope.start + "&contrastEnd=" + $scope.end).success(function (contrastData) {
                        var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
                        chart.showLoading({
                            text: "正在努力的读取数据中..."
                        });
                        $scope.charts[0].config.chartType = "line";
                        $scope.charts[0].config.bGap = true;
                        $scope.charts[0].config.instance = chart;
                        if (renderLegend)
                            util.renderLegend(chart, $scope.charts[0].config);
                        var hasSem = false;
                        for (var t = 0; t < queryOptions.length; t++) {
                            for (var k = 0; k < $scope.sem_checkArray.length; k++) {
                                if (queryOptions[t] == $scope.sem_checkArray[k]) {
                                    hasSem = true;
                                    break;
                                }
                            }
                        }
                        var hasCrate = false;
                        for (var i = 0; i < queryOptions.length; i++) {
                            if (queryOptions[i] == "crate") {
                                hasCrate = true;
                                break;
                            }
                        }
                        if (hasSem) {
                            if (hasCrate) {
                                if ($scope.convert_url_all.length != 0) {
                                    var all_urls = [];
                                    for (var k = 0; k < $scope.convert_url_all.length; k++) {
                                        for (var c = 0; c < $scope.convert_url_all[k].all_urls.length; c++) {
                                            if ($scope.convert_url_all[k].all_urls[c].split("/").length != 0) {
                                                all_urls.push("http://" + $scope.convert_url_all[k].all_urls[c]);
                                            } else {
                                                all_urls.push("http://" + $scope.convert_url_all[k].all_urls[c] + "/");
                                            }
                                        }
                                    }
                                    var test_url = ["http://www.farmer.com.cn/", "http://182.92.227.23:8080/login?url=localhost:8000"];
                                    $http({
                                        method: "GET",
                                        url: "/api/transform/transformAnalysis?start=" + crate_time.start + "&end=" + crate_time.end + "&action=event&type=1&searchType=queryDataByUrl&showType=day&all_urls=" + test_url
                                    }).success(function (all_urls_data) {
                                            var semRequest = "";
                                            semRequest = $http.get(SEM_API_URL + "/sem/report/campaign?a=" + $rootScope.user + "&b=" + $rootScope.baiduAccount + "&startOffset=" + $rootScope.start + "&endOffset=" + $rootScope.end + "&q=cost");
                                            $q.all([semRequest]).then(function (sem_data) {
                                                var cost = 0;
                                                for (var k = 0; k < sem_data.length; k++) {
                                                    for (var c = 0; c < sem_data[k].data.length; c++) {
                                                        cost += Number(sem_data[k].data[c].cost);
                                                    }
                                                }
                                                queryOptions.forEach(function (key) {
                                                    for (var i = 0; i < contrastData.length; i++) {
                                                        if (key == contrastData[i].label) {
                                                            var temporaryContrastData = [];
                                                            var l = 0;
                                                            switch (key) {
                                                                case "avgCost":
                                                                    for (l = 0; l < contrastData[i].quota.length; l++) {
                                                                        if (Number(contrastData[i].quota[l]) == 0) {
                                                                            temporaryContrastData.push(0);
                                                                        } else {
                                                                            temporaryContrastData.push((cost / Number(contrastData[i].quota[l])).toFixed(2));
                                                                        }
                                                                    }
                                                                    contrastData[i].quota = temporaryContrastData;
                                                                    break;
                                                                case "profit":
                                                                    for (l = 0; l < contrastData[i].quota.length; l++) {
                                                                        if (Number(contrastData[i].quota[l]) == 0) {
                                                                            temporaryContrastData.push(0);
                                                                        } else {
                                                                            temporaryContrastData.push((cost / Number(contrastData[i].quota[l])).toFixed(2));
                                                                        }
                                                                    }
                                                                    contrastData[i].quota = temporaryContrastData;
                                                                    break;
                                                                case "orderMoney"://订单金额
                                                                    break;
                                                                case "crate":
                                                                    for (l = 0; l < contrastData[i].quota.length; l++) {
                                                                        if (Number(contrastData[i].quota[l]) == 0) {
                                                                            temporaryContrastData.push(0);
                                                                        } else {
                                                                            for (var p = 0; p < all_urls_data.length; p++) {
                                                                                if (contrastData[i].key == all_urls_data[p].date_time) {
                                                                                    if (Number(all_urls_data[i].crate_pv) == 0) {
                                                                                        temporaryContrastData.push(0);
                                                                                    } else {
                                                                                        temporaryContrastData.push((Number(contrastData[i].quota[l]) / Number(all_urls_data[i].crate_pv)).toFixed(2));
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                    contrastData[i].quota = temporaryContrastData;
                                                                    break;
                                                            }

                                                        }
                                                    }
                                                });
                                                for (var i = 0; i < contrastData.length; i++) {
                                                    if (contrastData[i].label.toString().split("_").length > 1) {
                                                        var temporaryContrastData = [];
                                                        var l = 0;
                                                        switch (contrastData[i].label) {
                                                            case "avgCost_contrast":
                                                                for (l = 0; l < contrastData[i].quota.length; l++) {
                                                                    if (Number(contrastData[i].quota[l]) == 0) {
                                                                        temporaryContrastData.push(0);
                                                                    } else {
                                                                        temporaryContrastData.push((cost / Number(contrastData[i].quota[l])).toFixed(2));
                                                                    }
                                                                }
                                                                contrastData[i].quota = temporaryContrastData;
                                                                break;
                                                            case "profit_contrast":
                                                                for (l = 0; l < contrastData[i].quota.length; l++) {
                                                                    if (Number(contrastData[i].quota[l]) == 0) {
                                                                        temporaryContrastData.push(0);
                                                                    } else {
                                                                        temporaryContrastData.push((Number(contrastData[i].quota[l]) - cost).toFixed(2));
                                                                    }
                                                                }
                                                                contrastData[i].quota = temporaryContrastData;
                                                                break;
                                                            case "orderMoney_contrast"://订单金额对比数据
                                                                break;
                                                            case "crate_contrast":
                                                                for (l = 0; l < contrastData[i].quota.length; l++) {
                                                                    if (Number(contrastData[i].quota[l]) == 0) {
                                                                        temporaryContrastData.push(0);
                                                                    } else {
                                                                        for (var p = 0; p < all_urls_data.length; p++) {
                                                                            if (contrastData[i].key == all_urls_data[p].date_time) {
                                                                                if (Number(all_urls_data[p].crate_pv) == 0) {
                                                                                    temporaryContrastData.push(0);
                                                                                } else {
                                                                                    temporaryContrastData.push((Number(contrastData[i].quota[l]) / Number(all_urls_data[p].crate_pv)).toFixed(2));
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                break;
                                                        }
                                                        contrastData[i].label = "对比数据";
                                                    } else {
                                                        contrastData[i].label = chartUtils.convertChinese(contrastData[i].label);
                                                    }
                                                }
                                                cf.renderChart(contrastData, $scope.charts[0].config);
                                                Custom.initCheckInfo();
                                            });
                                        }
                                    );
                                }
                                else {
                                    $scope.getRedisConvertData_url();
                                    $http({
                                        method: "GET",
                                        url: "/api/transform/transformAnalysis?start=" + crate_time.start + "&end=" + crate_time.end + "&action=event&type=1&searchType=queryDataByUrl&showType=day&all_urls=" + test_url
                                    }).success(function (all_urls_data) {
                                        //page_crate(isContrastDataByTime, start, end, data, all_urls_data);
                                    });
                                }
                            } else {
                                var semRequest = "";
                                semRequest = $http.get(SEM_API_URL + "/sem/report/campaign?a=" + $rootScope.user + "&b=" + $rootScope.baiduAccount + "&startOffset=" + $rootScope.start + "&endOffset=" + $rootScope.end + "&q=cost");
                                $q.all([semRequest]).then(function (sem_data) {
                                    var cost = 0;
                                    for (var k = 0; k < sem_data.length; k++) {
                                        for (var c = 0; c < sem_data[k].data.length; c++) {
                                            cost += Number(sem_data[k].data[c].cost);
                                        }
                                    }
                                    $scope.sem_checkArray.forEach(function (key) {
                                        for (var i = 0; i < contrastData.length; i++) {
                                            if (key == contrastData[i].label) {
                                                var temporaryContrastData = [];
                                                var l = 0;
                                                switch (key) {
                                                    case "avgCost":
                                                        for (l = 0; l < contrastData[i].quota.length; l++) {
                                                            if (Number(contrastData[i].quota[l]) == 0) {
                                                                temporaryContrastData.push(0);
                                                            } else {
                                                                temporaryContrastData.push((cost / Number(contrastData[i].quota[l])).toFixed(2));
                                                            }
                                                        }
                                                        contrastData[i].quota = temporaryContrastData;
                                                        break;
                                                    case "profit":
                                                        for (l = 0; l < contrastData[i].quota.length; l++) {
                                                            if (Number(contrastData[i].quota[l]) == 0) {
                                                                temporaryContrastData.push(0);
                                                            } else {
                                                                temporaryContrastData.push((cost / Number(contrastData[i].quota[l])).toFixed(2));
                                                            }
                                                        }
                                                        contrastData[i].quota = temporaryContrastData;
                                                        break;
                                                    case "orderMoney"://订单金额
                                                        break;
                                                }

                                            }
                                        }
                                    });
                                    for (var i = 0; i < contrastData.length; i++) {
                                        if (contrastData[i].label.toString().split("_").length > 1) {
                                            var temporaryContrastData = [];
                                            var l = 0;
                                            switch (contrastData[i].label) {
                                                case "avgCost_contrast":
                                                    for (l = 0; l < contrastData[i].quota.length; l++) {
                                                        if (Number(contrastData[i].quota[l]) == 0) {
                                                            temporaryContrastData.push(0);
                                                        } else {
                                                            temporaryContrastData.push((cost / Number(contrastData[i].quota[l])).toFixed(2));
                                                        }
                                                    }
                                                    contrastData[i].quota = temporaryContrastData;
                                                    break;
                                                case "profit_contrast":
                                                    for (l = 0; l < contrastData[i].quota.length; l++) {
                                                        if (Number(contrastData[i].quota[l]) == 0) {
                                                            temporaryContrastData.push(0);
                                                        } else {
                                                            temporaryContrastData.push((Number(contrastData[i].quota[l]) - cost).toFixed(2));
                                                        }
                                                    }
                                                    contrastData[i].quota = temporaryContrastData;
                                                    break;
                                                case "orderMoney_contrast"://订单金额对比数据
                                                    break;
                                            }
                                            contrastData[i].label = "对比数据";
                                        } else {
                                            contrastData[i].label = chartUtils.convertChinese(contrastData[i].label);
                                        }
                                    }
                                    cf.renderChart(contrastData, $scope.charts[0].config);
                                    Custom.initCheckInfo();
                                });
                            }
                        } else {
                            if (hasCrate) {
                                var all_urls = [];
                                for (var k = 0; k < $scope.convert_url_all.length; k++) {
                                    for (var c = 0; c < $scope.convert_url_all[k].all_urls.length; c++) {
                                        if ($scope.convert_url_all[k].all_urls[c].split("/").length != 0) {
                                            all_urls.push("http://" + $scope.convert_url_all[k].all_urls[c]);
                                        } else {
                                            all_urls.push("http://" + $scope.convert_url_all[k].all_urls[c] + "/");
                                        }
                                    }
                                }
                                var test_url = ["http://www.farmer.com.cn/", "http://182.92.227.23:8080/login?url=localhost:8000"];
                                $http({
                                    method: "GET",
                                    url: "/api/transform/transformAnalysis?start=" + crate_time.start + "&end=" + crate_time.end + "&action=event&type=1&searchType=queryDataByUrl&showType=day&all_urls=" + test_url
                                }).success(function (all_urls_data) {
                                    var temporaryContrastData = [];
                                    for (var i = 0; i < contrastData.length; i++) {
                                        temporaryContrastData = [];
                                        switch (contrastData[i].label) {
                                            case "crate":
                                                for (var l = 0; l < contrastData[i].quota.length; l++) {
                                                    if (Number(contrastData[i].quota[l]) == 0) {
                                                        temporaryContrastData.push(0);
                                                    } else {
                                                        for (var p = 0; p < all_urls_data.length; p++) {
                                                            for (var t = 0; t < contrastData[i].key.length; t++) {
                                                                if (contrastData[i].key[t] == all_urls_data[p].date_time) {
                                                                    if (Number(all_urls_data[p].crate_pv) == 0) {
                                                                        temporaryContrastData.push(0);
                                                                    } else {
                                                                        temporaryContrastData.push((Number(contrastData[i].quota[l]) / Number(all_urls_data[p].crate_pv)));
                                                                    }
                                                                }
                                                            }

                                                        }
                                                    }
                                                }
                                                contrastData[i].quota = temporaryContrastData;
                                                break;
                                            case "crate_contrast":
                                                for (var l = 0; l < contrastData[i].quota.length; l++) {
                                                    if (Number(contrastData[i].quota[l]) == 0) {
                                                        temporaryContrastData.push(0);
                                                    } else {
                                                        for (var p = 0; p < all_urls_data.length; p++) {
                                                            for (var t = 0; t < contrastData[i].key.length; t++) {
                                                                if (contrastData[i].key[t] == all_urls_data[p].date_time) {
                                                                    if (Number(all_urls_data[p].crate_pv) == 0) {
                                                                        temporaryContrastData.push(0);
                                                                    } else {
                                                                        temporaryContrastData.push((Number(contrastData[i].quota[l]) / Number(all_urls_data[p].crate_pv)));
                                                                    }
                                                                }
                                                            }

                                                        }
                                                    }
                                                }
                                                contrastData[i].quota = temporaryContrastData;
                                                break;
                                        }
                                    }
                                    for (var i = 0; i < contrastData.length; i++) {
                                        if (contrastData[i].label.split("_").length > 1) {
                                            contrastData[i].label = "对比数据";
                                        } else {
                                            contrastData[i].label = chartUtils.convertChinese(contrastData[i].label);
                                        }
                                    }
                                    cf.renderChart(contrastData, $scope.charts[0].config);
                                    Custom.initCheckInfo();
                                });
                            } else {
                                for (var i = 0; i < contrastData.length; i++) {
                                    if (contrastData[i].label.split("_").length > 1) {
                                        contrastData[i].label = "对比数据";
                                    } else {
                                        contrastData[i].label = chartUtils.convertChinese(contrastData[i].label);
                                    }
                                }
                                cf.renderChart(contrastData, $scope.charts[0].config);
                                Custom.initCheckInfo();
                            }

                        }
                    });
                } else {
                    $http.get("/api/transform/transformAnalysis?start=" + $rootScope.start + "&end=" + $rootScope.end + "&action=event&type=1&searchType=dataTable&showType=" + showType + "&queryOptions=" + queryOptions).success(function (data) {
                        var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
                        chart.showLoading({
                            text: "正在努力的读取数据中..."
                        });
                        $scope.charts[0].config.chartType = "line";
                        $scope.charts[0].config.bGap = true;
                        $scope.charts[0].config.instance = chart;
                        util.renderLegend(chart, $scope.charts[0].config);
                        var hasSem = false;
                        for (var t = 0; t < queryOptions.length; t++) {
                            for (var k = 0; k < $scope.sem_checkArray.length; k++) {
                                if (queryOptions[t] == $scope.sem_checkArray[k]) {
                                    hasSem = true;
                                    break;
                                }
                            }
                        }
                        var hasCrate = false;
                        for (var i = 0; i < queryOptions.length; i++) {
                            if (queryOptions[i] == "crate") {
                                hasCrate = true;
                                break;
                            }
                        }
                        if (hasSem) {
                            if (hasCrate) {
                                var all_urls = [];
                                for (var k = 0; k < $scope.convert_url_all.length; k++) {
                                    for (var c = 0; c < $scope.convert_url_all[k].all_urls.length; c++) {
                                        if ($scope.convert_url_all[k].all_urls[c].split("/").length != 0) {
                                            all_urls.push("http://" + $scope.convert_url_all[k].all_urls[c]);
                                        } else {
                                            all_urls.push("http://" + $scope.convert_url_all[k].all_urls[c] + "/");
                                        }
                                    }
                                }
                                var test_url = ["http://www.farmer.com.cn/", "http://182.92.227.23:8080/login?url=localhost:8000"];
                                $http({
                                    method: "GET",
                                    url: "/api/transform/transformAnalysis?start=" + crate_time.start + "&end=" + crate_time.end + "&action=event&type=1&searchType=queryDataByUrl&showType=day&all_urls=" + test_url
                                }).success(function (all_urls_data) {
                                    var semRequest = "";
                                    semRequest = $http.get(SEM_API_URL + "/sem/report/campaign?a=" + $rootScope.user + "&b=" + $rootScope.baiduAccount + "&startOffset=" + $rootScope.start + "&endOffset=" + $rootScope.end + "&q=cost");
                                    $q.all([semRequest]).then(function (sem_data) {
                                        var cost = 0;
                                        for (var k = 0; k < sem_data.length; k++) {
                                            for (var c = 0; c < sem_data[k].data.length; c++) {
                                                cost += Number(sem_data[k].data[c].cost);
                                            }
                                        }
                                        queryOptions.forEach(function (key) {
                                            for (var i = 0; i < data.length; i++) {
                                                if (key == data[i].label) {
                                                    var temporaryContrastData = [];
                                                    var l = 0;
                                                    switch (key) {
                                                        case "avgCost":
                                                            for (l = 0; l < data[i].quota.length; l++) {
                                                                if (Number(data[i].quota[l]) == 0) {
                                                                    temporaryContrastData.push(0);
                                                                } else {
                                                                    temporaryContrastData.push((cost / Number(data[i].quota[l])).toFixed(2));
                                                                }
                                                            }
                                                            data[i].quota = temporaryContrastData;
                                                            break;
                                                        case "profit":
                                                            for (l = 0; l < data[i].quota.length; l++) {
                                                                if (Number(data[i].quota[l]) == 0) {
                                                                    temporaryContrastData.push(0);
                                                                } else {
                                                                    temporaryContrastData.push((Number(data[i].quota[l]) - cost).toFixed(2));
                                                                }
                                                            }
                                                            data[i].quota = temporaryContrastData;
                                                            break;
                                                        case "orderMoney"://订单金额
                                                            break;
                                                        case "crate":
                                                            for (var l = 0; l < data[i].quota.length; l++) {
                                                                if (Number(data[i].quota[l]) == 0) {
                                                                    temporaryContrastData.push(0);
                                                                } else {
                                                                    for (var p = 0; p < all_urls_data.length; p++) {
                                                                        for (var t = 0; t < data[i].key.length; t++) {
                                                                            if (data[i].key[t] == all_urls_data[p].date_time) {
                                                                                if (Number(all_urls_data[p].crate_pv) == 0) {
                                                                                    temporaryContrastData.push(0);
                                                                                } else {
                                                                                    temporaryContrastData.push((Number(data[i].quota[l]) / Number(all_urls_data[p].crate_pv)));
                                                                                }
                                                                            }
                                                                        }

                                                                    }
                                                                }
                                                            }
                                                            data[i].quota = temporaryContrastData;
                                                            break;
                                                            break;
                                                    }

                                                }
                                            }
                                        });
                                        for (var i = 0; i < data.length; i++) {
                                            data[i].label = chartUtils.convertChinese(data[i].label);
                                        }
                                        cf.renderChart(data, $scope.charts[0].config);
                                        Custom.initCheckInfo();
                                    });
                                });
                            } else {
                                var semRequest = "";
                                semRequest = $http.get(SEM_API_URL + "/sem/report/campaign?a=" + $rootScope.user + "&b=" + $rootScope.baiduAccount + "&startOffset=" + $rootScope.start + "&endOffset=" + $rootScope.end + "&q=cost");
                                $q.all([semRequest]).then(function (sem_data) {
                                    var cost = 0;
                                    for (var k = 0; k < sem_data.length; k++) {
                                        for (var c = 0; c < sem_data[k].data.length; c++) {
                                            cost += Number(sem_data[k].data[c].cost);
                                        }
                                    }
                                    $scope.sem_checkArray.forEach(function (key) {
                                        for (var i = 0; i < data.length; i++) {
                                            if (key == data[i].label) {
                                                var temporaryContrastData = [];
                                                var l = 0;
                                                switch (key) {
                                                    case "avgCost":
                                                        for (l = 0; l < data[i].quota.length; l++) {
                                                            if (Number(data[i].quota[l]) == 0) {
                                                                temporaryContrastData.push(0);
                                                            } else {
                                                                temporaryContrastData.push((cost / Number(data[i].quota[l])).toFixed(2));
                                                            }
                                                        }
                                                        data[i].quota = temporaryContrastData;
                                                        break;
                                                    case "profit":
                                                        for (l = 0; l < data[i].quota.length; l++) {
                                                            if (Number(data[i].quota[l]) == 0) {
                                                                temporaryContrastData.push(0);
                                                            } else {
                                                                temporaryContrastData.push((Number(data[i].quota[l]) - cost).toFixed(2));
                                                            }
                                                        }
                                                        data[i].quota = temporaryContrastData;
                                                        break;
                                                    case "orderMoney"://订单金额
                                                        break;
                                                }

                                            }
                                        }
                                    });
                                    for (var i = 0; i < data.length; i++) {
                                        data[i].label = chartUtils.convertChinese(data[i].label);
                                    }
                                    cf.renderChart(data, $scope.charts[0].config);
                                    Custom.initCheckInfo();
                                });
                            }

                        } else {
                            if (hasCrate) {
                                var all_urls = [];
                                for (var k = 0; k < $scope.convert_url_all.length; k++) {
                                    for (var c = 0; c < $scope.convert_url_all[k].all_urls.length; c++) {
                                        if ($scope.convert_url_all[k].all_urls[c].split("/").length != 0) {
                                            all_urls.push("http://" + $scope.convert_url_all[k].all_urls[c]);
                                        } else {
                                            all_urls.push("http://" + $scope.convert_url_all[k].all_urls[c] + "/");
                                        }
                                    }
                                }
                                var test_url = ["http://www.farmer.com.cn/", "http://182.92.227.23:8080/login?url=localhost:8000"];
                                $http({
                                    method: "GET",
                                    url: "/api/transform/transformAnalysis?start=" + $rootScope.start + "&end=" + $rootScope.end + "&action=event&type=1&searchType=queryDataByUrl&showType=day&all_urls=" + test_url
                                }).success(function (all_urls_data) {
                                    var temporaryContrastData = [];
                                    for(var i = 0;i<data.length;i++){
                                        if(data[i].label=="crate"){
                                            for (var l = 0; l < data[i].quota.length; l++) {
                                                if (Number(data[i].quota[l]) == 0) {
                                                    temporaryContrastData.push(0);
                                                } else {
                                                    for (var p = 0; p < all_urls_data.length; p++) {
                                                        for (var t = 0; t < data[i].key.length; t++) {
                                                            if (data[i].key[t] == all_urls_data[p].date_time) {
                                                                if (Number(all_urls_data[p].crate_pv) == 0) {
                                                                    temporaryContrastData.push(0);
                                                                } else {
                                                                    temporaryContrastData.push((Number(data[i].quota[l]) / Number(all_urls_data[p].crate_pv)));
                                                                }
                                                            }
                                                        }

                                                    }
                                                }
                                            }
                                            data[i].quota = temporaryContrastData;
                                        }
                                    }

                                    for (var i = 0; i < data.length; i++) {
                                        data[i].label = chartUtils.convertChinese(data[i].label);
                                    }
                                    cf.renderChart(data, $scope.charts[0].config);
                                    Custom.initCheckInfo();
                                });
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    data[i].label = chartUtils.convertChinese(data[i].label);
                                }
                                cf.renderChart(data, $scope.charts[0].config);
                                Custom.initCheckInfo();
                            }
                        }
                    });
                }


            };
            $scope.targetSearchSpreadPage = function (isClicked) {
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
                    $scope.setShowArray();
                    $scope.page_init(false);
                    $scope.$broadcast("transformData_ui_grid", {
                        start: $rootScope.start,
                        end: $rootScope.end,
                        checkedArray: $scope.es_checkedArray,
                        sem_checkedArray: $scope.sem_checkedArray,
                        all_checked: $rootScope.checkedArray
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
                        all_checked: $rootScope.checkedArray
                    });
                }
            };
            $scope.page_init(false);
        }
    )
    ;
});
