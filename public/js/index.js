app.controller('DateChartController', function ($scope,requestService) {
    $scope.today = function () {
        var start = today_start(), end = today_end();
        var selectedType=getCheckbox("radio1");
        if(!selectedType){alert("请选择统计指标");return;}
        var option = {
            type:selectedType,
            chart: "line"

        };
        requestService.request('index_charts', start.getTime(), end.getTime(), option);
    };

    $scope.yesterday = function () {
        var selectedType=getCheckbox("radio1");
        if(!selectedType){alert("请选择统计指标");return;}
        var start=yesterday_start(),end=yesterday_end(),option={type:selectedType,chart:'line'};
        requestService.request('index_charts',start.getTime(),end.getTime(),option);
    };

    $scope.lastWeek = function () {
        var selectedType=getCheckbox("radio1");
        if(!selectedType){alert("请选择统计指标");return;}
        var start=lastWeek_start(),end=lastWeek_end(),option={type:selectedType,chart:'line'};
        requestService.request('index_charts',start.getTime(),end.getTime(),option);

    };

    $scope.lasMonth=function(){
        var selectedType=getCheckbox("radio1");
        if(!selectedType){alert("请选择统计指标");return;}
        var start=lastWeek_start(),end=lastWeek_end(),option={type:selectedType,chart:'line'};
        requestService.request('index_charts',start.getTime(),end.getTime(),option);
    }

}).controller('IndexController', ['$scope', '$http', function ($scope, $http) {
    // grid
    $scope.gridOptions = {
        paginationPageSizes: [10, 15, 20],
        paginationPageSize: 10,
        columnDefs: [
            {field: '_id', displayName: 'ID', visible: false},
            {field: 'name', displayName: '关键词', enableSorting: false}
            //{
            //    name: 'edit',
            //    displayName: '编辑',
            //    cellTemplate: '<button id="editBtn" type="button" class="btn-small" ng-click="edit(row.entity)" >Edit</button>'
            //}
        ]
    };
}]);

