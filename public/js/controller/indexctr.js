/**
 * Created by yousheng on 15/3/26.
 */

app.controller('IndexCtrl', function ($scope, $http, requestService, messageService) {
    $scope.todayClass = true;
    $scope.dayClass = true;
    $scope.timeselect = true;
    $scope.reset = function () {
        $scope.todayClass = false;
        $scope.yesterdayClass = false;
        $scope.sevenDayClass = false;
        $scope.monthClass = false;
        $scope.definClass = false;
        $scope.btnchecked = true;
    };
    $scope.today = function () {
        $scope.reset();
        $scope.todayClass = true;
        $scope.btnchecked = false;
        var start = today_start(), end = today_end();
        var option = {
            type: "pv",
            chart: "line",
            interval: 24
        };
        requestService.request('index_charts', start.getTime(), end.getTime(), option);
        requestService.mapRequest('gest_map', start.getTime(), end.getTime(), "pv");
        requestService.pieRequest("environment_map", start.getTime(), end.getTime(), "pv");

    };
    $scope.yesterday = function () {
        $scope.reset();
        $scope.yesterdayClass = true;
        var start = yesterday_start(), end = yesterday_end(), option = {
            type: "pv",
            chart: 'line',
            interval: 24
        };
        requestService.request('index_charts', start.getTime(), end.getTime(), option);
        requestService.mapRequest('gest_map', start.getTime(), end.getTime(), "pv");
        requestService.pieRequest("environment_map", start.getTime(), end.getTime(), "pv");
    };
    $scope.sevenDay = function () {
        $scope.reset();
        $scope.sevenDayClass = true;
        var start = lastWeek_start(), end = today_end(), option = {
            type: "pv",
            chart: 'line',
            interval: 7
        };
        requestService.request('index_charts', start.getTime(), end.getTime(), option);

    };
    $scope.month = function () {
        $scope.reset();
        $scope.monthClass = true;
        var start = lastMonth_start(), end = today_end(), option = {
            type: "pv",
            chart: 'line',
            interval: 30
        };
        requestService.request('index_charts', start.getTime(), end.getTime(), option);

    };
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
        $scope.reset();
        $scope.definClass = true;
    };

    $scope.initMap = function () {
        var start = today_start(), end = today_end();
        requestService.mapRequest('gest_map', start.getTime(), end.getTime(), "pv");
    };
    // initialize
    $scope.today();
    //$scope.initMap();
    $scope.hourcheck = function () {
        $scope.hourcheckClass = true;
        $scope.dayClass = false;
        $scope.timeselect = false;

    };
    $scope.daycheck = function () {
        $scope.hourcheckClass = false;
        $scope.dayClass = true;
        $scope.timeselect = true;

        $scope.today();
    };
    $scope.selected = '';

    $scope.model = [{
        id: 1,
        when: '00:00-00:59'

    }, {
        id: 2,
        when: '01:00-01:59'
    }, {
        id: 3,
        when: '02:00-02:59'
    },
        {
            id: 4,
            when: '03:00-03:59'
        },
        {
            id: 5,
            when: '04:00-04:59'
        },
        {
            id: 6,
            when: '05:00-05:59'
        },
        {
            id: 7,
            when: '06:00-06:59'
        },
        {
            id: 8,
            when: '07:00-07:59'
        },
        {
            id: 9,
            when: '08:00-08:59'
        },
        {
            id: 10,
            when: '09:00-09:59'
        },
        {
            id: 11,
            when: '10:00-10:59'
        },
        {
            id: 12,
            when: '11:00-11:59'
        },
        {
            id: 13,
            when: '12:00-12:59'
        },
        {
            id: 14,
            when: '13:00-13:59'
        },
        {
            id: 15,
            when: '14:00-14:59'
        },
        {
            id: 16,
            when: '15:00-15:59'
        },
        {
            id: 17,
            when: '16:00-16:59'
        },
        {
            id: 18,
            when: '17:00-17:59'
        },
        {
            id: 19,
            when: '18:00-18:59'
        },
        {
            id: 20,
            when: '19:00-19:59'
        },
        {
            id: 21,
            when: '20:00-20:59'
        },
        {
            id: 22,
            when: '21:00-21:59'
        },
        {
            id: 23,
            when: '22:00-22:59'
        },
        {
            id: 24,
            when: '23:00-23:59'
        },


    ];

});
