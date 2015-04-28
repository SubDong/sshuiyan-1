/**
 * Created by john on 2015/4/2.
 */
app.controller('searchctr', function ($scope, $rootScope,areaService, $http) {
        $scope.todayClass = true;

        //table默认信息配置
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        $rootScope.tableFilter = undefined;
        $rootScope.latitude = {name: "搜索引擎", field: "wd"}
        //

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

            //table配置
            $rootScope.tableTimeStart = 0;
            $rootScope.tableTimeEnd = 0;
            $rootScope.targetSearch();
            //

        };
        $scope.yesterday = function () {
            $scope.reset();
            $scope.yesterdayClass = true;

            //table配置
            $rootScope.tableTimeStart = -1;
            $rootScope.tableTimeEnd = -1;
            $rootScope.targetSearch();
            //

        };
        $scope.sevenDay = function () {
            $scope.reset();
            $scope.sevenDayClass = true;

            //table配置
            $rootScope.tableTimeStart = -7;
            $rootScope.tableTimeEnd = -1;
            $rootScope.targetSearch();
            //
        };
        $scope.month = function () {
            $scope.reset();
            $scope.monthClass = true;

            //table配置
            $rootScope.tableTimeStart = -30;
            $rootScope.tableTimeEnd = -1;
            $rootScope.targetSearch();
            //

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
        //点击显示指标
        $scope.visible =true;
        $scope.select = function(){
            $scope.visible =false;
        };
        $scope.clear = function() {
            $scope.page.selected = undefined;
            $scope.city.selected = undefined;
            $scope.country.selected = undefined;
            $scope.continent.selected = undefined;
        };
        $scope.page = {};
        $scope.pages = [
            { name: '全部页面目标'},
            { name: '全部事件目标'},
            { name: '所有页面右上角按钮'},
            { name: '所有页面底部400按钮'},
            { name: '详情页右侧按钮'},
            { name: '时长目标'},
            { name: '访问页数目标'},
        ];

    }
)
