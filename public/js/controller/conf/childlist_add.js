/**
 * Created by Fzk lwek on 2015/6/4.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('childlist_add', function ($scope, $http,$rootScope,$cookieStore) {

        //子目录对象
        $scope.subdirectory = {};
        //是否使用正则表达式
        $scope.subdirectory.is_regular;
        //要分析的页面
        $scope.subdirectory.analysis_url ="";
        //不分析的页面
        $scope.subdirectory.not_analysis_url ="";
        //子目录名称
        $scope.subdirectory.subdirectory_url="";
        // user id 用户ID
        $scope.subdirectory.uid =  $cookieStore.get("uid");
        // 根目录
        $scope.subdirectory.root_url =$rootScope.userType;
        //创建时间
        $scope.subdirectory.create_date = new Date();



        $scope.pages =[{
            url:""
        }];

        $scope.no_pages =[{
            url:""
        }];


        $scope.ipArea = {
            "tNum": "1",//当前个数？
            "tText": "",//内容
            "count": 1,//个数
            "helpFlag": false//是否显示帮组信息
        };


        $scope.childlist_add_yes = angular.copy($scope.ipArea);
        $scope.childlist_add_no = angular.copy($scope.ipArea);
        //规则IP
        $scope.myFocus = function (obj) {
            obj.helpFlag = true;
        };

        $scope.myBlur = function (obj) {
            obj.helpFlag = false;
        };
        $scope.addPage = function (o) {
            o.push({
                url:""
            });
        };
        $scope.deletePage=function(p){
            p.pop();
        };


        $scope.onSaveSubdirectory = function (){

            $scope.subdirectory.analysis_url = listToStirng($scope.pages);

            $scope.subdirectory.not_analysis_url = listToStirng($scope.no_pages);

            var entity =  JSON.stringify($scope.subdirectory);


            var url= "/config/subdirectory_list?type=save&entity="+entity;
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                console.log(dataConfig);
            });

        };

        var listToStirng = function (list) {
            var str = "";
            list.forEach(function (page) {
                str += page.url +",";
            })
            str=str.substring(0,str.length-1);
            return str;
        }





    });
});