/**
 * Created by john on 2015/4/2.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller('urlspeedctr', function ($scope, $rootScope, requestService, areaService, $http) {
        $scope.todayClass = true;

        //table默认信息配置
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        $rootScope.tableFormat = null;
        //配置默认指标
        $rootScope.checkedArray = ["", "", ""];
        $rootScope.gridArray = [
            {name: "xl", displayName: "序列号", cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",maxWidth:70},
            {name: "计划", field: "loc"},
            {
                name: " ",
                cellTemplate: "<div class='table_box'><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' class='table_nextbtn'></a></div>"
            },
            {name: "访问次数", field: "pv"},
            {name: "访客数(UV)",displayName: '访客数(UV)', disfield: "uv"},
            {name: "平均访问时长", field: "avgTime"}
        ];
        $rootScope.tableSwitch = {//$rootScope.targetSearchSpread();
            latitude: {name: "计划", field: "loc"},
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
        $scope.reset = function () {
            $scope.todayClass = false;
            $scope.yesterdayClass = false;
            $scope.sevenDayClass = false;
            $scope.monthClass = false;
            $scope.definClass = false;
        };
      // $scope.init();


        //$scope.initMap();
        //点击显示指标
        $scope.visible = true;
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
            {name: '访问页数目标'},
        ];
        //日历
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
            requestService.gridRefresh($scope.grids);

        }

        this.removeFromSelected = function (dt) {
            this.selectedDates.splice(this.selectedDates.indexOf(dt), 1);
        }
    });

});

