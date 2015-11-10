/**
 * Created by XiaoWei on 2015/4/22.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller('equipmentctr', function ($scope, $rootScope, $q, $http, requestService, areaService, $location,uiGridConstants) {
        //客户端属性初始化
        $scope.equipment.selected = {"name": "网络设备类型", "field": "pm"};
        if($location.url().split("?").length>1) {
            var param = $location.url().split("?")[1];
            if(param == 1){
                $scope.todayClass = true;
            }else if(param == 2){
                $scope.yesterdayClass = true;
            }else if(param == 3){
                $scope.sevenDayClass = true;
            }else if(param == 4){
                $scope.monthClass = true;
            }
        }else{
            $scope.todayClass = true;
        }

        $scope.dt = new Date();
        //table配置
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        //配置默认指标
        $rootScope.checkedArray = ["pv", "uv", "ip", "outRate", "avgTime"];
        //ng-click='grid.appScope.getHistoricalTrend(this)'
        $rootScope.gridArray = [
            {
                name: "xl",
                displayName: "",
                cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                maxWidth: 10,
                enableSorting: false
            },
            {
                name: "网络设备类型",
                displayName: "网络设备类型",
                field: "pm",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                enableSorting: false
            },
            {
                name: "浏览量(PV)",
                displayName: "浏览量(PV)",
                field: "pv",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>",
                sort: {
                    direction: uiGridConstants.DESC,
                    priority: 1
                }
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
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>",
                enableSorting: false
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
            latitude: {name: "网络设备类型", displayName: "网络设备类型", field: "pm"},
            tableFilter: null,
            dimen: "os",
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 0,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: false,
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false //是否清空指标array
        };
        //
        $scope.isShowExpandable = function (e) {
            return e.pm == "暂无数据";
        };

        $scope.reset = function () {
            $scope.todayClass = false;
            $scope.yesterdayClass = false;
            $scope.sevenDayClass = false;
            $scope.monthClass = false;
            $scope.definClass = false;
        };
        $scope.equipmentChange = function (val) {
            $scope.charts[0].keyFormat = "wq";
            $scope.charts[0].dimension = val.field;
            if ($scope.compareType) {
                var times = [$rootScope.start, $rootScope.end];
                $scope.compare(times, chartUtils.convertEnglish($scope.compareLegendData[0]), true);
                return;
            }
            $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
            requestService.refresh($scope.charts);

            $rootScope.tableSwitch.latitude = val;
            val.footerCellTemplate = "<div class='ui-grid-cell-contents'>当页汇总</div>";
            val.field == "isp" ? $rootScope.tableSwitch.dimen = "region" : val.field == "pm" ? $rootScope.tableSwitch.dimen = "os" : $rootScope.tableSwitch.dimen = false;
            $rootScope.indicators(null, null, null, "refresh");
            $rootScope.$broadcast("ssh_data_show_refresh");
            $rootScope.targetSearch();
        };
        $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
            if ($scope.compareType) {
                var times = [$rootScope.start, $rootScope.end];
                $scope.compare(times, checkedVal);
            } else {
                $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
                $scope.charts[0].types = checkedVal;
                var chartArray = [$scope.charts[0]];
                requestService.refresh(chartArray);
            }
        }
        $scope.pieFormat = function (data, config) {
            var json = JSON.parse(eval("(" + data + ")").toString());
            config["noFormat"] = "noFormat";
            util.getEquipmentData(json, $scope.equipment.selected);

            json.forEach(function(item){
                if(item.key.length>10){
                    item.key=item.key.slice(0,10);
                    item.quota=item.quota.slice(0,10);
                }
            });
            cf.renderChart(json, config);
        }
        $scope.charts = [
            {
                config: {
                    legendId: "equipment_legend",
                    legendData: ["浏览量(PV)", "访问次数", "访客数(UV)", "新访客数", "新访客比率", "IP数", "跳出率", "平均访问时长", "平均访问页数"],
                    legendClickListener: $scope.onLegendClick,
                    legendAllowCheckCount: 2,
                    legendDefaultChecked: [0, 1],
                    min_max: false,
                    bGap: true,
                    id: "equipment",
                    chartType: "bar",
                    dataKey: "key",
                    auotHidex: true,
                    keyFormat: 'eq',
                    dataValue: "quota"
                },
                types: ["pv", "vc"],
                dimension: ["pm"],
                interval: $rootScope.interval,
                url: "/api/charts",
                cb: $scope.pieFormat
            }
        ]
        $scope.compareLegendData = [];
        $scope.init = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
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
            $rootScope.targetSearch();
            var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
            $scope.charts[0].config.instance = chart;
            requestService.refresh($scope.charts);
        });


        $scope.checkopen = function ($event) {
            $scope.reset();
            $scope.definClass = true;
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opens = true;
        };
        //日历
        $rootScope.datepickerClick = function (start, end, label) {
            if ($scope.compareType) {
                $scope.compareReset();
            }
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
            requestService.refresh($scope.charts);
            $rootScope.tableTimeStart = time[0];
            $rootScope.tableTimeEnd = time[1];
            $rootScope.targetSearch();
            $scope.$broadcast("ssh_dateShow_options_time_change");
        }

        $scope.compareType = false;
        $scope.datePickerCompare = function (start, end, lable) {
            var times = chartUtils.getTimeOffset(start, end);
            var type = [chartUtils.convertEnglish($scope.charts[0].config.legendData[0])];
            $rootScope.start = times[0];
            $rootScope.end = times[1];
            if ($rootScope.start == $rootScope.end) {
                alert("请选择正确的对比时间");
                return;
            }
            $scope.compare(times, type, true);
            $scope.reset();
            $scope.choiceClass = true;
            $scope.compareType = true;
        }

        $scope.compare = function (times, type, legendRender) {
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.legendAllowCheckCount = 1;
                e.config.legendDefaultChecked = undefined;
                e.config.noFormat = true;
                e.config.compare = true;
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
                    var _dateTime = chartUtils.getSetOffTime(times[0], times[1], "/");
                    var final_result = util.getEquipmentDataCompare(data, $scope.equipment.selected, _dateTime);
                    cf.renderChart(final_result, e.config);
                });
            });
        }
        $scope.compareReset = function () {
            $scope.compareType = false;
            $scope.choiceClass = false;
            $rootScope.interval = 1;
            $scope.date = "与其他时间段对比";
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                e.config.legendDefaultChecked = [0, 1];
                e.config.legendAllowCheckCount = 2;
                e.config.compareCustom = undefined;
                e.config.compare = undefined;
                e.types = [chartUtils.convertEnglish(e.config.legendData[0]), chartUtils.convertEnglish(e.config.legendData[1])];
                util.renderLegend(chart, e.config);
                Custom.initCheckInfo();
            })
            //requestService.refresh($scope.charts);
        }

        //刷新
        $scope.page_refresh = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.tableTimeStart = 0;
            $rootScope.tableTimeEnd = 0;
//            $scope.charts.forEach(function (e) {
//                var chart = echarts.init(document.getElementById(e.config.id));
//                e.config.instance = chart;
//            });
            $scope.reloadByCalendar("today");
            $('#reportrange span').html(GetDateStr(0));
            //图表
//            requestService.refresh($scope.charts);
            //其他页面表格
//            $rootScope.targetSearch();
            //classcurrent
            $scope.reset();
            $scope.todayClass = true;
        };


        // 构建PDF数据
        $scope.generatePDFMakeData = function (cb) {
            var dataInfo = angular.copy($rootScope.gridApi2.grid.options.data);
            var dataHeadInfo = angular.copy($rootScope.gridApi2.grid.options.columnDefs);
            var _tableBody = $rootScope.getPDFTableBody(dataInfo, dataHeadInfo);
            var docDefinition = {
                header: {
                    text: "Visitor Equipment Map Data Report",
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
