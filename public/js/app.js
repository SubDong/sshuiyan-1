/**
 * Created by weims on 2015/5/15.
 */
define(["angular", "js001", "js002", "js003", "js004", "js005", "js006", "js007", "angularjs/vfs_fonts", "angularjs/ui-bootstrap-tpls", "angularjs/ui-bootstrap.min", "angularjs/csv", "angularjs/pdfmake", "angularjs/ui-grid-unstable.min", "angularjs/checkbox", "angularjs/moment.min", "angularjs/daterangepicker", "heatmap/heatmap", "controller/index", "controller/source/index", "controller/trend/index", "controller/page/index", "controller/value/index", "controller/visitor/index", "controller/conf/index"], function (ng) {
    'use strict';


    var myApp = ng.module("myApp", [
        "app.controllers",
        "source.controllers",
        "trend.controllers",
        'page.controllers',
        'value.controllers',
        'visitor.controllers',
        'conf.controllers',
        'ui.router',
        'ui.grid',
        'ui.grid.autoResize',
        'ui.grid.grouping',
        'ui.grid.expandable',
        'ui.grid.pagination',
        'ui.bootstrap',
        'ngDialog',
        'ngSanitize',
        'ui.select',
        'ui.grid.selection',
        'ui.grid.exporter']);

    myApp.constant('SEM_API_URL', 'http://182.92.227.79:9080/');

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
