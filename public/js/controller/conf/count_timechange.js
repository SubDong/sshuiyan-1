/**
 * Created by john on 2015/4/1.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('timechange', function ($scope, $http,$rootScope,$cookieStore) {
       //$scope.
        $scope.time_conv={
            status: false,
            val: 30
        };
        $scope.pv_conv={
            status: false,
            val: 3
        };
        /**
         * 数据初始化
         */

       var init= function(){
            var uid= $cookieStore.get("uid");
            var site_id=$rootScope.userType;
            var url= "/config/conf?index=5&type=search&query={\"uid\":\""+uid+"\",\"site_id\":\""+site_id+"\"}";
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                if(dataConfig!=null&&dataConfig.length>0){
                    $scope.time_conv = dataConfig[0].time_conv;
                    $scope.pv_conv =dataConfig[0].pv_conv;
                }
            });

        };
        init();
        Custom.initCheckInfo();//页面check样式js调用
        $scope.onSubmitClickListener = function (){
            var uid= $cookieStore.get("uid");
            var site_id=$rootScope.userType;//从conf_sites中获取
            var query= "/config/conf?index=5&type=search&query={\"uid\":\""+uid+"\",\"site_id\":\""+site_id+"\"}";
            $http({
                method: 'GET',
                url: query
            }).success(function (dataConfig, status) {
                if(dataConfig==null||dataConfig.length==0){//不存在配置 save
                    var entity= "{\"uid\":\""+uid+"\",\"site_id\":\""+site_id+"\",\"time_conv\":"+ angular.toJson($scope.time_conv)+",\"pv_conv\":"+ angular.toJson($scope.pv_conv)+"}";
                    var url= "/config/conf?index=5&type=save&entity="+entity;
                    $http({
                        method: 'GET',
                        url: url
                    }).success(function (dataConfig, status) {

                    });
                }else{//update
                    var updates= "{\"uid\":\""+uid+"\",\"site_id\":\""+site_id+"\",\"time_conv\":"+ angular.toJson($scope.time_conv)+",\"pv_conv\":"+ angular.toJson($scope.pv_conv)+"}";
                    var url= "/config/conf?index=5&type=update&query={\"uid\":\""+uid+"\",\"site_id\":\""+site_id+"\"}&updates="+updates;
                    $http({
                        method: 'GET',
                        url: url
                    }).success(function (dataConfig, status) {

                    });

                }

            });
        }
    });
});
