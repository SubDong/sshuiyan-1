/**
 * Created by john on 2015/3/31.
 */
app.controller("Vistiorctr", function ($scope, $http, requestService) {
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
        $scope.doSearch(today_start().valueOf(), today_end().valueOf(),"1");
    };
    $scope.yesterday = function () {
        $scope.reset();
        $scope.yesterdayClass = true;
        $scope.doSearch(yesterday_start().valueOf(), yesterday_end().valueOf(),"1");
    };
    $scope.sevenDay = function () {
        $scope.reset();
        $scope.sevenDayClass = true;
        $scope.doSearch(lastWeek_start().valueOf(), lastWeek_end().valueOf(),"1");

    };
    $scope.month = function () {
        $scope.reset();
        $scope.monthClass = true;
        $scope.doSearch(lastMonth_start().valueOf(), lastMonth_end().valueOf(),"1");

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


    $scope.gridOptions = {
        enableScrollbars: false,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        columnDefs: [
            {name: '地域'},
            {name: '访问时间'},
            {name: '来源'},
            {name: '访问IP'},
            {name: '访问时长'},
            {name: '访问页数'},
        ]
    };

    $scope.doSearch = function (start, end, type) {

        $http({
            method: 'GET',
            url: '/api/visitormap/?start=' + start + "&end=" + end + "&type=" + type
        }).success(function (data, status) {
            var _data = JSON.parse(eval('(' + data + ')').toString());
            $scope.pv=_data.pv;
            $scope.uv=_data.uv;
            $scope.ip=_data.ip;
            $scope.jump=_data.jump;
            $scope.avgTime=_data.avgTime;

        }).error(function (error) {
            console.log(error);
        });

    };

    // init
    $scope.doSearch(today_start().valueOf(), today_end().valueOf(),"1");
});