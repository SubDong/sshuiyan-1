/**
 * Created by john on 2015/4/2.
 */
app.controller('searchtermctr', function ($scope, $rootScope, requestService, areaService, $http) {
        $scope.todayClass = true;
        //table默认信息配置
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        $rootScope.tableSwitch = {
            latitude:{name: "搜索词", field: "kw"},
            tableFilter:undefined,
            dimen:false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number:2,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
        };
        //
        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $rootScope.targetSearch();
        });


        //$scope.initMap();
        //点击显示指标
        $scope.visible = true;
        $scope.select = function () {
            $scope.visible = false;
        };
        $scope.page = {};
        $scope.pages = [
            {name: '全部页面目标'},
            {name: '全部事件目标'},
            {name: '所有页面右上角按钮'},
            {name: '所有页面底部400按钮'},
            {name: '详情页右侧按钮'},
            {name: '时长目标'},
            {name: '访问页数目标'},
        ];

    }
)
