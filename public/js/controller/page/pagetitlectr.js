/**
 * Created by john on 2015/4/2.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.directive('pagetitlectrRemoteValidation', function ($http, $cookieStore) {
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
    ctrs.controller('pagetitlectr', function ($scope, areaService, $http, $rootScope, ngDialog, $cookieStore) {


        ////////////////////////////Grid 配置////////////////////////////////////////////////
        $rootScope.adminIndicators = function (item, entities, number, refresh) {
            $rootScope.gridArray.shift();
            $rootScope.gridArray.shift();
            if (refresh == "refresh") {
                $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude);
                return
            }
            $rootScope.tableSwitch.number != 0 ? $scope.gridArray.shift() : "";
            $scope.gridObj = {};
            $scope.gridObjButton = {};
            var a = $rootScope.checkedArray.indexOf(item.name);
            if (a != -1) {
                $rootScope.checkedArray.splice(a, 1);
                $rootScope.gridArray.splice(a, 1);

                if ($rootScope.tableSwitch.number != 0) {
                    $scope.gridObjButton["name"] = " ";
                    $scope.gridObjButton["cellTemplate"] = $scope.gridBtnDivObj;
                    $rootScope.gridArray.unshift($scope.gridObjButton);
                }
                $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude);
            } else {
                if ($rootScope.checkedArray.length >= number) {
                    $rootScope.checkedArray.shift();
                    $rootScope.checkedArray.push(item.name);
                    $rootScope.gridArray.shift();

                    $scope.gridObj["name"] = item.consumption_name;
                    $scope.gridObj["displayName"] = item.consumption_name;
                    $scope.gridObj["field"] = item.name;

                    $rootScope.gridArray.push($scope.gridObj);

                    if ($rootScope.tableSwitch.number != 0) {
                        $scope.gridObjButton["name"] = " ";
                        $scope.gridObjButton["cellTemplate"] = $scope.gridBtnDivObj;
                        $rootScope.gridArray.unshift($scope.gridObjButton);
                    }

                    $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude);
                    $scope.gridObjButton = {};
                    $scope.gridObjButton["name"] = "xl";
                    $scope.gridObjButton["displayName"] = "";
                    $scope.gridObjButton["cellTemplate"] = "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>";
                    $scope.gridObjButton["maxWidth"] = 10;
                    $rootScope.gridArray.unshift($scope.gridObjButton);
                } else {
                    $rootScope.checkedArray.push(item.name);

                    $scope.gridObj["name"] = item.consumption_name;
                    $scope.gridObj["displayName"] = item.consumption_name;
                    $scope.gridObj["field"] = item.name;
                    $rootScope.gridArray.push($scope.gridObj);

                    if ($rootScope.tableSwitch.number != 0) {
                        $scope.gridObjButton["name"] = " ";
                        $scope.gridObjButton["cellTemplate"] = $scope.gridBtnDivObj;
                        $rootScope.gridArray.unshift($scope.gridObjButton);
                    }
                    $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude);
                    $scope.gridObjButton = {};
                    $scope.gridObjButton["name"] = "xl";
                    $scope.gridObjButton["displayName"] = "";
                    $scope.gridObjButton["cellTemplate"] = "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>";
                    $scope.gridObjButton["maxWidth"] = 10;
                    $rootScope.gridArray.unshift($scope.gridObjButton);
                }
            }
            angular.forEach(entities, function (subscription, index) {
                if (subscription.name == item.name) {
                    $scope.classInfo = 'current';
                }
            });
        };
        $rootScope.gridOptions = {
            paginationPageSize: 25,
            expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions'></div>",
            enableColumnMenus: false,
            enablePaginationControls: false,
            enableSorting: true,
            enableGridMenu: false,
            enableHorizontalScrollbar: 0,
            columnDefs: $rootScope.gridArray,
            onRegisterApi: function (girApi) {
                $rootScope.gridApi2 = girApi;
                adminGriApihtml(girApi);
            }
        };
        //配置展开巷HTML
        var adminGriApiInfo = function (gridApi) {
            if (typeof($rootScope.checkedArray) != undefined && $rootScope.tableJu == "html") {
                $scope.gridOpArray = angular.copy($rootScope.gridArray);
                gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                    var tempHtml = $rootScope.adminSetHtml.replace('ex_track_id', row.entity.track_id);//替换
                    var data = [{
                        name: "p",
                        displayName: "",
                        field: 'info',
                        cellTemplate: tempHtml
                    }];

                    row.entity.subGridOptions = {
                        showHeader: false,
                        columnDefs: data
                    };
                    row.entity.subGridOptions.data = [{"info": " "}];
                })
            }
        }
        var adminGriApihtml = function (gridApi) {
            if (typeof($rootScope.checkedArray) != undefined && $rootScope.tableJu == "html") {
                var htmlData = [];
                gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                    row.entity.subGridOptions = {
                        showHeader: false,
                        enableHorizontalScrollbar: 0,
                        columnDefs: htmlData
                    };
                    var res = {};
                    res["name"] = "test";
                    res["field"] = "info";
                    res["cellTemplate"] = $rootScope.adminSetHtml;
                    htmlData.push(res);
                    row.entity.subGridOptions.data = [{"info": " "}];
                });
            }
        };
        ////////////////////////////Grid 配置////////////////////////////////////////////////
        ////////////////////////////数据格式绑定////////////////////////////////////////////////
        $scope.page_title_model = {
            uid: "",
            site_id: "",
            page_url: "",
            icon_name: "",
            is_open: true
        };


        ////////////////////////////数据格式绑定////////////////////////////////////////////////
        ////////////////////////////Grid 内容设置////////////////////////////////////////////////
        $rootScope.checkedArray = ["page_url", "icon_name", "is_open"];
        $rootScope.gridArray = [
            {
                name: "xl",
                displayName: "",
                cellTemplate: "<div class='table_xlh'>1</div>",
                maxWidth: 10
            },
            {
                name: "热力图URL",
                displayName: "热力图URL",
                field: "page_url",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>热力图URL</div>"
            },
            {
                name: "图标名称",
                displayName: "图标名称",
                field: "icon_name",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>图标名称</div>"
            },
            {
                name: "开启状态̬",
                displayName: "开启状态",
                field: "is_open",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>开启状态</div>"
            },
            {
                name: "x3",
                displayName: "",
                cellTemplate: "<div class='table_admin' ><a href=''>修改</a></div>",
                maxWidth: 150
            }, {
                name: "x4",
                displayName: "",
                // grid.appScope.Delete(row, grid.options.data)
                cellTemplate: "<div class='table_admin'><a href='' >删除</a></div>",
                maxWidth: 150
            }
        ];

        $scope.refushGridData = function () {
            var dataArray = [];
            var qryjson = {
                uid: $cookieStore.get("uid"),
                site_id: $rootScope.siteId
            }
            var query = "/config/page_title?type=search&query=" + JSON.stringify(qryjson);
            //console.log(query);
            $http({
                method: 'GET',
                url: query
            }).success(function (dataConfig, status) {
                if (dataConfig != null || $scope.dialog_page_title.length > 0) {
                    $rootScope.gridOptions.data = dataConfig;
                }
            });
        }
        $scope.refushGridData();


        /**
         * 打开添加热力图配置窗口
         */
        $scope.dialog_page_title = angular.copy($scope.page_title_model);
        $scope.dialog_page_title.uid = $cookieStore.get("uid");//uid 设置
        $scope.dialog_page_title.site_id = $rootScope.siteId;//site_id设置
        $scope.openAddDialog = function () {
            //console.log("打开窗口");
            $scope.dialog_page_title.page_url = "";
            $scope.dialog_page_title.icon_name = "";
            $scope.urlDialog = ngDialog.open({
                template: '\
                <form role="form" name="pagetitleForm" class="form-horizontal" novalidate>\
                <div>\
                <li>新增点击图</li><br>\
                </div>\
              <div class="ngdialog-buttons" >\
                   <ul> \
                   <li>点击图名称</li>\
                    <li><input type="text" data-ng-focus="icon_name_focus=true" data-ng-blur="site_name_focus =false" data-ng-model="dialog_page_title.icon_name" class="form-control"/></li> \
                    <li data-ng-show="icon_name_focus && !dialog_page_title.icon_name" style="color: red;">不能为空</li>\
                   <li>您想统计的页面</li>\
                     <li><input type="text" name="remote" pagetitlectr-remote-validation data-ng-focus="page_url_focus = true" data-ng-blur="page_url_focus = false" data-ng-model="dialog_page_title.page_url" class="form-control" required/></li> \
                     <li ng-show="pagetitleForm.remote.$error.remote" style="color: red;">网站域名重复！</li> \
                    <li data-ng-show="page_url_focus && !dialog_page_title.page_url" style="color: red;">不能为空</li>\
                    <br>\
                    <br>\
                    <li><strong>注意：</strong>请在所有想统计的页面上都安装百度统计代码。</li>\
                    </ul>\
                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">返回</button>\
                    <button type="button" ng-disabled="pagetitleForm.$invalid" class="ngdialog-button ngdialog-button-primary" ng-click="submit(0)">确定</button>\
                </div></form>',
                className: 'ngdialog-theme-default',
                plain: true,
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
                page_url: $scope.dialog_page_title.page_url,
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
