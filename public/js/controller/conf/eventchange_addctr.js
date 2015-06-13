/**
 * Created by john on 2015/4/1.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('eventchange_addctr', function ($scope, $http,$rootScope,$cookieStore,ngDialog) {


        $scope.eventChange = {};

        $scope.eventChange.event_id = "0";

        $scope.eventChange.event_name ="";

        $scope.eventChange.event_page ="";

        $scope.eventChange.uid =  $cookieStore.get("uid");

        $scope.eventChange.root_url =$rootScope.userType;

        $scope.eventChange.create_date = new Date().Format("yyyy-MM-dd hh:mm:ss");

        $scope.site_url='';
       $scope.saveUrl = function() {
           $("#iframe").attr("src",'https://www.'+$scope.site_url);
           $(".modal_title p").html('事件目标预览URL:'+$scope.site_url);
           $(".event_modal").fadeIn();
       }
        $scope.closed = function() {
            $(".event_modal").fadeOut();

        }
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
    })
});
});