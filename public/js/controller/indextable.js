/**
 * Created by john on 2015/3/30.
 */
app.controller("TabsCtrl", function ($timeout, $scope, $rootScope, $http, requestService) {
    $scope.todayClass = true;


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
        {consumption_name: "浏览量(PV)", name: "pv"},
        {consumption_name: "访问次数", name: "vc"},
        {consumption_name: "访客数(UV)", name: "uv"},
        {consumption_name: "新访客数", name: "nuv"},
        {consumption_name: "新访客比率", name: "nuvRate"},
        //{consumption_name: "页头访问次数", name: "o1"}
    ];
    $scope.flow = [
        {consumption_name: "跳出率", name: "outRate"},
        {consumption_name: "平均访问时长", name: "avgTime"},
        {consumption_name: "平均访问页数", name: "avgPage"},
        {consumption_name: "抵达率", name: "arrivedRate"},
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
        {consumption_name: "访问次数", name: "vc"},
        {consumption_name: "访客数(UV)", name: "uv"},
        {consumption_name: "新访客数", name: "nuv"},
        {consumption_name: "新访客比率", name: "nuvRate"},
        {consumption_name: "IP数", name: "ip"}
    ];
    $scope.Todytransform = [
        {consumption_name: "转化次数", name: "zhuanF"},
        {consumption_name: "转化率", name: "zhuanN"}
    ];
    $scope.Todayfloweds = [
        {consumption_name: "跳出率", name: "outRate"},
        {consumption_name: "平均访问时长", name: "avgTime"},
        {consumption_name: "平均访问页数", name: "avgPage"},
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
        //{consumption_name: "贡献浏览量", name: "q9"},
        {consumption_name: "跳出率", name: "outRate"},
        {consumption_name: "平均访问时长", name: "avgTime"},
        {consumption_name: "平均访问页数", name: "avgPage"},
    ];
    $scope.Mapwebbase = [
        {consumption_name: "浏览量(PV)", name: "pv"},
        //{consumption_name: "浏览量占比", name: "a5"},
        {consumption_name: "访问次数", name: "vc"},
        {consumption_name: "访客数(UV)", name: "uv"},
        {consumption_name: "新访客数", name: "nuv"},
        {consumption_name: "新访客比率", name: "nuvRate"},
        {consumption_name: "IP数", name: "ip"}
    ];
    $scope.Novisitorbase = [
        {consumption_name: "浏览量(PV)", name: "pv"},
        //{consumption_name: "浏览量占比", name: "z3"},
        {consumption_name: "访问次数", name: "vc"},
        {consumption_name: "访客数(UV)", name: "uv"},
        {consumption_name: "IP数", name: "ip"}
    ];

    $rootScope.gridArray = new Array();
    $rootScope.checkedArray = new Array()
    $rootScope.indicators = function (item, entities, number) {
        /*$rootScope.gridArray == undefined?$rootScope.gridArray = new Array():"";
        $rootScope.checkedArray == undefined?$rootScope.checkedArray = new Array():"";*/

        $scope.gridArray.shift();
        $scope.gridObj = {};
        var a = $scope.checkedArray.indexOf(item.name);
        if (a != -1) {
            $scope.checkedArray.splice(a, 1);
            $scope.gridArray.splice(a, 1);
            $scope.gridArray.unshift($rootScope.latitude);
        } else {
            if ($scope.checkedArray.length >= number) {
                $scope.checkedArray.shift();
                $scope.gridArray.shift();
                $scope
                $scope.gridObj["name"] = item.consumption_name;
                $scope.gridObj["field"] = item.name;
                $scope.gridArray.push($scope.gridObj);
                $scope.gridArray.unshift($rootScope.latitude);
            } else {
                $scope.checkedArray.push(item.name);

                $scope.gridObj["name"] = item.consumption_name;
                $scope.gridObj["field"] = item.name;
                $scope.gridArray.push($scope.gridObj);
                $scope.gridArray.unshift($rootScope.latitude);
            }
        }
        angular.forEach(entities, function (subscription, index) {
            if (subscription.name == item.name) {
                $scope.classInfo = 'current';
            }
        });
    };

     /*function initTable(entities,item){
        entities.forEach(function(key,x){
            angular.forEach($scope[key], function (subscription, index) {
                item.forEach(function(info,i){
                    if (subscription.name == info) {
                        $scope.classInfo = 'current';
                    }
                })
            });
        });
    }*/
    // 推广概况表格配置项
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        enableColumnMenus: false,
        enableSorting: true,
        enableScrollbars: false,
        enableGridMenu: false,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
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
        $rootScope.$broadcast("ssh_dateShow_options_quotas_change", $scope.checkedArray);
        if ($rootScope.latitude == undefined) {
            console.error("error: latitude is not defined,Please check whether the parameter the configuration.");
            return;
        }
        if ($rootScope.tableTimeStart == undefined) {
            console.error("error: tableTimeStart is not defined,Please check whether the parameter the configuration.");
            return;
        }
        if ($rootScope.tableTimeEnd == undefined) {
            console.error("error: tableTimeEnd is not defined,Please check whether the parameter the configuration.");
            return;
        }
        $http({
            method: 'GET',
            url: '/api/indextable/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $scope.checkedArray + "&dimension=" + $rootScope.latitude.field
            + "&filter" + $rootScope.tableFilter + "&type=1"
        }).success(function (data, status) {
            $scope.gridOptions.data = data;
        }).error(function (error) {
            console.log(error);
        });
    }

    //init
    $scope.targetSearch();
    //
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
