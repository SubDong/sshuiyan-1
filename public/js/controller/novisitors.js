/**
 * Created by SubDong on 2015/4/23.
 */
app.controller('novisitors', function ($scope, $rootScope, $http,areaService) {
    $scope.todayClass = true;

    $rootScope.tableFilter = undefined;


    $scope.$on("ssh_refresh_charts", function(e, msg) {
        $rootScope.targetSearch();
    });
});