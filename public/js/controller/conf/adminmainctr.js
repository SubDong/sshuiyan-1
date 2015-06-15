/**
 * Created by john on 2015/4/1.
 */

define(["./module"], function (ctrs) {
    "use strict";

    ctrs.directive('adminmainctrRemoteValidation', function ($http, $cookieStore) {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                elm.bind('keyup', function () {
                    var uid = $cookieStore.get("uid");
                    var url = "/config/site_list?type=search&query={\"uid\":\"" + uid + "\",\"site_url\":\"" + scope.dialog_model.site_url + "\"}";
                    $http({method: 'GET', url: url}).
                        success(function (data, status) {
                            if (data.length > 0) {
                                ctrl.$setValidity('remote', false);
                            } else {
                                ctrl.$setValidity('remote', true);
                            }
                        }).
                        error(function (data, status, headers, config) {
                            ctrl.$setValidity('remote', false);
                        });


                });
            }
        };
    });

    ctrs.controller('adminmainctr', function ($scope, $q, $rootScope, $http, requestService, ngDialog, $cookieStore) {
        /**
         * 对应Mongo
         * @type {{uid: string, type_id: string, track_id: string, site_url: string, site_name: string, site_pause: boolean, track_status: string}}
         */
        $scope.sites_model = {

            //_id: String, // mongoid
            uid: "", // user id 用户ID
            type_id: "", // es type id ( hidden in front-end) 对应ES ID
            track_id: "", // js track id 随机生成
            site_url: "", // site url 设置的URL
            site_name: "", // site name 设置的URL
            site_pause: false,//配置暂停 true：暂停 false：使用
            track_status: 0, // track code status
            //status: String, // enable or disable track
            is_top: false
        };
        $scope.dialog_model = {
            "site_url": "",
            "site_name": "",
            is_top: true,
            readOnly: "",
            add_update: ""
        };
        //table配置
        $rootScope.adminSetHtml = "<div class='mid_left'><div id='base_code' class='mid_left_code'>" +
            "&lt;script&gt;\<br\>" +
            "var _pct= _pct|| [];\<br\>" +
            " (function() {\<br\>" +
            "   var hm = document.createElement(\"script\");\<br\>" +
            "   hm.src = \"//t.best-ad.cn/t.js?tid=ex_track_id\";\<br\>" +
            "   var s = document.getElementsByTagName(\"script\")[0];\<br\>" +
            "    s.parentNode.insertBefore(hm, s);\<br\>" +
            " })();\<br\>" +
            "&lt;/script&gt;" +
            "</div> </div><div class='mid_right'><button type='button' class='btn btn-default navbar-btn' ssh-clip='' title='单击复制到剪贴板' data-clipboard-target='base_code'>复制代码</button><ul type='disc'>" +
            "  <li>请将代码添加至网站全部页面的&lt;/head&gt;标签前；</li><li>建议在header.htm类似的页头模板页面中安装，以达到一处安装，全站皆有的效果；</li><li>如需在JS文件中调用统计分析代码，请直接去掉以下代码首尾的&lt;script type='text/javascript' &gt;与&lt;/script&gt;后，放入JS文件中即可；</li>" +
            "<li> 如果代码安装正确，一般20分钟 后,可以查看网站分析数据；</li></ul></div>";
        //配置默认指标
        $rootScope.checkedArray = ["_uid", "uid", "type_id", "track_id", "site_url", "site_name", "site_pause", "track_status_ch"];


        //配置默认指标
        $rootScope.gridArray = [
            {
                name: "xl",
                displayName: "",
                cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                maxWidth: 5
            },
            {name: "网站域名", displayName: "网站域名", field: "site_url", maxWidth: '', cellClass: 'table_admin'},

            {name: "网站名称", displayName: "网站名称", field: "site_name", maxWidth: '', cellClass: 'table_admin_color'},
            {
                name: "首页代码状态",
                displayName: "首页代码状态",
                field: "track_status_ch",
                maxWidth: 500,
                cellClass: 'table_admin_color'
            },
            {
                name: "x7",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a href='' data-ng-click='grid.appScope.gain(index,grid,row)'>" +
                "获取代码</a><span class='glyphicon glyphicon-file'></span></div>",
                maxWidth: 100
            },
            {
                name: "x2",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a href='/#index'>查看网站概览</a></div>",
                maxWidth: 100
            },
            {
                name: "x3",
                displayName: "",
                cellTemplate: "<div class='btn-group table_admin' dropdown='' is-open='status.isopen'>" +
                "<span class='glyphicon glyphicon-cog'></span><a type='button' dropdown-toggle='' ng-disabled='disabled' aria-haspopup='true' aria-expanded='false'>设置 </a> <ul class='dropdown-menu' role='menu'>" +
                "<li><a href='#conf/webcountsite/countrules'>设置统计规则</a></li>" +
                "<li><a href='#conf/webcountsite/childlist'>设置子目录</a></li>" +
                "<li><a href='#conf/webcountsite/pagechange'>设置页面转化目标</a></li>" +
                "<li><a href='#conf/webcountsite/eventchange'>设置事件转化目标</a></li>" +
                "<li><a href='#conf/webcountsite/timechange'>设置市场转化目标</a></li>" +
                " <li><a href='#conf/webcountsite/adtrack'>设置指定广告跟踪</a></li>" +
                "</ul> </div>",
                maxWidth: 80
            },
            {
                name: "x4",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a href='' data-ng-click='grid.appScope.stop(index,grid,row)'>{{grid.appScope.x4Text(row)}}</a></div>",
                maxWidth: 80
            },
            {
                name: "x5",
                displayName: "",
                // grid.appScope.Delete(row, grid.options.data)
                cellTemplate: "<div class='table_admin'><a href='' ng-click='grid.appScope.onDelete(index,grid,row)' >删除</a></div>",
                maxWidth: 80
            },
            {
                name: "x6",
                displayName: "",
                // grid.appScope.Delete(row, grid.options.data)
                cellTemplate: "<div class='table_admin'><a href='' ng-click='grid.appScope.onUpdate(index,grid,row)' >修改</a></div>",
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

        //var adminGriApihtml = function (gridApi) {
        //    var htmlData = [];
        //    gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
        //        row.entity.subGridOptions = {
        //            showHeader: false,
        //            enableHorizontalScrollbar: 0,
        //            columnDefs: htmlData
        //        };
        //        var res = {};
        //        res["name"] = "test";
        //        res["field"] = "info";
        //        res["cellTemplate"] = $rootScope.adminSetHtml;
        //        htmlData.push(res);
        //        row.entity.subGridOptions.data = [{"info": " "}];
        //    });
        //};
        //新增网站弹框


        $scope.openAddDialog = function () {
            $scope.urlDialog = ngDialog.open({
                template: '\
                <form role="form" name="adminmainctrForm" class="form-horizontal" novalidate>\
              <div class="ngdialog-buttons" >\
                   <ul> \
                   <li>网站域名</li>\
                     <li><input type="text" name="remote" adminmainctr-remote-validation data-ng-focus="site_url_focus = true" data-ng-blur="site_name_focus = false" data-ng-model="dialog_model.site_url" class="form-control" required/></li> \
                    <li ng-show="adminmainctrForm.remote.$error.remote" style="color: red;">网站域名重复！</li> \
                    <li data-ng-show="site_url_focus && !dialog_model.site_url" style="color: red;">不能为空</li>\
                    <br>\
                    <li>网站名称</li>\
                    <li><input type="text" data-ng-focus="site_name_focus=true" data-ng-blur="site_name_focus =false" data-ng-model="dialog_model.site_name" class="form-control"/></li> \
                    <li data-ng-show="site_name_focus && !dialog_model.site_name" style="color: red;">不能为空</li>\
                    <br>\
                    <li style="color: black;"><input type="checkbox"  name="置顶" data-ng-model="dialog_model.is_top"/>\
                    <span>设置站点是否置顶</span></li>\
                    <br>\
                    <li>可输入如下4种域名形式</li>\
                    <li>1.主域名（如：www.baidu.com）</li>\
                    <li>2.二级域名（如：sub.baidu.com)</li>\
                    <li>3.子目录（如：www.baidu.com/sub）</li>\
                    <li>4.wap站域名（如：wap.baidu.com）</li>\
                    </ul>\
                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">返回</button>\
                    <button type="button" ng-disabled="adminmainctrForm.$invalid" class="ngdialog-button ngdialog-button-primary" ng-click="submit()">确定</button>\
                </div></form>',
                className: 'ngdialog-theme-default',
                plain: true,
                scope: $scope
            });
        };

        $scope.openUpdateDialog = function () {
            $scope.urlDialog = ngDialog.open({
                template: '\
                <form role="form" name="adminmainctrForm" class="form-horizontal" novalidate>\
              <div class="ngdialog-buttons" >\
                   <ul> \
                   <li>网站域名</li>\
                     <li><input type="text" name="remote" readOnly  adminmainctr-remote-validation data-ng-focus="site_url_focus = true" data-ng-blur="site_name_focus = false" data-ng-model="dialog_model.site_url" class="form-control" required/></li> \
                    <li ng-show="adminmainctrForm.remote.$error.remote" style="color: red;">网站域名重复！</li> \
                    <li data-ng-show="site_url_focus && !dialog_model.site_url" style="color: red;">不能为空</li>\
                    <br>\
                    <li>网站名称</li>\
                    <li><input type="text" data-ng-focus="site_name_focus=true" data-ng-blur="site_name_focus =false" data-ng-model="dialog_model.site_name" class="form-control"/></li> \
                    <li data-ng-show="site_name_focus && !dialog_model.site_name" style="color: red;">不能为空</li>\
                    <br>\
                    <li style="color: black;"><input type="checkbox"  name="置顶" data-ng-model="dialog_model.is_top"/>\
                    <span>设置站点是否置顶</span></li>\
                    <br>\
                    <li>可输入如下4种域名形式</li>\
                    <li>1.主域名（如：www.baidu.com）</li>\
                    <li>2.二级域名（如：sub.baidu.com)</li>\
                    <li>3.子目录（如：www.baidu.com/sub）</li>\
                    <li>4.wap站域名（如：wap.baidu.com）</li>\
                    </ul>\
                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">返回</button>\
                    <button type="button" ng-disabled="adminmainctrForm.$invalid" class="ngdialog-button ngdialog-button-primary" ng-click="submit()">确定</button>\
                </div></form>',
                className: 'ngdialog-theme-default',
                plain: true,
                scope: $scope
            });
        };
        $scope.onInsert = function () {
            //$scope.dialog_model.readOnly = "";
            $scope.dialog_model.site_url = "";
            $scope.dialog_model.site_name = "";
            $scope.dialog_model.is_top = false;
            //$scope.dialog_model.add_update = "add";
            $scope.openAddDialog();
        }
        $scope.onUpdate = function (index, grid, row) {
            $scope.dialog_model.readOnly = "readonly";
            $scope.dialog_model.site_url = row.entity.site_url;
            $scope.dialog_model.site_name = row.entity.site_name;
            $scope.dialog_model.is_top = row.entity.is_top;
            $scope.dialog_model.add_update = "update";
            $scope.openUpdateDialog();
        }
        /**
         * 删除按钮响应
         * @param index
         * @param grid
         * @param row
         */
        $scope.onDelete = function (index, grid, row) {
            $scope.onDeleteDialog = ngDialog.open({
                template: '' +
                '<div class="ngdialog-buttons" ><ui><li> 确认删除吗？<span style=" color: red " >（要测试自己新建条删哈！）<span></li></ui>' +
                '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">返回</button>\
                  <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="sureonDelete()">确定</button></div>',
                className: 'ngdialog-theme-default',
                plain: true,
                scope: $scope
            });

            $scope.sureonDelete = function () {
                $scope.onDeleteDialog.close();
                var query = "/config/site_list?type=delete&query={\"_id\":\"" + row.entity._id + "\"}";
                $http({
                    method: 'GET',
                    url: query
                }).success(function (dataConfig, status) {
                    if (dataConfig == "success") {
                        refushGridData();
                    }

                });
            };
        };


        //暂停弹框
        $scope.stop = function (index, grid, row) {

            $scope.onPause = function () {
                //关闭弹出窗
                $scope.urlDialog.close();

                //用户ID+url 确定该用户对某个网站是否进行配置
                var query = "/config/site_list?type=search&query={\"_id\":\"" + row.entity._id + "\"}";
                $http({
                    method: 'GET',
                    url: query
                }).success(function (dataConfig, status) {
                    if (dataConfig != null) {//不存在配置 save
                        row.entity.site_pause = !row.entity.site_pause;
                        var url = "/config/site_list?type=update&query={\"_id\":\"" + row.entity._id + "\"}&updates={\"site_pause\":\"" + row.entity.site_pause + "\"}";
                        $http({
                            method: 'GET',
                            url: url
                        }).success(function (dataConfig, status) {

                        });
                        //if(config)
                    }
                });
            };
            var tip = "";
            if (row.entity.site_pause) {
                tip = "确定重新启用？";
            } else {
                tip = "<li>注意</li><li>暂停后，您将不再分析该网站，直至您重新启用，你确定现在暂停使用吗？</li>"
            }
            $scope.urlDialog = ngDialog.open({
                template: '\
                  <div class="ngdialog-buttons" >\
                            <ul>' + tip + '</ul>   \
                        <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">返回</button>\
                        <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="onPause()">确定</button>\
                  </div>',
                className: 'ngdialog-theme-default',
                plain: true,
                scope: $scope

            });

        };

        $scope.x4Text = function (row) {
            if (row.entity.site_pause) {
                return "重新启用";
            }
            return "暂停"
        };
        //获取代码弹框
        $scope.gain = function (index, grid, row) {
            var thtml = $rootScope.adminSetHtml.replace("ex_track_id", row.entity.track_id);
            $scope.urlDialog = ngDialog.open({
                template: thtml,
                className: 'ngdialog-theme-default',
                plain: true,
                scope: $scope
            });
        };
        /**
         * 初始化数据
         */
        var refushGridData = function () {
            var uid = $cookieStore.get("uid");
            var url = "/config/site_list?index=site_list&type=search&query={\"uid\":\"" + uid + "\"}";
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                $scope.gridOptions.data = dataConfig;
                $scope.gridOptions.data.forEach(function (data) {
                    switch (data.track_status){
                        case 0:
                            data.track_status_ch="待测试"
                            break;
                        case 1:
                            data.track_status_ch="正常"
                            break;
                        case -1:
                            data.track_status_ch="异常"
                            break;
                        default :
                            data.track_status_ch="未知"
                            break;
                    }
                })
            });
        };
        refushGridData();
        var closeThisDialog = function (clicked) {
        };


        /**
         * 增加网站配置时候 添加配置
         * @param cliecked
         */
        $scope.submit = function (cliecked) {
            //var site_id=$rootScope.userType;//从conf_sites中获取
            var model = angular.copy($scope.sites_model);
            model.site_url = $scope.dialog_model.site_url;//网站URL 页面输入
            model.site_name = $scope.dialog_model.site_name;//网站名称 页面输入
            model.is_top = $scope.dialog_model.is_top;
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
                        var uid = $cookieStore.get("uid");
                        var url = "/config/site_list?index=site_list&type=search&query={\"uid\":\"" + uid + "\"}";
                        $http({
                            method: 'GET',
                            url: url
                        }).success(function (dataConfig, status) {
                            if (model.is_top) {
                                dataConfig.forEach(function (item) {
                                    if ((item.is_top && item.site_url != model.site_url) || item.is_top == null) {//置顶且非当前
                                        item.is_top = false;
                                        var url = "/config/site_list?type=update&query={\"uid\":\"" + item.uid + "\",\"site_url\":\"" + item.site_url + "\"}&updates=" + JSON.stringify(item);
                                        $http({
                                            method: 'GET',
                                            url: url
                                        }).success(function (dataConfig, status) {
                                        });
                                    }
                                })
                            }
                            $rootScope.gridOptions.data = dataConfig;
                        });
                    });
                }
                else {//update
                    //alert("该站点配置已存在！");
                    model.type_id = dataConfig.type_id;//更新传入不再重新生成
                    model.track_id = dataConfig.track_id;
                    if (dataConfig.site_name != model.site_name) {
                        var url = "/config/site_list?type=update&query={\"uid\":\"" + model.uid + "\",\"site_url\":\"" + model.site_url + "\"}&updates=" + JSON.stringify(model);
                        $http({
                            method: 'GET',
                            url: url
                        }).success(function (dataConfig, status) {
                            var uid = $cookieStore.get("uid");
                            var url = "/config/site_list?index=site_list&type=search&query={\"uid\":\"" + uid + "\"}";
                            $http({
                                method: 'GET',
                                url: url
                            }).success(function (dataConfig, status) {
                                if (model.is_top) {
                                    dataConfig.forEach(function (item) {
                                        if ((item.is_top && item.site_url != model.site_url) || item.is_top == null) {//置顶且非当前
                                            item.is_top = false;
                                            var url = "/config/site_list?type=update&query={\"uid\":\"" + item.uid + "\",\"site_url\":\"" + item.site_url + "\"}&updates=" + JSON.stringify(item);
                                            $http({
                                                method: 'GET',
                                                url: url
                                            }).success(function (dataConfig, status) {
                                            });
                                        }
                                    })
                                }
                                $rootScope.gridOptions.data = dataConfig;
                            });
                        });
                    }
                }
            });
            $scope.urlDialog.close();
        };

        Custom.initCheckInfo();//页面check样式js调用

    });
})
;
