/**
 * Created by john on 2015/4/2.
 */
define(["./module"], function (ctrs) {

    'use strict';

    ctrs.controller('searchtermctr_yq', function ($scope, $rootScope, $http, requestService, messageService, areaService, uiGridConstants, popupService) {
            //        高级搜索提示显示
            $scope.terminalSearch = "";
            $scope.areaSearch = "";
//        取消显示的高级搜索的条件
            $scope.removeTerminalSearch = function (obj) {
                $rootScope.$broadcast("loadAllTerminal");
                obj.terminalSearch = "";
            }
            $scope.removeAreaSearch = function(obj){
                $scope.city.selected = {"name": "全部"};
                $rootScope.$broadcast("loadAllArea");
                obj.areaSearch = "";
            }
            $scope.city.selected = {"name": "全部"};
            $scope.todayClass = true;
            $scope.visible = false;
            //table默认信息配置
            $rootScope.tableTimeStart = 0;
            $rootScope.tableTimeEnd = 0;
            $rootScope.tableFormat = null;
            //配置默认指标
            //$rootScope.checkedArray = ["pv", "vc", "nuv", "ip"];
            $rootScope.gridArray = [
                {
                    name: "xl",
                    displayName: "",
                    cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                    maxWidth: 10,
                    enableSorting: false
                },
                {
                    name: "搜索词",
                    displayName: "搜索词",
                    field: "word",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                    enableSorting: false
                },
                {
                    name: "总搜索次数",
                    displayName: "总搜索次数",
                    field: "freq",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>",
                    sort: {
                        direction: uiGridConstants.DESC,
                        priority: 1
                    }
                },
                {
                    name: "百度",
                    displayName: "百度",
                    field: "baidu",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "搜狗",
                    displayName: "搜狗",
                    field: "sougou",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "好搜",
                    displayName: "好搜",
                    field: "haosou",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "必应",
                    displayName: "必应",
                    field: "bing",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "其他",
                    displayName: "其他",
                    field: "other",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                }
            ];
            $rootScope.tableSwitch = {
                latitude: {name: "搜索词", displayName: "搜索词", field: "word"},
                tableFilter: null,
                dimen: false,
                // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
                number: 4,
                //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
                coding: false,
                //"<li><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
                arrayClear: false//是否清空指标array
            };
            //
            $scope.$on("ssh_refresh_charts", function (e, msg) {
                $rootScope.targetSearch();
            });

            //$scope.initMap();
            //点击显示指标
            $scope.visible = false;
            $scope.select = function () {
                $scope.visible = false;
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
//            $scope.charts.forEach(function (e) {
//                var chart = echarts.init(document.getElementById(e.config.id));
//                e.config.instance = chart;
//            });
                //图表
//            requestService.refresh($scope.charts);
                //首页表格
                //requestService.gridRefresh(scope.grids);
                //其他页面表格
                $rootScope.targetSearch(true);
                $scope.reloadByCalendar("today");
                $('#reportrange span').html(GetDateStr(0));
                $scope.$broadcast("ssh_dateShow_options_time_change");
                //classcurrent
                $scope.reset();
                $scope.todayClass = true;
            };

        }
    );

});
