/**
 * Created by john on 2015/3/30.
 */
app.controller("TabsCtrl", function ($timeout, $scope, $rootScope, $http, requestService) {
    $scope.todayClass = true;
    $scope.dateTimeStart = today_start().valueOf();
    $scope.dateTimeEnd = today_end().valueOf();
    $scope.reset = function () {
        $scope.todayClass = false;
        $scope.yesterdayClass = false;
        $scope.sevenDayClass = false;
        $scope.monthClass = false;
        $scope.definClass = false;
    };
    $scope.today = function () {
        $scope.reset();
        $scope.todayClass = true;
        $scope.dateTimeStart = today_start().valueOf();
        $scope.dateTimeEnd = today_end().valueOf();
    };
    $scope.yesterday = function () {
        $scope.reset();
        $scope.yesterdayClass = true;
        $scope.dateTimeStart = yesterday_start().valueOf();
        $scope.dateTimeEnd = yesterday_end().valueOf();
    };
    $scope.sevenDay = function () {
        $scope.reset();
        $scope.sevenDayClass = true;
        $scope.dateTimeStart = lastWeek_start().valueOf();
        $scope.dateTimeEnd = lastWeek_end().valueOf();
    };
    $scope.month = function () {
        $scope.reset();
        $scope.monthClass = true;
        $scope.dateTimeStart = lastMonth_start().valueOf();
        $scope.dateTimeEnd = lastMonth_end().valueOf();
    };
    $scope.open = function ($event) {
        $scope.reset();
        $scope.definClass = true;
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
    $scope.checkopen = function ($event) {
        $scope.reset();
        $scope.othersdateClass = true;
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opens = true;
    };


    $scope.tabs = [
        {title: 'Dynamic Title 1', content: 'Dynamic content 1'},
        {title: 'Dynamic Title 2', content: 'Dynamic content 2', disabled: true}
    ]
    //sem
    $scope.target = [
        {consumption_name: "展现量", name: "h2"},
        {consumption_name: "点击量", name: "h1"},
        {consumption_name: "消费", name: "o9"},
        {consumption_name: "点击率", name: "o8"},
        {consumption_name: "平均点击价格", name: "o7"}
    ];
    //
    $scope.Webbased = [
        {consumption_name: "浏览量(PV)", name: "o6"},
        {consumption_name: "访问次数", name: "o5"},
        {consumption_name: "访客数(UV)", name: "o4"},
        {consumption_name: "新访客数", name: "o3"},
        {consumption_name: "新访客比率", name: "o2"},
        {consumption_name: "页头访问次数", name: "o1"}
    ];
    $scope.flow = [
        {consumption_name: "跳出率", name: "jump"},
        {consumption_name: "平均访问时长", name: "avgTime"},
        {consumption_name: "平均访问页数", name: "avgPage"},
        {consumption_name: "抵达率", name: "dida"},
    ];
    $scope.transform = [
        {consumption_name: "转化次数", name: "m1"},
        {consumption_name: "转化率", name: "m2"},
        {consumption_name: "平均转化成本", name: "m3"},
        {consumption_name: "收益", name: "m4"},
        {consumption_name: "利润", name: "m5"},
        {consumption_name: "投资回报率", name: "m6"},
    ];
    $scope.mobile = [
        {consumption_name: "搜索页直拨电话展现", name: "v1"},
        {consumption_name: "搜索页直拨电话点击", name: "v2"},
        {consumption_name: "搜索页直拨电话消费", name: "v3"},
        {consumption_name: "搜索页沟通展现", name: "v4"},
        {consumption_name: "搜索页沟通点击", name: "v5"},
        {consumption_name: "搜索页沟通消费", name: "v6"},
        {consumption_name: "搜索页回呼电话展现", name: "v7"},
        {consumption_name: "搜索页回呼电话点击", name: "v8"},
        {consumption_name: "搜索页回呼电话消费", name: "v9"},
        {consumption_name: "搜索页APP下载展现", name: "b1"},
        {consumption_name: "搜索页APP下载点击", name: "b2"},
        {consumption_name: "搜索页APP下载消费", name: "b3"},
    ];
    $scope.recall = [
        {consumption_name: "电话量", name: "z7"},
        {consumption_name: "已接电话量", name: "z8"},
        {consumption_name: "平均通话时长", name: "z9"},
        {consumption_name: "漏接电话量", name: "x1"}
    ];
    $scope.TodayWeb = [
        {consumption_name: "浏览量(PV)", name: "pv"},
        {consumption_name: "访问次数", name: "tt"},
        {consumption_name: "访客数(UV)", name: "uv"},
        {consumption_name: "新访客数", name: "ct"},
        {consumption_name: "新访客比率", name: "ctRate"},
        {consumption_name: "IP数", name: "ip"}
    ];
    $scope.Todytransform = [
        {consumption_name: "转化次数", name: "zhuanF"},
        {consumption_name: "转化率", name: "zhuanN"}
    ];
    $scope.Todayfloweds = [
        {consumption_name: "跳出率", name: "q1"},
        {consumption_name: "平均访问时长", name: "q2"},
        {consumption_name: "平均访问页数", name: "q3"},
    ];
    $scope.Order = [
        {consumption_name: "订单数", name: "q4"},
        {consumption_name: "订单金额", name: "q5"},
        {consumption_name: "订单转化率", name: "q6"}
    ];
    $scope.Indexform = [
        {consumption_name: "转化指标", name: "q7"},
        {consumption_name: "转化率", name: "q8"}
    ];
    $scope.Indexfloweds = [
        {consumption_name: "贡献浏览量", name: "q9"},
        {consumption_name: "跳出率", name: "a1"},
        {consumption_name: "平均访问时长", name: "a2"},
        {consumption_name: "平均访问页数", name: "a3"},
    ];
    $scope.Mapwebbase = [
        {consumption_name: "浏览量(PV)", name: "a4"},
        {consumption_name: "浏览量占比", name: "a5"},
        {consumption_name: "访问次数", name: "a6"},
        {consumption_name: "访客数(UV)", name: "a7"},
        {consumption_name: "新访客数", name: "a8"},
        {consumption_name: "新访客比率", name: "a9"},
        {consumption_name: "IP数", name: "z1"}
    ];
    $scope.Novisitorbase = [
        {consumption_name: "浏览量(PV)", name: "z2"},
        {consumption_name: "浏览量占比", name: "z3"},
        {consumption_name: "访问次数", name: "z4"},
        {consumption_name: "访客数(UV)", name: "z5"},
        {consumption_name: "IP数", name: "z6"}
    ];

    $rootScope.latitude = {name: "地域", field: "region"};
    $scope.checkedArray = new Array();
    $scope.gridArray = new Array();
    var gridNumber = 1;
    $scope.indicators = function (item, entities, number) {
        gridNumber == 0 ? $scope.gridArray.shift() : "";
        $scope.gridObj = {};
        var a = $scope.checkedArray.indexOf(item.name);
        if (a != -1) {
            $scope.checkedArray.splice(a, 1);
            $scope.gridArray.splice(a, 1);
        } else {
            if ($scope.checkedArray.length >= number) {
                $scope.checkedArray.shift();
                $scope.gridArray.shift();
                $scope.checkedArray.push(item.name);

                $scope.gridObj["name"] = item.consumption_name;
                $scope.gridObj["field"] = item.name;
                $scope.gridArray.push($scope.gridObj);
            } else {
                $scope.gridObj["name"] = item.consumption_name;
                $scope.gridObj["field"] = item.name;
                $scope.gridArray.push($scope.gridObj);
                $scope.checkedArray.push(item.name);
            }
        }
        angular.forEach(entities, function (subscription, index) {
            $scope.checkedArray;
            if (subscription.name == item.name) {
                $scope.classInfo = 'current';
            }
        });
    };
    // 推广概况表格配置项
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        enableGridMenu: true,
        columnDefs: $scope.gridArray
    };


    /**
     *
     * @param start 开始时间
     * @param end   结束时间
     * @param indic   查询指标
     * @param lati   查询纬度
     * @param type
     */
    $scope.targetSearch = function () {
        if ($rootScope.latitude == undefined) {
            console.error("error: latitude is not defined,Please check to see if the assignment.");
            return;
        }
        $http({
            method: 'GET',
            url: '/api/indextable/?start=' + $scope.dateTimeStart + "&end=" + $scope.dateTimeEnd + "&indic=" + $scope.checkedArray + "&lati=" + $rootScope.latitude.field + "&type=1"
        }).success(function (data, status) {
            gridNumber = 0;
            $scope.gridArray.unshift($rootScope.latitude);
            $scope.gridOptions.data = data;
        }).error(function (error) {
            console.log(error);
        });
    }

    var select = $scope.select = {};

    //数组对象用来给ng-options遍历
    select.optionsData = [{
        title: "公告"
    }, {
        title: "全部事件目标"
    }, {
        title: "完整下载"
    }, {
        title: "在线下载"
    }, {
        title: "时长目标"

    }, {
        title: "访问页数目标"

    }
    ];
});
