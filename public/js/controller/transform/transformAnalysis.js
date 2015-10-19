/**
 * Created by perfection on 15-7-07.
 */
define(["./module"], function (ctrs) {
    "use strict";
    ctrs.controller('transformAnalysisctr', function ($scope, $rootScope, $q, requestService, areaService, $http, SEM_API_URL, uiGridConstants, $cookieStore) {
            $scope.city.selected = {"name": "全部"};
            $scope.todayClass = true;
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.tableFormat = null;
            $scope.send = true;//显示发送
            $scope.isCompared = false;
            var refushGridData = function () {
                var url = "/config/eventchnage_list?type=search&query=" + JSON.stringify(
                        {uid: $cookieStore.get("uid"), root_url: $rootScope.siteId}
                    );
                $http({
                    method: 'GET',
                    url: url
                }).success(function (dataConfig, status) {
                    var url_convert_info = [];
                    for (var i = 0; i < dataConfig.length; i++) {
                        if(dataConfig[i].event_target)
                        url_convert_info.push({
                            convertName: dataConfig[i].event_name,
                            convertId: dataConfig[i].event_id,
                            all_urls: dataConfig[i].event_page
                        });
                    }
                    var all_url = [];
                    for (var k = 0; k < dataConfig.length; k++) {
                        all_url.push(dataConfig[k].event_page)
                    }
                    $scope.all_url = all_url;
                    $scope.convert_url_all = url_convert_info;
                    //console.log($scope.convert_url_all)
                });
            };
            refushGridData();

            //sem
            $scope.es_checkArray = ["pv", "uv", "vc", "ip", "nuv", "nuvRate", "conversions", "crate", "transformCost", "clickTotal", "visitNum"];
            $scope.sem_checkArray = ["transformCost"];

            $rootScope.tableTimeStart = -1;//开始时间
            $rootScope.tableTimeEnd = -1;//结束时间、
            $rootScope.tableFormat = null;

            //配置默认指标
            $rootScope.checkedArray = ["clickTotal", "pv", "uv", "ip", "conversions", "crate"];
            $scope.getEventName =function(grid, row,index){
                //console.log(row)
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
                    field: "pv",
                    cellTemplate: "<div><a href='javascript:void(0)' style='color:#0965b8;line-height:30px' ng-click='grid.appScope.getHistoricalTrend(this)'>{{grid.appScope.getEventName(grid, row,index)}}</a></div>"
                    , footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                    enableSorting: false
                },
                {
                    name: "浏览量(PV)",
                    displayName: "浏览量(PV)",
                    field: "pv",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
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
                    name: "事件点击总数",
                    displayName: "事件点击总数",
                    field: "clickTotal",
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
                latitude: {name: "事件名称", displayName: "事件名称", field: "campaignName"},
                tableFilter: null,
                dimen: false,
                number: 6,
                arrayClear: false, //是否清空指标array
                promotionSearch: {
                    turnOn: true, //是否开启推广中sem数据
                    SEMData: "campaign" //查询类型
                }
            };
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
                    }
                    else {
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
            $scope.queryOption_all = ["pv", "uv", "ip", "vc", "conversions", "crate", "transformCost"];
            $scope.queryOptions = ["pv", "uv"];
            $scope.charts = [
                {
                    config: {
                        legendId: "indicators_charts_legend",
                        legendData: ["浏览量(PV)", "访客数(UV)", "IP数", "访问次数", "转化次数", "转化率", "平均转化成本(事件)"],//显示几种数据
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
                        dataValue: "quota",//传入数据的value值
                        // qingXie: true,
                        qxv: 18
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
                $scope.refreshData(false);
                init_transformData();
            };
            $rootScope.datepickerClickTow = function (start, end, label) {
                var time = chartUtils.getTimeOffset(start, end);
                $scope.start = time[0];
                $scope.end = time[1];
                $scope.refreshData(true);
                init_transformData();
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

            $scope.refreshData = function (isContrastDataByTime) {//isContrastDataByTime 是否按时间对比
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
                    $scope.dataTable(isContrastDataByTime, "day", ["pv", "uv"], false);
                }
                $scope.isCompared = isContrastDataByTime;
                $http.get("/api/transform/transformAnalysis?start=" + start + "&end=" + end + "&analysisAction=event&type=" + $rootScope.userType + "&searchType=initAll&queryOptions=" + $scope.es_checkArray).success(function (data) {

                    if (data != null || data != "") {
                        var hasEvent = false;
                        //$scope.es_checkedArray = ["pv", "uv", "ip"]
                        for (var i = 0; i < $scope.es_checkedArray.length; i++) {
                            if ($scope.es_checkedArray[i] == "crate" || $scope.es_checkedArray[i] == "conversions" || $scope.es_checkedArray[i] == "clickTatol") {
                                hasEvent = true;
                                break;
                            }
                        }
                        //是否需要查询 包含事件的信息
                        if (hasEvent) {
                            $http({
                                method: "GET",
                                url: "/api/transform/getConvEvent?" +
                                "&start=" + start +
                                "&end=" + end +
                                "&analysisAction=" + "event" +
                                "&type=" + $rootScope.userType +
                                "&showType=" + "tatol"
                            }).success(function (all_urls_data) {
                                for (var i = 0; i < $scope.dateShowArray.length; i++) {
                                    for (var key in data) {
                                        if ($scope.dateShowArray[i].label == key) {
                                            if ($scope.dateShowArray[i].label == "crate") {
                                                if (isContrastDataByTime) {
                                                    if (Number(data["pv"]) != 0) {
                                                        $scope.dateShowArray[i].cValue = ( Number(all_urls_data[0].convCount / Number(data["pv"])) * 100).toFixed(2) + "%";
                                                    } else {
                                                        $scope.dateShowArray[i].cValue = "0%";
                                                    }
                                                } else {
                                                    if (Number(data["crate"]) != 0) {
                                                        $scope.dateShowArray[i].value = (Number(all_urls_data[0].convCount / Number(data["pv"])) * 100).toFixed(2) + "%";
                                                    } else {
                                                        $scope.dateShowArray[i].value = "0%";
                                                    }
                                                }
                                            } else if ($scope.dateShowArray[i].label == "transformCost" && Number(data[key]) != 0) {
                                                var add_i = i;
                                                var semRequest = "";
                                                semRequest = $http.get(SEM_API_URL + "/sem/report/campaign?a=" + $rootScope.user + "&b=" + $rootScope.baiduAccount + "&startOffset=" + start + "&endOffset=" + end + "&q=cost");
                                                $q.all([semRequest]).then(function (sem_data) {
                                                    var cost = 0;
                                                    for (var k = 0; k < sem_data.length; k++) {
                                                        for (var c = 0; c < sem_data[k].data.length; c++) {
                                                            cost += Number(sem_data[k].data[c].cost);
                                                        }
                                                    }
                                                    if (isContrastDataByTime) {
                                                        $scope.dateShowArray[add_i].cValue = (cost / Number(data[key])).toFixed(2).toString() + "元";
                                                    } else {
                                                        $scope.dateShowArray[add_i].value = (cost / Number(data[key])).toFixed(2).toString() + "元";
                                                    }
                                                });
                                            } else if ($scope.dateShowArray[i].label == "clickTotal") {
                                                if (isContrastDataByTime) {
                                                    $scope.dateShowArray[i].cValue = Number(all_urls_data[i].eventCount);
                                                } else {
                                                    $scope.dateShowArray[i].value = Number(all_urls_data[0].eventCount);
                                                }
                                            }
                                            else if ($scope.dateShowArray[i].label == "conversions") {
                                                if (isContrastDataByTime) {
                                                    $scope.dateShowArray[i].cValue = Number(all_urls_data[i].convCount);
                                                } else {
                                                    $scope.dateShowArray[i].value = Number(all_urls_data[0].convCount);
                                                }
                                            }
                                            else {
                                                if (isContrastDataByTime) {
                                                    $scope.dateShowArray[i].cValue = data[key];
                                                } else {
                                                    $scope.dateShowArray[i].value = data[key];
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        }
                        else {
                            for (var i = 0; i < $scope.dateShowArray.length; i++) {
                                for (var key in data) {
                                    if ($scope.dateShowArray[i].label == key) {
                                        if ($scope.dateShowArray[i].label == "transformCost" && Number(data[key]) != 0) {
                                            var add_i = i;
                                            var semRequest = "";
                                            semRequest = $http.get(SEM_API_URL + "/sem/report/campaign?a=" + $rootScope.user + "&b=" + $rootScope.baiduAccount + "&startOffset=" + start + "&endOffset=" + end + "&q=cost");
                                            $q.all([semRequest]).then(function (sem_data) {
                                                var cost = 0;
                                                for (var k = 0; k < sem_data.length; k++) {
                                                    for (var c = 0; c < sem_data[k].data.length; c++) {
                                                        cost += Number(sem_data[k].data[c].cost);
                                                    }
                                                }
                                                if (isContrastDataByTime) {
                                                    $scope.dateShowArray[add_i].cValue = (cost / Number(data[key])).toFixed(2).toString() + "元";

                                                } else {
                                                    $scope.dateShowArray[add_i].value = (cost / Number(data[key])).toFixed(2).toString() + "元";
                                                }
                                            });
                                        } else if ($scope.dateShowArray[i].label == "transformCost" && Number(data[key]) == 0) {
                                            if (isContrastDataByTime) {
                                                $scope.dateShowArray[i].cValue = 0;

                                            } else {
                                                $scope.dateShowArray[i].value = 0;
                                            }
                                        } else {
                                            if (isContrastDataByTime) {
                                                $scope.dateShowArray[i].cValue = data[key];

                                            } else {
                                                $scope.dateShowArray[i].value = data[key];
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
                });
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
                    $http.get("/api/transform/transformAnalysis?start=" + $rootScope.start + "&end=" + $rootScope.end + "&analysisAction=event&type=" + $rootScope.userType + "&searchType=contrastData&showType=" + showType + "&queryOptions=" + queryOptions + "&contrastStart=" + $scope.start + "&contrastEnd=" + $scope.end).success(function (contrastData) {
                        var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
                        chart.showLoading({
                            text: "正在努力的读取数据中..."
                        });
                        $scope.charts[0].config.chartType = "line";
                        $scope.charts[0].config.bGap = true;
                        $scope.charts[0].config.instance = chart;
                        $scope.charts[0].config.instance = chart;
                        if (renderLegend)
                            util.renderLegend(chart, $scope.charts[0].config);
                        var hasSem = false;

                        var hasEvent = false;
                        for (var i = 0; i < queryOptions.length; i++) {
                            if (queryOptions == "crate" || $scope.es_checkedArray[i] == "conversions" || $scope.es_checkedArray[i] == "clickTatol") {
                                hasEvent = true;
                                break;
                            }
                        }
                        if (hasEvent) {
                            $http({
                                method: "GET",
                                url: "/api/transform/getConvEvent?start=" + crate_time.start + "&end=" + crate_time.end + "&analysisAction=event&type=" + $rootScope.userType + "&searchType=queryDataByUrl&showType=day"
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
                        }
                        else {
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
                        //}
                    });
                }
                else {
                    $http.get("/api/transform/transformAnalysis?start=" + $rootScope.start + "&end=" + $rootScope.end + "&analysisAction=event&type=" + $rootScope.userType + "&searchType=dataTable&showType=" + showType + "&queryOptions=" + queryOptions).success(function (data) {
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
                        if (hasCrate) {
                            $http({
                                method: "GET",
                                url: "/api/transform/getConvEvent?" +
                                "&start=" + $rootScope.start +
                                "&end=" + $rootScope.end +
                                "&analysisAction=" + "event" +
                                "&type=" + $rootScope.userType +
                                "&showType=" + "day"
                            }).success(function (all_urls_data) {
                                for (var c = 0; c < data.length; c++) {
                                    if (data[c].label == "crate") {
                                        var temporaryContrastData = [];
                                        for (var l = 0; l < data[c].quota.length; l++) {
                                            temporaryContrastData.push(Number(all_urls_data[l].convCount) / +Number(data[c].quota[l]) );
                                        }
                                        data[c].quota = temporaryContrastData;
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
                    });
                }


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
                $rootScope.targetSearch(isClicked)
                if (isClicked) {
                    $scope.setShowArray();
                    $scope.refreshData(false);
                    $scope.$broadcast("transformData_ui_grid", {
                        start: $rootScope.start,
                        end: $rootScope.end,
                        checkedArray: $scope.es_checkedArray,
                        sem_checkedArray: $scope.sem_checkedArray,
                        all_checked: $rootScope.checkedArray,
                        analysisAction: "event",
                        convert_url_all: $scope.convert_url_all
                    });
                    console.log("自定义指标"+isClicked)

                }
                else {
                    console.log("高级筛选"+isClicked)
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
                $rootScope.targetSearch(isClicked)
            };
            init_transformData();
            $scope.refreshData(false);
        }

    );
});
