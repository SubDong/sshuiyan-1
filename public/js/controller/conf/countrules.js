define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('countrules', function ($scope, $rootScope) {
        $scope.records = [{
            a:"",
            b:""
        }];

        $scope.myAdd = function (o) {
            o.push({});
        };
    });
});