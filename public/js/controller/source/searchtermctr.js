/**
 * Created by XiaoWei on 2015/5/5.
 */
app.controller("searchtermctr", function ($scope, $rootScope, $http, requestService, areaService) {
    $scope.todayClass = true;
    //日历
    this.selectedDates = [new Date().setHours(0, 0, 0, 0)];
    this.type = 'range';
    /*      this.identity = angular.identity;*/

    this.removeFromSelected = function (dt) {
        this.selectedDates.splice(this.selectedDates.indexOf(dt), 1);
    }
});