/**
 * Created by SubDong on 2015/5/14.
 */
define(['./module'], function (ctrs) {
    'use strict';
    ctrs.controller('history', function ($scope, $window, $location, $rootScope, requestService, areaService, $http, SEM_API_URL) {
        if($rootScope.gridArray == undefined || $rootScope.tableSwitch == undefined){
            var temp_path = $location.path();
            var _index = temp_path.indexOf("/history");
            console.log(_index);
            $location.path(temp_path.substring(0, _index));
        }

        $scope.monthClass = true;
        var esType = "2";

        $rootScope.tableTimeStart = -30;
        $rootScope.tableTimeEnd = -1;
        $rootScope.tableFormat = null;

        $rootScope.gridArray[0] = {name: "日期", displayName: "日期", field: "period"};
        $rootScope.gridArray.splice(1, 1);
        $rootScope.tableSwitch.dimen = false;
        $rootScope.tableSwitch.coding = false;

        $rootScope.tableSwitch.latitude = {name: "日期", displayName: "日期", field: "period"};
        $rootScope.historyJu = "NO";

        $scope.historyInit = function () {
            var getTime = $rootScope.tableTimeStart <= -7 ? "day" : "hour";
            if($rootScope.tableSwitch.number == 4){
                var searchUrl = SEM_API_URL + "elasticsearch/"+esType+"/?startOffset="+ $rootScope.tableTimeStart+"&endOffset="+ $rootScope.tableTimeEnd;
                $http({
                    method: 'GET',
                    url: searchUrl
                }).success(function (data, status) {
                    $scope.$broadcast("history", data);
                    $rootScope.historyJu = "";
                })
            }else{
                $rootScope.tableSwitch.number = 0;
                $http({
                    method: 'GET',
                    url: '/api/indextable/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=" + $rootScope.tableSwitch.latitude.field
                    + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&formartInfo=" + getTime + "&type=" + esType
                }).success(function (data, status) {
                    $scope.$broadcast("history", data);
                    $rootScope.historyJu = "";
                }).error(function (error) {
                    console.log(error);
                });
            }
        }


        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $scope.historyInit()
        });
        //日历
        this.selectedDates = [new Date().setHours(0, 0, 0, 0)];

        this.type = 'range';
        this.removeFromSelected = function (dt) {
            this.selectedDates.splice(this.selectedDates.indexOf(dt), 1);
        }
    });
});