/**
 * Created by yousheng on 15/3/26.
 */

define(['./module'], function (ctrs) {
    'use strict';

    ctrs.controller("indexctr", ['$scope', '$rootScope', '$http', 'requestService', 'messageService', 'areaService', function ($scope, $rootScope, $http, requestService, messageService, areaService) {
        $scope.todayClass = true;
        $scope.hourcheckClass = true;
        $scope.menu_select = false;
        //$rootScope.interval=1;
        $scope.reset = function () {
            $scope.definClass = false;
        };
//        查看更多中函数跳转传递参数
        $scope.is_date_select = function(url) {
            var a ;
            if($scope.todayClass){
               a = 1;
            }else if($scope.yesterdayClass) {
                a = 2;
            }else if($scope.sevenDayClass) {
                a = 3;
            }else if($scope.monthClass) {
                a = 4;
            }else{
                a =  $('#reportrange span').html().split('至');
                a = a[0]+"#"+a[1];
            }
            window.location.href = url+"?"+a;
        }
        $scope.gridOptions = {
            enableColumnMenus: false,
            enableSorting: true,
            enableScrollbars: false,
            enableGridMenu: false,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,

            columnDefs: [

                {name: 'name', displayName: "搜索词"},
                {name: 'value', displayName: "浏览量(PV)", headerCellClass: 'ui_text', cellClass: 'ui_text'}
            ],
            onRegisterApi: function (gridApi) {
                $rootScope.gridApi2 = gridApi;
            }

        };
        $scope.onLegendClickListener = function (radio, chartObj, chartConfig, checkedVal) {
            clear.lineChart($scope.charts[0].config, checkedVal);
            $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
            $scope.charts[0].types = checkedVal;
            var chartArray = [$scope.charts[0]];
            requestService.refresh(chartArray);

        }
        $scope.pieFormat = function (data, config) {
            var json = JSON.parse(eval("(" + data + ")").toString());
            var tmpData = [];
            json.forEach(function (e) {
                e.key.forEach(function (item) {
                    tmpData.push(chartUtils.getDevice(item));
                });
                e.key = tmpData;
            });
            cf.renderChart(json, config);
        }
        $scope.secondChartFormat = function (data, config) {
            var json = JSON.parse(eval("(" + data + ")").toString());
            if (json[0]) {
                json[0].label = chartUtils.convertChinese(json[0].label);
                if (json[0].quota.length > 10) {
                    json[0].quota = json[0].quota.slice(0, 10);
                    json[0].key = json[0].key.slice(0, 10);
                }
                json[0].quota.sort(chartUtils.NumDescSort)
            }
            config["noFormat"] = "noFormat";
            cf.renderChart(json, config);
        }
        $scope.indexLineFormat = function (data, config, e) {
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
                        chartUtils.getXType(config, $rootScope.interval, $rootScope.start);
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
                        config["bGap"] = false;//图表类型
                        chartUtils.getXType(config, $rootScope.interval, $rootScope.start);
                        cf.renderChart(data, config);
                    }
                } else {
                    config["noFormat"] = undefined;
                    config["bGap"] = false;//图表类型
                    chartUtils.getXType(config, $rootScope.interval, $rootScope.start);
                    cf.renderChart(data, config);
                }
            }
        }
        $scope.legendData=[
            {label:'浏览量(PV)',type:'number'},
            {label:'访客数(UV)',type:'number'},
            {label:'IP数',type:'number'},
            {label:'跳出率',type:'percent'},
            {label:'抵达率',type:'percent'},
            {label:'平均访问时长',type:'time'},
            {label:'访问次数',type:'number'},
            {label:'平均访问页数',type:'number'},
        ];
        $scope.charts = [
            {
                config: {
                    legendId: "index_charts_legend",
                    legendData: ["浏览量(PV)", "访客数(UV)", "IP数", "跳出率", "抵达率", "平均访问时长", "访问次数", "平均访问页数"],//显示几种数据
                    legendAllowCheckCount: 2,
                    legendClickListener: $scope.onLegendClickListener,
                    legendDefaultChecked: [0, 1],
                    id: "index_charts",
                    bGap: false,//首行缩进
                    min_max: false,
                    chartType: "line",//图表类型
                    dataKey: "key",//传入数据的key值
                    dataValue: "quota"//传入数据的value值
                },
                types: ["pv", "uv"],
                dimension: ["period"],
                interval: $rootScope.interval,
                url: "/api/charts",
                cb: $scope.indexLineFormat
            },
            {
                config: {
                    min_max: false,//是否显示最大，最小值
                    legendData: [],
                    id: "gest_map",
                    bGap: true,
                    chartType: "bar",
                    auotHidex: true,
                    dataKey: "key",
                    autoInput: 10,
                    keyFormat: 'eq',
                    dataValue: "quota"

                },
                types: ["pv"],
                dimension: ["region"],
                url: "/api/map",
                cb: $scope.secondChartFormat
            },
            {
                config: {
                    legendData: ["移动", "PC"],
                    chartType: "pie",
                    id: "environment_map",
                    serieName: "所占比例",
                    dataKey: "key",
                    dataValue: "quota",
                    legendShow: true
                },
                types: ["pv"],
                dimension: ["pm"],
                url: "/api/pie",
                cb: $scope.pieFormat
            }
        ];
        $scope.grids = [
            {
                config: {
                    gridOptions: $scope.gridOptions
                },
                types: ["pv"],
                dimension: ["kw"],
                url: "/api/pie"
            }
        ]
        $scope.init = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.interval = 1;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                util.renderLegend(chart, e.config);
            })
            requestService.refresh($scope.charts);
            requestService.gridRefresh($scope.grids);
        }
        $scope.init();

        $scope.$on("ssh_refresh_charts", function (e, msg) {
            if ($rootScope.start > -7 && $scope.charts[0].config.keyFormat == "week") {
                $rootScope.interval = -1;
            }
            $scope.charts.forEach(function (chart) {
                chart.config.instance = echarts.init(document.getElementById(chart.config.id));
                chart.config.time = chartUtils.getWeekTime($rootScope.start, $rootScope.end);
            });
            requestService.refresh($scope.charts);
            requestService.gridRefresh($scope.grids);
        });
        $scope.hourcheck = function () {
            $scope.hourcheckClass = true;
            $scope.dayClass = false;
            $scope.timeselect = false;
            $scope.weekcheckClass = false;
            $scope.mothcheckClass = false;
            $rootScope.interval = 1;
            var e = $scope.charts[0];
            var chart = echarts.init(document.getElementById(e.config.id));
            e.config.instance = chart;
            $scope.charts[0].config.bGap = false;//图表类型
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
            var e = $scope.charts[0];
            var chart = echarts.init(document.getElementById(e.config.id));
            e.config.instance = chart;
            e.config.noFormat = undefined;
            requestService.refresh($scope.charts);
        };
        $scope.weekcheck = function () {
            $scope.weekcheckClass = true;
            $scope.hourcheckClass = false;
            $scope.mothcheckClass = false;
            $scope.dayClass = false;
            $rootScope.interval = 604800000;
            var e = $scope.charts[0];
            var chart = echarts.init(document.getElementById(e.config.id));
            e.config.instance = chart;
            e.config.noFormat = undefined;
            $scope.charts[0].config.time = chartUtils.getWeekTime($rootScope.start, $rootScope.end);
            $scope.charts[0].config.keyFormat = "week";
            requestService.refresh($scope.charts);

        };
        //604800000 week
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
            $scope.charts[0].config.keyFormat = "month";
            requestService.refresh($scope.charts);
            $scope.dayClass = false;
            $scope.mothcheckClass = false;
        };

        //下拉框
        $scope.mapChange = function (_this) {
            $scope.charts[1].types = _this.value;
            $scope.charts[1].config.instance = echarts.init(document.getElementById($scope.charts[1].config.id));
            var chartArray = [$scope.charts[1]];
            requestService.refresh(chartArray);
        }
        $scope.equipmentChange = function (_this) {
            $scope.charts[2].types = _this.value;
            $scope.charts[2].config.instance = echarts.init(document.getElementById($scope.charts[2].config.id));
            var chartArray = [$scope.charts[2]];
            requestService.refresh(chartArray);
        }
        $scope.searchChange = function (_this) {
            $scope.grids[0].types = _this.value;
            $scope.gridOptions.columnDefs[1].displayName = _this.name;
            var chartArray = [$scope.grids[0]];
            requestService.gridRefresh(chartArray);
        }

        //index select
        $scope.disabled = undefined;
        $scope.enable = function () {
            $scope.disabled = false;
        };
        $scope.disable = function () {
            $scope.disabled = true;
        };
        $scope.clear = function () {
            $scope.country.selected = undefined;
            $scope.continent.selected = undefined;
        }
        $scope.continent = {};
        $scope.country = {};
        $rootScope.datepickerClick = function (start, end, label) {
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
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
            });
            requestService.refresh($scope.charts);
            requestService.gridRefresh($scope.grids);
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
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.tableTimeStart = 0;
            $rootScope.tableTimeEnd = 0;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
            });
            //图表
            requestService.refresh($scope.charts);
            //首页表格
            requestService.gridRefresh($scope.grids);
            $scope.reloadByCalendar("today");
            $('#reportrange span').html(GetDateStr(0));
            //classcurrent
            $scope.reset();
            $scope.todayClass = true;
        };
        /*       $scope.fileSave = function (obj) {
         if(obj.value=="csv"){
         $scope.gridApi.exporter.csvExport( "all", "visible", angular.element() );
         }
         else{
         $scope.gridApi.exporter.pdfExport( "all", "visible", angular.element() );
         }
         }*/

    }])
})

