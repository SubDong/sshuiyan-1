/**
 * Created by john on 2015/3/30.
 */

app.controller("Indextable",function($scope, $http, requestService){
    $scope.gridOptions = {
        enableScrollbars :false,
        enableHorizontalScrollbar:0,
        enableVerticalScrollbar:0,
        columnDefs :[
            { name: '关键词'  },
            { name: '浏览量' }
        ]
    };


})