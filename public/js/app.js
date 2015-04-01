var app = angular.module('mainapp', ['ui.router', 'ui.grid', 'ui.grid.pagination', 'ui.bootstrap', 'ngDialog']);

app.directive("calendar", function () {
    var option = {
        restrict: "EA",
        template: "<div><button class=\"btn btn-default disabled\" type=\"button\">时间</button><button class=\"btn btn-default\" type=\"button\" ng-click=\"today()\" ng-class=\"{'current':todayClass}\">今天</button><button class=\"btn btn-default\" type=\"button\" ng-click=\"yesterday()\" ng-class=\"{'current':yesterdayClass}\">昨天</button><button class=\"btn btn-default\" type=\"button\" ng-click=\"sevenDay()\" ng-class=\"{'current':sevenDayClass}\">最近7天</button><button class=\"btn btn-default\" type=\"button\" ng-click=\"month()\" ng-class=\"{'current':monthClass}\">最近30天</button><button type=\"button\" class=\"btn btn-default\" datepicker-popup=\"{{format}}\" ng-model=\"dt\" is-open=\"opened\" date-disabled=\"disabled(date, mode)\" current-text=\"今天\" clear-text=\"清空\" close-text=\"关闭\" ng-click=\"open($event)\" ng-class=\"{'current':definClass}\">自定义<i class=\"glyphicon glyphicon-calendar\"></i></button><span class=\"dateshow fl\">{{dt | date: 'yyyy-MM-dd' }}</span></div>",
        replace: true,
        transclude: true
    };
    return option;
});