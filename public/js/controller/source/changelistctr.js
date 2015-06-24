/**
 * Created by ss on 2015/6/23.
 */
define(["./module"], function (ctrs) {

    'use strict';
    ctrs.controller('changelistctr', function ($scope, $rootScope, $q, $http, requestService, messageService, areaService, uiGridConstants,popupService) {
          $scope.yesterdayClass = true;
          $scope.lastWeek = true;
          $scope.lastMonth = true;
          $scope.visible = true;

            $rootScope.gridArray = [
                {
                    name: "xl",
                    displayName: "",
                    cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                    maxWidth: 10
                },
                {
                    name: "来源域名",
                    displayName: "来源域名",
                    field: "kw",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>"
                },
                {
                    name: "浏览量(PV)",
                    displayName: "2015-06-11",
                    field: "pv",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "访问次数",
                    displayName: "2015-06-10",
                    field: "vc",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: " ",
                    headerCellTemplate: '<div class="change_list">' +
                        '<a href="javascript:void(0)" class="rise">+升</a>' +
                        '<a href="javascript:void(0)" class="descend">-降</a>' +
                        '<a href="javascript:void(0)" class="flat">平</a>' +
                        '<a href="javascript:void(0)" class="all">全部</a>' +
                        '</div>'
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
        }
    );

});
