/**
 * Created by ss on 2015/6/25.
 */
define(["./module"], function (ctrs) {
    "use strict";
    ctrs.controller("noDataCtr", function ($scope, $rootScope, $http, requestService, messageService, areaService, uiGridConstants) {
        $scope.todayClass = true;
    })
})