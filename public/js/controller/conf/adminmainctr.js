/**
 * Created by john on 2015/4/1.
 */

define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('adminmainctr', function ($scope, $q, $rootScope, $http, requestService, ngDialog, $cookieStore) {

        /**
         * 对应Mongo
         * @type {{uid: string, type_id: string, track_id: string, site_url: string, site_name: string, site_pause: boolean, track_status: string}}
         */
        $scope.sites_model = {
            //_id: "", // mongoid
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
        //table配置
        $rootScope.adminSetHtml = "<div class='mid_left'><div class='mid_left_code'>" +
        "var _pct= _pct|| [];\n"+
        " (function() {\n"+
        "   var hm = document.createElement(\"script\");\n"+
        "   hm.src = \"//t.best-ad.cn/_t.js?ex_track_id\";\n"+
        "   var s = document.getElementsByTagName(\"script\")[0];\n"+
        "    s.parentNode.insertBefore(hm, s);\n"+
        " })();"+
            "</div> </div><div class='mid_right'><button type='button' class='btn btn-default navbar-btn'>复制代码</button><ul type='disc'>" +
            "  <li>请将代码添加至网站全部页面的&lt;/head&gt;标签前；</li><li>建议在header.htm类似的页头模板页面中安装，以达到一处安装，全站皆有的效果；</li><li>如需在JS文件中调用统计分析代码，请直接去掉以下代码首尾的&lt;script type='text/javascript' &gt;与&lt;/script&gt;后，放入JS文件中即可；</li>" +
            "<li> 如果代码安装正确，一般20分钟 后,可以查看网站分析数据；</li></ul></div>";
        //配置默认指标
        $rootScope.checkedArray = ["_uid","uid", "type_id", "track_id", "site_url", "site_name", "site_pause", "track_status"];

        /**
         * 删除按钮响应
         * @param index
         * @param grid
         * @param row
         */
        $scope.onDelete = function(index,grid,row){
            var query = "/config/site_list?type=delete&query={\"_id\":\"" + row.entity._id +  "\"}";
            $http({
                method: 'GET',
                url: query
            }).success(function (dataConfig, status) {

            });
        };
        /**
         * 暂停按钮响应
         * @param index
         * @param grid
         * @param row
         */
        $scope.onPause = function(index,grid,row){

            //用户ID+url 确定该用户对某个网站是否进行配置
            var query = "/config/site_list?type=search&query={\"uid\":\"" +   row.entity.uid + "\",\"site_url\":\"" +   row.entity.site_url + "\"}";
            $http({
                method: 'GET',
                url: query
            }).success(function (dataConfig, status) {
                if (dataConfig != null ) {//不存在配置 save

                    //model.type_id = dataConfig.type_id;//更新传入不再重新生成
                    //model.track_id = dataConfig.track_id;
                    row.entity.site_pause =   !row.entity.site_pause;
                    var url = "/config/site_list?type=update&query={\"uid\":\"" +  row.entity.uid + "\",\"site_url\":\"" +  row.entity.site_url + "\"}&updates={\"site_pause\":\"" + row.entity.site_pause+"\"}";
                    $http({
                        method: 'GET',
                        url: url
                    }).success(function (dataConfig, status) {

                    });

                }
            });
        };
        $rootScope.gridArray = [
            {name: "xl", displayName: "", cellTemplate: "<div class='table_xlh'></div>", maxWidth: 5},
            {name: "网站域名", displayName: "网站域名", field: "site_url", maxWidth: '', cellClass: 'table_admin'},

            {name: "网站名称", displayName: "网站名称", field: "site_name", maxWidth: '', cellClass: 'table_admin'},
            {name: "首页代码状态", displayName: "首页代码状态", field: "track_status", maxWidth: 500, cellClass: 'table_admin'},
            {
                name: "x6",
                displayName: "",
                cellTemplate: "<div class='table_admin' ><a href='' >获取代码</a><span class='glyphicon glyphicon-file'></span></div>",
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
                cellTemplate: "<div class='table_admin'  ng-click='grid.appScope.onPause(index,grid,row)'><a href=''>暂停</a></div>",
                maxWidth: 80
            },
            {
                name: "x5",
                displayName: "",
                cellTemplate: "<div class='table_admin' ng-click='grid.appScope.onDelete(index,grid,row)'><a href='' ng-click='onDelete()'>删除</a></div>",
                maxWidth: 80
            }

        ];
        /**
         * 弹出添加网站窗口
         */
        $scope.open = function () {

            $scope.urlDialog = ngDialog.open({
                template: '\
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
                scope: $scope
            });
        };

        /**
         * 增加网站配置时候 添加配置
         * @param cliecked
         */
        $scope.submit = function (cliecked) {

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
                } else {//update;
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
