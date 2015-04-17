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
        //点击显示指标
        $scope.visible =true;
        $scope.select = function(){
            $scope.visible =false;
        };
        $scope.disabled = undefined;
        $scope.enable = function() {
            $scope.disabled = false;
        };

        $scope.disable = function() {
            $scope.disabled = true;
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

    }
)
