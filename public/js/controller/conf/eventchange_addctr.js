/**
 * Created by john on 2015/4/1.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('eventchange_addctr', function ($scope, $http, $rootScope, $cookieStore, ngDialog, $state,$stateParams) {
        $scope.eventChange = {};
        $scope.eventChange.event_id = "";
        $scope.eventChange.event_name = "";
        $scope.eventChange.event_page = "";
        $scope.eventChange.event_method = "手动方式";
        $scope.eventChange.event_target = false;
        $scope.eventChange.event_status = "1";
        $scope.eventChange.uid = $cookieStore.get("uid");
        $scope.eventChange.root_url = $rootScope.siteId;
        $scope.targetUrl = "";
        $scope.onCancel = function () {
            $state.go('eventchange');
        }
        $scope.onSaveEvent = function () {
            //去掉 www. 的配置URL
            var localURl = $rootScope.siteUrl.replace(/www./g, '');
            //二级域名验证
            var regex = new RegExp("(\\w.)?" + localURl + "/*");
            if(! regex.test($scope.eventChange.event_page)){
                $scope.urlDialog = ngDialog.open({
                    template: '<div class="ngdialog-buttons" ><div class="ngdialog-tilte">系统提示</div><ul class="admin-ng-content"><li>输入的网址不在站点 '+$rootScope.siteUrl+' 下</li></ul>' + '<div class="ng-button-div">\
                  <button type="button" class="ngdialog-button ng-button " ng-click="closeThisDialog(0)">确定</button></div></div>',
                    className: 'ngdialog-theme-default admin_ngdialog',
                    plain: true,
                    scope: $scope
                });
                return;
            }
            var entity = JSON.stringify($scope.eventChange);
            var url = "/config/eventchnage_list?type=save&entity=" + entity;
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                $scope.urlDialog = ngDialog.open({
                    preCloseCallback: function () {
                        $state.go('eventchange');
                    },
                    template: '<div class="ngdialog-buttons" ><div class="ngdialog-tilte">来自网页的消息</div><ul class="admin-ng-content"><li>保存成功</li></ul>' + '<div class="ng-button-div">\
                  <button type="button" class="ngdialog-button ng-button " ng-click="closeThisDialog(0)">确定</button></div></div>',
                    className: 'ngdialog-theme-default admin_ngdialog',
                    plain: true,
                    scope: $scope
                });
            });
        };
        /**
         * 接收预览URL的输入
         * @type {{url: string}}
         */
        $scope.preview = {
            url: ""
        };

        /**
         * 事件转化目标URL验证
         */
        $scope.sshUrlEvent = function () {
            var uid = $cookieStore.get("uid");
            //预览输入URL去空格
            var previewUrl = $scope.preview.url.trim();
            //if(previewUrl.indexOf("?")>-1)
            //    previewUrl = previewUrl.substring(0,previewUrl.indexOf("?"))
            //当前站点配置的URL
            var configUrl = $rootScope.siteUrl;
            //去掉 www. 的配置URL
            var localURl = $rootScope.siteUrl.replace(/http:\/\/./g, '').replace(/www./g, '');
            //二级域名验证
           if(previewUrl.indexOf(localURl)<0){
               $scope.urlDialog = ngDialog.open({
                   template: '<div class="ngdialog-buttons" ><div class="ngdialog-tilte">来自网页的消息</div><ul class="admin-ng-content"><li>输入的网址不在站点 '+$rootScope.siteUrl+' 下</li></ul>' + '<div class="ng-button-div">\
                  <button type="button" class="ngdialog-button ng-button " ng-click="closeThisDialog(0)">确定</button></div></div>',
                   className: 'ngdialog-theme-default admin_ngdialog',
                   plain: true,
                   scope: $scope
               });
               return;
           }
            $scope.iframeobj = function (tid) {
                if(previewUrl.indexOf("http")>4||previewUrl.indexOf("http")<0){
                    previewUrl="http://"+previewUrl
                }
                var strSrc =  previewUrl + "?domain=" + configUrl + "&amp;td=" + tid + "&amp;cuid=" + uid + "&amp;jn=select&amp;type=event";
                var dialogFlag = false;
                $scope.urlDialog = ngDialog.open({
                    template: '\
                        <div class="ngdialog-content" style="width:100%">\
                            <div id="previewControlPanel">\
                                <div class="ngdialog-tilte">\
                                    <div>事件目标预览URL：' + previewUrl + '</div>\
                                </div>\
                                <div class="overlay-content">\
                            <iframe id="" name="" marginwidth="0" marginheight="0" width="100%" height=700 frameborder="0" src=' + strSrc + '></iframe>\
                                </div>\
                                <div class="ng-button-div">\
                                <button  class="ngdialog-button ng-button" type="submit" data-ng-click="closeThisDialog()">确定</button>\
                                </div>\
                            </div>\
                        </div>',
                    //<button  class="ngdialog-button ng-button" data-ng-click="closeThisDialog()">取消</button>\
                    className: 'ngdialog-theme-default admin_ngdialog iframeBox',
                    plain: true,
                    closeByDocument: false,
                    scope: $scope
                });
            };

            $scope.iframeobj($rootScope.siteTrackId);
        }
        /**
         * 预览保存事件
         */
        $scope.previewSaveEvent = function () {
            $scope.eventChange.event_method = "预览添加";
            var entity = JSON.stringify($scope.eventChange);
            var url = "/config/eventchnage_list?type=save&entity=" + entity;
            $http({method: 'GET', url: url}).success(function (dataConfig) {
            })
        };
        if($stateParams.url!=undefined){
            $scope.tab =1;
            $scope.preview.url = $stateParams.url
            $scope.sshUrlEvent();
        }
    })
});
