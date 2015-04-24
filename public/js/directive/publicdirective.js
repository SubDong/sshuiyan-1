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
/**
 * Create by wms on 2015-04-22.合计信息显示
 */
app.directive("sshDateShow", function ($http, $rootScope) {
    return {
        restrict : 'E',
        templateUrl : '../commons/date_show.html',
        link : function(scope, element, attris, controller) {
            // 初始化参数
            scope.isCompared = true;
            //
            scope.dateShowClassArray = ["date_first", "date_secend", "date_third", "date_four", "date_five", "date_last"];
            scope.myClass = function(index) {
                return scope.dateShowClassArray[index];
            };
            // 整体样式
            scope.myDivClass = function(length) {
                return "dateshow" + length;
            };
            scope.setDateShowOptions = function(type) {
                if (type === "today") {
                    scope.start = 0;
                    scope.end = 0;
                } else if (type === "yesterday") {
                    scope.start = -1;
                    scope.end = -1;
                } else if (type === "seven") {
                    scope.start = -7;
                    scope.end = -1;
                } else if (type === "month") {
                    scope.start = -7;
                    scope.end = -1;
                }
            };
            scope.setDateShowOptions(attris.type);
            scope.setDateShowDimensionOption = function(dimension) {
                if(undefined === dimension) {
                    scope.dimension = "period";
                    return;
                }
                scope.dimension = dimension;
            };
            scope.setDateShowDimensionOption(attris.dimension);
            // 当点击页面改变时间的时候。比如今日，昨日等
            scope.$on("ssh_dateShow_options_change", function(e, msg) {
                scope.setDateShowOptions(msg);
                scope.loadSummary();
            });
            scope.$on("ssh_dateShow_options_quotas_change", function(e, msg) {
                console.log("--------------kitty----------------");
                var types = angular.copy(msg);
                scope.dateShowOptions = {
                    types : types
                };
                scope.loadSummary();
            });
            scope.dateShowOptions = {
                types : ["pv", "uv", "ip", "nuv", "outRate", "avgTime"]
            };
            scope.loadSummary = function() {
                $http.get("/api/summary?type=1&dimension=" + scope.dimension + "&quotas=" + scope.dateShowOptions.types + "&start=" + scope.start + "&end=" + scope.end).success(function (result) {
                    scope.dateShowArray = [];
                    var obj = JSON.parse(eval('(' + result + ')').toString());; //由JSON字符串转换为JSON对象
                    angular.forEach(obj, function(r) {
                        var dateShowObject = {};
                        dateShowObject.label = r.label;
                        var temp = 0;
                        var count = 0;
                        angular.forEach(r.quota,function(qo) {
                            temp += Number(qo);
                            count++;
                        });
                        if(r.label === "outRate" || r.label === "nuvRate") {
                            dateShowObject.value = (temp / count).toFixed(2) + "%";
                        } else if (r.label === "avgPage") {
                            dateShowObject.value = (temp / count).toFixed(2);
                        } else if (r.label === "avgTime") {
                            dateShowObject.value = MillisecondToDate(temp / count);
                        } else {
                            dateShowObject.value = temp;
                        }
                        scope.dateShowArray.push(dateShowObject);
                    });
                    scope.isCompared = !scope.isCompared;
                });
            };
            scope.loadSummary();
        }
    };
});
/**
 * 指标过滤器
 */
app.filter("quotaFormat", function() {
    var quotaObject = {};
    quotaObject.pv = "浏览量(PV)";
    quotaObject.uv = "访客数(UV)";
    quotaObject.vc = "访问次数";
    quotaObject.outRate = "跳出率";
    quotaObject.ip = "IP数";
    quotaObject.nuv = "新访客数";
    quotaObject.nuvRate = "新访客比率";
    quotaObject.arrivedRate = "抵达率";
    quotaObject.pageConversion = "页面转化";
    quotaObject.eventConversion = "事件转化";
    quotaObject.avgTime = "平均访问时长";
    quotaObject.avgPage = "平均访问页数";
    return function(key) {
        if (quotaObject[key]) {
            return quotaObject[key];
        }
        return "错误的指标KEY";
    };
});
/**
 * 指标帮助字符过滤器
 */
app.filter("quotaHelpFormat", function() {
    var quotaObject = {};
    quotaObject.pv = "即通常说的Page View(PV)，用户每打开一个网站页面就被记录1次。用户多次打开同一页面，浏览量值累计。";
    quotaObject.uv = "一天之内您网站的独立访客数(以Cookie为依据)，一天内同一访客多次访问您网站只计算1个访客。";
    quotaObject.vc = "访客在您网站上的会话(Session)次数，一次会话过程中可能浏览多个页面。如果访客连续30分钟没有新开和刷新页面，或者访客关闭了浏览器，则当访客下次访问您的网站时，访问次数加1。";
    quotaObject.outRate = "只浏览了一个页面便离开了网站的访问次数占总的访问次数的百分比。";
    quotaObject.ip = "一天之内您网站的独立访问ip数。";
    quotaObject.nuv = "一天的独立访客中，历史第一次访问您网站的访客数。";
    quotaObject.nuvRate = "新访客比率=新访客数/访客数。";
    quotaObject.arrivedRate = "抵达率";
    quotaObject.pageConversion = "页面转化";
    quotaObject.eventConversion = "事件转化";
    quotaObject.avgTime = "访客在一次访问中，平均打开网站的时长。即每次访问中，打开第一个页面到关闭最后一个页面的平均值，打开一个页面时计算打开关闭的时间差。";
    quotaObject.avgPage = "平均每次访问浏览的页面数量，平均访问页数=浏览量/访问次数。";
    return function(key) {
        if (quotaObject[key]) {
            return quotaObject[key];
        }
        return "错误的指标KEY";
    };
});