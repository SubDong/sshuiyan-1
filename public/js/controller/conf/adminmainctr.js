/**
 * Created by john on 2015/4/1.
 */

define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('adminmainctr', function ($scope, $q, $rootScope, $http, requestService,ngDialog,$cookieStore) {


        $scope.sites_model = {

            //_id: String, // mongoid
            uid: "", // user id 用户ID
            type_id: "", // es type id ( hidden in front-end) 对应ES ID
            track_id: "", // js track id 随机生成
            site_url: "", // site url 设置的URL
            site_name: "", // site name 设置的URL
            site_pause: false,//配置暂停 true：暂停 false：使用
            track_status: "" // track code status
            //status: String, // enable or disable track

        };
        $scope.urlconfig = {
            "site_url": "",
            "site_name": ""
        };

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
        //table配置
        $rootScope.adminSetHtml = "<div class='mid_left'><div class='mid_left_code'> 邓子豪</div> </div><div class='mid_right'><button type='button' class='btn btn-default navbar-btn'>复制代码</button><ul type='disc'>" +
            "  <li>请将代码添加至网站全部页面的&lt;/head&gt;标签前；</li><li>建议在header.htm类似的页头模板页面中安装，以达到一处安装，全站皆有的效果；</li><li>如需在JS文件中调用统计分析代码，请直接去掉以下代码首尾的&lt;script type='text/javascript' &gt;与&lt;/script&gt;后，放入JS文件中即可；</li>" +
            "<li> 如果代码安装正确，一般20分钟 后,可以查看网站分析数据；</li></ul></div>";
        //配置默认指标
        //配置默认指标
        $rootScope.checkedArray = ["", "", ""];
        $rootScope.gridArray = [
            {name: "xl", displayName: "", cellTemplate: "<div class='table_xlh'>1</div>", maxWidth: 5},
            {name: "网站域名", displayName: "网站域名", field: "site_url", maxWidth: '', cellClass: 'table_admin'},

            {name: "网站名称", displayName: "网站名称", field: "site_name", maxWidth: '', cellClass: 'table_admin'},
            {name: "首页代码状态", displayName: "首页代码状态", field: "track_code", maxWidth: 500, cellClass: 'table_admin'},
            {
                name: "x6",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a href=''>获取代码</a><span class='glyphicon glyphicon-file'></span></div>",
                maxWidth: 100
            },
            {
                name: "x2",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a href=''>查看网站概览</a></div>",
                maxWidth: 100
            },
            {
                name: "x3",
                displayName: "",
                cellTemplate: "<div class='table_admin'><span class='glyphicon glyphicon-cog'></span><a href=''>设置</a></div>",
                maxWidth: 80
            },
            {
                name: "x4",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a href=''>暂停</a></div>",
                maxWidth: 80
            },
            {
                name: "x5",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a href=''>删除</a></div>",
                maxWidth: 80
            }

        ];

        $rootScope.tableSwitch = {
            latitude: {name: "网站域名", displayName: "网站域名", field: ""},
            tableFilter: null,
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 6,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: false,
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false //是否清空指标array
        };
        //
        $scope.dt = new Date();
        $scope.onLegendClickListener = function (radio, chartObj, chartConfig, checkedVal) {
            if ($scope.charts[0].config.compare) {
                var time = $rootScope.start;
                if ($scope.compareType == 2) {
                    time = $rootScope.start - 7;
                }
                $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
                var todayData = $http.get("api/charts?type=" + checkedVal + "&dimension=period&start=" + time + "&end=" + time + "&userType=" + $rootScope.userType + "&int=" + $rootScope.interval);
                var lastDayData = $http.get("api/charts?type=" + checkedVal + "&dimension=period&start=" + (time - 1) + "&end=" + ( time - 1) + "&userType=" + $rootScope.userType + "&int=" + $rootScope.interval);
                console.log("*********`" + todayData);
                console.log("*********1" + lastDayData);
                $q.all([todayData, lastDayData]).then(function (res) {
                    var dateStamp = chartUtils.getDateStamp(time);
                    console.log("*********1" + dateStamp);
                    var final_result = chartUtils.compareTo(res, dateStamp);
                    $scope.charts[0].config.noFormat = "none";
                    $scope.charts[0].config.compare = true;
                    cf.renderChart(final_result, $scope.charts[0].config);
                });
            } else {
                clear.lineChart($scope.charts[0].config, checkedVal);
                $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
                $scope.charts[0].types = checkedVal;
                var chartarray = [$scope.charts[0]];
                requestService.refresh(chartarray);
            }
        };

        Custom.initCheckInfo();
        var adminGriApiInfo = function (gridApi) {
//            $scope.gridOptions.data = [{a:"<div class='table_admin'>aaaaaaaaaa</div>",b:"bbbbbbbbbb",c:"ccccccccc"},{a:"dddddddddd",b:"eeeeeeeee",c:"ccccccccc"}]
        };

        //����HTML ���չ����
        var adminGriApihtml = function (gridApi) {
            var htmlData = [];
            gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                console.log("+++++++++" + row);
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

        $scope.open=function(){

            $scope.urlDialog = ngDialog.open({
                template:'\
              <div class="ngdialog-buttons" >\
                   <ul> \
                   <li>网站域名</li>\
                    <li><input type="text" data-ng-model="urlconfig.site_url" class="form-control"/></li> \
                    <li style="color: red;">不能为空</li>\
                    <br>\
                    <li>网站名称</li>\
                    <li><input type="text" data-ng-model="urlconfig.site_name" class="form-control"/></li> \
                    <li style="color: red;">不能为空</li>\
                    <br>\
                    <li>可输入如下4种域名形式</li>\
                    <li>1.主域名（如：www.baidu.com）</li>\
                    <li>2.二级域名（如：sub.baidu.com)</li>\
                    <li>3.子目录（如：www.baidu.com/sub）</li>\
                    <li>4.wap站域名（如：wap.baidu.com）</li>\
                    </ul>\
                     \
                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">返回</button>\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="submit(0)">确定</button>\
                </div>',
                className: 'ngdialog-theme-default',
                plain: true,
                scope : $scope
            });
        };


        /**
         * 初始化数据
         */
        var refushGridData = function () {
            var uid = $cookieStore.get("uid");
            var site_id = $rootScope.userType;
            var url = "/config/conf?index=site_list&type=search&query={\"uid\":\"" + uid + "\"}";
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                $scope.gridOptions.data = dataConfig;
            });
        };
        refushGridData();
        var closeThisDialog = function (clicked) {
            console.log("dfdfsdfd");
        };


        /**
         * 增加网站配置时候 添加配置
         * @param cliecked
         */
        $scope.submit = function (cliecked) {
            console.log("submit");

            //var site_id=$rootScope.userType;//从conf_sites中获取
            var model = angular.copy($scope.sites_model);
            model.site_url = $scope.urlconfig.site_url;//网站URL 页面输入
            model.site_name = $scope.urlconfig.site_name;//网站名称 页面输入
            model.uid = $cookieStore.get("uid");
            //用户ID+url 确定该用户对某个网站是否进行配置
            var query = "/config/site_list?type=search&query={\"uid\":\"" + model.uid + "\",\"site_url\":\"" + model.site_url + "\"}";
            $http({
                method: 'GET',
                url: query
            }).success(function (dataConfig, status) {
                if (dataConfig == null || dataConfig.length == 0) {//不存在配置 save
                    var url = "/config/site_list?type=save&entity=" + JSON.stringify(model);
                    $http({
                        method: 'GET',
                        url: url
                    }).success(function (dataConfig, status) {
                    });
                } else {//update
                    model.type_id = dataConfig.type_id;//更新传入不再重新生成
                    model.track_id = dataConfig.track_id;
                    if (dataConfig.site_name != model.site_name) {
                        var url = "/config/site_list?type=update&query={\"uid\":\"" + model.uid + "\",\"site_url\":\"" + model.site_url + "\"}&updates=" + JSON.stringify(model);
                        $http({
                            method: 'GET',
                            url: url
                        }).success(function (dataConfig, status) {

                        });
                    }
                }
            });
            //refushGridData();
        };
    });
});
