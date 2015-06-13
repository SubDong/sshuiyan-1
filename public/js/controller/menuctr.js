/**
 * Created by john on 2015/3/25.
 */

define(["./module"], function (ctrs) {
    'use strict';

    ctrs.controller('menuctr', function ($scope, $location) {
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
            }else if("/conf" === menu){
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
                }, {
                    text: '网盟推广',
                    sref: '#extension/alliance'
                }, {
                    text: '推广URL速度',
                    sref: '#extension/urlspeed'
                }]
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
                }, {
                    text: '访客特征',
                    sref: '#visitor/visitorfeature'
                }]
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
            },
            {
                title: '系统管理设置',
                icon: 'glyphicon glyphicon-user',
                stype: 1,
                sref: 'admin',
                child: [{
                    text: ' 权限账户管理',
                    sref: '#conf/admin/root'
                }, {
                    text: '统计图标设置',
                    sref: '#conf/admin/counticon'
                }, {
                    text: '报告发送设置',
                    sref: '#conf/admin/reportsite'

                }]
            }
        ];

    });

    /*********nav-select*********/
    ctrs.controller('ngSelect', function ($scope, $location, $cookieStore, $window, $rootScope,$state) {
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
        $rootScope.siteId=$rootScope.usites[0].site_id;
        $rootScope.userTypeName = $rootScope.usites[0].site_name;

        $scope.changeUrl = function (select) {
            $rootScope.user = $rootScope.perfectUser;
            $rootScope.baiduAccount = select.bd_name;
            $rootScope.userType = select.type_id;
            $rootScope.siteId=select.site_id;
            $rootScope.userTypeName = select.site_name;
            $state.go("index");
        }
    })
});
