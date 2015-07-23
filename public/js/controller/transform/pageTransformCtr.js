/**
 * Created by perfection on 15-7-22.
 */
define(["./module"], function (ctrs) {
    "use strict";
    ctrs.controller('pageTransformCtr', function ($scope, $rootScope, $q, requestService, areaService, $http, SEM_API_URL, uiGridConstants) {
            $scope.city.selected = {"name": "全部"};
            $scope.todayClass = true;
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.tableFormat = null;
            $scope.send = true;//显示发送

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
                {consumption_name: '平均转化成本', name: 'avgCost'},
                {consumption_name: '收益', name: 'benefit'},
                {consumption_name: '利润', name: 'profit'}
            ];
            $scope.order = [
                {consumption_name: "订单转化", name: "orderNum"},
                {consumption_name: "订单金额", name: "orderMoney"},
                {consumption_name: "订单转化率", name: "orderNumRate"}
            ];
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
            $scope.selectedQuota = ["click", "impression"];
            $scope.onLegendClickListener = function (radio, chartInstance, config, checkedVal) {
                if (checkedVal.length) {
                    //$scope.init($rootScope.user, $rootScope.baiduAccount, "campaign", checkedVal, $rootScope.start, $rootScope.end);
                } else {
                    def.defData($scope.charts[0].config);
                }
            };
            $scope.charts = [
                {
                    config: {
                        legendId: "indicators_charts_legend",
                        legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "新访客数", "转化次数", "转化率", "平均转化成本", "收益", "利润", "订单数", "订单金额", "订单转化率"],//显示几种数据
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
                $scope.page.selected = undefined;
                $scope.city.selected = undefined;
                $scope.country.selected = undefined;
                $scope.continent.selected = undefined;
            };
            $scope.page = {};
            $scope.pages = [
                {name: '全部页面目标'},
                {name: '全部事件目标'},
                {name: '所有页面右上角按钮'},
                {name: '所有页面底部400按钮'},
                {name: '详情页右侧按钮'},
                {name: '时长目标'},
                {name: '访问页数目标'}
            ];
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
            $scope.page_init = function (isContrastDataByTime) {
                $scope.$broadcast("transformData", {
                    start: $rootScope.start,
                    end: $rootScope.end,
                    checkedArray: $scope.checkedArray
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
                $http.get("/api/transform/transformAnalysis?start=" + start + "&end=" + end + "&action=event&type=1&searchType=initAll&queryOptions=" + $rootScope.checkedArray).success(function (data) {
                    if (data != null || data != "") {
                        for (var i = 0; i < $scope.dateShowArray.length; i++) {
                            for (var key in data) {
                                if ($scope.dateShowArray[i].label == key) {
                                    if (isContrastDataByTime) {
                                        $scope.dateShowArray[i].cValue = data[key];

                                    } else {
                                        $scope.dateShowArray[i].value = data[key];
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
            /**
             * @param isContrastTime　是否为对比数据
             * @param showType　显示横轴方式　有四种：hour小时为单位，显示一天24小时的数据；day天为单位，显示数天的数据，week周为单位，显示数周的数据；month月为单位，显示数月的数据
             * @param queryOption　查询条件指标　事件转化：指标："浏览量(pv)", "访客数(uv)", "转化次数(conversions)", "转化率(crate)", "平均转化成本(transformCost)"
             */
            $scope.dataTable = function (isContrastTime, showType, queryOptions, renderLegend) {
                if (isContrastTime) {
                    $http.get("/api/transform/transformAnalysis?start=" + $rootScope.start + "&end=" + $rootScope.end + "&action=event&type=1&searchType=contrastData&showType=" + showType + "&queryOptions=" + queryOptions + "&contrastStart=" + $scope.start + "&contrastEnd=0" + $scope.end).success(function (contrastData) {
                        var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
                        chart.showLoading({
                            text: "正在努力的读取数据中..."
                        });
                        $scope.charts[0].config.chartType = "line";
                        $scope.charts[0].config.bGap = true;
                        $scope.charts[0].config.instance = chart;
                        if (renderLegend)
                            util.renderLegend(chart, $scope.charts[0].config);


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
                    //$scope.charts[0].config.legendDefaultChecked = [0,1];
                    //$scope.charts[0].config.legendAllowCheckCount = 2;
                    $http.get("/api/transform/transformAnalysis?start=" + $rootScope.start + "&end=" + $rootScope.end + "&action=event&type=1&searchType=dataTable&showType=" + showType + "&queryOptions=" + queryOptions).success(function (data) {
                        var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
                        chart.showLoading({
                            text: "正在努力的读取数据中..."
                        });
                        $scope.charts[0].config.chartType = "line";
                        $scope.charts[0].config.bGap = true;
                        $scope.charts[0].config.instance = chart;
                        util.renderLegend(chart, $scope.charts[0].config);
                        for (var i = 0; i < data.length; i++) {
                            data[i].label = chartUtils.convertChinese(data[i].label);
                        }
                        cf.renderChart(data, $scope.charts[0].config);
                        Custom.initCheckInfo();
                    });
                }


            };
            $scope.targetSearchSpreadPage = function (isClicked) {
                $scope.setShowArray();
                $scope.my_init(false);
                if (isClicked) {
                    $scope.$broadcast("transformData_ui_grid", {
                        start: $rootScope.start,
                        end: $rootScope.end,
                        checkedArray: $scope.checkedArray
                    });
                } else {
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
                        checkedArray: $scope.checkedArray
                    });
                }
            };
            $scope.page_init(false);
            //Custom.initCheckInfo();//页面check样式js调用
        }
    );
});
