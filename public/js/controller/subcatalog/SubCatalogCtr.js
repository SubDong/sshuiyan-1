/**
 * Created by ss on 2015/9/24.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller('SubCatalogCtr', function ($scope, $rootScope, $q, $http, $cookieStore, requestService, areaService, $location, uiGridConstants) {
        $scope.allCitys = angular.copy($rootScope.citys);
        $scope.allBrowsers = angular.copy($rootScope.browsers);
        $scope.chart_title = true;
        $scope.todayClass = true;
        $scope.hourcheckClass = true;
        $scope.lastDaySelect = true;
        $scope.lastWeekSelect = true;
        $scope.clearCompareSelect = true;
        $scope.souce.selected = {"name": "全部"};
        $scope.city.selected = {"name": "全部"};
        $scope.browser.selected = {"name": "全部"};
//        高级搜索提示
        $scope.sourceSearch = "";
        $scope.visitorSearch = "";
        $scope.areaSearch = "";
//        取消显示的高级搜索的条件
        $scope.removeSourceSearch = function (obj) {
            $scope.souce.selected = {"name": "全部"};
            $rootScope.$broadcast("loadAllSource");
            obj.sourceSearch = "";
        }
        $scope.removeVisitorSearch = function (obj) {
            $rootScope.$broadcast("loadAllVisitor");
            obj.visitorSearch = "";
        }
        $scope.removeAreaSearch = function (obj) {
            $scope.city.selected = {"name": "全部"};
            $rootScope.$broadcast("loadAllArea");
            obj.areaSearch = "";
        }
        $scope.reset = function () {
            $scope.todayClass = false;
            $scope.yesterdayClass = false;
            $scope.sevenDayClass = false;
            $scope.monthClass = false;
            $scope.definClass = false;
            $scope.hourcheckClass = false;
            $scope.hourselect = true;
        };
        //table配置
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        $rootScope.tableFormat = "hour";
        //配置默认指标
        $rootScope.checkedArray = ["pv", "uv", "ip", "outRate", "avgTime", "avgPage"];
        $rootScope.gridArray = [
            {
                name: "xl",
                displayName: "",
                cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                maxWidth: 10,
                enableSorting: false
            },
            {
                name: "子目录",
                displayName: "子目录",
                field: "",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                cellClass: "table_list_color",
                enableSorting: false
            },
            {
                name: " ",
                cellTemplate: "<div class='table_box'><a ng-click='grid.appScope.getHistoricalTrend(this, \"history1\")' target='_parent' class='table_nextbtn' title='查看历史趋势'></a></div>",
                enableSorting: false
            },
            {
                name: "浏览量(PV)",
                displayName: "浏览量(PV)",
                field: "pv",
                cellClass: "table_list_color",
                enableSorting: false,
                cellTooltip: function (row, col) {
                    return row.entity.pv;
                }
            },

            {
                name: "访客数(UV)",
                displayName: "访客数(UV)",
                field: "uv",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>",
                sort: {
                    direction: uiGridConstants.DESC,
                    priority: 1
                }
            },
            {
                name: "IP数",
                displayName: "IP数",
                field: "ip",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "跳出率",
                displayName: "跳出率",
                field: "outRate",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "平均访问时长",
                displayName: "平均访问时长",
                field: "avgTime",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            }
            ,
            {
                name: "平均访问页数",
                displayName: "平均访问页数",
                field: "avgPage",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            }
        ];
        $rootScope.tableSwitch = {
            latitude: {name: "页面url", displayName: "页面url", field: "loc"},
            tableFilter: null,
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 1,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: false,
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false //是否清空指标array
        };
        //
        $scope.dt = new Date();
        $scope.onLegendClickListener = function (radio, chartObj, chartConfig, checkedVal) {
            if ($scope.compareType) {
                switch ($scope.compareType) {
                    case 1:
                        var times = [0, -1];
                        $scope.compare(times, checkedVal);
                        break;
                    case 2:
                        var times = [0, -7];
                        $scope.compare(times, checkedVal);
                        break;
                    default :
                        var times = [$rootScope.start, $rootScope.end];
                        $scope.compare(times, checkedVal);
                        break;
                }
            } else {
                clear.scatterChart($scope.charts[0].config, checkedVal);
                $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
                $scope.charts[0].types = checkedVal;
                var chartarray = [$scope.charts[0]];
                requestService.refresh(chartarray);
            }
            //}
        }
        $scope.todayFormat = function (data, config, e) {
            if ($rootScope.interval == 1) {
                var final_result = chartUtils.getByHourByDayData(data);
                config["noFormat"] = "noFormat";
                config["keyFormat"] = "none";
                config["chartType"] = "scatter";//图表类型
                config["bGap"] = false;//图表类型
                cf.renderChart(final_result, config);
            } else {

                var json = JSON.parse(eval("(" + data + ")").toString());
                config["noFormat"] = undefined;
                config["chartType"] = "scatter";//图表类型
                config["bGap"] = false;//图表类型
                chartUtils.getXType(config, $rootScope.interval);
                cf.renderChart(data, config);
            }
        }
        $scope.charts = [
            {
                config: {
                    legendId: "today_charts_legend",
                    legendAllowCheckCount: 2,
                    legendClickListener: $scope.onLegendClickListener,
                    legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "新访客数", "新访客比率", "IP数", "跳出率", "平均访问时长", "平均访问页数"],//显示几种数据
                    legendDefaultChecked: [0, 1],
                    id: "today_charts",
                    //min_max: false,
                    bGap: true,//首行缩进
                    chartType: "scatter",//图表类型
                    dataKey: "key",//传入数据的key值
                    keyFormat: 'hour',
                    dataValue: "quota"//传入数据的value值
                },
                types: ["avgTime"],
                dimension: ["period"],
                interval: $rootScope.interval,
                url: "/api/charts",
                cb: $scope.todayFormat
            }];
        $scope.compareLegendData = [];
        $scope.init = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.interval = 1;
            $scope.charts.forEach(function (e) {
                $scope.compareLegendData = e.config.legendData;
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                util.renderLegend(chart, e.config);
            })
            requestService.refresh($scope.charts);
        }
        $scope.init();
        $scope.$on("ssh_refresh_charts", function (e, msg, data, config) {
            if ($scope.charts[0].config.compareCustom) {
                $scope.resetC();
            }
            if ($rootScope.start > -6 && $scope.charts[0].config.keyFormat == "week") {
                $rootScope.interval = -1;
            }
            if ($rootScope.interval == -1) {
                $scope.lastDaySelect = false;
                $scope.lastWeekSelect = false;
                $scope.clearCompareSelect = false;
            }
            $scope.charts.forEach(function (chart) {
                chart.config.instance = echarts.init(document.getElementById(chart.config.id));
                chart.config.time = chartUtils.getWeekTime($rootScope.start, $rootScope.end);
            });
            requestService.refresh($scope.charts);
            $rootScope.targetSearch();
        });
        $scope.clear = function () {
            $scope.extendway.selected = undefined;
            $scope.city.selected = undefined;
            $scope.country.selected = undefined;
            $scope.continent.selected = undefined;
            $scope.souce.selected = undefined;
        };
        //日历
        $rootScope.datepickerClick = function (start, end, label) {
            if ($scope.compareType) {
                $scope.resetC();
            }
            var time = chartUtils.getTimeOffset(start, end);
            var offset = time[1] - time[0];
            $scope.reset();
            if (offset >= 31) {
                $scope.mothselected = false;
                $scope.weekselected = false;
            } else {
                if (offset >= 7) {
                    $scope.weekselected = false;
                } else {
                    $scope.weekselected = true;
                }
                $scope.mothselected = true;
            }
            $rootScope.start = time[0];
            $rootScope.end = time[1];
            //$rootScope.interval = -1;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.time = chartUtils.getWeekTime($rootScope.start, $rootScope.end);
            })
            requestService.refresh($scope.charts);
            $rootScope.tableTimeStart = time[0];
            $rootScope.tableTimeEnd = time[1];
            $rootScope.targetSearch();
            $scope.$broadcast("ssh_dateShow_options_time_change");
        }
        $scope.checkBoxCompare = function (checked, legend) {
            var compareType = checked[0];
            $scope.isShowCalendar = true;
            var type = [chartUtils.convertEnglish($scope.charts[0].config.legendData[0])];
            switch (compareType) {
                case 0:
                    $scope.compareType = 1;
                    var times = [$rootScope.tableTimeStart - 0, $rootScope.tableTimeStart - 1];
                    var timesFormat = chartUtils.getSetOffTime(times[0], times[1]);
                    $scope.todayCalendar = timesFormat[0];
                    $scope.dayOrWeek = timesFormat[1];
                    $scope.compare(times, type, true);
                    break;
                case 1:
                    $scope.compareType = 2;
                    var times = [$rootScope.tableTimeStart - 0, $rootScope.tableTimeStart - 7];
                    var timesFormat = chartUtils.getSetOffTime(times[0], times[1]);
                    $scope.todayCalendar = timesFormat[0];
                    $scope.dayOrWeek = timesFormat[1];
                    $scope.compare(times, type, true);
                    break;
                default:
                    $scope.resetC(true);
                    $scope.isShowCalendar = false;
                    break;
            }
        }
        //前一日
        //上周同期

        $scope.compareType = false;
        $scope.datePickerCompare = function (start, end, label) {
            var time = chartUtils.getTimeOffset(start, end);
            var offset = time[1] - time[0];
            if (offset < 0) {
                alert("请选择正确的对比时间！");
                return;
            }
            var times = chartUtils.getTimeOffset(start, end);
            $scope.todayCalendar = $scope.getDateByDayInt($rootScope.tableTimeStart);
            $scope.dayOrWeek = start;
            $scope.mothselected = true;
            $scope.weekselected = true;
            $scope.choiceClass = true;
            $scope.dayClass = false;
            $scope.hourcheckClass = true;
            $rootScope.start = times[0];
            $rootScope.end = times[1];
            $rootScope.interval = -1;
            $scope.isShowCalendar = true;
            $scope.compareType = true;
            var type = [chartUtils.convertEnglish($scope.charts[0].config.legendData[0])];
            $scope.compare(times, type, true);
            $scope.cancelCheckbox();
        };
        $scope.getDateByDayInt = function (startInt) {

            function GetDateStr(AddDayCount) {
                var dd = new Date();
                dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
                var y = dd.getFullYear();
                var m = dd.getMonth() + 1;//获取当前月份的日期
                var d = dd.getDate();
                return y + "-" + m + "-" + d;
            }

            return GetDateStr(startInt);
        };
        $scope.compare = function (times, type, legendRender) {
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.legendAllowCheckCount = 1;
                e.config.legendDefaultChecked = undefined;
                e.config.noFormat = true;
                if (e.config.chartType == "scatter") {
                    e.config.bGap = false;
                } else {
                    e.config.bGap = true;
                }
                e.config.noFormat = "none";
                e.config.compareCustom = true;
                e.types = type;
                if (legendRender) {
                    e.config.legendData = $scope.compareLegendData;
                    util.renderLegend(chart, e.config);
                    Custom.initCheckInfo();
                }
                var reqRequestStart;
                var reqRequestEnd;
                if (e.config.keyFormat == "day") {
                    e.half = true;
                    reqRequestStart = $http.get(e.url + "?type=" + e.types + "&dimension=" + e.dimension + "&start=" + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&userType=" + $rootScope.userType + "&int=-1");
                    reqRequestEnd = $http.get(e.url + "?type=" + e.types + "&dimension=" + e.dimension + "&start=" + times[0] + "&end=" + times[1] + "&userType=" + $rootScope.userType + "&int=-1");
                } else {
                    reqRequestStart = $http.get(e.url + "?type=" + e.types + "&dimension=" + e.dimension + "&start=" + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeStart + "&userType=" + $rootScope.userType);
                    reqRequestEnd = $http.get(e.url + "?type=" + e.types + "&dimension=" + e.dimension + "&start=" + times[0] + "&end=" + times[0] + "&userType=" + $rootScope.userType);
                }
                e.config.instance.showLoading({
                    effect: 'whirling',
                    text: "正在努力的读取数据中..."
                });
                $q.all([reqRequestStart, reqRequestEnd]).then(function (data) {
                    var final_result = [];
                    data.forEach(function (q) {
                        var json = JSON.parse(eval("(" + q.data + ")").toString());
                        json.forEach(function (item) {
                            if (item.key.length) {
                                var _timeBase = new Date(item.key[0]).Format("yyyy-MM-dd hh:mm:ss");
                                var _label = _timeBase.substring(0, 10) + ":" + chartUtils.convertChinese(item.label);
                                var _key = [];
                                item.key.forEach(function (k) {
                                    k = new Date(k).Format("yyyy-MM-dd hh:mm:ss");
                                    if (e.config.keyFormat == "day") {
                                        k = k.toString().substring(0, 10);
                                    } else {
                                        k = Number(k.toString().substring(10, 13));
                                    }
                                    _key.push(k);
                                });
                                item.key = _key;
                                item.label = _label;
                            }
                        });
                        final_result.push(json[0]);
                    });
                    cf.renderChart(final_result, e.config);
                });
            });
        }
        $scope.resetC = function (refresh) {
            $scope.isShowCalendar = false;
            $scope.compareType = false;
            $scope.choiceClass = false;
            $scope.dayselect = false;
            $scope.dayClass = false;
            $scope.hourcheckClass = true
            $rootScope.interval = 1;
            $scope.date = "与其他时间段对比";
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.bGap = false;
                e.config.legendDefaultChecked = [0, 1];
                e.config.legendAllowCheckCount = 2;
                e.config.compareCustom = undefined;
                e.types = [chartUtils.convertEnglish(e.config.legendData[0]), chartUtils.convertEnglish(e.config.legendData[1])];
                util.renderLegend(chart, e.config);
                Custom.initCheckInfo();
            });
            $scope.cancelCheckbox();
            if (refresh) {
                requestService.refresh($scope.charts);
            }
        }

        //刷新
        $scope.page_refresh = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.tableTimeStart = 0;
            $rootScope.tableTimeEnd = 0;
            $scope.reloadByCalendar("today");
//            $scope.charts.forEach(function (e) {
//                var chart = echarts.init(document.getElementById(e.config.id));
//                e.config.instance = chart;
//            });
//            //图表
//            requestService.refresh($scope.charts);
//            $scope.reloadByCalendar("today");
            $('#reportrange span').html(GetDateStr(0));
            //首页表格
            //requestService.gridRefresh(scope.grids);
            //其他页面表格
//            $rootScope.targetSearch(true);
//            $scope.$broadcast("ssh_dateShow_options_time_change");
            //classcurrent
            $scope.reset();
            $scope.todayClass = true;
        };
        $scope.cancelCheckbox = function () {
            var checkBox = $("#cm").find("input[type='checkbox']");
            checkBox.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop('checked', false);
            });
        }

        $rootScope.initMailData = function () {
            $http.get("api/saveMailConfig?rt=read&rule_url=" + $rootScope.mailUrl[1] + "").success(function (result) {
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
                formData.rule_url = $rootScope.mailUrl[1];
                formData.uid = $cookieStore.get('uid');
                formData.site_id = $rootScope.siteId;
                formData.type_id = $rootScope.userType;
                formData.schedule_date = $scope.mytime.time.Format('hh:mm');
                $http.get("api/saveMailConfig?data=" + JSON.stringify(formData)).success(function (data) {
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
        // 构建PDF数据
        $scope.generatePDFMakeData = function (cb) {
            var dataInfo = angular.copy($rootScope.gridApi2.grid.options.data);
            var dataHeadInfo = angular.copy($rootScope.gridApi2.grid.options.columnDefs);
            var _tableBody = $rootScope.getPDFTableBody(dataInfo, dataHeadInfo);
            var docDefinition = {
                header: {
                    text: "today trend data report",
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
                    {text: '\nPower by www.best-ad.cn', style: 'header'},
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
    });
})