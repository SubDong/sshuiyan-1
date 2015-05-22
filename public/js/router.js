/**
 * Created by weims on 2015/5/15.
 */
define(["angular", "app"], function (ng, app) {
    'use strict';

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
            .state('searchterm_yq', {
                url: "/source/searchterm_yq",
                templateUrl: "../source/searchterm_yq.html"
            })
            .state('externallinks', {
                url: "/source/externallinks",
                templateUrl: "../source/externallinks.html"
            })
            .state('visitedpages', {
                url: "/page/visitedpages",
                templateUrl: "../page/visitedpages.html"
            })
            .state('offsitelinks', {
                url: "/page/offsitelinks",
                templateUrl: "../page/offsitelinks.html"
            })
            .state('entrancepage', {
                url: "/page/entrancepage",
                templateUrl: "../page/entrancepage.html"
            })
            .state('entrancepage_fa', {
                url: "/page/entrancepage_fa",
                templateUrl: "../page/entrancepage_fa.html"
            })
            .state('entrancepage_nv', {
                url: "/page/entrancepage_nv",
                templateUrl: "../page/entrancepage_nv.html"
            })
            .state('entrancepage_as', {
                url: "/page/entrancepage_as",
                templateUrl: "../page/entrancepage_as.html"
            })
            .state('entrancepage_af', {
                url: "/page/entrancepage_af",
                templateUrl: "../page/entrancepage_af.html"
            })
            .state('pagetitle', {
                url: "/page/pagetitle",
                templateUrl: "../page/pagetitle.html"
            })
            /*      .state('heatmap', {
             url: "/page/heatmap",
             templateUrl: "../page/heatmap.html"
             })*/
            .state('indexoverview', {
                url: "/page/indexoverview",
                templateUrl: "../page/indexoverview.html"
            })
            .state('indexoverview_pv', {
                url: "/page/indexoverview_pv",
                templateUrl: "../page/indexoverview_pv.html"
            })
            .state('indexoverview_pg', {
                url: "/page/indexoverview_pg",
                templateUrl: "../page/indexoverview_pg.html"
            })
            .state('indexoverview_ep', {
                url: "/page/indexoverview_ep",
                templateUrl: "../page/indexoverview_ep.html"
            })
            .state('provincemap/1', {
                url: "/visitor/visitormap",
                templateUrl: "../visitor/visitormap.html"
            })
            .state('provincemap', {
                url: "/visitor/provincemap",
                templateUrl: "../visitor/provincemap.html"
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
            .state('search_dy', {
                url: "/extension/search_dy",
                templateUrl: "../extension/search_dy.html"
            })
            .state('search_gjc', {
                url: "/extension/search_gjc",
                templateUrl: "../extension/search_gjc.html"
            })
            .state('search_cy', {
                url: "/extension/search_cy",
                templateUrl: "../extension/search_cy.html"
            })
            .state('search_ssc', {
                url: "/extension/search_ssc",
                templateUrl: "../extension/search_ssc.html"
            })
            .state('search_tg_url', {
                url: "/extension/search_tg_url",
                templateUrl: "../extension/search_tg_url.html"
            })
            .state('way', {
                url: "/extension/way",
                templateUrl: "../extension/way.html"
            })
            .state('urlspeed', {
                url: "/extension/urlspeed",
                templateUrl: "../extension/urlspeed.html"
            })
            .state('urlspeed_m', {
                url: "/extension/urlspeed_m",
                templateUrl: "../extension/urlspeed_m.html"
            })
            .state('urlspeed_w', {
                url: "/extension/urlspeed_w",
                templateUrl: "../extension/urlspeed_w.html"
            })
            .state('alliance', {
                url: "/extension/alliance",
                templateUrl: "../extension/alliance.html"
            })
            .state('exchange', {
                url: "/value/exchange",
                templateUrl: "../value/exchange.html"
            })
            .state('trafficmap', {
                url: "/value/trafficmap",
                templateUrl: "../value/trafficmap.html"
            })
            .state('history', {
                url: "/historytrend/history",
                templateUrl: "../historytrend/history.html"
            })
        $urlRouterProvider.when('', '/conf');
        $stateProvider
            .state('conf', {
                url: '/conf',
                templateUrl: '../weblist/main.html'
            })
    });

});