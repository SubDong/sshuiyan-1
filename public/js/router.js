app.config(function ($stateProvider, $urlRouterProvider) {

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
        });
});