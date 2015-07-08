/**
 * Created by john on 2015/4/1.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('eventchange_addctr', function ($scope, $http, $rootScope, $cookieStore, ngDialog, $state) {


        $scope.eventChange = {};

        $scope.eventChange.event_id = "";

        $scope.eventChange.event_name = "";

        $scope.eventChange.event_page = "";

        $scope.eventChange.event_method = "手动方式";

        $scope.eventChange.event_status = "1";

        $scope.eventChange.uid = $cookieStore.get("uid");

        $scope.eventChange.root_url = $rootScope.siteId;


        $scope.targetUrl = "";


        $scope.onCancel = function () {
            $state.go('eventchange');
        }


        $scope.onSaveEvent = function () {

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
                    template: '\
              <div class="ngdialog-buttons">\
                        <ul>\
                        <li> 保存成功</li></ul>   \
                    <a href="#conf/webcountsite/eventchange" ng-click=closeThisDialog(0)>确认</a>\
                </div>',
                    className: 'ngdialog-theme-default',
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
            var previewUrl = $scope.preview.url;
            /*var str = previewUrl.replace(/www./g,'');
            var completionUrl = "www" + previewUrl;
            console.log("completionUrl======"+str);*/
            var localURl = $rootScope.siteUrl.replace(/www./g,'');
            var cuid = $cookieStore.get("uid");
            var regex = new RegExp("(\\w.)?" + localURl + "/*");
            console.log(regex.test(previewUrl));
            if (regex.test(previewUrl) == true) {
                $http.get("cdapi/link?path=" + previewUrl).success(function (data) {
                    console.log(data);
                    if (data.match("404 Not Found") == null) {
                        var k = Number((data.toString().split('tid=')[0].split('\"').length));
                        if (data.toString().split("tid=")[0].split("\"")[k - 1].split("/").length == 4) {
                            if (data.toString().split("tid=").length > 1) {
                                var tid = data.toString().split("tid=")[1].split("\"")[0];
                                $http.get("/config/searchByUID?uid=" + uid + "&track_id=" + tid).success(function (result) {
                                    if (result == null || result == "") {
                                        alert("该账户下不存在该路径");
                                    }else{
                                        $scope.urlDialog = ngDialog.open({
                                            preCloseCallback: function () {
                                                $state.go('eventchange');
                                            },
                                            template: '\
                                                <div class="ngdialog-content" style="width:100%">\
                                                    <div id="previewControlPanel">\
                                                        <div class="ngdialog-tilte">\
                                                            <div>事件目标预览URL：</div>\
                                                        </div>\
                                                        <div class="overlay-content">\
                                                    <iframe id="" name="" marginwidth="0" marginheight="0" width="100%" height=600 frameborder="0" src="http://' + previewUrl + '?domain=' + localURl + '&amp;td=' + tid + '&amp;cuid=' + cuid + '&amp;jn=select&amp;type=event"></iframe>\
                                                        </div>\
                                                        <div class="ng-button-div">\
                                                        <button id="overlaySubmitBtn" class="ngdialog-button ngdialog-button-secondary">确定</button>\
                                                        <button id="overlayCancelBtn" class="ngdialog-button ng-button">取消</button>\
                                                        </div>\
                                                    </div>\
                                                </div>',

                                            className: 'ngdialog-theme-default admin_ngdialog iframeBox ',
                                            plain: true,
                                            scope: $scope
                                        });
                                    }
                                });
                            } else {
                                alert("未检测到代码安装");
                            }
                        } else {
                            alert("未检测到代码安装");
                        }
                    } else {
                        alert("未检测到代码安装");
                    }
                });
            }
            if (regex.test(previewUrl) == false) {
                alert("预览URL应该是本站或跨域内的URL");
            }
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
    })
});
