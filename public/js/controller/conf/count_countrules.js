/**
 * Created by john on 2015/4/1.
 */

define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('countrules', function ($scope, $http, $q, requestService) {
        $scope.rules ={
            source:"",
            convert:""
        };
        //排除IP
        $scope.ex_ips=[];
        //排除来源域名
        $scope.ex_refer_urls=[];
        //排除受访域名
        $scope.ex_urls=[];
        //跨域监控
        $scope.cross_sites=[];
        //启用长效转化
        $scope.open_tranver=false;
        //访客点击广告后天数
        $scope.days=1;
        $scope.onSubmitClickListener = function (){
            console.log($scope.rules.source+"**********************"+$scope.rules.convert);
            console.log("**********************"+$scope.ex_ips[0]);
            console.log("**********************"+$scope.open_tranver);
            console.log("**********************"+$scope.days);


            var entity= "{rules:[source:"+ $scope.rules.source+",convert:"+ $scope.rules.convert+"],ex_ips:"+$scope.ex_ips+""+",ex_refer_urls:"
                + $scope.ex_refer_urls+",ex_urls:"+ $scope.ex_urls+",cross_sites:"+ $scope.cross_sites+"}";
            var url= "/api/config?index=0&type='saveOrUpdate'&entity="+entity;
            //var url= "/api/config?index=0&type=saveOrUpdate&rule
            // s="+ $scope.rules+"&ex_ips="+ $scope.ex_ips+"&ex_refer_urls="+ $scope.ex_refer_urls+"&ex_urls="+
            //    $scope.ex_urls+"&cross_sites="+ $scope.cross_sites+"&open_tranver="+ $scope.open_tranver+"&days="+ $scope.days;
            ////$http.get(url);
            //
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                console.log("修改保存配置状态"+status);
            });
            //$scope.clear();
        };

        /**
         * 清空初始化输入内容
         */
        $scope.clear = function (){
            $scope.rules ={
                source:"",
                convert:""
            };
            //排除IP
            $scope.ex_ips=[];
            //排除来源域名
            $scope.ex_refer_urls=[];
            //排除受访域名
            $scope.ex_urls=[];
            //跨域监控
            $scope.cross_sites=[];
            //启用长效转化
            $scope.open_tranver=false;
            //访客点击广告后天数
            $scope.days=1;
        };
    });
});
