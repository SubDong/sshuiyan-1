/**
 * Created by john on 2015/4/3.
 */
define(["app"], function (app) {

    "use strict";

    app.controller('wayctrl', function ($timeout, $scope, $rootScope, $q, $http, requestService, areaService, SEM_API_URL) {
        $scope.areaSearch = "";
        $scope.removeAreaSearch = function(obj){
            $rootScope.tableSwitch.tableFilter = null;
            obj.areaSearch = "";
        }
        $scope.city.selected = {"name": "全部"};
        $scope.visible = true;
        $rootScope.tableTimeStart = -1;//开始时间
        $rootScope.tableTimeEnd = -1;//结束时间、
        $scope.compareType = false;//对比标识
        //配置默认指标
        $rootScope.checkedArray = ["click", "cost", "cpc", "pv", "uv", "avgPage"];
        $rootScope.tableFormat = null;
        $rootScope.gridArray = [
            {
                name: "xl",
                displayName: "",
                cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                maxWidth: 10
            },
            {
                name: "推广方式",
                displayName: "推广方式",
                field: "accountName",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                minWidth: 200
            },
            {
                name: " ",
                cellTemplate: "<div class='table_box'><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' class='table_nextbtn' title='查看历史趋势'></a></div>"

            },
            {
                name: "点击量",
                displayName: "点击量",
                field: "click",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "消费",
                displayName: "消费",
                field: "cost",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "平均点击价格",
                displayName: "平均点击价格",
                field: "cpc",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
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
                name: "平均访问页数",
                displayName: "平均访问页数",
                field: "avgPage",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            }
        ];
        $rootScope.tableSwitch = {
            latitude: {name: "推广方式", displayName: "推广方式", field: "accountName"},
            tableFilter: null,
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 1,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: false,
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false, //是否清空指标array
            promotionSearch: true //是否开始推广中sem数据
        };
        $scope.reset = function () {
            $scope.todayClass = false;
            $scope.yesterdayClass = false;
            $scope.sevenDayClass = false;
            $scope.monthClass = false;
            $scope.definClass = false;
        };

        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $rootScope.targetSearch();
            if ($scope.compareType) {
                $scope.otherDateCompareReset();
            } else {
                $scope.init($rootScope.user, $rootScope.baiduAccount, "account", $scope.selectedQuota, $rootScope.start, $rootScope.end);
            }

            //$scope.doSearchAreas($scope.tableTimeStart, $scope.tableTimeEnd, "1", $scope.mapOrPieConfig);
        });

        $scope.selectedQuota = ["click", "impression"];
        $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
            $scope.selectedQuota = checkedVal;
            if ($scope.compareType) {
                var times = [$rootScope.start, $rootScope.end];
                $scope.otherDateCompare("account", times, checkedVal);
            } else {
                if (checkedVal.length) {
                    $scope.init($rootScope.user, $rootScope.baiduAccount, "account", $scope.selectedQuota, $rootScope.start, $rootScope.end);
                } else {
                    def.defData($scope.charts[0].config);
                }
            }
        }
        $scope.charts = [
            {
                config: {
                    legendId: "indicators_charts_legend",
                    legendData: ["点击量", "展现量", "消费", "点击率", "平均点击价格", "浏览量(PV)", "访问次数", "访客数(UV)", "新访客数", "新访客比率", "跳出率", "平均访问时长", "抵达率"],
                    legendClickListener: $scope.onLegendClick,
                    //legendMultiData: $rootScope.lagerMulti,
                    legendAllowCheckCount: 2,
                    legendDefaultChecked: [0, 1],
                    bGap: true,
                    min_max: false,
                    id: "indicators_charts",
                    chartType: "bar",
                    noFormat: true,
                    dataKey: "key",
                    keyFormat: 'eq',
                    dataValue: "quota"
                }
            }
        ];
        //*************推广*********************/

        $scope.compareResult = [];
        //**************************************/
        $scope.init = function (user, baiduAccount, semType, quotas, start, end, renderLegend) {
            var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
            $scope.charts[0].config.instance = chart;
            chart.showLoading({
                effect: 'whirling',
                text: "正在努力的读取数据中..."
            });
            var requestParams = chartUtils.qAll(quotas);
            var requestArray = [];
            if (requestParams[0] != "") {
                //var test = SEM_API_URL + "/sem/report/"+semType+"?a=" + user + "&b=" + baiduAccount + "&startOffset=" + start + "&endOffset=" + end+"&q="+requestParams[0];
                var semRequest = $http.get(SEM_API_URL + "/sem/report/" + semType + "?a=" + user + "&b=" + baiduAccount + "&startOffset=" + start + "&endOffset=" + end + "&q=" + requestParams[0]);
                semRequest.error(function (e) {
                    console.error(e);
                })
                requestArray.push(semRequest);
            }
            if (requestParams[1].length) {
                var esRequest = $http.get("/api/charts/?type=" + requestParams[1].toString() + "&dimension=one&start=" + start + "&end=" + end + "&userType=" + $rootScope.userType);
                requestArray.push(esRequest);
            }
            $q.all(requestArray).then(function (res) {
                var final_result = chartUtils.getSearchTypeResult(quotas, res);
                var count = util.existData(final_result);
                if (count) {
                    $scope.charts[0].config.chartType = "bar";
                    $scope.charts[0].config.bGap = true;
                    if ($scope.compareResult.length) {
                        //console.log($scope.compareResult);
                    }
                    cf.renderChart(final_result, $scope.charts[0].config);
                } else {
                    def.defData($scope.charts[0].config);
                }
                if (renderLegend) {
                    util.renderLegend(chart, $scope.charts[0].config);
                    Custom.initCheckInfo();
                }
            });


        }
        $scope.yesterday = function () {
            $scope.reset();
            $scope.yesterdayClass = true;
            $rootScope.start = -1;
            $rootScope.end = -1;
            $scope.init($rootScope.user, $rootScope.baiduAccount, "account", $scope.selectedQuota, $rootScope.start, $rootScope.end, true);
        };
        // initialize
        $scope.yesterday();
        //$scope.initMap();
        $scope.disabled = undefined;
        $scope.enable = function () {
            $scope.disabled = false;
        };

        $scope.disable = function () {
            $scope.disabled = true;
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
        $scope.country = {};
        $scope.countrys = [
            {name: '中国'},
            {name: '泰国'}

        ];
        $scope.continent = {};
        $scope.continents = [
            {name: '亚洲'},
            {name: '美洲 '}
        ];
        //日历
        $rootScope.datepickerClick = function (start, end, label) {

            var time = chartUtils.getTimeOffset(start, end);
            $rootScope.start = time[0];
            $rootScope.end = time[1];
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
            })
            if ($rootScope.start <= -1) {
                $scope.charts[0].config.keyFormat = "day";
            } else {
                $scope.charts[0].config.keyFormat = "hour";
            }
            if ($scope.compareType) {
                $scope.otherDateCompareReset();
            } else {
                $scope.init($rootScope.user, $rootScope.baiduAccount, "account", $scope.selectedQuota, $rootScope.start, $rootScope.end);
            }
            $rootScope.targetSearch();
            $rootScope.tableTimeStart = time[0];
            $rootScope.tableTimeEnd = time[1];
            $scope.$broadcast("ssh_dateShow_options_time_change");
        }
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
            $rootScope.start = -1;
            $rootScope.end = -1;
            $scope.init($rootScope.user, $rootScope.baiduAccount, "account", $scope.selectedQuota, $rootScope.start, $rootScope.end, true);
            $rootScope.tableTimeStart = -1;
            $rootScope.tableTimeEnd = -1;
            //图表
            requestService.refresh($scope.charts);
            $scope.reloadByCalendar("today");
            $('#reportrange span').html(GetDateStr(0));
            //classcurrent
            $scope.reset();
            $scope.yesterdayClass = true;
        };
        $rootScope.datePickerCompare = function (start, end, label) {
            $scope.compareType = true;
            // $scope.reset();
            $scope.choiceClass = true;
            var times = chartUtils.getTimeOffset(start, end);
            $rootScope.start = times[0];
            $rootScope.end = times[1];
            if (times[0] == 0 && times[1] == 0) {
                alert("请选择正确的对比时间!");
            } else {
                var type = chartUtils.convertEnglish($scope.charts[0].config.legendData[0]);
                $scope.otherDateCompare("account", times, [type], true);
            }
        };
        $scope.otherDateCompare = function (semType, times, type, legendRender) {
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.legendAllowCheckCount = 1;
                e.config.legendDefaultChecked = undefined;
                e.types = type;
                e.config.noFormat = "none";
                if (legendRender) {
                    util.renderLegend(chart, e.config);
                    Custom.initCheckInfo();
                }
                chart.showLoading({
                    text: "正在努力的读取数据中..."
                });
            });
            var requestParams = chartUtils.qAll(type);
            var requestArray = [];
            if (requestParams[0] != "") {
                var semRequest = $http.get(SEM_API_URL + "/sem/report/" + semType + "?a=" + $rootScope.user + "&b=" + $rootScope.baiduAccount + "&startOffset=" + times[0] + "&endOffset=" + times[0] + "&q=" + requestParams[0]);
                requestArray.push(semRequest);
                if (times[1] != 0) {
                    var semRequestCompare = $http.get(SEM_API_URL + "/sem/report/"+semType+"?a=" + $rootScope.user  + "&b=" + $rootScope.baiduAccount + "&startOffset=" + times[1] + "&endOffset=" + times[1]+"&q="+requestParams[0]);
                    requestArray.push(semRequestCompare);
                }
            }
            if (requestParams[1].length) {
                var esRequest = $http.get("/api/charts/?type=" + requestParams[1].toString() + "&dimension=period&start=" + times[0] + "&end=" + times[0] + "&userType=" + $rootScope.userType);
                requestArray.push(esRequest);
                var esRequestCompare = $http.get("/api/charts/?type=" + requestParams[1].toString() + "&dimension=period&start=" + times[1] + "&end=" + times[1] + "&userType=" + $rootScope.userType);
                requestArray.push(esRequestCompare);
            }
            $q.all(requestArray).then(function (res) {
                var final_result = [];
                res.forEach(function (item) {
                    if (item.data[0][type]) {
                        var _tmp = {};
                        _tmp["key"] = ["搜索推广"];
                        _tmp["quota"] = [item.data[0][type]];
                        _tmp["label"] = item.data[0]["date"] + " " + chartUtils.convertChinese(type.toString());
                        final_result.push(_tmp);
                    } else {
                        var _tmpJson = JSON.parse(eval("(" + item.data + ")").toString());
                        var _tmp = {};
                        var count = 0;
                        _tmpJson.forEach(function (item) {
                            item.quota.forEach(function (quota) {
                                count += quota;
                            });
                            _tmp["key"] = ["搜索推广"];
                            _tmp["quota"] = [count];
                            _tmp["label"] = item.key[0].substring(0, 10) + " " + chartUtils.convertChinese(type.toString());
                            final_result.push(_tmp);
                        });
                    }
                });
                cf.renderChart(final_result, $scope.charts[0].config);
            });
        }
        $scope.otherDateCompareReset = function () {
            $scope.compareType = false;
            $scope.selectedQuota = ["click", "impression"];
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.legendAllowCheckCount = 2;
                e.config.legendDefaultChecked = [0, 1];
                e.types = [chartUtils.convertEnglish($scope.charts[0].config.legendData[0]), chartUtils.convertEnglish($scope.charts[0].config.legendData[1])];
                e.config.noFormat = "none";
                util.renderLegend(chart, e.config);
                Custom.initCheckInfo();
            });
            $scope.init($rootScope.user, $rootScope.baiduAccount, "account", $scope.selectedQuota, $rootScope.start, $rootScope.end);
        }

    });
})
;
