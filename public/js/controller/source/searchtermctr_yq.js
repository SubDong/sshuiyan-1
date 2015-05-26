/**
 * Created by john on 2015/4/2.
 */
define(["./module"], function(ctrs) {

    'use strict';

    ctrs.controller('searchtermctr_yq', function ($scope, $rootScope, $http, requestService, messageService, areaService, uiGridConstants) {
            $scope.todayClass = true;
            $scope.visible = false;
            //table默认信息配置
            $rootScope.tableTimeStart = 0;
            $rootScope.tableTimeEnd = 0;
            $rootScope.tableFormat = null;
            //配置默认指标
            //$rootScope.checkedArray = ["pv", "vc", "nuv", "ip"];
            $rootScope.gridArray = [
                {name: "xl", displayName: "序列号", cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",maxWidth:70},
                {name: "搜索词", displayName: "搜索词", field: "word"},
                {name: "总搜索次数", displayName: "总搜索次数", field: "freq"},
                {name: "百度", displayName: "百度", field: "baidu"},
                {name: "搜狗", displayName: "搜狗", field: "sougou"},
                {name: "好搜", displayName: "好搜", field: "haosou"},
                {name: "必应", displayName: "必应", field: "bing"},
                {name: "其他", displayName: "其他", field: "other"}
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
            $scope.visible = true;
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
                {name: '访问页数目标'},
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
        }
    );

});
