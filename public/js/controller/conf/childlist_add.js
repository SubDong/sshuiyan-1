/**
 * Created by Fzk lwek on 2015/6/4.
 */
define(["./module"], function (ctrs) {
    "use strict";


    ctrs.directive('remoteValidation', function ($http) {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                elm.bind('keyup', function () {


                    var url = "/config/subdirectory_list?type=search&query={\"subdirectory_url\":\"" + scope.subdirectory.subdirectory_url + "\"}";

                    $http({method: 'GET', url: url}).
                        success(function (data, status, headers, config) {
                            if (data.length > 0) {
                                ctrl.$setValidity('remote', false);
                            } else {
                                ctrl.$setValidity('remote', true);
                            }
                        }).
                        error(function (data, status, headers, config) {
                            ctrl.$setValidity('remote', false);
                        });


                });
            }
        };
    });

    ctrs.controller('childlist_add', function ($scope, $http, $rootScope, $cookieStore, ngDialog, $state) {


        $scope.subdirectory = {};

        $scope.subdirectory.is_regular = "0";

        $scope.subdirectory.analysis_url = "";

        $scope.subdirectory.not_analysis_url = "";

        $scope.subdirectory.subdirectory_url = "";

        $scope.subdirectory.uid = $cookieStore.get("uid");

        $scope.subdirectory.root_url = $rootScope.userType;

        $scope.subdirectory.create_date = new Date().Format("yyyy-MM-dd hh:mm:ss");


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


        $scope.onSaveSubdirectory = function () {

            $scope.subdirectory.analysis_url = listToStirng($scope.pages);

            $scope.subdirectory.not_analysis_url = listToStirng($scope.no_pages);

            var entity = JSON.stringify($scope.subdirectory);


            var url = "/config/subdirectory_list?type=save&entity=" + entity;
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {


                $scope.urlDialog = ngDialog.open({
                    preCloseCallback: function() {
                        $state.go('childlist');
                    },
                    template: '\
              <div class="ngdialog-buttons" >\
                        <ul>\
                        <li> 保存成功</li></ul>   \
                    <a href="#conf/webcountsite/childlist" ng-click=closeThisDialog(0)>确定</a>\
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

        Custom.initCheckInfo();//页面check样式js调用

    });


});