app.config(function ($locationProvider, $stateProvider, $urlRouterProvider) {

    //$locationProvider.html5Mode(true);

    $urlRouterProvider.when('', '/index');

    $stateProvider
        .state('index', {
            url: '/index',
            templateUrl: '../home/main.html'
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
        .state('survey', {
            url: "/extension/survey",
            templateUrl: "../extension/survey.html"
        })
        .state('search', {
            url: "/extension/search",
            templateUrl: "../extension/search.html"
        })
        .state('way', {
            url: "/extension/way",
            templateUrl: "../extension/way.html"
        })

})
