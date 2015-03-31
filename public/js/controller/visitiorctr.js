/**
 * Created by john on 2015/3/31.
 */
app.controller("Vistiorctr", function ($scope, $http, requestService) {
    $scope.gridOptions = {
        enableScrollbars: false,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        columnDefs: [
            {name: '地域'},
            {name: '访问时间'},
            {name: '来源'},
            {name: '访问IP'},
            {name: '访问时长'},
            {name: '访问页数'},
        ]
    };
});