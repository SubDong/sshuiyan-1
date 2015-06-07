/**
 * Created by Fzk lwek on 2015/6/4.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('childlist_add', function ($scope, $http,$rootScope,$cookieStore) {
        $scope.ipArea = {
            "tNum": "1",//��ǰ������
            "tText": "",//����
            "count": 1,//����
            "helpFlag": false//�Ƿ���ʾ������Ϣ
        };
        $scope.pages =[{
            pages_web:""
        }];
        $scope.no_pages =[{
            no_pages_web:""
        }];
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
            o.push({});
        };
        $scope.deletePage=function(p){
            p.pop();
        };
    });
});