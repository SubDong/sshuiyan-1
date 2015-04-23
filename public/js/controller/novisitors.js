/**
 * Created by SubDong on 2015/4/23.
 */
app.controller('novisitors', function ($scope, $rootScope, $http) {
    $scope.todayClass = true;

    $rootScope.tableTimeStart = 0;
    $rootScope.tableTimeEnd = 0;
    $rootScope.tableFilter = undefined;


    $scope.dateTimeStart = today_start().valueOf();
    $scope.dateTimeEnd = today_end().valueOf();
    $scope.reset = function () {
        $scope.todayClass = false;
        $scope.yesterdayClass = false;
        $scope.sevenDayClass = false;
        $scope.monthClass = false;
        $scope.definClass = false;
    };
    $scope.today = function () {
        $scope.reset();
        $scope.todayClass = true;
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;

    };
    $scope.yesterday = function () {
        $scope.reset();
        $scope.yesterdayClass = true;
        $rootScope.tableTimeStart = -1;
        $rootScope.tableTimeEnd = -1;

    };
    $scope.sevenDay = function () {
        $scope.reset();
        $scope.sevenDayClass = true;
        $rootScope.tableTimeStart = -7;
        $rootScope.tableTimeEnd = -1;

    };
    $scope.month = function () {
        $scope.reset();
        $scope.monthClass = true;
        $rootScope.tableTimeStart = -30;
        $rootScope.tableTimeEnd = -1;


    };
});