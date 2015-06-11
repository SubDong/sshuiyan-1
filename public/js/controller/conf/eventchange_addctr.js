/**
 * Created by john on 2015/4/1.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('eventchange_addctr', function ($scope, $http,$rootScope,$cookieStore) {

        //事件转化对象
        $scope.eventChange = {};
        //是否使用正则表达式
        $scope.eventChange.event_id = "0";
        //要分析的页面
        $scope.eventChange.event_name ="";
        //不分析的页面
        $scope.eventChange.event_page ="";
        // user id 用户ID
        $scope.eventChange.uid =  $cookieStore.get("uid");
        // 根目录
        $scope.eventChange.root_url =$rootScope.userType;
        //创建时间
        $scope.eventChange.create_date = new Date().Format("yyyy-MM-dd hh:mm:ss");





    })
});
