/**
 * Created by SubDong on 2015/4/23.
 */
app.controller('indexoverview', function ($scope, $rootScope, $http, requestService, messageService, areaService, uiGridConstants) {
    $scope.todayClass = true;
    $rootScope.tableTimeStart = 0;
    $rootScope.tableTimeEnd = 0;
    //配置默认指标
    $rootScope.checkedArray = ["pv", "uv", "avgTime"];
    $rootScope.gridArray = [
        {name: "页面url", field: "loc"},
        {
            name: " ",
            cellTemplate: "<div class='table_box'><a href='http://www.best-ad.cn' class='table_btn'></a></div>"
        },
        {name: "访问次数", field: "pv"},
        {name: "访客数(UV)", field: "uv"},
        {name: "平均访问时长", field: "avgTime"}
    ];
    $rootScope.tableSwitch = {
        latitude: {name: "页面url", field: "loc"},
        tableFilter: null,
        dimen: false,
        // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
        number: 1,
        //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
        coding: false,
        //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
        arrayClear: false //是否清空指标array
    };

    $scope.$on("ssh_refresh_charts", function (e, msg) {
        $rootScope.targetSearch();
    });
    //日历
    $scope.dateClosed = function () {
        $rootScope.targetSearch();
        $rootScope.tableTimeStart = $scope.startOffset;
        $rootScope.tableTimeEnd = $scope.endOffset;
        $scope.$broadcast("ssh_dateShow_options_time_change");
    };
    //
    this.selectedDates = [new Date().setHours(0, 0, 0, 0)];
    //this.type = 'range';
    /*      this.identity = angular.identity;*/
    //$scope.$broadcast("update", "msg");
    $scope.$on("update", function (e, datas) {
        // 选择时间段后接收的事件
        datas.sort();
        //console.log(datas);
        var startTime = datas[0];
        var endTime = datas[datas.length - 1];
        $scope.startOffset = (startTime - today_start()) / 86400000;
        $scope.endOffset = (endTime - today_start()) / 86400000;
        //console.log("startOffset=" + startOffset + ", " + "endOffset=" + endOffset);
    });
});