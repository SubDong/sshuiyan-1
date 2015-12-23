/**
 * Created by XiaoWei on 2015/5/15.
 */
define(["./../module"], function (ctrs) {

    "use strict";

    ctrs.controller('search_tg_ctr', function ($scope, $rootScope, $cookieStore, requestService, areaService, $http, uiGridConstants) {
        $scope.todayClass = true;
        //        高级搜索提示
        $scope.areaSearch = "";
        $scope.removeAreaSearch = function(obj){
            $scope.city.selected = {"name": "全部"};
            $rootScope.$broadcast("searchLoadAllArea");
            obj.areaSearch = "";
        }
        $scope.city.selected = {"name": "全部"};
        $rootScope.tableTimeStart = -1;//开始时间
        $rootScope.tableTimeEnd = -1;//结束时间、
        $rootScope.tableFormat = null;
        //配置默认指标
        $rootScope.checkedArray = ["impression", "cost", "cpc", "outRate", "avgTime", "nuvRate"]
        $rootScope.searchGridArray = [
            {
                name: "xl",
                displayName: "",
                cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                maxWidth: 10,
                enableSorting: false
            },
            {
                name: "关键词对应的URL",
                displayName: "关键词对应的URL",
                field: "des_url",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                enableSorting: false
            },
            {
                name: "展现",
                displayName: "展现",
                field: "impression",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>",
                sort: {
                    direction: uiGridConstants.DESC,
                    priority: 1
                }
            },
            {
                name: "消费",
                displayName: "消费",
                field: "cost",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "平均点击价格",
                displayName: "平均点击价格",
                field: "cpc",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "跳出率",
                displayName: "跳出率",
                field: "outRate",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "平均访问时长",
                displayName: "平均访问时长",
                field: "avgTime",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "新访客比率",
                displayName: "新访客比率",
                field: "nuvRate",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
            }
        ];
        $rootScope.tableSwitch = {
            latitude: {name: "关键词对应的URL", displayName: "关键词对应的URL", field: "des_url"},
            tableFilter: null,
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 5,  //特例  当number等于5时  表示为推广url
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: false,
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false, //是否清空指标array
            promotionSearch: {
                turnOn: true, //是否开始推广中sem数据
                SEMData: "keyword" //查询类型
            }
        };


        $scope.charts = [
            {
                config: {
                    legendId: "indicators_charts_legend",
                    legendData: ["浏览量(PV)", "访客数(UV)", "跳出率", "抵达率", "平均访问时长", "页面转化"],//显示几种数据
                    legendMultiData: $rootScope.lagerMulti,
                    legendAllowCheckCount: 2,
                    legendClickListener: $scope.onLegendClickListener,
                    id: "indicators_charts",
                    bGap: false,//首行缩进
                    chartType: "line",//图表类型
                    dataKey: "key",//传入数据的key值
                    dataValue: "quota"//传入数据的value值
                },
                types: ["pv", "uv"],
                dimension: ["period"],
                interval: $rootScope.interval,
                url: "/api/charts"
            }
        ];
        $scope.init = function () {
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
                //util.renderLegend(chart, e.config);
            })
            requestService.refresh($scope.charts);
        }
        $scope.init();

        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $rootScope.targetSearchSpread();
        });

        //点击显示指标
        $scope.visible = false;
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
        $scope.dateClosed = function () {
            $rootScope.start = $scope.startOffset;
            $rootScope.end = $scope.endOffset;
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
            $rootScope.targetSearch();
            $rootScope.tableTimeStart = $scope.startOffset;
            $rootScope.tableTimeEnd = $scope.endOffset;
            $scope.$broadcast("ssh_dateShow_options_time_change");
        };
        //

        this.selectedDates = [new Date().setHours(0, 0, 0, 0)];
        //this.type = 'range';
        /*      this.identity = angular.identity;*/
        //$scope.$broadcast("update", "msg");
        $scope.$on("update", function (e, datas) {
            // 选择时间段后接收的事件
            datas.sort();
            //console.log(datas);
            var startTime = datas[0];
            var endTime = datas[datas.length - 1];
            $scope.startOffset = (startTime - today_start()) / 86400000;
            $scope.endOffset = (endTime - today_start()) / 86400000;
            //console.log("startOffset=" + startOffset + ", " + "endOffset=" + endOffset);
        });

        /**
         * 自定义日期刷新
         * @param start
         * @param end
         */
        $rootScope.datepickerClick = function (start, end) {
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
            $rootScope.targetSearchSpread();
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
            })
            requestService.refresh($scope.charts);
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
    });

});
