/**
 * Created by john on 2015/4/1.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('eventchange_addctr', function ($scope, $http, $rootScope, $cookieStore, ngDialog, $state) {


        $scope.eventChange = {};

        $scope.eventChange.event_id = "";

        $scope.eventChange.event_name ="";

        $scope.eventChange.event_page ="";

        $scope.eventChange.event_method ="手动方式";

        $scope.eventChange.event_status = "1";

        $scope.eventChange.uid =  $cookieStore.get("uid");

        $scope.eventChange.root_url =$rootScope.siteId;



        $scope.targetUrl ="";


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
                    preCloseCallback: function() {
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

        $scope.preview = {
            url: ""
        };

        /**
         * 事件转化目标URL验证
         */
        $scope.sshUrlEvent = function(){
            var uid = $cookieStore.get("uid");
            var previewUrl = $scope.preview.url;
            var localURl = $rootScope.siteUrl;

            function isContains(str, substr) {
                return new RegExp(substr).test(str);
            }
           if(isContains(previewUrl, localURl) == true){
                var url = "/config/site_list?type=search&query={\"uid\":\"" + uid + "\",\"site_url\":\"" + previewUrl + "\"}";
                //console.log(url);
                $http({method: 'GET', url: url}).success(function (dataConfig, status) {
                    if(dataConfig == undefined || dataConfig.length == 0){
                        alert("预览URL应该是本站或跨域内的URL");
                    }else{
                        dataConfig.forEach(function(item){
                            var track_id = item.track_id;
                            var track_status = item.track_status;
                            if(track_status != 1){
                                alert("你输入的URL未检测到代码安装");
                            }else{
                                $scope.urlDialog = ngDialog.open({
                                    preCloseCallback: function() {
                                        $state.go('eventchange');
                                    },
                                    template: '\
                                    <div class="container" style="width: 980px"">\
                                        <div id="previewControlPanel">\
                                            <div class="overlay-top">\
                                                <div>事件目标预览URL：</div>\
                                                <div>关闭</div>\
                                            </div>\
                                            <div class="overlay-content">\
                                                <iframe id="" name="" marginwidth="0" marginheight="0" width="100%" height="100%" frameborder="0" src="http://'+previewUrl+'#domain='+previewUrl+'&amp;td='+track_id+'&amp;jn=select&amp;type=event"></iframe>\
                                            </div>\
                                            <div class="overlay-bottom">\
                                                <input id="overlaySubmitBtn" type="button" value="关闭"/>\
                                                <input id="overlayCancelBtn" type="button" value="取消"/>\
                                            </div>\
                                        </div>\
                                    </div>',

                                    className: 'ngdialog-theme-default',
                                    plain: true,
                                    scope: $scope
                                });
                            }
                        });
                    }
                });
            }
            if(isContains(previewUrl, localURl) == false){
                alert("预览URL应该是本站或跨域内的URL");
            }
            /*$scope.urlDialog = ngDialog.open({
                preCloseCallback: function() {
                    $state.go('eventchange');
                },
                template: '\
                    <div class="container" style="width: 980px">\
                        <div id="previewControlPanel">\
                            <div class="overlay-top">\
                                <div>事件目标预览URL：</div>\
                                <div>关闭</div>\
                            </div>\
                            <div class="overlay-content">\
                                <iframe id="" name="" marginwidth="0" marginheight="0" width="100%" height="100%" frameborder="0" src="http://'+previewUrl+'#domain='+previewUrl+'&amp;td='+track_id+'&amp;jn=select&amp;type=event"></iframe>\
                            </div>\
                            <div class="overlay-bottom">\
                                <input id="overlaySubmitBtn" type="button" value="关闭"/>\
                                <input id="overlayCancelBtn" type="button" value="取消"/>\
                            </div>\
                        </div>\
                    </div>',
                className: 'ngdialog-theme-default',
                plain: true,
                scope: $scope
            });*/
        }

        /**
         * 预览保存事件
         */
        $scope.previewSaveEvent = function(){
            $scope.eventChange.event_method ="预览添加";
            var entity = JSON.stringify($scope.eventChange);
            var url = "/config/eventchnage_list?type=save&entity=" + entity;
            $http({method: 'GET', url: url}).success(function (dataConfig) {})
        };
    })
});
