/**
 * Created by john on 2015/4/1.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('eventchange', function ($scope, $q, $rootScope,$cookieStore,$http,ngDialog, $state) {

        //对象-对话框
        $scope.urlDialog = null;
        //对象-记录
        $scope.entity = null;

        //操作-删除
        $scope.deleteGridData  = function () {

            //后台删除
            var url= "/config/eventchnage_list?type=delete&query={\"uid\":\"" + $scope.entity.uid + "\",\"_id\":\"" +  $scope.entity._id + "\"}";
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                //页面删除
                console.log("删除成功 关闭窗口")
                $scope.gridOptions.data.splice($scope.gridOptions.data.indexOf($scope.entity), 1);
                $scope.urlDialog.close();
            });
        }

        //显示-删除对话框
        $scope.deleteDialog=function(entity){

            $scope.entity = entity;

            $scope.urlDialog = ngDialog.open({
                template:'\
              <div class="ngdialog-buttons" >\
                        <ul>\
                        <li> 你确定删除这个事件转化吗？</li></ul>   \
                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click=closeThisDialog(0)>返回</button>\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=deleteGridData()>确定</button>\
                </div>',
                className: 'ngdialog-theme-default',
                plain: true,
                scope : $scope
            });
        };


        //跳转-修改界面
        $scope.toUpdate = function (entity) {

            $state.go('eventchange_update',{ 'id':entity._id});

        }

        $scope.operationStatus = function (entity) {

            entity.event_status = entity.event_status == '0' ? '1':'0';


            var url = "/config/eventchnage_list?type=update&query={\"_id\":\"" + entity._id + "\"}&updates={\"event_status\":\"" + entity.event_status + "\"}";

            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {});



        }

        //配置默认指标
        $rootScope.checkArray = ["", "", ""];

        $rootScope.gridArray = [

            {name: "事件目标事件名称", displayName: "事件目标事件名称", field: "event_name",cellClass: 'table_admin'},
            {name: "事件元素ID", displayName: "事件元素ID", field: "event_id",cellClass: 'table_admin'},
            {name: "事件作用或目录", displayName: "事件作用或目录", field: "event_page",cellClass: 'table_admin'},
            {name: "记录方式", displayName: "记录方式", field: "event_method",cellClass: 'table_admin'},
            {
                name: "x4",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a href='' data-ng-click='grid.appScope.operationStatus(row.entity)'>{{row.entity.event_status == '0' ? '启动':'暂停' }}</a></div>",
                maxWidth: 80
            },
            {
                name: "x5",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a  ng-click='grid.appScope.toUpdate(row.entity)' >修改</a></div>",
                maxWidth: 80
            },
            {
                name: "x6",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a ng-click='grid.appScope.deleteDialog(row.entity)' >删除</a></div>",
                maxWidth: 80
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
            paginationPageSize: 25,
            expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions'></div>",
            expandableRowHeight: 360,
            enableColumnMenus: false,
            enablePaginationControls: false,
            enableSorting: true,
            enableGridMenu: false,
            enableHorizontalScrollbar: 0,
            columnDefs: $rootScope.gridArray
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

            });
        };
        refushGridData();

    });
});
