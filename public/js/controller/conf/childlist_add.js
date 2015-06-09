/**
 * Created by Fzk lwek on 2015/6/4.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('childlist_add', function ($scope, $http,$rootScope,$cookieStore) {

        //��Ŀ¼����
        $scope.subdirectory = {};
        //�Ƿ�ʹ��������ʽ
        $scope.subdirectory.is_regular;
        //Ҫ������ҳ��
        $scope.subdirectory.analysis_url ="";
        //��������ҳ��
        $scope.subdirectory.not_analysis_url ="";
        //��Ŀ¼����
        $scope.subdirectory.subdirectory_url="";
        // user id �û�ID
        $scope.subdirectory.uid =  $cookieStore.get("uid");
        // ��Ŀ¼
        $scope.subdirectory.root_url =$rootScope.userType;
        //����ʱ��
        $scope.subdirectory.create_date = new Date();



        $scope.pages =[{
            url:""
        }];

        $scope.no_pages =[{
            url:""
        }];


        $scope.ipArea = {
            "tNum": "1",//��ǰ������
            "tText": "",//����
            "count": 1,//����
            "helpFlag": false//�Ƿ���ʾ������Ϣ
        };


        $scope.childlist_add_yes = angular.copy($scope.ipArea);
        $scope.childlist_add_no = angular.copy($scope.ipArea);
        //����IP
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