/**
 * Created by john on 2015/4/1.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('count_pagechange', function ($http, $scope, $q, $rootScope, $cookieStore, ngDialog, $state) {


        $scope.page_schema_model = {
            //id: String,
            uid: "",//用户ID
            site_id: "", // 站点ID
            target_name: "",//目标名称
            target_urls: [{url: ""}],//目标URL
            record_type: "",//记录方式
            //收益设置
            expected_yield: null,//预期收益
            pecent_yield: null,//预期收益率
            //路径类型
            paths: [{
                path_name: "",//路径名称
                path_mark: false,//只有经过此路径的目标记为转化
                steps: [{
                    step_name: "",//步骤名称
                    step_urls: [{url: ""}, {url: ""}]//步骤URL 最多三个
                }]

            }],
            conv_tpye: "other",//转换类型，regist,communicate,place_order,other
            conv_text: ""
        };
        $scope.record_type_cn = {
            visit_times: "访问次数",
            pv: "测量PV",
            order_conv: "订单转化"
        };

        $scope.conv_tpye_cn = {
            regist: "注册",
            communicate: "沟通",
            place_order: "下单",
            other: "其他"
        };


        //跳转到修改界面
        $scope.onUpdate = function (entity) {
                $state.go('pagechange_update', {'id': entity._id});
        };

        //配置默认指标
        $rootScope.checkedArray = ["target_name", "target_urls", "needPath", "record_type", "conv_tpye", "_id"];
        $rootScope.gridArray = [
            {name: "xl", displayName: "", cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>", maxWidth: 5,  enableSorting: false},
            {name: "目标名称", displayName: "目标名称", field: "target_name", enableSorting: false},
            {
                name: "路径",
                displayName: "目标URL",
                field: "target_urls",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>URL</div>",
                cellClass: "table_list_color",
                enableSorting: false
            },
            {name: "是否需要经过路径", displayName: "是否需要经过路径", field: "needPath", enableSorting: false},
            {name: "记录方式", displayName: "记录方式", field: "record_type", enableSorting: false},
            {name: "转化类型", displayName: "转化类型", field: "conv_tpye", enableSorting: false},
            {
                name: "x3",
                displayName: "",
                cellTemplate: "<div class='table_admin' ng-click='grid.appScope.onUpdate(row.entity)'><a href=''>修改</a></div>",
                maxWidth: 150,
                enableSorting: false
            },
            {
                name: "x4",
                displayName: "",
                // grid.appScope.Delete(row, grid.options.data)
                cellTemplate: "<div class='table_admin'><a href='' ng-click='grid.appScope.onDelete(index,grid,row)' >删除</a></div>",
                maxWidth: 50,
                enableSorting: false
            }


        ];

        $rootScope.tableSwitch = {
            latitude: {name: "页面转化", displayName: "页面转化", field: ""},
            adminindex: true
        };

        var forceUrlsToArray = function (urls) {
            var arr = [];
            for (var i = 0; i < urls.length; i++) {
                arr.push(urls[i].url);
            }
            return arr;
        }
        /**
         * 初始化数据
         */
        var refushGridData = function () {
            var uid = $cookieStore.get("uid");
            var site_id = $rootScope.siteId;
            var url = "/config/page_conv?type=search&query=" + JSON.stringify({uid: uid, site_id: site_id});
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                $rootScope.gridOptions.data = dataConfig;
                var tempData = [];
                //修改数据
                dataConfig.forEach(function (item, i) {
                    if (item.paths == null || item.paths.length == 0) {
                        item.needPath = "否";
                    } else {
                        item.needPath = "是";
                    }
                    if (item.target_urls != null && item.target_urls.length > 0) {
                        var url = "";
                        item.target_urls.forEach(function (u, i) {
                            url = url + u.url;
                            if (i < item.target_urls.length - 1) {
                                url = url + "或";
                            }
                        });
                        $rootScope.gridOptions.data[i].target_urls = url;
                    }
                    if (item.record_type != null) {
                        item.record_type = $scope.record_type_cn[item.record_type]
                    }
                    if (item.conv_tpye != null) {
                        item.conv_tpye = $scope.conv_tpye_cn[item.conv_tpye]
                    }
                    tempData.push(item);
                });
                $rootScope.gridOptions.data = tempData;

            });
        };
        refushGridData();
        $scope.onDelete = function (index, grid, row) {
            $scope.onDeleteDialog = ngDialog.open({
                template: '' +
                '<div class="ngdialog-buttons" ><div class="ngdialog-tilte">来自网页的消息</div><ul class="admin-ng-content"><li> 您确定删除这个路径吗？</li></ul>' +
                '<div class="ng-button-div"><button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">返回</button>\
                    <button type="button" class="ngdialog-button ng-button" ng-click="sureonDelete()">确定</button></div></div>',

                className: 'ngdialog-theme-default admin_ngdialog',
                plain: true,
                scope: $scope
            });

            $scope.sureonDelete = function () {
                $scope.onDeleteDialog.close();
                var query = "/config/page_conv?type=delete&query={\"_id\":\"" + row.entity._id + "\"}";
                $http({
                    method: 'GET',
                    url: query
                }).success(function (dataConfig, status) {
                    if (dataConfig == "\"success\"") {
                        refushGridData();
                    }
                });
            };

        };
        /**
         * 实现expandRowData 控制展开项
         * @param pGridApi
         */
        $rootScope.expandRowData = function (pGridApi) {
            //展开操作
            pGridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                initExpandData(row);//每次展开第一级都初始化 保证下一级收起
                row.isInit = true;
                row.entity.subGridOptions.data.length = row.entity.paths.length + 1;
            })
        }

        /**
         * 初始化展开行数据
         * @param pRow 父行
         */
        var initExpandData = function (pRow) {
            var childData = [];
            for (var pindex = 0; pindex < pRow.entity.paths.length; pindex++) {
                var chileChildData = []
                if (pRow.entity.paths[pindex].steps != null && pRow.entity.paths[pindex].steps.length > 0) {
                    for (var sindex = 0; sindex < pRow.entity.paths[pindex].steps.length; sindex++) {
                        var surl = ""
                        if (pRow.entity.paths[pindex].steps[sindex].step_urls != null && pRow.entity.paths[pindex].steps[sindex].step_urls.length > 0) {
                            pRow.entity.paths[pindex].steps[sindex].step_urls.forEach(function (u, i) {

                                surl = surl + u.url;
                                if (i < pRow.entity.paths[pindex].steps[sindex].step_urls.length - 1) {
                                    surl = surl + "或";
                                }
                            });
                        } else {
                            surl = "未配置URL"
                        }
                        chileChildData.push({step_name: pRow.entity.paths[pindex].steps[sindex].step_name, url: surl})
                    }
                }
                childData.push({
                    name: pRow.entity.paths[pindex].path_name, steps: pRow.entity.paths[pindex].steps,
                    subGridOptions: {
                        enableColumnMenus: false,
                        enablePaginationControls: false,
                        enableGridMenu: false,
                        enableHorizontalScrollbar: 0,
                        enableSorting: false,
                        expandableRowHeight: 30,
                        columnDefs: [{name: "步骤名称", field: "step_name", width: '30%'}, {
                            name: "URL",
                            field: "url",
                            width: '70%'
                        }],
                        data: chileChildData,
                    }
                })
            }
            pRow.entity.subGridOptions = {
                enableColumnMenus: false,
                enablePaginationControls: false,
                enableGridMenu: false,
                enableHorizontalScrollbar: 0,
                enableSorting: false,
                expandableRowHeight: 30,
                expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions' class='grid clearfix secondary_table' ui-grid-exporter ui-grid-auto-resize ></div>",
                columnDefs: [{name: "路径名称", field: "name", width: '30%'}, {name: "", field: "url", width: '70%'}],
                data: childData,
                onRegisterApi: function (gridApi) {
                    $rootScope.gridApiAdmin = gridApi;
                    gridApi.expandable.on.rowExpandedStateChanged($scope, function (childRow) {//展开第二层操作
                        //childRow.entity.subGridOptions.data.length = childRow.entity.steps.length + 1;
                        if (childRow.isExpanded) {
                            childRow.entity.subGridOptions.data.length = childRow.entity.steps.length + 1;
                            pRow.entity.subGridOptions.data.length = pRow.entity.subGridOptions.data.length + childRow.entity.steps.length + 1;
                        } else {
                            pRow.entity.subGridOptions.data.length = pRow.entity.subGridOptions.data.length - childRow.entity.steps.length - 1;
                        }
                    });
                }
            }
        }
    });
});
