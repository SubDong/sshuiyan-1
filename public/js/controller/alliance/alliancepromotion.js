/**
 * Created by john on 2015/3/30.
 */
define(["./../module"], function (ctrs) {

    "use strict";

    ctrs.controller("alliancepromotion", function ($timeout, $scope, $rootScope, $http, $q, requestService, $cookieStore, uiGridConstants) {
        $scope.todayClass = true;
        var user = $rootScope.user
        var baiduAccount = $rootScope.baiduAccount;
        var esType = $rootScope.userType;
        var trackid = $rootScope.siteTrackId;
        console.log(user)
        console.log(baiduAccount)
        console.log(esType)
        console.log(trackid)
    });
})
