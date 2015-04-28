/**
 * Created by SubDong on 2015/4/23.
 */
app.controller('indexoverview', function ($scope, $rootScope, $http) {
    $scope.todayClass = true;

    $rootScope.tableTimeStart = 0;
    $rootScope.tableTimeEnd = 0;
    $rootScope.latitude = {name: "页面url", field: "loc"}
    $rootScope.dimen = false;


    $scope.$on("ssh_refresh_charts", function(e, msg) {
        $rootScope.targetSearch();
    });
});