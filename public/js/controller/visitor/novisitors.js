/**
 * Created by SubDong on 2015/4/23.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller('novisitors', function ($scope, $rootScope, $http,areaService) {
        $scope.todayClass = true;
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        $rootScope.tableFormat = null;
        //配置默认指标
        $rootScope.checkedArray = ["vc", "uv", "outRate", "avgTime", "avgPage"];
        $rootScope.gridArray = [
            {name: "xl", displayName: "序列号", cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",maxWidth:70},
            {name: "网络供应商", displayName: "网络供应商", field: "ct"},
            {
                name: " ",
                cellTemplate: "<div class='table_box'><a ui-sref='history2' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' class='table_nextbtn'></a></div>"
            },
            {name: "访问次数", displayName: "访问次数", field: "vc"},
            {name: "访客数(UV)", displayName: "访客数(UV)", field: "uv"},
            {name: "跳出率", displayName: "跳出率", field: "outRate"},
            {name: "平均访问时长", displayName: "平均访问时长", field: "avgTime"},
            {name: "平均访问页数", displayName: "平均访问页数", field: "avgPage"}
        ];
        $rootScope.tableSwitch = {
            latitude: {name: "新老访客", displayName: "新老访客", field: "ct"},
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

        $scope.equipmentChange = function (val) {
            $rootScope.tableSwitch.latitude = val;
            val.field == "ips" ? $rootScope.tableSwitch.dimen = "region" : val.field == "pm" ? $rootScope.tableSwitch.dimen = "br" : $rootScope.tableSwitch.dimen = false
            $rootScope.indicators(null, null, null, "refresh");
            $rootScope.targetSearch();
        }

        //日历
        $rootScope.datepickerClick = function (start, end, label) {
            var time = chartUtils.getTimeOffset(start, end);
            $rootScope.tableTimeStart = time[0];
            $rootScope.tableTimeEnd = time[1];
            $rootScope.targetSearch();
        }
    });

});
