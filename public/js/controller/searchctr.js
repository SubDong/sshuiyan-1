/**
 * Created by john on 2015/4/2.
 */
app.controller('searchctr', function ($scope, $rootScope,areaService, $http) {
        $scope.todayClass = true;

        //table默认信息配置
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        $rootScope.tableFilter = undefined;
        $rootScope.latitude = {name: "搜索引擎", field: "wd"}
        $rootScope.dimen = false;
        //

        $scope.$on("ssh_refresh_charts", function(e, msg) {
            $rootScope.targetSearch();
        });


        //$scope.initMap();
        //点击显示指标
        $scope.visible =true;
        $scope.select = function(){
            $scope.visible =false;
        };
        $scope.clear = function() {
            $scope.page.selected = undefined;
            $scope.city.selected = undefined;
            $scope.country.selected = undefined;
            $scope.continent.selected = undefined;
        };
        $scope.page = {};
        $scope.pages = [
            { name: '全部页面目标'},
            { name: '全部事件目标'},
            { name: '所有页面右上角按钮'},
            { name: '所有页面底部400按钮'},
            { name: '详情页右侧按钮'},
            { name: '时长目标'},
            { name: '访问页数目标'},
        ];

    }
)
