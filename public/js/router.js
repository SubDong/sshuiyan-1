/**
 * Created by weims on 2015/5/15.
 */
define(["angular", "./app"], function (angular, myApp) {
    'use strict';

    myApp.config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            // 设置路由
            $stateProvider
                .state('index', {
                    url: '/index',
                    templateUrl: 'home/main.html',
                    //controller: 'indexctr',
                    resolve: {
                        load: loadDeps([
                            'controller/indexctr'
                        ])
                    }
                });

            // extension百度推广
            $stateProvider
                .state('survey', {
                    url: "/extension/survey",
                    templateUrl: "../extension/survey.html",
                    resolve: {
                        load: loadDeps([
                            'controller/surveryctrl'
                        ])
                    }
                })
                .state('search', {
                    url: "/extension/search",
                    templateUrl: "../extension/search.html",
                    resolve: {
                        load: loadDeps([
                            'controller/search/searchctr',
                            'controller/search/searchpromotion'
                        ])
                    }
                })
                .state('search_dy', {
                    url: "/extension/search_dy",
                    templateUrl: "../extension/search_dy.html",
                    resolve: {
                        load: loadDeps([
                            'controller/search/search_dy_ctr',
                            'controller/search/searchpromotion'
                        ])
                    }
                })
                .state('search_gjc', {
                    url: "/extension/search_gjc",
                    templateUrl: "../extension/search_gjc.html",
                    resolve: {
                        load: loadDeps([
                            'controller/search/search_gjc_ctr',
                            'controller/search/searchpromotion'
                        ])
                    }
                })
                .state('search_cy', {
                    url: "/extension/search_cy",
                    templateUrl: "../extension/search_cy.html",
                    resolve: {
                        load: loadDeps([
                            'controller/search/search_cy_ctr',
                            'controller/search/searchpromotion'
                        ])
                    }
                })
                .state('search_ssc', {
                    url: "/extension/search_ssc",
                    templateUrl: "../extension/search_ssc.html",
                    resolve: {
                        load: loadDeps([
                            'controller/search/search_ssc_ctr',
                            'controller/search/searchpromotion'
                        ])
                    }
                })
                .state('search_tg_url', {
                    url: "/extension/search_tg_url",
                    templateUrl: "../extension/search_tg_url.html",
                    resolve: {
                        load: loadDeps([
                            'controller/search/search_tg_ctr',
                            'controller/search/searchpromotion'
                        ])
                    }
                })
                .state('way', {
                    url: "/extension/way",
                    templateUrl: "../extension/way.html",
                    resolve: {
                        load: loadDeps([
                            'controller/wayctrl'
                        ])
                    }
                })
                .state('urlspeed', {
                    url: "/extension/urlspeed",
                    templateUrl: "../extension/urlspeed.html",
                    resolve: {
                        load: loadDeps([
                            "controller/url/urlspeedctr"
                        ])
                    }
                })
                .state('urlspeed_m', {
                    url: "/extension/urlspeed_m",
                    templateUrl: "../extension/urlspeed_m.html",
                    resolve: {
                        load: loadDeps([
                            "controller/url/urlspeed_m"
                        ])
                    }
                })
                .state('urlspeed_w', {
                    url: "/extension/urlspeed_w",
                    templateUrl: "../extension/urlspeed_w.html",
                    resolve: {
                        load: loadDeps([
                            "controller/url/urlspeed_w"
                        ])
                    }
                })
                .state('alliance', {
                    url: "/extension/alliance",
                    templateUrl: "../extension/alliance.html",
                    resolve: {
                        load: loadDeps([
                            "controller/alliance/alliancectr",
                            'controller/search/searchpromotion'
                        ])
                    }
                }).state('alliance_group', {
                    url: "/extension/alliance_group",
                    templateUrl: "../extension/alliance_group.html",
                    resolve: {
                        load: loadDeps([
                            'controller/alliance/alliance_group_ctr',
                            'controller/search/searchpromotion',
                            'controller/alliance/alliancepromotion'
                        ])
                    }
                }).state('alliance_cy', {
                    url: "/extension/alliance_cy",
                    templateUrl: "../extension/alliance_cy.html",
                    resolve: {
                        load: loadDeps([
                            'controller/alliance/alliance_cy_ctr',
                            'controller/search/searchpromotion'
                        ])
                    }
                }).state('alliance_network', {
                    url: "/extension/alliance_network",
                    templateUrl: "../extension/alliance_network.html",
                    resolve: {
                        load: loadDeps([
                            'controller/alliance/alliance_network_ctr',
                            'controller/search/searchpromotion'
                        ])
                    }
                }).state('alliance_keyword', {
                    url: "/extension/alliance_keyword",
                    templateUrl: "../extension/alliance_keyword.html",
                    resolve: {
                        load: loadDeps([
                            'controller/alliance/alliance_keyword_ctr',
                            'controller/search/searchpromotion'
                        ])
                    }
                });

            // trend趋向分析
            $stateProvider
                .state('realtime', {
                    url: "/trend/realtime",
                    templateUrl: "trend/realtime.html",
                    //controller: 'trend_realtime_ctrl',
                    resolve: {
                        load: loadDeps([
                            'controller/trend/trend_realtime_ctrl'
                        ])
                    }
                })
                .state('today', {
                    url: "/trend/today",
                    templateUrl: "trend/today.html",
                    //controller: 'trend_today_ctrl',
                    resolve: {
                        load: loadDeps([
                            'controller/trend/trend_today_ctrl'
                        ])
                    }
                })
                .state('yesterday', {
                    url: "/trend/yesterday",
                    templateUrl: "trend/yesterday.html",
                    //controller: 'trend_yesterday_ctrl',
                    resolve: {
                        load: loadDeps([
                            'controller/trend/trend_yesterday_ctrl'
                        ])
                    }
                })
                .state('month', {
                    url: "/trend/month",
                    templateUrl: "trend/month.html",
                    //controller: 'trend_month_ctrl',
                    resolve: {
                        load: loadDeps([
                            'controller/trend/trend_month_ctrl'
                        ])
                    }
                });

            // transform转化分析
            $stateProvider
                .state('transformAnalysis', {
                    url: '/transform/transformAnalysis',
                    templateUrl: '../transform/transformAnalysis.html',
                    resolve: {
                        load: loadDeps([
                            "controller/transform/transformAnalysis",
                            "controller/tabsctrl"
                        ])
                    }
                })
                .state('pageTransform', {
                    url: "/transform/pageTransform",
                    templateUrl: "./transform/pageTransform.html",
                    resolve: {
                        load: loadDeps([
                            'controller/transform/pageTransformCtr',
                            "controller/transform/transformSearchPromotion"
                        ])
                    }
                });
//            同类群主分析
            $stateProvider
                .state('sameGroupAnalysis', {
                    url: '/group_analysis/sameGroupAnalysis',
                    templateUrl: '../group_analysis/sameGroupAnalysis.html',
                    resolve: {
                        load: loadDeps([
                            "controller/group_analysis/sameGroupAnalysisCtr"
                        ])
                    }
                });
//            指定广告跟踪
            $stateProvider
                .state('adsSource', {
                    url: '/ads/adsSource',
                    templateUrl: '../ads/adsSource.html',
                    resolve: {
                        load: loadDeps([
                            "controller/ads/adsSourceCtr",
                            "controller/tabsctrlads"
                        ])
                    }
                })
                .state('adsPlan', {
                    url: '/ads/adsPlan',
                    templateUrl: '../ads/adsPlan.html',
                    resolve: {
                        load: loadDeps([
                            "controller/ads/adsPlanCtr",
                            "controller/tabsctrlads"
                        ])
                    }
                })
                .state('adsKeyWord', {
                    url: '/ads/adsKeyWord',
                    templateUrl: '../ads/adsKeyWord.html',
                    resolve: {
                        load: loadDeps([
                            "controller/ads/adsKeyWordCtr",
                            "controller/tabsctrlads"
                        ])
                    }
                })
                .state('adsCreative', {
                    url: '/ads/adsCreative',
                    templateUrl: '../ads/adsCreative.html',
                    resolve: {
                        load: loadDeps([
                            "controller/ads/adsCreativeCtr",
                            "controller/tabsctrlads"
                        ])
                    }
                })
                .state('adsMedium', {
                    url: '/ads/adsMedium',
                    templateUrl: '../ads/adsMedium.html',
                    resolve: {
                        load: loadDeps([
                            "controller/ads/adsMediumCtr",
                            "controller/tabsctrlads"
                        ])
                    }
                })
                .state('noData', {
                    url: '/ads/noData',
                    templateUrl: '../ads/noData.html',
                    resolve: {
                        load: loadDeps([
                            "controller/ads/noDataCtr"
                        ])
                    }
                })

            // source来源分析
            $stateProvider
                .state('source', {
                    url: "/source/source",
                    templateUrl: "./source/source.html",
                    //controller: 'sourcectr',
                    resolve: {
                        load: loadDeps([
                            'controller/source/sourcectr'
                        ])
                    }
                })
                .state('searchengine', {
                    url: "/source/searchengine",
                    templateUrl: "./source/searchengine.html",
                    //controller: 'searchenginectr',
                    resolve: {
                        load: loadDeps([
                            'controller/source/searchenginectr'
                        ])
                    }
                })
                .state('searchterm', {
                    url: "/source/searchterm",
                    templateUrl: "./source/searchterm.html",
                    //controller: 'searchtermctr',
                    resolve: {
                        load: loadDeps([
                            'controller/source/searchtermctr'
                        ])
                    }
                })
                .state('searchterm_yq', {
                    url: "/source/searchterm_yq",
                    templateUrl: "./source/searchterm_yq.html",
                    //controller: 'searchtermctr_yq',
                    resolve: {
                        load: loadDeps([
                            'controller/source/searchtermctr_yq'
                        ])
                    }
                })
                .state('externallinks', {
                    url: "/source/externallinks",
                    templateUrl: "../source/externallinks.html",
                    //controller: 'externallinksctr',
                    resolve: {
                        load: loadDeps([
                            'controller/source/externallinksctr'
                        ])
                    }
                })
                .state('changelist', {
                    url: "/source/changelist",
                    templateUrl: "../source/changelist.html",
                    resolve: {
                        load: loadDeps([
                            'controller/source/changelistctr'
                        ])
                    }
                });

            // page页面分析
            $stateProvider
                .state('indexoverview', {
                    url: "/page/indexoverview",
                    templateUrl: "./page/indexoverview.html",
                    //controller: 'indexoverview',
                    resolve: {
                        load: loadDeps([
                            'controller/page/indexoverview'
                        ])
                    }
                })
                .state('indexoverview_pv', {
                    url: "/page/indexoverview_pv",
                    templateUrl: "../page/indexoverview_pv.html",
                    //controller: 'pagevaluectr',
                    resolve: {
                        load: loadDeps([
                            'controller/page/pagevaluectr'
                        ])
                    }
                })
                .state('indexoverview_pg', {
                    url: "/page/indexoverview_pg",
                    templateUrl: "../page/indexoverview_pg.html",
                    //controller: 'visitepagesctr',
                    resolve: {
                        load: loadDeps([
                            'controller/page/visitepagesctr'
                        ])
                    }
                })
                .state('indexoverview_ep', {
                    url: "/page/indexoverview_ep",
                    templateUrl: "../page/indexoverview_ep.html",
                    //controller: 'exitpagesctr',
                    resolve: {
                        load: loadDeps([
                            'controller/page/exitpagesctr'
                        ])
                    }
                })
                .state('entrancepage', {
                    url: "/page/entrancepage",
                    templateUrl: "../page/entrancepage.html",
                    resolve: {
                        load: loadDeps([
                            "controller/page/entrancepagectr"
                        ])
                    }
                })
                .state('entrancepage_fa', {
                    url: "/page/entrancepage_fa",
                    templateUrl: "../page/entrancepage_fa.html",
                    resolve: {
                        load: loadDeps([
                            "controller/page/secondpage/flowanalysisctr"
                        ])
                    }
                })
                .state('entrancepage_nv', {
                    url: "/page/entrancepage_nv",
                    templateUrl: "../page/entrancepage_nv.html",
                    resolve: {
                        load: loadDeps([
                            "controller/page/secondpage/newvisitorsctr"
                        ])
                    }
                })
                .state('entrancepage_as', {
                    url: "/page/entrancepage_as",
                    templateUrl: "../page/entrancepage_as.html",
                    resolve: {
                        load: loadDeps([
                            "controller/page/secondpage/attractivenessanalysisctr"
                        ])
                    }
                })
                .state('entrancepage_af', {
                    url: "/page/entrancepage_af",
                    templateUrl: "../page/entrancepage_af.html",
                    resolve: {
                        load: loadDeps([
                            "controller/page/secondpage/analysistransformationctr"
                        ])
                    }
                })
                .state('pagetitle', {
                    url: "/page/pagetitle",
                    templateUrl: "../page/pagetitle.html",
                    resolve: {
                        load: loadDeps([
                            "controller/page/pagetitlectr"
                        ])
                    }
                })
                .state('heaturl', {
                    url: "/page/heaturl",
                    params: {'rf': null},
                    templateUrl: "../page/heaturl.html",
                    resolve: {
                        load: loadDeps([
                            "controller/page/heaturlctr"
                        ])
                    }
                })
                .state('heat', {
                    url: "/page/heat",
                    params: {'rf': null},
                    templateUrl: "../page/heat.html",
                    resolve: {
                        load: loadDeps([
                            "controller/page/heatctr"
                        ])
                    }
                })

                .state('heatmap', {
                    url: "/page/heatmap",
                    templateUrl: "../page/heatmap.html",
                    resolve: {
                        load: loadDeps([
                            "controller/page/heatmapCtr",
                            "heatmap/heatmap"
                        ])
                    }
                })
                /*.state('offsitelinks', {
                    url: "/page/offsitelinks",
                    templateUrl: "../page/offsitelinks.html",
                    resolve: {
                        load: loadDeps([
                            "controller/page/linksctrl"
                        ])
                    }
                })*/;

            // visitor访客分析
            $stateProvider
                .state('provincemap/1', {
                    url: "/visitor/visitormap",
                    templateUrl: "../visitor/visitormap.html",
                    resolve: {
                        load: loadDeps([
                            "controller/vistiorctr"
                        ])
                    }
                })
                .state('provincemap', {
                    url: '/visitor/provincemap:data',
                    templateUrl: "../visitor/provincemap.html",
                    resolve: {
                        load: loadDeps([
                            "controller/visitor/provincemapctr"
                        ])
                    }
                })
                .state('equipment', {
                    url: "/visitor/equipment",
                    templateUrl: "../visitor/equipment.html",
                    resolve: {
                        load: loadDeps([
                            "controller/visitor/equipmentctr"
                        ])
                    }
                })
                .state('novisitors', {
                    url: "/visitor/novisitors",
                    templateUrl: "../visitor/novisitors.html",
                    resolve: {
                        load: loadDeps([
                            "controller/visitor/novisitors"
                        ])
                    }
                });

            // value价值透析
            $stateProvider
                .state('exchange', {
                    url: "/value/exchange",
                    templateUrl: "../value/exchange.html",
                    resolve: {
                        load: loadDeps([
                            "controller/value/exchangectr"
                        ])
                    }
                })
                .state('trafficmap', {
                    url: "/value/trafficmap",
                    templateUrl: "../value/trafficmap.html",
                    resolve: {
                        load: loadDeps([
                            "controller/value/trafficmapctr"
                        ])
                    }
                });

            // 历史趋势
            $stateProvider
                .state('history', {
                    url: "/source/source/history",
                    templateUrl: "../historytrend/history.html",
                    resolve: {
                        load: loadDeps([
                            "controller/history"
                        ])
                    }
                })
                .state('history1', {
                    url: "/visitor/provincemap/history",
                    templateUrl: "../historytrend/history.html",
                    resolve: {
                        load: loadDeps([
                            "controller/history"
                        ])
                    }
                })
                .state('history2', {
                    url: "/visitor/novisitors/history",
                    templateUrl: "../historytrend/history.html",
                    resolve: {
                        load: loadDeps([
                            "controller/history"
                        ])
                    }
                })
                .state('history3', {
                    url: "/page/indexoverview/history",
                    templateUrl: "../historytrend/history.html",
                    resolve: {
                        load: loadDeps([
                            "controller/history"
                        ])
                    }
                })
                .state('history4', {
                    url: "/page/entrancepage/history",
                    templateUrl: "../historytrend/history.html",
                    resolve: {
                        load: loadDeps([
                            "controller/history"
                        ])
                    }
                })
                .state('history5', {
                    url: "/source/searchengine/history",
                    templateUrl: "../historytrend/history.html",
                    resolve: {
                        load: loadDeps([
                            "controller/history"
                        ])
                    }
                })
                .state('history6', {
                    url: "/source/searchterm/history",
                    templateUrl: "../historytrend/history.html",
                    resolve: {
                        load: loadDeps([
                            "controller/history"
                        ])
                    }
                })
                .state('history7', {
                    url: "/source/externallinks/history",
                    templateUrl: "../historytrend/history.html",
                    resolve: {
                        load: loadDeps([
                            "controller/history"
                        ])
                    }
                })
                .state('history8', {
                    url: "/page/entrancepage_fa/history",
                    templateUrl: "../historytrend/history.html",
                    resolve: {
                        load: loadDeps([
                            "controller/history"
                        ])
                    }
                })
                .state('history9', {
                    url: "/page/entrancepage_nv/history",
                    templateUrl: "../historytrend/history.html",
                    resolve: {
                        load: loadDeps([
                            "controller/history"
                        ])
                    }
                })
                .state('history10', {
                    url: "/page/entrancepage_as/history",
                    templateUrl: "../historytrend/history.html",
                    resolve: {
                        load: loadDeps([
                            "controller/history"
                        ])
                    }
                })
                .state('history11', {
                    url: "/page/entrancepage_af/history",
                    templateUrl: "../historytrend/history.html",
                    resolve: {
                        load: loadDeps([
                            "controller/history"
                        ])
                    }
                })
                .state('history12', {
                    url: "/page/indexoverview_pv/history",
                    templateUrl: "../historytrend/history.html",
                    resolve: {
                        load: loadDeps([
                            "controller/history"
                        ])
                    }
                })
                .state('history13', {
                    url: "/page/indexoverview_pg/history",
                    templateUrl: "../historytrend/history.html",
                    resolve: {
                        load: loadDeps([
                            "controller/history"
                        ])
                    }
                })
                .state('history14', {
                    url: "/page/indexoverview_ep/history",
                    templateUrl: "../historytrend/history.html",
                    resolve: {
                        load: loadDeps([
                            "controller/history"
                        ])
                    }
                })
            ;

            // 管理设置
            //$urlRouterProvider.when('', '/conf');
            $stateProvider
                .state('conf', {
                    url: '/conf',
                    templateUrl: '../conf/weblist/main.html',
                    current: 'current',
                    resolve: {
                        load: loadDeps([
                            "controller/conf/adminmainctr",
                            "controller/conf/admintablectr"
                        ])
                    }
                })
                .state('rule', {
                    url: '/conf/webcountsite/countrules',
                    templateUrl: '../conf/webcountsite/countrules.html',
                    resolve: {
                        load: loadDeps([
                            "controller/conf/countrules"
                        ])
                    }
                })
                .state('web_add', {
                    url: '/conf/weblist/web_add',
                    templateUrl: '../conf/weblist/web_add.html'
                })
                .state('childlist', {
                    url: '/conf/webcountsite/childlist',
                    templateUrl: '../conf/webcountsite/childlist.html',
                    resolve: {
                        load: loadDeps([
                            "controller/conf/count_childlist"
                        ])
                    }
                })
                .state('childlist_add', {
                    url: '/conf/webcountsite/childlist_add',
                    templateUrl: '../conf/webcountsite/childlist_add.html',
                    resolve: {
                        load: loadDeps([
                            "controller/conf/childlist_add"
                        ])
                    }
                })
                .state('childlist_update', {
                    url: '/conf/webcountsite/childlist_update',
                    params: {'id': null},
                    templateUrl: '../conf/webcountsite/childlist_update.html',
                    resolve: {
                        load: loadDeps([
                            "controller/conf/childlist_update"
                        ])
                    }
                })
                .state('pagechange', {
                    url: '/conf/webcountsite/pagechange',
                    templateUrl: '../conf/webcountsite/pagechange.html',
                    resolve: {
                        load: loadDeps([
                            "controller/conf/count_pagechange",
                            "controller/conf/admintablectr"
                        ])
                    }
                })
                .state('pagechange_add', {
                    url: '/conf/webcountsite/pagechange_add',
                    templateUrl: '../conf/webcountsite/pagechange_add.html',
                    resolve: {
                        load: loadDeps([
                            "controller/conf/pagechange_addctr"
                        ])
                    }
                })
                .state('pagechange_update', {
                    url: '/conf/webcountsite/pagechange_update',
                    params: {'id': null},
                    templateUrl: '../conf/webcountsite/pagechange_update.html',
                    resolve: {
                        load: loadDeps([
                            "controller/conf/pagechange_updatectr"
                        ])
                    }
                })
                .state('eventchange', {
                    url: '/conf/webcountsite/eventchange',
                    templateUrl: '../conf/webcountsite/eventchange.html',
                    resolve: {
                        load: loadDeps([
                            "controller/conf/count_eventchange",
                            "controller/conf/eventchange_updatectr",
                            "controller/conf/admintablectr"
                        ])
                    }
                })
                .state('eventchange_add', {
                    url: '/conf/webcountsite/eventchange_add',
                    params: {'url': null},
                    templateUrl: '../conf/webcountsite/eventchange_add.html',
                    resolve: {
                        load: loadDeps([
                            "controller/conf/eventchange_addctr"
                        ])
                    }
                })
                .state('eventchange_update', {
                    url: '/conf/webcountsite/eventchange_update',
                    params: {'id': null},
                    templateUrl: '../conf/webcountsite/eventchange_update.html',
                    resolve: {
                        load: loadDeps([
                            "controller/conf/eventchange_updatectr"
                        ])
                    }
                })
//            获取代码
                .state('main_getcode', {
                    url: '/conf/weblist/main_getcode',
                    templateUrl: '../conf/weblist/main_getcode.html'
                })
                .state('timechange', {
                    url: '/conf/webcountsite/timechange',
                    templateUrl: '../conf/webcountsite/timechange.html',
                    resolve: {
                        load: loadDeps([
                            "controller/conf/count_timechange"
                        ])
                    }
                })
                .state('adtrack', {
                    url: '/conf/webcountsite/adtrack',
                    templateUrl: '../conf/webcountsite/adtrack.html',
                    resolve: {
                        load: loadDeps([
                            "controller/conf/ad_track",
                            "controller/conf/admintablectr"
                        ])
                    }
                })
                .state('adtrack_add', {
                    url: '/conf/webcountsite/adtrack_add',
                    params: {'vo': null},
                    templateUrl: '../conf/webcountsite/adtrack_add.html',
                    resolve: {
                        load: loadDeps([
                            "controller/conf/adtrack_add"
                        ])
                    }
                })
                .state('root', {
                    url: '/conf/admin/root',
                    templateUrl: '../conf/admin/root.html'
                })
                .state('counticon', {
                    url: '/conf/admin/counticon',
                    templateUrl: '../conf/admin/counticon.html'
                })
                .state('reportsite', {
                    url: '/conf/admin/reportsite',
                    templateUrl: '../conf/admin/reportsite.html'
                });
            //            子目录
            $stateProvider
                .state('subcatalog', {
                    url: '/subcatalog/subcatalog',
                    templateUrl: '../subcatalog/subcatalog.html',
                    resolve: {
                        load: loadDeps([
                            "controller/subcatalog/SubCatalogCtr"
                        ])
                    }
                });
            // 不能使用下面这句代码：
            // $urlRouterProvider.otherwise( '/index' );
            // 见 http://stackoverflow.com/questions/25065699/why-does-angularjs-with-ui-router-keep-firing-the-statechangestart-event
            // 另外，这段代码必须放在最后一个路由，否则直接在链接中到 #/路由 会无效
            $stateProvider
                .state('otherwise', {
                    url: '*path',
                    template: '',
                    controller: [
                        '$state',
                        function ($state) {
                            $state.go('index');
                        }
                    ]
                });

            /**
             * 加载依赖的辅助函数
             * @param deps
             * @returns {*[]}
             */
            function loadDeps(deps) {
                return [
                    '$q', function ($q) {
                        var def = $q.defer();
                        require(deps, function () {
                            def.resolve();
                        });
                        return def.promise;
                    }
                ];
            }

        }
    ]);

});