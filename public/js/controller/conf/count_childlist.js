/**
 * Created by john on 2015/4/1.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('childlist', function ($scope, $q, $rootScope,$cookieStore,$http) {
        //配置默认指标
        $rootScope.checkArray = ["", "", ""];
        $rootScope.gridArray = [


            {name: "子目录名称", displayName: "子目录名称", field: "subdirectory_url",cellClass: 'table_admin'},
            {name: "包含的页面或目录", displayName: "包含的页面或目录", field: "analysis_url",cellClass: 'table_admin'},
            {name: "不包含的页面或目录", displayName: "不包含的页面或目录", field: "not_analysis_url",cellClass: 'table_admin'},
            {name: "创建时间", displayName: "创建时间", field: "create_date",cellClass: 'table_admin'}

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

        /**
         * 初始化数据
         */
        var refushGridData = function () {
            var uid = $cookieStore.get("uid");
            var root_url = $rootScope.userType;
            var url = "/config/subdirectory_list?type=search&query={\"uid\":\"" + uid + "\",\"root_url\":\"" + root_url + "\"}";
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {

                console.log(dataConfig);
               $scope.gridOptions.data = dataConfig;

            });
        };
        refushGridData();




    });
});
