/**
 * Created by Fzk lwek on 2015/6/25.
 */

define(["app"], function (app) {

    "use strict";
    app.directive("gridpageht", function ($rootScope, requestService) {
        var option = {
            restrict: "EA",
            template: "<div class=\"page_ht\"><div class=\"shishi\"><input class='select_checkbox' type='checkbox'  ng-click=\'Selectall()\' id='Selectall' name='Selectall'><p style='color: #000011;position: absolute; margin-left: 35px; '>本页全选</p><p><a href='' style='color:#46b8da;position: absolute;margin-left: 60px;'  ng-click='deleteall()'>批量删除</a></p></div> <a ng-click=\"gridApiAdmin.pagination.previousPage()\">上一页</a> <button type=\"button\" class=\"btn btn_ht\"> {{ gridApiAdmin.pagination.getPage() }}</button><a ng-click=\"gridApiAdmin.pagination.nextPage()\">下一页 </a> <input type=\"text\" ng-model=\"page\" value=\"\"><span> /{{ gridApiAdmin.pagination.getTotalPages() }}</span> <button type=\"button\" class=\"btn btn_ht\" ng-click=\"pagego(gridApi2)\">跳转</button> </div>",
            replace: true,
            transclude: true,
            link: function (scope, element, attris, controller) {
                //scope.selectAll = function() {
                //    console.log(111);
                //   // scope.gridApi2.selection.selectAllRows();
                //};
                scope.deleteall=function() {
                    console.log(scope.gridApiAdmin.selection.getSelectedRows());
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