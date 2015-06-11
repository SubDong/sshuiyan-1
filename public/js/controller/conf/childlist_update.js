/**
 * Created by Fzk lwek on 2015/6/4.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('childlist_update', function ($scope, $http, $rootScope, $cookieStore, $stateParams, ngDialog,$state) {


        $scope.subdirectory = {};

        $scope.subdirectory.is_regular = "0";

        $scope.subdirectory.analysis_url = "";

        $scope.subdirectory.not_analysis_url = "";

        $scope.subdirectory.subdirectory_url = "";

        $scope.subdirectory.uid = "";

        $scope.subdirectory.root_url = "";

        $scope.subdirectory.create_date = "";

        $scope.subdirectory._id = $stateParams.id;

        $scope.pages = [{
            url: ""
        }];

        $scope.no_pages = [{
            url: ""
        }];


        $scope.ipArea = {
            "tNum": "1",//当前个数？
            "tText": "",//内容
            "count": 1,//个数
            "helpFlag": false//是否显示帮组信息
        };


        $scope.childlist_add_yes = angular.copy($scope.ipArea);
        $scope.childlist_add_no = angular.copy($scope.ipArea);

        $scope.myFocus = function (obj) {
            obj.helpFlag = true;
        };

        $scope.myBlur = function (obj) {
            obj.helpFlag = false;
        };
        $scope.addPage = function (o) {
            o.push({
                url: ""
            });
        };
        $scope.deletePage = function (p) {
            p.pop();
        };
        $scope.onCancel = function () {
            $state.go('childlist');
        }

        $scope.onUpdateSubdirectory = function () {

            $scope.subdirectory.analysis_url = listToStirng($scope.pages);

            $scope.subdirectory.not_analysis_url = listToStirng($scope.no_pages);

            var entity = JSON.stringify($scope.subdirectory);

            var url = "/config/subdirectory_list?type=update&query={\"_id\":\"" + $scope.subdirectory._id + "\"}&updates=" + entity;


            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {

                $scope.urlDialog = ngDialog.open({
                    template: '\
              <div class="ngdialog-buttons" >\
                        <ul>\
                        <li> 修改成功</li></ul>   \
                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click=closeThisDialog(0)>确定</button>\
                </div>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    scope: $scope
                });
            });

        };

        var listToStirng = function (list) {
            var str = "";
            list.forEach(function (page) {
                str += page.url + ",";
            })
            str = str.substring(0, str.length - 1);
            return str;
        }


        var stringToList = function (str) {
            var list = [];
            str.split(",").forEach(function (s) {
                var page = {};
                page.url = s;
                list.push(page);
            })
            return list;
        }


        var loadData = function () {

            var url = "/config/subdirectory_list?type=findById&query={\"_id\":\"" + $scope.subdirectory._id + "\"}";

            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                $scope.subdirectory = dataConfig;
                $scope.pages = stringToList($scope.subdirectory.analysis_url);
                $scope.no_pages = stringToList($scope.subdirectory.not_analysis_url);
            });
        }

        loadData();


    });
});