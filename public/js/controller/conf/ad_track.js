/**
 * Created by john on 2015/4/1.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('ad_track', function ($scope, $rootScope, $cookieStore, $http, ngDialog,$state) {

        //配置默认指标
        $rootScope.checkedArray = ["_uid", "uid", "type_id", "track_id", "targetUrl", "mediaPlatform", "adTypes", "planName", "keywords", "creative", "produceUrl"];
        $rootScope.gridArray = {
            paginationPageSize: 20,
            paginationPageSizes: [20, 50, 100],
            expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions'></div>",
            expandableRowHeight: 360,
            enableColumnMenus: false,
            enablePaginationControls: true,
            enableSorting: false,
            enableGridMenu: false,
            enableHorizontalScrollbar: 0,
            onRegisterApi: function (girApi) {
                $rootScope.gridApiAdmin = girApi;
                //adminGriApihtml(girApi);
            },
            columnDefs: [
                {
                    name: "xl",
                    displayName: "",
                    cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                    maxWidth: 5
                },
                {name: "目标URL", displayName: "目标URL", field: "targetUrl"},
            /*    {name: "生成日期", displayName: "生成日期", field: "updateTime"},*/
                {name: "媒体平台", displayName: "媒体平台", field: "mediaPlatform"},
                {name: "广告类型", displayName: "广告类型", field: "adTypes"},
                {name: "计划名称", displayName: "计划名称", field: "planName"},
                {name: "关键词", displayName: "关键词", field: "keywords"},
                {name: "创意", displayName: "创意", field: "creative"},
                {
                    name: "x1",
                    displayName: "",
                    cellTemplate: "<div ng-click='grid.appScope.onViewUrl(index,grid,row)'><a href=''>查看生成的URL</a></div>",
                    maxWidth: 110,
                    cellClass: 'table_admin',
                    enableSorting: false
                },
                {
                    name: "x2",
                    displayName: "",
                    cellTemplate: "<div ng-click='grid.appScope.onDelete(index,grid,row)'><a href='' ng-click='onDelete()'>删除</a></div>",
                    maxWidth: 50,
                    cellClass: 'table_admin',
                    enableSorting: false
                } /*,
                 {
                 name: "x8",
                 displayName: "",
                 cellTemplate: "<div class='table_admin' ng-click='grid.appScope.onUpdate(row.entity)'><a href=''>修改</a></div>",
                 maxWidth: 50,
                 enableSorting: false
                 }*/
            ],
            data: [{}]
        };
   /*     //跳转到修改界面
        $scope.onUpdate = function (entity) {
            $state.go('adtrack_add', {'vo': entity});
        };*/
        /**
         * 刪除
         * @param index
         * @param grid
         * @param row
         */
        $scope.onDelete = function (index, grid, row) {
            $scope.onDeleteDialog = ngDialog.open({
                template: '<div class="ngdialog-buttons" ><div class="ngdialog-tilte">系统提示</div><ul class="admin-ng-content" ><li> 确认删除这条广告跟踪吗？</li></ul>' +
                ' <div class="ng-button-div"><button type="button" class="ngdialog-button ng-button" ng-click="sureonDelete()">确定</button></div></div>',
                className: 'ngdialog-theme-default admin_ngdialog',
                plain: true,
                scope: $scope
            });

            //刪除
            $scope.sureonDelete = function () {
                $scope.onDeleteDialog.close();
                var query = "/config/adtrack?type=delete&query={\"_id\":\"" + row.entity._id + "\"}";
                $http({method: 'GET', url: query}).success(function (dataConfig, status) {
                    if (dataConfig == "\"remove\"") {
                        $scope.refushGridData();
                    }
                });
            };
        };

        /**
         * 批量刪除
         */
        $scope.deleteAll = function (index, grid, row) {

            var elements = $scope.gridApiAdmin.selection.getSelectedRows();
            if (elements.length == 0) {
                $scope.onAlertDialog = ngDialog.open({
                    template: '' +
                    '<div class="ngdialog-buttons" ><div class="ngdialog-tilte">系统提示</div><ul class="admin-ng-content" ><li>请勾选要删除的配置项</li></ul> <div class="ng-button-div"><button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">返回</button>\
                    </div></div>',
                    className: 'ngdialog-theme-default admin_ngdialog',
                    plain: true,
                    scope: $scope
                });
                return;
            }


            $scope.onDeleteDialog = ngDialog.open({
                template: '' +
                '<div class="ngdialog-buttons" ><div class="ngdialog-tilte">系统提示</div><ul class="admin-ng-content" ><li>您想批量删除已选择的指定广告跟踪吗？</li></ul> <div class="ng-button-div"><button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">返回</button>\
                  <button type="button" class="ngdialog-button ng-button" ng-click="batchDelete()">确定</button></div></div>',
                className: 'ngdialog-theme-default admin_ngdialog',
                plain: true,
                scope: $scope
            });

            $scope.batchDelete = function () {
                var choiceAll = $scope.gridApiAdmin.selection.getSelectedRows();
                for (var i = 0; i < choiceAll.length; i++) {
                    var val = choiceAll[i]._id;
                    $scope.onDeleteDialog.close();
                    var query = "/config/adtrack?type=delete&query={\"_id\":\"" + val + "\"}";
                    $http({method: 'GET', url: query}).success(function (dataConfig, status) {
                        if (dataConfig == "\"remove\"") {
                            $scope.refushGridData();
                        }
                    });
                }
            }

        };

        /**
         * 刷新
         */
        $scope.refushGridData = function () {
            var uid = $cookieStore.get("uid");
            var site_id = $rootScope.siteId;
            var url = "/config/adtrack?index=adtrack&type=search&query={\"uid\":\"" + uid + "\",\"site_id\":\"" + site_id + "\"}";
            $http({method: 'GET', url: url}).success(function (dataConfig) {
                $scope.gridArray.data = dataConfig;
            });
        };
        $scope.refushGridData();

        /**
         * 查看生成的URL
         * @param index
         * @param grid
         * @param row
         */
        $scope.onViewUrl = function (index, grid, row) {
            var thtml = $rootScope.urlDialogHtml.replace("produceUrl", row.entity.produceUrl);
            //col
            $scope.urlDialog = ngDialog.open({
                template: thtml,
                className: 'ngdialog-theme-default admin_ngdialog',
                plain: true,
                scope: $scope
            });
        };
        $rootScope.urlDialogHtml = "<div class='mid_left'><div class=\"ngdialog-tilte\">生成URL</div ><div class='admin-ng-content'><div id='base_code' class='mid_left_code'>produceUrl</div> " +
        "<div class='mid_right'><button type='button' class='btn btn-default navbar-btn' ssh-clip='' data-clipboard-target='base_code'>复制</button><ul type='disc'>" +
        "  <li style='color：red；'>请将生成的URL复制到你的其他媒介的推广目标URL位置</li></ul></div></div>";

    });

});
