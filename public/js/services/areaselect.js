app.service('areaService', ['$rootScope','$http',function ($scope,$rootScope,$http) {
        $scope.disabled = undefined;
        $scope.enable = function() {
            $scope.disabled = false;
        };
        $scope.disable = function() {
            $scope.disabled = true;
        };
        $scope.country = {};
        $scope.countrys = [
            { name: '中国'},
            { name: '泰国'},
        ];
        $scope.city = {};
        $scope.citys = [
            { name: '北京'},
            { name: '上海'},
            { name: '成都'},
        ];
        $scope.continent = {};
        $scope.continents = [
            { name: '亚洲'},
            { name: '美洲 '},
        ];



}]);

