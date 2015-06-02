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
        //�ų�IP
        $scope.ex_ips=[];
        //�ų���Դ����
        $scope.ex_refer_urls=[];
        //�ų��ܷ�����
        $scope.ex_urls=[];
        //������
        $scope.cross_sites=[];
        //���ó�Чת��
        $scope.open_tranver=false;
        //�ÿ͵����������
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
                console.log("�޸ı�������״̬"+status);
            });
            //$scope.clear();
        };

        /**
         * ��ճ�ʼ����������
         */
        $scope.clear = function (){
            $scope.rules ={
                source:"",
                convert:""
            };
            //�ų�IP
            $scope.ex_ips=[];
            //�ų���Դ����
            $scope.ex_refer_urls=[];
            //�ų��ܷ�����
            $scope.ex_urls=[];
            //������
            $scope.cross_sites=[];
            //���ó�Чת��
            $scope.open_tranver=false;
            //�ÿ͵����������
            $scope.days=1;
        };
    });
});
