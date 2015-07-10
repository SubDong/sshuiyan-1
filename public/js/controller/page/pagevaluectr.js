/**
 * Created by SubDong on 2015/4/23.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller('pagevaluectr', function ($scope, $rootScope,areaService,uiGridConstants) {
        //        高级搜索提示
        $scope.sourceSearch = "";
        $scope.visitorSearch = "";
//        取消显示的高级搜索的条件
        $scope.removeSourceSearch = function(obj){
            $scope.souce.selected = {"name": "全部"};
            $rootScope.$broadcast("loadAllSource");
            obj.sourceSearch = "";
        }
        $scope.removeVisitorSearch = function(obj){
            $rootScope.$broadcast("loadAllVisitor");
            obj.visitorSearch = "";
        }
        $scope.souce.selected = {"name": "全部"};
        $scope.browser.selected = {"name": "全部"};
        $scope.todayClass = true;
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        $rootScope.tableFormat = null;
        //配置默认指标
        $rootScope.checkedArray = ["pv", "uv"];
        $rootScope.gridArray = [
            {
                name: "xl",
                displayName: "",
                cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                maxWidth: 10,
                enableSorting: false
            },
            {
                name: "页面url",
                displayName: "页面url",
                field: "loc",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                enableSorting: false
            },
            {
                name: " ",
                cellTemplate: "<div class='table_box'><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' class='table_nextbtn' title='查看历史趋势'></a></div>",
                enableSorting: false
            },
            {
                name: "浏览量(PV)",
                displayName: '浏览量(PV)',
                field: "pv",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>",
                sort: {
                    direction: uiGridConstants.DESC,
                    priority: 1
                }
            },
            {
                name: "访客数(UV)",
                displayName: '访客数(UV)',
                field: "uv",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            }
        ];
        $rootScope.tableSwitch = {
            latitude: {name: "页面url", field: "loc"},
            tableFilter: null,
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 1,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: false,
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false //是否清空指标array
        };

        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $rootScope.targetSearch();
        });
        //日历
        $rootScope.datepickerClick = function (start, end, label) {
            var time = chartUtils.getTimeOffset(start, end);
            $rootScope.tableTimeStart = time[0];
            $rootScope.tableTimeEnd = time[1];
            $rootScope.targetSearch();
            $scope.$broadcast("ssh_dateShow_options_time_change");
            $scope.$broadca
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
            //其他页面表格
            $scope.reloadByCalendar("today");
            $('#reportrange span').html(GetDateStr(0));
            $rootScope.targetSearch();
            //classcurrent
            $scope.reset();
            $scope.todayClass = true;
        };
    });

});
