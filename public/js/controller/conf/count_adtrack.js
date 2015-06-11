/**
 * Created by john on 2015/4/1.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('adtrack', function ($scope, $q, $rootScope,ngDialog) {
        //配置默认指标
        $rootScope.checkArray = ["", "", ""];
        $rootScope.gridArray = [
            {name: "xl", displayName: "", cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>", maxWidth: 5},
            {name: "事件目标事件名称", displayName: "事件目标事件名称", field: "a", cellClass: 'table_admin'},
            {name: "事件元素ID", displayName: "事件元素ID", field: "b", cellClass: 'table_admin'},
            {name: "事件作用或目录", displayName: "事件作用或目录", field: "c", cellClass: 'table_admin'  },
            {name: "记录方式", displayName: "记录方式", field: ""},
            {
                name: "x2",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a data-ng-click='grid.appScope.gainURL()' href=''>查看生成的URL</a></div>",
                maxWidth: 100
            },
            {
                name: "x4",
                displayName: "",
                // grid.appScope.Delete(row, grid.options.data)
                cellTemplate: "<div class='table_admin'><a href='' ng-click='grid.options.data.splice(grid.options.data.indexOf(row.entity), 1);' >删除</a></div>",
                maxWidth: 100
            }

        ];
        $rootScope.tableSwitch = {
            latitude: {name: "网站域名", displayName: "网站域名", field: ""},
            tableFilter: null,
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 0,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: false,
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false //是否清空指标array
        };

        $scope.gridOptions = {
            paginationPageSize: 25,
            expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions'></div>",
            expandableRowHeight: 360,
            enableColumnMenus: false,
            enablePaginationControls: false,
            enableSorting: true,
            enableGridMenu: false,
            enableHorizontalScrollbar: 0,
            columnDefs: $rootScope.gridArray
        };
         $scope.gridOptions.data = [{a:"<div class='table_admin'>aaaaaaaaaa</div>",b:"bbbbbbbbbb",c:"ccccccccc"},{a:"dddddddddd",b:"eeeeeeeee",c:"ccccccccc"}]
        $scope.gainURL=function(){

            $scope.urlDialog = ngDialog.open({
                template:$rootScope.urlDialogHtml,
                className: 'ngdialog-theme-default',
                plain: true,
                scope : $scope
            });
        };
        $rootScope.urlDialogHtml = "<div class='mid_left'>生成URL<div class='mid_left_code'>   </div> </div><div class='mid_right'><button type='button' class='btn btn-default navbar-btn'>复制</button><ul type='disc'>" +
            "  <li style='color：red；'>请将生成的URL复制到你的其他媒介的推广目标URL位置</li></ul></div>";


    });
});
