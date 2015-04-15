var app = angular.module('mainapp', ['ui.router', 'ui.grid', 'ui.grid.expandable', 'ui.grid.pagination', 'ui.bootstrap', 'ngDialog']);

// inject constant
app.constant('SEM_API_URL', 'http://192.168.1.105:9080/')
    .constant('PERFORMANCE_DATA', 'cost,impression,click,ctr,cpc');