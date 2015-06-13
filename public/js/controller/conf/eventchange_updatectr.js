/**
 * Created by john on 2015/4/1.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('eventchange_updatectr', function ($scope, $http, $rootScope, $cookieStore, $stateParams, ngDialog,$state) {


        $scope.eventChange = {};

        $scope.eventChange.event_id = "";

        $scope.eventChange.event_name ="";

        $scope.eventChange.event_page ="";

        $scope.eventChange.event_method ="手动方式";

        $scope.eventChange.event_status;

        $scope.eventChange.uid =  "";

        $scope.eventChange.root_url =  "";

        $scope.eventChange._id = $stateParams.id;


        $scope.onCancel = function () {
            $state.go('eventchange');
        }

        $scope.onUpdateEvent = function () {

            var entity = JSON.stringify($scope.eventChange);

            var url = "/config/eventchnage_list?type=update&query={\"_id\":\"" + $scope.eventChange._id + "\"}&updates=" + entity;

            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                $scope.urlDialog = ngDialog.open({
                    preCloseCallback: function() {
                        $state.go('eventchange');
                    },
                    template: '\
              <div class="ngdialog-buttons" >\
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

        var loadData = function () {

            var url = "/config/eventchnage_list?type=findById&query={\"_id\":\"" + $scope.eventChange._id + "\"}";

            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                $scope.eventChange = dataConfig;

            });
        }

        loadData();





    })
});
