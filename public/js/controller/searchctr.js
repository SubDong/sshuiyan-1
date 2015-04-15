/**
 * Created by john on 2015/4/2.
 */
app.controller('searchctr', function ($scope, $http) {
        $scope.todayClass = true;
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
            $scope.dt = new Date();
        };
        $scope.yesterday = function () {
            $scope.reset();
            $scope.yesterdayClass = true;

        };
        $scope.sevenDay = function () {
            $scope.reset();
            $scope.sevenDayClass = true;
        };
        $scope.month = function () {
            $scope.reset();
            $scope.monthClass = true;

        };
        $scope.open = function ($event) {
            $scope.reset();
            $scope.definClass = true;
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };
        $scope.checkopen = function ($event) {
            $scope.reset();
            $scope.othersdateClass = true;
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opens = true;
        };
        // initialize
        $scope.today();
        //$scope.initMap();

    }
)
