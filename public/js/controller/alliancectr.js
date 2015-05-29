/**
 * Created by john on 2015/4/2.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller('alliancectr', function ($scope, $rootScope, $http, requestService, messageService) {
        $scope.visibles = true;
        $scope.todayClass = true;
        //table默认信息配置
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        $rootScope.tableFormat = null;
        //配置默认指标
        $rootScope.checkedArray = ["", "", ""];
        $rootScope.gridArray = [
            {name: "xl", displayName: "", cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",maxWidth:10},
            {name: "计划", field: "loc"},
            {
                name: " ",
                cellTemplate: "<div class='table_box'><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' class='table_nextbtn' title='查看历史趋势'></a></div>"
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
        $scope.today = function () {
            $scope.reset();
            $scope.todayClass = true;
            $scope.dt = new Date();

            //table配置
            $rootScope.tableTimeStart = 0;
            $rootScope.tableTimeEnd = 0;
            //$rootScope.targetSearchSpread();
            //

        };
        $scope.yesterday = function () {
            $scope.reset();
            $scope.yesterdayClass = true;

            //table配置
            $rootScope.tableTimeStart = -1;
            $rootScope.tableTimeEnd = -1;
            //$rootScope.targetSearchSpread();
            //

        };
        $scope.sevenDay = function () {
            $scope.reset();
            $scope.sevenDayClass = true;

            //table配置
            $rootScope.tableTimeStart = -7;
            $rootScope.tableTimeEnd = -1;
            //$rootScope.targetSearchSpread();
            //
        };
        $scope.month = function () {
            $scope.reset();
            $scope.monthClass = true;

            //table配置
            $rootScope.tableTimeStart = -30;
            $rootScope.tableTimeEnd = -1;
            //$rootScope.targetSearchSpread();
            //

        };
        $scope.open = function ($event) {
            $scope.reset();
            $scope.definClass = true;
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };
        $scope.checkopen = function ($event) {
            $scope.reset();
            $scope.othersdateClass = true;
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opens = true;
        };
        // initialize
        $scope.today();
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
            {name: '访问页数目标'}
        ];
        //日历
        this.selectedDates = [new Date().setHours(0, 0, 0, 0)];
        this.type = 'range';
        /*      this.identity = angular.identity;*/

        this.removeFromSelected = function (dt) {
            this.selectedDates.splice(this.selectedDates.indexOf(dt), 1);
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
        $scope.page_refresh = function(){
//            $rootScope.start = -1;
//            $rootScope.end = -1;
//            $rootScope.tableTimeStart = -1;//开始时间
//            $rootScope.tableTimeEnd = -1;//结束时间、
//            $rootScope.tableFormat = null;
//            $rootScope.targetSearchSpread();
//            $scope.init($rootScope.user, $rootScope.baiduAccount, "creative", $scope.selectedQuota, $rootScope.start, $rootScope.end);
            //图表
//            requestService.refresh($scope.charts);
            //其他页面表格
            //classcurrent
            $scope.$broadcast("ssh_dateShow_options_time_change");
            $scope.reloadByCalendar("yesterday");
            $('#reportrange span').html(GetDateStr(-1));
            $scope.reset();
            $scope.yesterdayClass = true;
        };
    });

});
