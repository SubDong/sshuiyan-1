/**
 * Created by john on 2015/4/1.
 */
app.directive("calendar", function () {
    var option = {
        restrict: "EA",
        template: "<div  role=\"group\" class=\"btn-group fl\"><button class=\"btn btn-default\" type=\"button\" ng-click=\"today()\" ng-class=\"{'current':todayClass}\">今天</button><button class=\"btn btn-default\" type=\"button\" ng-click=\"yesterday()\" ng-class=\"{'current':yesterdayClass}\">昨天</button><button class=\"btn btn-default\" type=\"button\" ng-click=\"sevenDay()\" ng-class=\"{'current':sevenDayClass}\">最近7天</button><button class=\"btn btn-default\" type=\"button\" ng-click=\"month()\" ng-class=\"{'current':monthClass}\">最近30天</button><button type=\"button\" class=\"btn btn-default\" datepicker-popup=\"{{format}}\" ng-model=\"dt\" is-open=\"opened\" date-disabled=\"disabled(date, mode)\" current-text=\"今天\" clear-text=\"清空\" close-text=\"关闭\" ng-click=\"open($event)\" ng-class=\"{'current':definClass}\">{{dt | date: 'yyyy-MM-dd' }}<i class=\"glyphicon glyphicon-calendar\"></i></button><span class=\"dateshow fl\"></span></div>",
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
app.directive("page", function () {
    var option = {
        restrict: "EA",
        template: "<div aria-label=\"First group\" role=\"group\" class=\"btn-group fl\"><a ui-sref=\"entrancepage\" class=\"fl btn btn-default\" ui-sref-active=\"current\"> 指标概览</a><a ui-sref=\"entrancepage/1\" class=\"btn btn-default fl\" ui-sref-active=\"current\"> 流量分析</a><a ui-sref=\"entrancepage/2\" class=\"btn btn-default fl\" ui-sref-active=\"current\"> 新访客分析</a> <a ui-sref=\"entrancepage/3\" class=\"btn btn-default fl\" ui-sref-active=\"current\">吸引力分析</a> <a ui-sref=\"entrancepage/4\" class=\"btn btn-default fl\" ui-sref-active=\"current\">转化分析</a> </div>",
        transclude: true
    };
    return option;
});
app.directive("indexoverview", function () {
    var option = {
        restrict: "EA",
        template: "<div aria-label=\"First group\" role=\"group\" class=\"btn-group fl\"><a class=\"btn btn-default\"ui-sref=\"indexoverview\"  ui-sref-active=\"active\">指标概览</a><a class=\"btn btn-default\" ui-sref=\"indexoverview/1\" ui-sref-active=\"active\">页面价值分析</a><a class=\"btn btn-default\"ui-sref=\"indexoverview/2\" ui-sref-active=\"active\">入口页分析</a> <a class=\"btn btn-default\"ui-sref=\"indexoverview/3\" ui-sref-active=\"active\">退出页分析</a></div>",
        transclude: true
    };
    return option;
});