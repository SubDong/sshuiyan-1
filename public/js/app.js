/**
 * Created by weims on 2015/5/15.
 */
define([
    "angular",
    "./controller/module",
    "./controller/trend/module",
    "./controller/source/module",
    "./controller/page/module",
    "./controller/visitor/module",
    "./controller/value/module",
    "./controller/conf/module",
    "js002",
    "js003",
    "js006",
    "./angularjs/ui-bootstrap-tpls",
    "./angularjs/ui-grid-unstable.min"
], function (angular) {

    'use strict';

    var myApp = angular.module("myApp", [
        "app.controllers",
        "trend.controllers",
        "source.controllers",
        "page.controllers",
        "visitor.controllers",
        "value.controllers",
        "conf.controllers",
        'ui.grid',
        'ui.grid.autoResize',
        'ui.grid.grouping',
        'ui.grid.expandable',
        'ui.grid.pagination',
        'ui.bootstrap',
        'ngDialog',
        'ngSanitize',
        'ui.select'
    ]);

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
                            'controller/searchctr',
                            'controller/searchpromotion'
                        ])
                    }
                })
                .state('search_dy', {
                    url: "/extension/search_dy",
                    templateUrl: "../extension/search_dy.html",
                    resolve: {
                        load: loadDeps([
                            'controller/search_dy_ctr',
                            'controller/searchpromotion'
                        ])
                    }
                })
                .state('search_gjc', {
                    url: "/extension/search_gjc",
                    templateUrl: "../extension/search_gjc.html",
                    resolve: {
                        load: loadDeps([
                            'controller/search_gjc_ctr',
                            'controller/searchpromotion'
                        ])
                    }
                })
                .state('search_cy', {
                    url: "/extension/search_cy",
                    templateUrl: "../extension/search_cy.html",
                    resolve: {
                        load: loadDeps([
                            'controller/search_cy_ctr',
                            'controller/searchpromotion'
                        ])
                    }
                })
                .state('search_ssc', {
                    url: "/extension/search_ssc",
                    templateUrl: "../extension/search_ssc.html",
                    resolve: {
                        load: loadDeps([
                            'controller/search_ssc_ctr',
                            'controller/searchpromotion'
                        ])
                    }
                })
                .state('search_tg_url', {
                    url: "/extension/search_tg_url",
                    templateUrl: "../extension/search_tg_url.html",
                    resolve: {
                        load: loadDeps([
                            'controller/search_tg_ctr',
                            'controller/searchpromotion'
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
                .state('heatmap', {
                    url: "/page/heatmap",
                    templateUrl: "../page/heatmap.html",
                    resolve: {
                        load: loadDeps([
                            "controller/page/heatmapctr",
                            "heatmap/heatmap"
                        ])
                    }
                })
                .state('offsitelinks', {
                    url: "/page/offsitelinks",
                    templateUrl: "../page/offsitelinks.html",
                    resolve: {
                        load: loadDeps([
                            "controller/page/linksctrl"
                        ])
                    }
                });

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
                    url: "/visitor/provincemap",
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
                });

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
                            "controller/conf/count_eventchange"
                        ])
                    }
                })
                .state('eventchange_add', {
                    url: '/conf/webcountsite/eventchange_add',
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

    myApp.constant('SEM_API_URL', 'http://182.92.227.79:9080/');

    myApp.controller('menuctr', function ($scope, $location) {
        $scope.oneAtATime = true;
        // 项目导航模块。用于页面刷新时，当前选中模块index的获取
        $scope.array = ["index", "extension", "trend", "source", "page", "visitor", "value"];
        $scope.selectRestaurant = function (row) {
            $scope.selectedRow = row;
        };
        var menu = $location.path();
        $scope.menuClass = function (menu, hrefs, i) {
            if ("" === menu) {
                return 0;
            } else if ("/conf" === menu) {
                return 0;
            }
            if ((menu.indexOf(hrefs[i]) != -1 & menu.indexOf(hrefs[i]) < 3) || i > hrefs.length) {
                return i;
            }
            return $scope.menuClass(menu, hrefs, i + 1);
        }

        $scope.selectedRow = $scope.menuClass(menu, $scope.array, 0);
        $scope.groups = [
            {
                title: '趋向分析 ',
                content: 'Dynamic Group Body - 1',
                template: "<h3>Hello, Directive</h3>"
            },
            {
                title: 'Dynamic Group Header - 2',
                content: 'Dynamic Group Body - 2'
            }
        ];

        $scope.items = ['Item 1', 'Item 2', 'Item 3'];

        $scope.addItem = function () {
            var newItemNo = $scope.items.length + 1;
            $scope.items.push('Item ' + newItemNo);
        };
        $scope.currentMenu = "menuFirst";
        $scope.selectMenu = function (menu) {
            $scope.currentMenu = menu;
        }

        $scope.expanders = [
            {
                title: '网站概览',
                icon: 'glyphicon glyphicon-th-large',
                stype: 0,
                sref: '#index',
                current: 'current'
            }, {
                title: '百度推广',
                icon: 'glyphicon glyphicon-asterisk',
                stype: 1,
                sref: 'extension',
                child: [{
                    text: '推广概况',
                    sref: '#extension/survey'
                }, {
                    text: '推广方式',
                    sref: '#extension/way'
                }, {
                    text: '搜索推广',
                    sref: '#extension/search'
                }/*, {
                 text: '网盟推广',
                 sref: '#extension/alliance'
                 }, {
                 text: '推广URL速度',
                 sref: '#extension/urlspeed'
                 }*/
                ]
            }, {
                title: '趋向分析',
                icon: 'glyphicon glyphicon-stats',
                stype: 1,
                sref: 'trend',
                child: [{
                    text: '实时访客',
                    sref: '#trend/realtime'
                }, {
                    text: '今日统计',
                    sref: '#trend/today'
                }, {
                    text: '昨日统计',
                    sref: '#trend/yesterday'
                }, {
                    text: '最近30天',
                    sref: '#trend/month'
                }]
            }, {
                title: '来源分析',
                icon: 'glyphicon glyphicon-globe',
                stype: 1,
                sref: 'source',
                child: [{
                    text: '全部来源',
                    sref: '#source/source'
                }, {
                    text: '搜索引擎',
                    sref: '#source/searchengine'
                }, {
                    text: '搜索词',
                    sref: '#source/searchterm'
                }, {
                    text: '外部链接',
                    sref: '#source/externallinks'
                }]
            }, {
                title: '页面分析',
                icon: 'glyphicon glyphicon-blackboard',
                stype: 1,
                sref: 'page',
                child: [{
                    text: '受访页面',
                    sref: '#page/indexoverview'
                }, {
                    text: '入口页面',
                    sref: '#page/entrancepage'
                }, {
                    text: '页面热点图',
                    sref: '#page/pagetitle'
                }, {
                    text: '离站链接',
                    sref: '#page/offsitelinks'
                }]
            }, {
                title: '访客分析',
                icon: 'glyphicon glyphicon-signal',
                stype: 1,
                sref: 'visitor',
                child: [{
                    text: '访客地图',
                    sref: '#visitor/provincemap'
                }, {
                    text: '设备环境',
                    sref: '#visitor/equipment'
                }, {
                    text: '新老访客',
                    sref: '#visitor/novisitors'
                }/*, {
                 text: '访客特征',
                 sref: '#visitor/visitorfeature'
                 }*/]
            }, {
                title: '价值透析',
                icon: 'glyphicon glyphicon-yen',
                stype: 1,
                sref: 'value',
                child: [{
                    text: '流量地图',
                    sref: '#value/exchange'
                }, {
                    text: '频道流转',
                    sref: '#value/trafficmap'
                }]
            }
        ];
        $scope.adminmenus = [
            {
                title: '网站列表',
                icon: 'glyphicon glyphicon-list',
                stype: 0,
                sref: '#conf',
                current: 'current'
            },
            {
                title: '网站统计设置',
                icon: 'glyphicon glyphicon-cog',
                stype: 1,
                sref: 'webcountsite',
                child: [{
                    text: ' 统计规则设置',
                    sref: '#conf/webcountsite/countrules'
                }, {
                    text: '子目录管理',
                    sref: '#conf/webcountsite/childlist'
                }, {
                    text: '页面转化目标',
                    sref: '#conf/webcountsite/pagechange'
                }, {
                    text: '事件转化目标',
                    sref: '#conf/webcountsite/eventchange'
                }, {
                    text: '时长转化目标',
                    sref: '#conf/webcountsite/timechange'
                }, {
                    text: '指定广告跟踪',
                    sref: '#conf/webcountsite/adtrack'
                }]
            }
            //{
            //    title: '系统管理设置',
            //    icon: 'glyphicon glyphicon-user',
            //    stype: 1,
            //    sref: 'admin',
            //    child: [{
            //        text: ' 权限账户管理',
            //        sref: '#conf/admin/root'
            //    }, {
            //        text: '统计图标设置',
            //        sref: '#conf/admin/counticon'
            //    }, {
            //        text: '报告发送设置',
            //        sref: '#conf/admin/reportsite'
            //
            //    }]
            //}
        ];

    });


    /*********nav-select*********/
    myApp.controller('ngSelect', function ($scope, $location, $cookieStore, $window, $rootScope, $state) {
        $scope.clear = function () {
            $scope.siteselect.selected = undefined;
        };

        $scope.initPerfectAccount = function () {
            var userObj = $cookieStore.get('uname');
            $rootScope.perfectUser = userObj;
            $rootScope.user = userObj;
            $rootScope.usites = $cookieStore.get('usites');
            $rootScope.default = $rootScope.usites[0].site_name;     // default site
            $rootScope.defaultType = $rootScope.usites[0].type_id;   // default site id
        }
        $scope.initPerfectAccount();
        $scope.siteselect = {};
        $scope.siteselects = $rootScope.usites;
        $rootScope.baiduAccount = $rootScope.usites[0].bd_name;//baidu-perfect2151880
        $rootScope.userType = $rootScope.usites[0].type_id;//www.perfect-cn.cn
        $rootScope.siteId = $rootScope.usites[0].site_id;
        $rootScope.userTypeName = $rootScope.usites[0].site_name;
        $rootScope.siteUrl = $rootScope.usites[0].site_url;
        $scope.changeUrl = function (select) {
            $rootScope.user = $rootScope.perfectUser;
            $rootScope.baiduAccount = select.bd_name;
            $rootScope.userType = select.type_id;
            $rootScope.siteId = select.site_id;
            $rootScope.siteUrl = select.site_url;
            $rootScope.userTypeName = select.site_name;
            if ($location.path().indexOf("conf") > -1) {
                $state.go("conf");
            } else {
                $state.go("index");
            }
        }
    })


    myApp.run(function ($rootScope) {

        $rootScope.$on("$locationChangeStart", function () {
            $rootScope.datePickerCompare = function () {
                // 处理datePickerCompare方法不存在的问题
            }
        });

        $rootScope.copy = function (obj) {
            return angular.copy(obj);
        };

        // 获取table行index
        // 求别删
        $rootScope.getIndex = function (b) {
            return b.$parent.$parent.rowRenderIndex + 1;
        };

    });

    return myApp;
});
