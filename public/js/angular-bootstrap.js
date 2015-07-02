/**
 * Created by weims on 2015/5/15.
 */
require([
        "angular",
        'js004',
        "./app",
        "./router",
        "js007",
        "./directive/publicdirective",
        "./services/dateservice",
        "./services/messageService",
        "./services/popupService",
        "./services/areaselect",
        "./services/defaultQuotaService",
        "./controller/tabsctrl",
        "./controller/public_bt_ctr"

    ],
    function (angular) {
        'use strict';
        angular.module('all', ['ui.router', 'myApp']); // 注意：app 模块只能放在最后一个，因为它依赖前面的第三方模块！
        angular.module('bootstrap', ['all']); // 单独加一个 all 模块的原因见 test/protractor.conf.js 的 onPrepare 事件
        angular.bootstrap(document, ['bootstrap']);
    });