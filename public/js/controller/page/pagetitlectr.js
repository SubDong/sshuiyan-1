/**
/**
 * Created by john on 2015/4/2.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.directive('pagetitlectrRemoteValidation', function ( $cookieStore,$http,uiGridConstants) {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                elm.bind('keyup', function () {
                    var uid = $cookieStore.get("uid");
                    //var url = "/config/site_list?type=search&query={\"uid\":\"" + uid + "\",\"site_url\":\"" + scope.urlconfig.site_url + "\"}";
                    //$http({method: 'GET', url: url}).
                    //    success(function (data, status) {
                    //        if (data.length > 0) {
                    //            ctrl.$setValidity('remote', false);
                    //        } else {
                    //            ctrl.$setValidity('remote', true);
                    //        }
                    //    }).
                    //    error(function (data, status, headers, config) {
                    //        ctrl.$setValidity('remote', false);
                    //    });


                });
            }
        };
    });
    ctrs.controller('pagetitlectr', function ($cookieStore,$scope, areaService, $http, $rootScope, ngDialog, $state) {



        $scope.page_title_model = {
            uid: "",
            site_id: "",
            page_url: "",
            icon_name: "",
            create_date: new Date().Format("yyyy-MM-dd hh:mm:ss"),
            is_open: true
        };
        $scope.dialog_page_title = angular.copy($scope.page_title_model);
        $scope.dialog_page_title.uid = $cookieStore.get("uid");//uid 设置
        $scope.dialog_page_title.site_id = $rootScope.siteId;//site_id设置


        //对象-对话框
        $scope.urlDialog = null;

        //前台录入的路径
        $scope.pageUrl = "";





        $rootScope.checkedArray = [""];
        $rootScope.gridArray = [
            {
                name: "xl",
                displayName: "",
                cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                maxWidth: 6,
                enableSorting: false
            },
            {
                name: "热力图URL",
                displayName: "热力图URL",
                field: "page_url",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>热力图URL</div>",
                enableSorting: false
            },
            {
                name: "图标名称",
                displayName: "图标名称",
                field: "icon_name",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>图标名称</div>",
                enableSorting: false
            },
            {name: "创建时间", displayName: "创建时间", field: "create_date",cellClass: 'table_admin_color'},
            {
                name: "x0",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a href='' data-ng-click='grid.appScope.openHeatUrl(row.entity)'>查看链接点击图</a></div>",
                maxWidth: 120,
                enableSorting: false
            },
            {
                name: "x1",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a href='' data-ng-click='grid.appScope.openHeat(row.entity)'>查看热力图</a></div>",
                maxWidth: 120,
                enableSorting: false
            },

            {
                name: "x2",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a href='' data-ng-click='grid.appScope.operationStatus(row.entity)'>{{row.entity.is_open == true ? '启动':'暂停' }}</a></div>",
                maxWidth: 80,
                enableSorting: false
            },
            {
                name: "x3",
                displayName: "",
                // grid.appScope.Delete(row, grid.options.data)
                cellTemplate: "<div class='table_admin'><a href='' data-ng-click='grid.appScope.deleteDialog(row.entity)'>删除</a></div>",
                maxWidth: 150,
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

        $rootScope.gridOptions = {
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



        /**打开热力图*/
        $scope.openHeat = function (entity) {

            $state.go('heat',{ 'rf':entity.page_url});
            //window.open("http://localhost:8000/page/heaturl.html");

            //window.open("http://www.jb51.net");
        }


        /**打开热力连接图*/
        $scope.openHeatUrl = function (entity) {
            $state.go('heaturl',{ 'rf':entity.page_url});
        }


        /**操作-修改状态*/
        $scope.operationStatus = function (entity) {

            entity.is_open = !entity.is_open;

            var url = "/config/page_title?type=update&query={\"_id\":\"" + entity._id + "\"}&updates={\"is_open\":\"" + entity.is_open + "\"}";

            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {});

        }

        //显示-删除对话框
        $scope.deleteDialog=function(entity){

            $scope.entity = entity;

            $scope.urlDialog = ngDialog.open({
                template:'\
              <div class="ngdialog-buttons" >\
                        <ul>\
                        <li> 你确定删除这条热力图记录吗？</li></ul>   \
                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click=closeThisDialog(0)>返回</button>\
                    <button type="button" class="ngdialog-button ng-button" ng-click=deleteGridData()>确定</button>\
                </div>',
                className: 'ngdialog-theme-default',
                plain: true,
                scope : $scope
            });
        };

        //操作-删除
        $scope.deleteGridData  = function () {

            //后台删除
            var url= "/config/page_title?type=delete&query={\"uid\":\"" + $scope.entity.uid + "\",\"_id\":\"" +  $scope.entity._id + "\"}";
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                //页面删除
                $scope.gridOptions.data.splice($scope.gridOptions.data.indexOf($scope.entity), 1);
                $scope.urlDialog.close();
            });
        }

        //操作-查询
        $scope.searchGridData = function () {

            if($scope.dialog_page_title.uid == undefined) {
                $scope.dialog_page_title.uid = $cookieStore.get("uid");//uid
            }
            var uid = $scope.dialog_page_title.uid;
            var root_url = $scope.dialog_page_title.site_id;
            var page_url = $scope.pageUrl;

            var url = "/config/page_title?type=search&query={\"uid\":\"" + uid + "\",\"site_id\":\"" + root_url + "\",\"page_url\":\"" + page_url + "\"}";
            if(page_url == null || page_url == undefined || page_url == "") {
               url = "/config/page_title?type=search&query={\"uid\":\"" + uid + "\",\"site_id\":\"" + root_url + "\"}";
            }


            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                $rootScope.gridOptions.data = dataConfig;

            });
        };


        //操作-初始化
        $scope.refushGridData = function () {

            if($scope.dialog_page_title.uid == undefined) {
                $scope.dialog_page_title.uid = $cookieStore.get("uid");//uid
            }

            var uid = $scope.dialog_page_title.uid;
            var root_url = $scope.dialog_page_title.site_id;
            var url = "/config/page_title?type=search&query={\"uid\":\"" + uid + "\",\"site_id\":\"" + root_url + "\"}";
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                $rootScope.gridOptions.data = dataConfig;

            });
        };
        $scope.refushGridData();




        /**
         * 打开添加热力图配置窗口*/

        $scope.openAddDialog = function () {
            //console.log("打开窗口");
            $scope.dialog_page_title.page_url = "";
            $scope.dialog_page_title.icon_name = "";
            $scope.urlDialog = ngDialog.open({
                template: './conf/Dialog/pagetitle_dialog.html',
                className: 'ngdialog-theme-default admin_ngdialog',
                scope: $scope
            });
        };


        /**
         * 增加网站配置时候 添加配置
         * @param cliecked
         */
        $scope.submit = function (cliecked) {
            //用户ID+url 确定该用户对某个网站是否进行配置
            var qryjson = {
                uid: $scope.dialog_page_title.uid,
                site_id: $scope.dialog_page_title.site_id,
                page_url: $scope.dialog_page_title.page_url
            }
            var query = "/config/page_title?type=search&query=" + JSON.stringify(qryjson);
            //console.log(query);
            $http({
                method: 'GET',
                url: query
            }).success(function (dataConfig, status) {
                //console.log(dataConfig )
                if (dataConfig == null ||dataConfig == 0) {
                    var url = "/config/page_title?type=save&entity=" + JSON.stringify($scope.dialog_page_title);
                    //console.log(url);
                    $http({
                        method: 'GET',
                        url: url
                    }).success(function (dataConfig, status) {
                        $scope.refushGridData();
                    });
                }
            });

            $scope.urlDialog.close();
        };


        /**
         * 打开添加热力图配置窗口
         */
        $scope.openAddDialog = function () {
            //console.log("打开窗口");
            $scope.dialog_page_title.page_url = "";
            $scope.dialog_page_title.icon_name = "";
            $scope.urlDialog = ngDialog.open({
                template: './conf/Dialog/pagetitle_dialog.html',
                className: 'ngdialog-theme-default admin_ngdialog',
                scope: $scope
            });
        };


        /**
         * 增加网站配置时候 添加配置
         * @param cliecked
         */
        $scope.submit = function (cliecked) {
            //用户ID+url 确定该用户对某个网站是否进行配置
            var qryjson = {
                uid: $scope.dialog_page_title.uid,
                site_id: $scope.dialog_page_title.site_id,
                page_url: $scope.dialog_page_title.page_url
            }
            var query = "/config/page_title?type=search&query=" + JSON.stringify(qryjson);
            //console.log(query);
            $http({
                method: 'GET',
                url: query
            }).success(function (dataConfig, status) {
                //console.log(dataConfig )
                if (dataConfig == null ||dataConfig == 0) {
                    var url = "/config/page_title?type=save&entity=" + JSON.stringify($scope.dialog_page_title);
                    //console.log(url);
                    $http({
                        method: 'GET',
                        url: url
                    }).success(function (dataConfig, status) {
                        $scope.refushGridData();
                    });
                }
            });

            $scope.urlDialog.close();
        };




    });

});
