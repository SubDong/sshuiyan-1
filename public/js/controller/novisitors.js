/**
 * Created by SubDong on 2015/4/23.
 */
app.controller('novisitors', function ($scope, $rootScope, $http,areaService) {
    $scope.todayClass = true;

    $rootScope.tableTimeStart = 0;
    $rootScope.tableTimeEnd = 0;
    $rootScope.tableSwitch = {
        latitude:{name: "新老访客", field: "ct"},
        tableFilter:undefined,
        dimen:false,
        // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
        number:1,
        //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
        coding:false
        //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
    };


    $scope.$on("ssh_refresh_charts", function(e, msg) {
        $rootScope.targetSearch();
    });
});