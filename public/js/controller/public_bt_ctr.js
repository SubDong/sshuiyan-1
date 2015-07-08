/**
 * Created by Fzk lwek on 2015/6/25.
 */

define(["app"], function (app) {

    "use strict";
    app.directive("gridpageht", function ($rootScope, requestService) {

        var option = {
            restrict: "EA",
            templateUrl:'./grid_page/grid_page_ht.html',
            replace: true,
            transclude: true,
            link: function (scope, element, attris, controller) {
                //scope.selectAll = function() {
                //    console.log(111);
                //   // scope.gridApi2.selection.selectAllRows();
                //};
                scope.gridpages=[0,1,2,3,4,5,6,7,8];
                scope.pagego = function (pagevalue) {
                    pagevalue.pagination.seek(Number(scope.page));
                };
                scope.Selectall= function() {
                    if(Selectall.checked==true){
                        $rootScope.gridApiAdmin.selection.selectAllRows();
                    }
                    else{
                        $rootScope.gridApiAdmin.selection.clearSelectedRows();
                    }
                };
            }
        };
        return option;
    });

});