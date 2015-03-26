app.config(function ($locationProvider, $stateProvider, $urlRouterProvider) {

    //$locationProvider.html5Mode(true);

    $urlRouterProvider.when('', '/index');

    $stateProvider
        .state('index', {
            url: '/index',
            templateUrl: '../home/main.html',
            controller: function ($scope, requestService) {
                $scope.init = function () {
                    var selectType=getCheckbox("radio1");
                    requestService.request('index_charts', today_start().getTime(), today_end().getTime(), {type:selectType,chart:"line"});

                };

                $scope.init();
            }
        })
        .state('visitor', {
            url: "/trend/visitor",
            templateUrl: "../trend/visitor.html"
        })
        .state('today', {
            url: "/trend/today",
            templateUrl: "../trend/today.html"
        })
        .state('yesterday', {
            url: "/trend/yesterday",
            templateUrl: "../trend/yesterday.html"
        })
        .state('month', {
            url: "/trend/month",
            templateUrl: "../trend/month.html"
        })
        .state('source', {
            url: "/source/source",
            templateUrl: "../source/source.html"
        })
        .state('searchengine', {
            url: "/source/searchengine",
            templateUrl: "../source/searchengine.html"
        })
        .state('searchterm', {
            url: "/source/searchterm",
            templateUrl: "../source/searchterm.html"
        })
        .state('externallinks', {
            url: "/source/externallinks",
            templateUrl: "../source/externallinks.html"
        })
        .state('visitedpages', {
            url: "/page/visitedpages",
            templateUrl: "../page/visitedpages.html"
        })
        .state('entrancepage', {
            url: "/page/entrancepage",
            templateUrl: "../page/entrancepage.html"
        })
        .state('pagetitle', {
            url: "/page/pagetitle",
            templateUrl: "../page/pagetitle.html"
        })
        .state('visitormap', {
            url: "/visitor/visitormap",
            templateUrl: "../visitor/visitormap.html"
        })
        .state('equipment', {
            url: "/visitor/equipment",
            templateUrl: "../visitor/equipment.html"
        })
        .state('novisitors', {
            url: "/visitor/novisitors",
            templateUrl: "../visitor/novisitors.html"
        })
        .state('visitorfeature', {
            url: "/visitor/visitorfeature",
            templateUrl: "../visitor/visitorfeature.html"
        })


});