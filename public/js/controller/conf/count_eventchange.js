/**
 * Created by john on 2015/4/1.
 */
define(["./module"], function (ctrs ) {
    "use strict";

    ctrs.controller('count_eventchange', function ($cookieStore,$scope, $q, $rootScope,$http,ngDialog, $state) {

        //对象-对话框
        $scope.urlDialog = null;
        //对象-记录
        $scope.entity = null;

        //操作-删除
        $scope.deleteGridData  = function () {

            //后台删除
            var url= "/config/eventchnage_list?type=delete&query="+JSON.stringify({
                    root_url:$scope.entity.root_url,
                    event_page:$scope.entity.event_page,
                    event_id:$scope.entity.event_id

                });
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                //页面删除
                $scope.gridOptions.data.splice($scope.gridOptions.data.indexOf($scope.entity), 1);
                $scope.urlDialog.close();
            });
        };

        //显示-删除对话框
        $scope.deleteDialog=function(entity){

            $scope.entity = entity;

            $scope.urlDialog = ngDialog.open({
                template:'\
              <div class="ngdialog-buttons" ><div class="ngdialog-tilte">系统提示</div>\
                        <ul class="admin-ng-content">\
                        <li class="fl warningImg"><img src="../../../img/remove_warning.png"></li><li class="fl warningWord">选择删除，此事件的全部历史数据将被清空，不再显示，您确定删除吗？</li></ul>   \
                   <div class="ng-button-div"> <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">返回</button>\
                    <button type="button" class="ngdialog-button ng-button" ng-click=" deleteGridData()  ">确定</button></div>\
                </div>',
                className: 'ngdialog-theme-default admin_ngdialog',
                plain: true,
                scope : $scope
            });
        };


        //跳转-修改界面
        $scope.toUpdate= function (entity) {
            if(entity.event_method=="手动方式"){
                $scope._id = entity._id;
                $scope.urlDialog = ngDialog.open({
                    template:'../conf/webcountsite/eventchange_update.html',
                    className:'ngdialog-theme-default admin_ngdialog ',
                    scope: $scope
                });
            }else if(entity.event_method=="自动"){
                $state.go('eventchange_add', {'url': entity.event_page});
            }

        };
        $scope.operationEventTarget = function (entity) {
            entity.event_target = !entity.event_target
            var url = "/config/eventchnage_list?type=update&query={\"_id\":\"" + entity._id + "\"}&updates={\"event_target\":\"" + entity.event_target + "\"}";
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                entity.event_target_des = entity.event_target?"是":"否"
            });
        };
        $scope.operationStatus = function (entity) {
            entity.event_status = entity.event_status == '0' ? '1':'0';
            var url = "/config/eventchnage_list?type=update&query={\"_id\":\"" + entity._id + "\"}&updates={\"event_status\":\"" + entity.event_status + "\"}";
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {});
        };
        //配置默认指标
        $rootScope.checkArray = ["", "", ""];

        $rootScope.gridArray = [
            {
                name: "xl",
                displayName: "",
                cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                maxWidth: 5,
                enableSorting: false
            },
            {name: "事件名称", displayName: "事件名称", field: "event_name",cellClass: 'table_admin_color', enableSorting: false},
            {name: "生成日期", displayName: "生成日期", field:"update_time_desc",cellClass: 'table_admin_color', enableSorting: true},
            {name: "事件元素ID", displayName: "事件元素ID", field: "event_id",cellClass: 'table_admin_color', enableSorting: false},
            {name: "事件预览页面", displayName: "事件预览页面", field: "event_page",cellClass: 'table_admin_color', enableSorting: false},
            {name: "事件作用页面或目录", displayName: "事件作用或目录", field: "event_page",cellClass: 'table_admin_color', enableSorting: false},
 /*           {name: "记录方式", displayName: "记录方式", field: "event_method",cellClass: 'table_admin_color',enableSorting: false},*/
            {name: "是否为事件转化目标", displayName: "是否为事件转化目标", field: "event_target_des",cellClass: 'table_admin_color',enableSorting: false},
            {
                name: "x4",
                displayName: "设置转化目标",
                cellTemplate: "<div class='table_admin'><a href='' data-ng-click='grid.appScope.operationEventTarget(row.entity)'>{{row.entity.event_target ? '取消':'设置' }}</a></div>",
                maxWidth: 100,
                enableSorting: false
            },
            {
                name: "x5",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a href='' data-ng-click='grid.appScope.operationStatus(row.entity)'>{{row.entity.event_status == '0' ? '重新启用':'暂停使用' }}</a></div>",
                maxWidth: 80,
                enableSorting: false
            },
            {
                name: "x6",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a  ng-click='grid.appScope.toUpdate(row.entity)' >修改</a></div>",
                maxWidth: 80,
                enableSorting: false
            },
            {
                name: "x7",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a ng-click='grid.appScope.deleteDialog(row.entity)' >删除</a></div>",
                maxWidth: 50,
                enableSorting: false
            }
        ];
        $rootScope.tableSwitch = {
            latitude: {name: "网站域名", displayName: "网站域名", field: ""},
            tableFilter: null,
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 0,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: false,
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false //是否清空指标array
        };

        $scope.gridOptions = {
            paginationPageSize:20,
            paginationPageSizes: [20, 50, 100],
            expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions'></div>",
            expandableRowHeight: 360,
            enableColumnMenus: false,
            enablePaginationControls: true,
            enableSorting: true,
            enableGridMenu: false,
            enableHorizontalScrollbar: 0,
            columnDefs: $rootScope.gridArray,

            onRegisterApi: function (girApi) {
                $rootScope.gridApiAdmin = girApi;
            }
        };

        //操作-初始化
        var refushGridData = function () {
            var uid = $cookieStore.get("uid");
            var root_url = $rootScope.siteId;
            var url = "/config/eventchnage_list?type=search&query={\"uid\":\"" + uid + "\",\"root_url\":\"" + root_url + "\"}";
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                $scope.gridOptions.data = dataConfig;
                $scope.gridOptions.data.forEach(function(item){
                    item.event_target_des = item.event_target?"是":"否"
                    item["update_time_desc"] = new Date(item.update_time).format("yyyy-MM-dd hh:mm:ss")
                })
            });
        };
        /**
         * 批量刪除
         */
        $scope.deleteAll = function (index, grid, row) {


            $scope.onDeleteDialog = ngDialog.open({
                template: '' +
                '<div class="ngdialog-buttons" ><div class="ngdialog-tilte">系统提示</div><ul class="admin-ng-content" ><li class="fl warningImg"><img src="../../../img/remove_warning.png"></li><li class="fl warningWord" style="line-height: 34px">您想批量删除已选择的事件转化目标吗？</li></ul> <div class="ng-button-div"><button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">返回</button>\
                  <button type="button" class="ngdialog-button ng-button" ng-click="batchDelete()">确定</button></div></div>',
                className: 'ngdialog-theme-default admin_ngdialog',
                plain: true,
                scope: $scope
            });

            $scope.batchDelete = function () {
                var choiceAll = $scope.gridApiAdmin.selection.getSelectedRows();
                //$rootScope.gridOptions.data.splice(index,1)
                for (var i = 0; i < choiceAll.length; i++) {
                    var val = choiceAll[i]._id;
                    $scope.onDeleteDialog.close();
                    var query = "/config/eventchnage_list?type=delete&query={\"_id\":\"" + val + "\"}";
                    $http({method: 'GET', url: query}).success(function (dataConfig, status) {
                        if (dataConfig == "\"success\"") {
                        }
                    });
                    $scope.gridOptions.data.splice($scope.gridOptions.data.indexOf(choiceAll[i]), 1);
                }
            };


        };
        /**
         * 初始化数据
         */

        refushGridData();
        //全选


    });
});
