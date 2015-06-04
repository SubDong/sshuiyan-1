/**
 * Created by ss on 2015/6/4.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('pagechange_addctr', function ($scope, $http,$rootScope,$cookieStore) {    //$scope.
        $scope.target = false;
        $scope.targetFocus = function(){
            $scope.target = true;
        };
        $scope.targetBlur = function() {
            $scope.target = false;
        }
        $scope.record = false;
        $scope.steps = [{}];//添加步骤
        $scope.addSteps = function(steps){
            steps.push({});
        }
        $scope.removeSteps = function(steps) {
            steps.pop({})
        }
        $scope.paths = [{}];//添加路径
        $scope.addPaths = function(paths) {
            paths.push({});
        }
        $scope.removePath = function(paths) {
            paths.pop({});
        }
        $scope.pages = [{}];//添加页面
        $scope.addPages = function(pages) {
            pages.push({})
        }
    })
});