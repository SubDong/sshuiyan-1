app.config(function ($locationProvider, $stateProvider, $urlRouterProvider) {

    //$locationProvider.html5Mode(true);

    $urlRouterProvider.when('', '/index');

    $stateProvider
        .state('index', {
            url: '/index',
            templateUrl: '../home/main.html'
        })
        .state('realtime', {
            url: "/trend/realtime",
            templateUrl: "../trend/realtime.html"
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
            templateUrl: "../source/source.html",
            controller:function($rootScope){
                $rootScope.latitude = {name: "来源类型", field: "rf_type"}
            }
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
            templateUrl: "../page/entrancepage.html",
            controller:function($rootScope){
                $rootScope.latitude = {name: "页面url", field: "loc"}
            }
        })
        .state('entrancepage/1', {
            url: "/page/secendpage/flowanalysis",
            templateUrl: "../page/secendpage/flowanalysis.html"
        })
        .state('entrancepage/2', {
            url: "/page/secendpage/newvisitors",
            templateUrl: "../page/secendpage/newvisitors.html"
        })
        .state('entrancepage/3', {
            url: "/page/secendpage/attractivenessanalysis",
            templateUrl: "../page/secendpage/attractivenessanalysis.html"
        })
        .state('entrancepage/4', {
            url: "/page/secendpage/analysistransformation",
            templateUrl: "../page/secendpage/analysistransformation.html"
        })
        .state('pagetitle', {
            url: "/page/pagetitle",
            templateUrl: "../page/pagetitle.html"
        })
        .state('indexoverview', {
            url: "/page/indexoverview",
            templateUrl: "../page/indexoverview.html",
            controller:function($rootScope){
                $rootScope.latitude = {name: "页面url", field: "loc"}
            }
        })
        .state('indexoverview/1', {
            url: "/page/indexoverview/pagevalue",
            templateUrl: "../page/secendpage/pagevalue.html"
        })
        .state('indexoverview/2', {
            url: "/page/secendpage/visitedpages",
            templateUrl: "../page/secendpage/visitedpages.html"
        })
        .state('indexoverview/3', {
            url: "/page/secendpage/exitpages",
            templateUrl: "../page/secendpage/exitpages.html"
        })
        .state('provincemap/1', {
            url: "/visitor/visitormap",
            templateUrl: "../visitor/visitormap.html"
        })
        .state('provincemap', {
            url: "/visitor/provincemap",
            templateUrl: "../visitor/provincemap.html",
            controller:function($rootScope){
                $rootScope.latitude = {name: "地域", field: "region"};
                /*$rootScope.checkedArray = ["pv","uv"];
                $rootScope.gridArray = [{field: "region",name: "地域"},{field: "pv",name: "浏览量(PV)"},{field: "uv",name: "访客数(UV)"}];
                var res = ["flow","TodayWeb"];
                initTable(res,$rootScope.checkedArray);*/
            }
        })
        .state('equipment', {
            url: "/visitor/equipment",
            templateUrl: "../visitor/equipment.html",
            controller:function($rootScope){
                $rootScope.latitude = {name: "浏览器", field: "br"}
            }
        })
        .state('novisitors', {
            url: "/visitor/novisitors",
            templateUrl: "../visitor/novisitors.html",
            controller:function($rootScope){
                $rootScope.latitude = {name: "新老访客", field: "ct"}
            }
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
        .state('urlspeed', {
            url: "/extension/urlspeed",
            templateUrl: "../extension/urlspeed.html"
        })
        .state('alliance', {
            url: "/extension/alliance",
            templateUrl: "../extension/alliance.html"
        })

});
