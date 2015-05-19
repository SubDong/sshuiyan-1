/**
 * Created by weims on 2015/5/15.
 */
define(["angular", "js001", "js002", "js003", "js004", "js005", "js006", "angularjs/ui-bootstrap.min", "angularjs/ui-bootstrap-tpls", "angularjs/gm.datepickerMultiSelect", "angularjs/ui-grid-unstable.min", "angularjs/checkbox", "heatmap/heatmap", "controller/index", "controller/source/index", "controller/trend/index", "controller/page/index", "controller/value/index", "controller/visitor/index"], function (ng) {
    'use strict';

    var myApp = ng.module("myApp", ["app.controllers", "source.controllers", "trend.controllers", 'page.controllers', 'value.controllers', 'visitor.controllers', 'ui.router', 'ui.grid', 'ui.grid.autoResize', 'ui.grid.grouping', 'ui.grid.expandable', 'ui.grid.pagination', 'ui.bootstrap', 'gm.datepickerMultiSelect', 'ngDialog', 'ngSanitize', 'ui.select']);

    myApp.constant('SEM_API_URL', 'http://182.92.227.79:9080/');

    myApp.run(function ($rootScope) {
        $rootScope.ssh_es_type = 2;
    });

    return myApp;
});