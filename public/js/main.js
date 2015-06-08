/**
 * Created by weims on 2015/5/15.
 */
require.config({
    baseUrl: 'js',
    paths: {
        "angular": [
            'http://cdn.bootcss.com/angular.js/1.3.15/angular.min'
        ],
        "angular-cookies": [
            'http://cdn.bootcss.com/angular.js/1.3.15/angular-cookies.min'
        ],
        "js001": [
            "http://cdn.bootcss.com/jquery/1.11.3/jquery.min"
        ],
        "js002": [
            "http://cdn.bootcss.com/angular.js/1.4.0-beta.6/angular-sanitize.min"
        ],
        "js003": [
            "http://cdn.bootcss.com/angular-ui-select/0.11.2/select"
        ],
        "js004": [
            "http://cdn.bootcss.com/angular-ui-router/0.2.13/angular-ui-router.min"
        ],
        "js005": [
            "http://cdn.bootcss.com/angular-i18n/1.2.15/angular-locale_zh-cn"
        ],
        "js006": [
            "http://cdn.bootcss.com/ng-dialog/0.3.12/js/ngDialog.min"
        ],
        "js007": [
            "http://cdn.bootcss.com/echarts/2.2.1/echarts-all"
        ],
        "js008": [
            "http://ui-grid.info/docs/grunt-scripts/vfs_fonts"
        ]
    },
    shim: {
        "angular": {
            exports: "angular"
        },
        "angular-cookies": {
            deps: ["angular"],
            exports: "angular-cookies"
        },
        // 确保angular在ui-select之前载入
        'js003': ['angular'],
        'js004': ["angular"],
        "js005": ["angular"],
        "js002": ["angular"],
        "angularjs/vfs_fonts": ["angularjs/pdfmake", "angularjs/csv"],
        "angularjs/ui-bootstrap-tpls": ["angular", "angularjs/ui-bootstrap.min"],
        "angularjs/ui-bootstrap.min": ["angular"],
        "angularjs/csv": ["angular"],
        "angularjs/pdfmake": ["angular"],
        "angularjs/ui-grid-unstable.min": ["angular"],
        "angularjs/checkbox": ["angular"],
        "angularjs/moment.min": ["angular"],
        "angularjs/daterangepicker": ["angular"]
    }
});

require(["angular-bootstrap", "js001", "utils/chartfactory", "utils/chartsMapOrPie", "utils/chartsutlis", "utils/date", "utils/map", "utils/arrayUtil"], function () {
    "use strict";

});