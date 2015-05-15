/**
 * Created by SubDong on 2015/5/14.
 */
app.controller('history', function ($scope, $window, $rootScope, requestService, areaService, $http, SEM_API_URL) {
    $scope.monthClass = true;
    $scope.$on("history", fun);
    var esType = "2";

    $rootScope.tableTimeStart = -30;
    $rootScope.tableTimeEnd = -1;
    $rootScope.gridArray[0] = {name: "日期", displayName: "日期", field: "period"};
    $rootScope.gridArray.splice(1, 1);
    $rootScope.tableSwitch.dimen = false;
    $rootScope.tableSwitch.coding = false;
    $rootScope.tableSwitch.number = 0;
    $rootScope.tableSwitch.latitude = {name: "日期", displayName: "日期", field: "period"};
    $rootScope.historyJu = "NO";

    $scope.historyInit = function () {
        var getTime = $rootScope.tableTimeStart == -1 || $rootScope.tableTimeStart == 0 ? "horl" : "day";
        $http({
            method: 'GET',
            url: '/api/indextable/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=" + $rootScope.tableSwitch.latitude.field
            + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&formartInfo=" + getTime + "&type=" + esType
        }).success(function (data, status) {
            $scope.$broadcast("history", data);
        }).error(function (error) {
            console.log(error);
        });
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