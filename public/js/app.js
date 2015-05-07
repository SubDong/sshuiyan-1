var app = angular.module('mainapp', ['ui.router', 'ui.grid', 'ui.grid.autoResize',  'ui.grid.grouping','ui.grid.expandable', 'ui.grid.pagination', 'ui.bootstrap','gm.datepickerMultiSelect', 'ngDialog','ngSanitize','ui.select']);

// inject constant
app.constant('SEM_API_URL', 'http://182.92.227.79:9080/')
    .constant('PERFORMANCE_DATA', 'cost,impression,click,ctr,cpc');