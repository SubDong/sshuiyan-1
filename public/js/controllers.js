/**
 * Created by yousheng on 15/3/19.
 */

var myApp = angular.module('myApp', [])

myApp.controller('myCtr', function ($scope) {
    $scope.now = {
        time: new Date()
    }
})