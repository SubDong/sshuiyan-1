/**
 * Created by john on 2015/4/1.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('eventchange_addctr', function ($scope, $http,$rootScope,$cookieStore) {

        //�¼�ת������
        $scope.eventChange = {};
        //�Ƿ�ʹ��������ʽ
        $scope.eventChange.event_id = "0";
        //Ҫ������ҳ��
        $scope.eventChange.event_name ="";
        //��������ҳ��
        $scope.eventChange.event_page ="";
        // user id �û�ID
        $scope.eventChange.uid =  $cookieStore.get("uid");
        // ��Ŀ¼
        $scope.eventChange.root_url =$rootScope.userType;
        //����ʱ��
        $scope.eventChange.create_date = new Date().Format("yyyy-MM-dd hh:mm:ss");





    })
});
