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
        };
        $scope.record = false;
        $scope.benefitSet = false;
        $scope.pathType = false;
        $scope.changeType = false;
        $scope.paths = [{
            steps: [{
                pages:[{}]
            }]
        }];//添加路径
        $scope.isAddPath = true;
        $scope.addPaths = function(paths) {
            paths.push({
                steps : [{
                    pages:[{}]
                }]
            });
        };
        $scope.removePath = function(steps, _index) {
            steps.splice(_index, 1);
        };
        $scope.steps = [{
            pages:[{}]
        }];//添加步骤
        $scope.cancelAdd ="cancelAdd";
        $scope.addSteps = function(path, steps){
            path.steps.push({
                pages:[{}]
            });
        };
        $scope.removeSteps = function(steps, _index) {
            steps.splice(_index, 1);
        };
        $scope.pages = [{}];//添加页面
        $scope.addPages = function(step, pages) {
            step.pages.push({});
        }
    })
});