/**
 * Created by john on 2015/3/30.
 */

app.controller("Indextable", function ($scope, $http, requestService) {
    var start = today_start().getTime(), end = today_end().getTime();
    $scope.gridOptions = {
        enableScrollbars: false,
        enableGridMenu: true,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        columnDefs: [
            {name: 'name', displayName: "关键词"},
            {name: 'value', displayName: "浏览量"}
        ]
    };
    //$http.get("/api/pie?start=" + start + "&end=" + end + "&type=pv").success(function (data) {
    //    $scope.gridOptions.data = data.data;
    //});

});
app.controller("TabsCtrl", function ($scope, $http, requestService) {
    $scope.tabs = [
        {title: 'Dynamic Title 1', content: 'Dynamic content 1'},
        {title: 'Dynamic Title 2', content: 'Dynamic content 2', disabled: true}
    ]
    $scope.target = [
        {consumption_name: "展现量"},
        {consumption_name: "点击量"},
        {consumption_name: "消费"},
        {consumption_name: "点击率"},
        {consumption_name: "平均点击价格"}
    ];
    $scope.Webbased = [
        {consumption_name: "浏览量(PV)"},
        {consumption_name: "浏览量(PV)"},
        {consumption_name: "访客数(UV)"},
        {consumption_name: "新访客数"},
        {consumption_name: "新访客数"},
        {consumption_name: "页头访问次数"}
    ];
    $scope.flow = [
        {consumption_name: "跳出率"},
        {consumption_name: "平均访问时长"},
        {consumption_name: "平均访问页数"},
        {consumption_name: "平均访问页数"},
    ];
    $scope.transform = [
        {consumption_name: "转化次数"},
        {consumption_name: "转化率"},
        {consumption_name: "平均转化成本"},
        {consumption_name: "收益"},
        {consumption_name: "利润"},
        {consumption_name: "投资回报率"},
    ];
    $scope.mobile = [
        {consumption_name: "搜索页直拨电话展现"},
        {consumption_name: "搜索页直拨电话点击"},
        {consumption_name: "搜索页直拨电话消费"},
        {consumption_name: "搜索页沟通展现"},
        {consumption_name: "搜索页沟通点击"},
        {consumption_name: "搜索页沟通消费"},
        {consumption_name: "搜索页回呼电话展现"},
        {consumption_name: "搜索页回呼电话点击"},
        {consumption_name: "搜索页回呼电话消费"},
        {consumption_name: "搜索页APP下载展现"},
        {consumption_name: "搜索页APP下载点击"},
        {consumption_name: "搜索页APP下载消费"},
    ];
    $scope.recall = [
        {consumption_name: "电话量"},
        {consumption_name: "已接电话量"},
        {consumption_name: "漏接电话量"},
        {consumption_name: "漏接电话量"}
    ];


    $scope.selectedWhich = function (row) {
        $scope.selectedRow = row;
    };
    $scope.selectedWebbased = function (row) {
        $scope.selectedWeb = row;
    };
    $scope.selectflowd = function (row) {
        $scope.selectedflow = row;
    };
    $scope.selectedform = function (row) {
        $scope.selectedtransform = row;
    };
    $scope.selectedmobiles = function (row) {
        $scope.selectedmobile = row;
    };
    $scope.selectedrecalls = function (row) {
        $scope.selectedrecall = row;
    };
});
app.controller("TodytableCtrl", function ($scope, $http, requestService) {

    $scope.Webbased = [
        {consumption_name: "浏览量(PV)"},
        {consumption_name: "访问次数"},
        {consumption_name: "访客数(UV)"},
        {consumption_name: "新访客数"},
        {consumption_name: "新访客比率"},
        {consumption_name: "IP数"}
    ];
    $scope.flow = [
        {consumption_name: "跳出率"},
        {consumption_name: "平均访问时长"},
        {consumption_name: "平均访问页数"},
    ];
    $scope.transform = [
        {consumption_name: "转化次数"},
        {consumption_name: "转化率"}
    ];
    $scope.selectedWebbased = function (row) {
        $scope.selectedWeb = row;
    };
    $scope.selectflowd = function (row) {
        $scope.selectedflow = row;
    };
    $scope.selectedform = function (row) {
        $scope.selectedtransform = row;
    };
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

