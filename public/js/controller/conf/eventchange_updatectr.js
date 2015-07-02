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

        $scope.eventChange.event_status = "";

        $scope.eventChange.uid =  "";

        $scope.eventChange.root_url =  "";

        $scope.eventChange._id = $scope._id;

        $scope.onUpdateEvent = function () {

            var entity = JSON.stringify($scope.eventChange);

            var url = "/config/eventchnage_list?type=update&query={\"_id\":\"" + $scope.eventChange._id + "\"}&updates=" + entity;

            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                $scope.closeThisDialog(0);
                refushGridData();
            });

        };

        $scope.loadData = function () {
            var url = "/config/eventchnage_list?type=findById&query={\"_id\":\"" + $scope.eventChange._id + "\"}";

            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig) {

                $scope.eventChange = dataConfig;
            });
        };
        var refushGridData = function () {
            var uid = $cookieStore.get("uid");
            var root_url = $rootScope.siteId;
            var url = "/config/eventchnage_list?type=search&query={\"uid\":\"" + uid + "\",\"root_url\":\"" + root_url + "\"}";
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {

                $scope.gridOptions.data = dataConfig;

            });
        };
    })
});
