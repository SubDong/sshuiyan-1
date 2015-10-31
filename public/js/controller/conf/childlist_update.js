/**
 * Created by Fzk lwek on 2015/6/4.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('childlist_update', function ($scope, $http, $rootScope, $cookieStore, $stateParams, ngDialog, $state) {


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
            url: "",
            correcturl: true,
            errmsg: "页面或目录为空"
        }];

        $scope.no_pages = [{
            url: "",
            correcturl: true,
            errmsg: "页面或目录为空"
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
                url: "",
                correcturl: true,
                errmsg: "页面或目录为空"
            });
        };
        $scope.deletePage = function (p) {
            p.pop();
        };
        $scope.onCancel = function () {
            $state.go('childlist');
        }

        $scope.checkPage = function (pages) {
            var flag = true
            var tempPage = []
            pages.forEach(function (page, index) {
                if (page.url != "") {
                    if (page.url.indexOf($rootScope.siteUrl) == -1) {//非本站点
                        page.correcturl = false;
                        page.errmsg = "请您输入正确且与当前网站主域名一致的URL。"
                        flag = false
                    }
                    //else if (page.url.indexOf("?") > -1) {
                    //    page.correcturl = false;
                    //    page.errmsg = "页面或目录包含参数"
                    //    flag = false
                    //}
                }
            })
            return flag;
        }
        $scope.null_pages = false;
        $scope.onUpdateSubdirectory = function () {
//判断正确性
            if (!$scope.checkPage($scope.pages)) {
                return;
            }
            ////判断是否全空
            $scope.null_pages = true;
            var pages = [];
            for (var index in $scope.pages) {
                if ($scope.pages[index].url != undefined && $scope.pages[index].url.trim() != "") {
                    $scope.null_pages = false;
                    pages.push({url: $scope.pages[index].url})
                }
            }
            if ($scope.null_pages) {//全空
                return;
            }
            ////判断是否全空
            var no_pages = [];
            for (var index in $scope.no_pages) {
                if ($scope.no_pages[index].url != undefined && $scope.no_pages[index].url.trim() != "") {
                    no_pages.push({url: $scope.no_pages[index].url})
                }
            }
            $scope.subdirectory.analysis_url = listToStirng($scope.pages);

            $scope.subdirectory.not_analysis_url = listToStirng($scope.no_pages);

            var entity = JSON.stringify($scope.subdirectory);

            var url = "/config/subdirectory_list?type=update&query={\"_id\":\"" + $scope.subdirectory._id + "\"}&updates=" + escape(entity) ;
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {

                $scope.urlDialog = ngDialog.open({
                    preCloseCallback: function () {
                        $state.go('childlist');
                    },
                    template: '<div class="ngdialog-buttons" ><div class="ngdialog-tilte">来自网页的消息</div><ul class="admin-ng-content"><li>保存成功</li></ul>' + '<div class="ng-button-div">\
                  <button type="button" class="ngdialog-button ng-button " ng-click="closeThisDialog(0)">确定</button></div></div>',
                    className: 'ngdialog-theme-default admin_ngdialog',
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