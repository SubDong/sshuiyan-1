/**
 * Created by john on 2015/4/2.
 */
define(["./module"], function (ctrs) {

    'use strict';
    ctrs.controller('searchtermctr', function ($scope, $rootScope, $q, $http, requestService, messageService, areaService, uiGridConstants,popupService,$location) {
            //        高级搜索提示显示
            $scope.terminalSearch = "";
            $scope.areaSearch = "";
//        取消显示的高级搜索的条件
            $scope.removeTerminalSearch = function(obj){
                $rootScope.$broadcast("loadAllTerminal");
                obj.terminalSearch = "";
            }
            $scope.removeAreaSearch = function(obj){
                $scope.city.selected = {"name": "全部"};
                $rootScope.$broadcast("loadAllArea");
                obj.areaSearch = "";
            }
            $scope.city.selected = {"name": "全部"};
            $scope.visible = false;
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
            //table默认信息配置
            $rootScope.tableTimeStart = 0;
            $rootScope.tableTimeEnd = 0;
            $rootScope.tableFormat = null;
            //配置默认指标
            $rootScope.checkedArray = ["pv", "vc", "nuv", "ip"];
            $rootScope.gridArray = [
                {
                    name: "xl",
                    displayName: "",
                    cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                    maxWidth: 10
                },
                {
                    name: "搜索词",
                    displayName: "搜索词",
                    field: "kw",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>"
                },
                {
                    name: " ",
                    cellTemplate: "<div class='table_box'>" +
                    "<button onmousemove='getMyButton(this)' class='table_btn'></button>" +
                    "<div class='table_win'>" +
                    "<ul style='color: #45b1ec'>" +
                    "<li><a>查看相关热门搜索词</a></li>" +
                    "<li><a ng-click='grid.appScope.showSearchUrl(row)'>查看搜索来路URL</a></li>" +
                    "<li><a ui-sref='history6' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' target='_blank'>查看历史趋势</a></li>" +
                    "</ul>" +
                    "</div>" +
                    "</div>"
                },
                {
                    name: "浏览量(PV)",
                    displayName: "浏览量(PV)",
                    field: "pv",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "访问次数",
                    displayName: "访问次数",
                    field: "vc",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "新访客数",
                    displayName: "新访客数",
                    field: "nuv",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "IP数",
                    displayName: "IP数",
                    field: "ip",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                }
            ];
            $scope.showSearchUrl = function (row) {
                popupService.showSourceData(row.entity.kw);
            };
            $rootScope.tableSwitch = {
                latitude: {name: "搜索词", displayName: "搜索词", field: "kw"},
                tableFilter: null,
                dimen: false,
                // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
                number: 2,
                //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
                coding: "<li><a>查看相关热门搜索词</a></li>" +
                "<li><a ng-click='grid.appScope.showSearchUrl()'>查看搜索来路URL</a></li>" +
                "<li><a ui-sref='history6' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent'>查看历史趋势</a></li>",
                //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
                arrayClear: false //是否清空指标array
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
            $rootScope.datepickerClick = function (start, end, label) {
                var time = chartUtils.getTimeOffset(start, end);
                $rootScope.tableTimeStart = time[0];
                $rootScope.tableTimeEnd = time[1];
                $rootScope.targetSearch();
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
                $rootScope.start = 0;
                $rootScope.end = 0;
                $rootScope.tableTimeStart = 0;
                $rootScope.tableTimeEnd = 0;
//                $scope.charts.forEach(function (e) {
//                    var chart = echarts.init(document.getElementById(e.config.id));
//                    e.config.instance = chart;
//                });
                //图表
//                requestService.refresh($scope.charts);
                //首页表格
                //requestService.gridRefresh(scope.grids);
                $scope.reloadByCalendar("today");
                $('#reportrange span').html(GetDateStr(0));
                //其他页面表格
                $rootScope.targetSearch();
                //classcurrent
                $scope.reset();
                $scope.todayClass = true;
            };
        }
    );

});
