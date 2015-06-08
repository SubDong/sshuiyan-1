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
        $scope.init= function(){
            var uid= $cookieStore.get("uid");
            var site_id=$rootScope.userType;
            var url= "/config/conf?index=5&type=search&query={\"uid\":\""+uid+"\",\"site_id\":\""+site_id+"\"}";
            console.log(url);
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                console.log("获取配置结果"+status);
                if(dataConfig!=null&&dataConfig.length>0){
                    console.log("初始化数据");
                    $scope.time_conv = dataConfig[0].time_conv;
                    $scope.pv_conv =dataConfig[0].pv_conv;
                }
            });

        };

    });
});
