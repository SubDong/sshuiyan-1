/**
 * Created by john on 2015/4/1.
 */
app.directive("calendar", function () {
    var option = {
        restrict: "EA",
        template: "<div  role=\"group\" class=\"btn-group fl\"><button class=\"btn btn-default disabled\" type=\"button\">时间</button><button class=\"btn btn-default\" type=\"button\" ng-click=\"today()\" ng-class=\"{'current':todayClass}\">今天</button><button class=\"btn btn-default\" type=\"button\" ng-click=\"yesterday()\" ng-class=\"{'current':yesterdayClass}\">昨天</button><button class=\"btn btn-default\" type=\"button\" ng-click=\"sevenDay()\" ng-class=\"{'current':sevenDayClass}\">最近7天</button><button class=\"btn btn-default\" type=\"button\" ng-click=\"month()\" ng-class=\"{'current':monthClass}\">最近30天</button><button type=\"button\" class=\"btn btn-default\" datepicker-popup=\"{{format}}\" ng-model=\"dt\" is-open=\"opened\" date-disabled=\"disabled(date, mode)\" current-text=\"今天\" clear-text=\"清空\" close-text=\"关闭\" ng-click=\"open($event)\" ng-class=\"{'current':definClass}\">{{dt | date: 'yyyy-MM-dd' }}<i class=\"glyphicon glyphicon-calendar\"></i></button><span class=\"dateshow fl\"></span></div>",
        replace: true,
        transclude: true
    };
    return option;
});
app.directive("datecontrast", function () {
    var option = {
        restrict: "EA",
        template: "<div role=\"group\" class=\"btn-group fl\"><button type=\"button\" class=\"btn btn-default\" datepicker-popup=\"{{format}}\" ng-model=\"dt\" is-open=\"opens\" date-disabled=\"disabled(date, mode)\" current-text=\"今天\" clear-text=\"清空\" close-text=\"关闭\" ng-click=\"checkopen($event)\" ng-class=\"{'current':othersdateClass}\">与其他时间段对比 <i class=\"glyphicon glyphicon-calendar\"></i></button> <button class=\"btn btn-default\" type=\"button\">前一日</button> <button class=\"btn btn-default\" type=\"button\">上周同期</button></div>",
        transclude: true
    };
    return option;
});
app.directive("dateother", function () {
    var option = {
        restrict: "EA",
        template: "<div role=\"group\" class=\"btn-group fl\"><button type=\"button\" class=\"btn btn-default\" datepicker-popup=\"{{format}}\" ng-model=\"dt\" is-open=\"opens\" date-disabled=\"disabled(date, mode)\" current-text=\"今天\" clear-text=\"清空\" close-text=\"关闭\" ng-click=\"checkopen($event)\" ng-class=\"{'current':othersdateClass}\">与其他时间段对比 <i class=\"glyphicon glyphicon-calendar\"></i></button></div>",
        transclude: true
    };
    return option;
});
app.directive("dateweek", function () {
    var option = {
        restrict: "EA",
        template: " <div aria-label=\"First group\" role=\"group\" class=\"btn-group fl\"><button class=\"btn btn-default\" type=\"button\">按时</button><button class=\"btn btn-default current\" type=\"button\">按日</button><button class=\"btn btn-default\" type=\"button\">按周</button><button class=\"btn btn-default\" type=\"button\">按月</button></div>",
        transclude: true
    };
    return option;
});
/*
app.directive("views", function () {
    var option = {
        restrict: "EA",
        template: "<select ng-model=\"selected\" ng-options=\"m.id as m.when for m in view\" > <option value=\"\">浏览量</option></select>",
        transclude: true
    };
    return option;
});
*/
