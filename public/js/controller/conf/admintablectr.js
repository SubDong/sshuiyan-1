/**
 * Created by Fzk lwek on 2015/5/27.
 */
define(["../module"], function (app) {

    "use strict";

    app.controller("admintablectr", function ($timeout, $scope, $rootScope, $http,$cookieStore) {
        $scope.site_config={
            uid: "", // user i
            site_url: "", // site url
            site_name: "", // site name
            track_code: "", // js track id
            track_status: "", // track code status
            status: "", // enable or disable track
            type_id: "" // es type id ( hidden in front-end)
        };

        //
        //if($rootScope.tableSwitch.number == 6){
        //    $scope.tableJu = "html";
        //}

        $rootScope.adminIndicators = function (item, entities, number, refresh) {
            console.log("adminIndicators");
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
            //$rootScope.$broadcast("ssh_reload_datashow");
        };
        //
        if (typeof($rootScope.checkedArray) != undefined && $scope.tableJu == "html") {
            $scope.gridOptions = {
                paginationPageSize: 25,
                expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions'></div>",
                expandableRowHeight: 360,
                enableColumnMenus: false,
                enablePaginationControls: false,
                enableSorting: true,
                enableGridMenu: false,
                enableHorizontalScrollbar: 0,
                columnDefs: $rootScope.gridArray,
                onRegisterApi: function (girApi) {
                    $scope.gridApi2 = girApi;
                    adminGriApihtml(girApi);
                }
            };
        } else {
            $scope.gridOptions = {
                paginationPageSize: 25,
                expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions'></div>",
                expandableRowHeight: 360,
                enableColumnMenus: false,
                enablePaginationControls: false,
                enableSorting: true,
                enableGridMenu: false,
                enableHorizontalScrollbar: 0,
                columnDefs: $rootScope.gridArray,
                onRegisterApi: function (gridApi) {
                    $scope.gridApi2 = gridApi;
                    if ($rootScope.tableSwitch.dimen) {
                        adminGriApiInfo(gridApi);
                    }
                }
            };
        }

        /**
         * 初始化数据
         */
        var initGridData = function(){
            var uid= $cookieStore.get("uid");
            var site_id=$rootScope.userType;
            var url= "/config/conf?index=site_list&type=search&query={\"uid\":\""+uid+"\"}";
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                //console.log("获取网站列表数据");
                //数据拼装
                //var urls=[];
                //var names=[];
                //dataConfig.forEach(function(item,i){
                //    urls[i]=item.site_url;
                //    names[i]=item.site_name
                //});
                $scope.gridOptions.data = dataConfig;
            });
        };
        initGridData();

        //var addSiteConfig=function(){
        //    $scope.site_config.uid = $cookieStore.get("uid");
        //    $scope.site_config.site_url = "www.perfect.com";
        //    $scope.site_config.site_name="普菲特";
        //    var query= "/config/conf?index=site_list&type=search&query={\"uid\":\""+$scope.site_config.uid+"\",\"site_url\":\""+$scope.site_config.site_url+"\"}";
        //    $http({
        //        method: 'GET',
        //        url: query
        //    }).success(function (dataConfig, status) {
        //        console.log("获取网站列表数据");
        //        console.log(angular.toJson($scope.site_config));
        //        if(dataConfig==null||dataConfig.length==0){//不存在配置 save
        //
        //            var url= "/config/conf?index=site_list&type=save&entity="+angular.toJson($scope.site_config);
        //            $http({
        //                method: 'GET',
        //                url: url
        //            }).success(function (dataConfig, status) {
        //                console.log("保存网站列表数据");
        //            });
        //        }else{//update
        //            var url= "/config/conf?index=site_list&type=update&query={\"uid\":\""+$scope.site_config.uid+"\",\"site_url\":\""+$scope.site_config.site_url+"\"}&updates="+angular.toJson($scope.site_config);;
        //            $http({
        //                method: 'GET',
        //                url: url
        //            }).success(function (dataConfig, status) {
        //                console.log("更新网站列表数据");
        //            });
        //
        //        }
        //
        //    });
        //};
        //addSiteConfig();

        //$scope.gridOptions.data = [{a:"aaaaaaaaaa",b:"bbbbbbbbbb",c:"ccccccccc"},{a:"dddddddddd",b:"eeeeeeeee",c:"ccccccccc"}];


        $scope.page = "";
        $scope.pagego = function (pagevalue) {
            pagevalue.pagination.seek(Number($scope.page));
        };

        //��ͨ���չ����
        var adminGriApiInfo = function (gridApi) {
//            $scope.gridOptions.data = [{a:"<div class='table_admin'>aaaaaaaaaa</div>",b:"bbbbbbbbbb",c:"ccccccccc"},{a:"dddddddddd",b:"eeeeeeeee",c:"ccccccccc"}]
        };

        //����HTML ���չ����
        var adminGriApihtml = function(gridApi){
            var htmlData = [];
            gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                console.log("+++++++++"+row);
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
        };
    });
});