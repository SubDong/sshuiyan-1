/**
 * Created by john on 2015/4/1.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('trend_month_ctrl', function ($scope, $rootScope, $q, $http,$cookieStore, requestService, messageService, areaService, uiGridConstants) {
        $scope.allCitys = angular.copy($rootScope.citys);
        $scope.allBrowsers = angular.copy($rootScope.browsers);
        $('#reportrange span').html(GetDateStr(-29) + "至" + GetDateStr(0));
        $scope.monthClass = true;
        $scope.hourcheckClass = true;
        $scope.weekselected = false;
        $scope.souce.selected = {"name": "全部"};
        $scope.browser.selected = {"name": "全部"};
        $scope.city.selected = {"name": "全部"};
        //        高级搜索提示显示
        $scope.sourceSearch = "";
        $scope.terminalSearch = "";
        $scope.areaSearch = "";
//        取消显示的高级搜索的条件
        $scope.removeSourceSearch = function(obj){
            $scope.souce.selected = {"name": "全部"};
            $rootScope.$broadcast("loadAllSource");
            obj.sourceSearch = "";
        };
        $scope.removeTerminalSearch = function(obj){
            $rootScope.$broadcast("loadAllTerminal");
            obj.terminalSearch = "";
        }
        $scope.removeAreaSearch = function(obj){
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
        };
        $scope.dateshows = false;
        //table配置
        $rootScope.tableTimeStart = -30;
        $rootScope.tableTimeEnd = -1;
        $rootScope.tableFormat = "hour";
        //配置默认指标
        $rootScope.checkedArray = ["pv", "uv", "ip", "outRate", "avgTime"];
        $rootScope.gridArray = [
            {
                name: "xl",
                displayName: "",
                cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                maxWidth: 10,
                enableSorting: false
            },
            {
                name: "时间",
                displayName: "时间",
                field: "period",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                sort: {
                    direction: uiGridConstants.ASC,
                    priority: 0
                }
            },
            {
                name: "浏览量(PV)",
                displayName: "浏览量(PV)",
                field: "pv",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "访客数(UV)",
                displayName: "访客数(UV)",
                field: "uv",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
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
        ];
        $rootScope.tableSwitch = {
            latitude: {name: "日期", displayName: "日期", field: "period"},
            tableFilter: null,
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 0,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: false,
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false //是否清空指标array
        };
        //

        $scope.dt = new Date();
        $scope.onLegendClickListener = function (radio, chartObj, chartConfig, checkedVal) {
            if ($scope.compareType) {
                var times = [$rootScope.start, $rootScope.end];
                $scope.compare(times, checkedVal);
            } else {
                clear.lineChart($scope.charts[0].config, checkedVal);
                $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
                $scope.charts[0].types = checkedVal;
                var chartarray = [$scope.charts[0]];
                requestService.refresh(chartarray);
            }
        }
        $scope.monthFormat = function (data, config, e) {
            if ($rootScope.interval == 1) {
                var final_result = chartUtils.getByHourByDayData(data);
                config["noFormat"] = "noFormat";
                config["keyFormat"] = "none";
                config["chartType"] = "line";//图表类型
                cf.renderChart(final_result, config);
            } else {
                var json = JSON.parse(eval("(" + data + ")").toString());
                if (json.length) {
                    if (json[0].key.length == 1) {
                        config["noFormat"] = "noFormat";
                        chartUtils.getXType(config, $rootScope.interval);
                        config["chartType"] = "bar";//图表类型
                        config["bGap"] = true;//图表类型
                        chartUtils.noFormatConvertLabel(json);
                        cf.renderChart(json, config);
                    } else if ($rootScope.interval == -1 && $rootScope.start >= -1) {
                        config["keyFormat"] = "none";
                        config["noFormat"] = "noFormat";
                        config["bGap"] = true;//图表类型
                        chartUtils.getXType(config, $rootScope.interval, $rootScope.start);
                        var final_result = chartUtils.getDataByDay(data);
                        cf.renderChart(final_result, config);
                    } else {
                        config["noFormat"] = undefined;
                        config["chartType"] = "line";//图表类型
                        config["bGap"] = false;//图表类型
                        chartUtils.getXType(config, $rootScope.interval);
                        cf.renderChart(data, config);
                    }
                } else {
                    config["noFormat"] = undefined;
                    config["chartType"] = "line";//图表类型
                    config["bGap"] = false;//图表类型
                    chartUtils.getXType(config, $rootScope.interval);
                    cf.renderChart(data, config);
                }
            }
        }
        $scope.charts = [
            {
                config: {
                    legendId: "moth_charts_legend",
                    legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "新访客数", "新访客比率", "IP数", "跳出率", "平均访问时长", "平均访问页数"],//显示几种数据
                    legendAllowCheckCount: 2,
                    legendClickListener: $scope.onLegendClickListener,
                    legendDefaultChecked: [0, 1],
                    id: "moth_charts",
                    //min_max: false,
                    bGap: false,//首行缩进
                    chartType: "line",//图表类型
                    dataKey: "key",//传入数据的key值
                    dataValue: "quota"//传入数据的value值

                },
                types: ["pv", "uv"],
                dimension: ["period"],
                interval: $rootScope.interval,
                url: "/api/charts",
                cb: $scope.monthFormat
            }];
        $scope.compareLegendData = [];
        $scope.init = function () {
            $rootScope.start = -30;
            $rootScope.end = -1;
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

        $scope.$on("ssh_refresh_charts", function (e, msg) {
            if ($scope.compareType) {
                $scope.compareReset();
            }
            $scope.charts.forEach(function (chart) {
                chart.config.instance = echarts.init(document.getElementById(chart.config.id));
                chart.config.time = chartUtils.getWeekTime($rootScope.start, $rootScope.end);
            });
            requestService.refresh($scope.charts);
            $rootScope.targetSearch();
        });

        $scope.hourcheck = function () {
            $scope.hourcheckClass = true;
            $scope.dayClass = false;
            $scope.timeselect = false;
            $scope.weekcheckClass = false;
            $scope.mothcheckClass = false;
            $rootScope.interval = 1;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.bGap = false;//图表类型
                e.config.instance = chart;
            });
            $rootScope.tableFormat = "hour";
            $rootScope.targetSearch();
            requestService.refresh($scope.charts);
        };
        $scope.weekcheck = function () {
            $scope.weekcheckClass = true;
            $scope.hourcheckClass = false;
            $scope.mothcheckClass = false;
            $scope.dayClass = false;
            $rootScope.interval = 604800000;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.noFormat = undefined;
            });
            $rootScope.tableFormat = "week";
            $rootScope.targetSearch();
            $scope.charts[0].config.keyFormat = "week";
            requestService.refresh($scope.charts);

        };
        $scope.daycheck = function () {
            $scope.dayClass = true;
            $scope.weekcheckClass = false;
            $scope.mothcheckClass = false;
            $scope.mothselected = true;
            $scope.hourcheckClass = false;
            $scope.timeselect = true;
            $rootScope.interval = -1;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.noFormat = undefined;
            });
            $rootScope.tableFormat = "day";
            $rootScope.targetSearch();
            requestService.refresh($scope.charts);
        };
        //2592000000 month
        $scope.mothcheck = function () {
            $scope.weekcheckClass = false;
            $scope.hourcheckClass = false;
            $scope.mothcheckClass = true;
            $scope.dayClass = false;
            $scope.mothselected = false;
            $rootScope.interval = 2592000000;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.noFormat = undefined;
            });
            $rootScope.tableFormat = "month";
            $rootScope.targetSearch();
            $scope.charts[0].config.keyFormat = "month";
            requestService.refresh($scope.charts);
            $scope.dayClass = false;
            $scope.mothcheckClass = false;
        };
        $scope.clear = function () {
            $scope.extendway.selected = undefined;
            $scope.city.selected = undefined;
            $scope.country.selected = undefined;
            $scope.continent.selected = undefined;
            $scope.souce.selected = undefined;
        };
        $scope.extendway = {};
        $scope.extendways = [
            {name: '全部页面目标'},
            {name: '公告'},
            {name: '全部事件目标'},
            {name: '完整下载'},
            {name: '在线下载'},
            {name: '时长目标'},
            {name: '访问页数目标'}
        ];
//        $scope.souce = {};
//        $scope.souces = [
//            {name: '全部'},
//            {name: '直接访问'},
//            {name: '搜索引擎'},
//            {name: '外部链接'}
//        ];
        //日历
        $rootScope.datepickerClick = function (start, end, label) {
            if ($scope.compareType) {
                $scope.compareReset();
            }
            var time = chartUtils.getTimeOffset(start, end);
            var offest = time[1] - time[0];
            $scope.reset();
            if (offest >= 31) {
                $scope.mothselected = false;
                $scope.weekselected = false;
            } else {
                if (offest >= 7) {
                    $scope.weekselected = false;
                } else {
                    $scope.weekselected = true;
                }
                $scope.mothselected = true;
            }
            $rootScope.start = time[0];
            $rootScope.end = time[1];
            $rootScope.interval = -1;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.time = chartUtils.getWeekTime($rootScope.start, $rootScope.end);
            });
            requestService.refresh($scope.charts);
            $rootScope.tableTimeStart = time[0];
            $rootScope.tableTimeEnd = time[1];
            $rootScope.targetSearch();
            $scope.$broadcast("ssh_dateShow_options_time_change");
        }

        //$scope.compareLastDay = function () {
        //    $scope.compareType = 1;
        //    $scope.compareLastDayClass = true;
        //    $scope.compareLastWeekClass = false;
        //    $scope.charts.forEach(function (e) {
        //        var chart = echarts.init(document.getElementById(e.config.id));
        //        e.config.instance = chart;
        //        e.config.legendAllowCheckCount = 1;
        //        e.config.legendDefaultChecked = undefined;
        //        e.types = [chartUtils.convertEnglish(e.config.legendData[0])];
        //        util.renderLegend(chart, e.config);
        //    });
        //    Custom.initCheckInfo();
        //    var todayData = $http.get("api/charts?type=" + chartUtils.convertEnglish($scope.charts[0].config.legendData[0]) + "&dimension=period&start=" + $rootScope.start + "&end=" + $rootScope.end + "&userType=" + $rootScope.userType + "&int=" + $rootScope.interval);
        //    var lastDayData = $http.get("api/charts?type=" + chartUtils.convertEnglish($scope.charts[0].config.legendData[0]) + "&dimension=period&start=" + ($rootScope.start - 1) + "&end=" + ( $rootScope.end - 1) + "&userType=" + $rootScope.userType + "&int=" + $rootScope.interval);
        //    $q.all([todayData, lastDayData]).then(function (res) {
        //        var dateStamp = chartUtils.getDateStamp($rootScope.start);
        //        var final_result = chartUtils.compareTo(res, dateStamp);
        //        $scope.charts[0].config.noFormat = "none";
        //        $scope.charts[0].config.compare = true;
        //        cf.renderChart(final_result, $scope.charts[0].config);
        //    });
        //}

        $scope.compareType = false;
        $rootScope.datePickerCompare = function (start, end, label) {
            var time = chartUtils.getTimeOffset(start, end);
            var offset=time[1]-time[0];
            if (offset == 0) {
                alert("请选择正确的对比时间！");
                return ;
            }
            if ($scope.charts[0].config.compare) {
                $scope.restCompare();
            }
            var times = chartUtils.getTimeOffset(start, end);
         //   $scope.reset();
            $scope.hourselect = true;
            $scope.dayselect = true;
            $scope.mothselected = true;
            $scope.weekselected = true;
            $scope.choiceClass = true;
            $scope.dayClass = false;
            $scope.hourcheckClass = true;
            $rootScope.start = times[0];
            $rootScope.end = times[1];
            $rootScope.interval = -1;
            $(".time_select").hide();
            $scope.compareType = true;
            var type = [chartUtils.convertEnglish($scope.charts[0].config.legendData[0])];
            $scope.compare(times, type, true);
        }
        $scope.compare = function (times, type, legendRender) {
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.legendAllowCheckCount = 1;
                e.config.legendDefaultChecked = undefined;
                e.config.noFormat = true;
                e.config.bGap = false;
                e.config.noFormat = "none";
                e.config.keyFormat = "day";
                e.config.compareCustom = true;
                e.types = type;
                if (legendRender) {
                    e.config.legendData = $scope.compareLegendData;
                    util.renderLegend(chart, e.config);
                    Custom.initCheckInfo();
                }
                var reqRequestStart = $http.get(e.url + "?type=" + e.types + "&dimension=" + e.dimension + "&start=" + times[0] + "&end=" + times[0] + "&userType=" + $rootScope.userType);
                var reqRequestEnd = $http.get(e.url + "?type=" + e.types + "&dimension=" + e.dimension + "&start=" + times[1] + "&end=" + times[1] + "&userType=" + $rootScope.userType);
                e.config.instance.showLoading({
                    text: "正在努力的读取数据中..."
                });
                $q.all([reqRequestStart, reqRequestEnd]).then(function (data) {
                    var final_result = [];
                    data.forEach(function (q) {
                        var json = JSON.parse(eval("(" + q.data + ")").toString());
                        json.forEach(function (item) {
                            if (item.key.length) {
                                var _label = item.key[0].substring(0, 10) + ":" + chartUtils.convertChinese(item.label);
                                var _key = [];
                                item.key.forEach(function (k) {
                                    k = Number(k.toString().substring(10, 13));
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
        $scope.compareReset = function () {
            $(".time_select").show();
            $scope.compareType = false;
           // $scope.reset();
            $scope.choiceClass = false;
            $scope.dayselect = false;
            $scope.hourselect = false;
            $scope.hourcheckClass = false;
            $scope.dayClass = true;
            $rootScope.interval = 1;
            $scope.date = "与其他时间段对比";
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.legendDefaultChecked = [0, 1];
                e.config.legendAllowCheckCount = 2;
                e.config.compareCustom = undefined;
                e.types = [chartUtils.convertEnglish(e.config.legendData[0]), chartUtils.convertEnglish(e.config.legendData[1])];
                util.renderLegend(chart, e.config);
                Custom.initCheckInfo();
            })
            //requestService.refresh($scope.charts);
        }
        //刷新
        function GetDateStr(AddDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
            var y = dd.getFullYear();
            var m = dd.getMonth() + 1;//获取当前月份的日期
            var d = dd.getDate();
            return y + "-" + m + "-" + d;
        }

        $scope.page_refresh = function () {
            $rootScope.start = -29;
            $rootScope.end = 0;
            $rootScope.interval = 1;
            $rootScope.tableTimeStart = -29;
            $rootScope.tableTimeEnd = 0;
            $scope.reloadByCalendar("month");
//            $scope.charts.forEach(function (e) {
//                var chart = echarts.init(document.getElementById(e.config.id));
//                e.config.instance = chart;
//                util.renderLegend(chart, e.config);
//            })
            //图表
//            requestService.refresh($scope.charts);
            //其他页面表格
            // $rootScope.targetSearch(true);
//            $scope.$broadcast("ssh_dateShow_options_time_change");
            //classcurrent
            $scope.reset();
            $scope.monthClass = true;
            $('#reportrange span').html(GetDateStr(-29) + "至" + GetDateStr(0));
        };
        $rootScope.initMailData = function () {
            $http.get("api/saveMailConfig?rt=read&rule_url=" + $rootScope.mailUrl[3] + "").success(function (result) {
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
                formData.rule_url = $rootScope.mailUrl[3];
                formData.uid = $cookieStore.get('uid');
                formData.site_id = $rootScope.siteId;
                formData.type_id=$rootScope.userType;
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
                    text: "month trend data report",
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

});
