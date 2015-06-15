/**
 * Created by john on 2015/4/1.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('pagechange', function ($http,$scope, $q, $rootScope,$cookieStore,ngDialog, $state) {
        $scope.page_schema_model = {
            //id: String,
            uid: "",//用户ID
            site_id: "", // 站点ID
            target_name: "",//目标名称
            target_url: [{url:""}],//目标URL
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
        $scope.record_type_cn={
            visit_times: "访问次数",
            pv: "测量PV",
            order_conv: "订单转化"
        }

        $scope.conv_tpye_cn = {
            regist: "注册",
            communicate: "沟通",
            place_order: "下单",
            other: "其他"
        };


        //跳转到修改界面
        $scope.onUpdate = function (entity) {
            console.log("传递ID="+entity._id);
            $state.go('pagechange_update',{ 'id':entity._id});
        }

        //配置默认指标
        $rootScope.checkedArray = ["target_name", "target_url", "needPath","record_type","conv_tpye"  ,"_id" ];
        $rootScope.gridArray = [
            {name: "xl", displayName: "", cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>", maxWidth: 5},
            {name: "目标名称", displayName: "目标名称", field: "target_name"},
            {name: "路径", displayName: "目标路径", field: "target_url"},
            {name: "是否需要经过路径", displayName: "是否需要经过路径", field: "needPath"},
            {name: "记录方式", displayName: "记录方式", field: "record_type"},
            {name: "转化类型", displayName: "转化类型", field: "conv_tpye"},
            {
                name: "x3",
                displayName: "",
                cellTemplate: "<div class='table_admin' ng-click='grid.appScope.onUpdate(row.entity)'><a href=''>修改</a></div>",
                maxWidth: 150
            },
            {
                name: "x4",
                displayName: "",
                // grid.appScope.Delete(row, grid.options.data)
                cellTemplate: "<div class='table_admin'><a href='' ng-click='grid.appScope.onDelete(index,grid,row)' >删除</a></div>",
                maxWidth: 150
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

        /**
         * 初始化数据
         */
        var refushGridData = function () {
            var uid = $cookieStore.get("uid");
            var site_id = $rootScope.siteId;
            var url = "/config/page_conv?type=search&query={\"uid\":\"" + uid + "\",\"site_id\":\"" + site_id + "\"}";
            console.log(url)
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                console.log(dataConfig)
                $rootScope.gridOptions.data=dataConfig;
                //修改数据
                dataConfig.forEach(function(item,i){
                    if(item.paths==null||item.paths.length==0){
                        $rootScope.gridOptions.data[i].needPath="否";
                    }else{
                        $rootScope.gridOptions.data[i].needPath="是";
                    }
                    if(item.target_url!=null&&item.target_url.length>0){
                        var url="";
                        item.target_url.forEach(function(u,i){
                            url=url+u.url;
                            if(i<item.target_url.length-1){
                                url=url+"或";
                            }
                        })
                        $rootScope.gridOptions.data[i].target_url=url;
                    }
                    if(item.record_type!=null){
                        $rootScope.gridOptions.data[i].record_type = $scope.record_type_cn[item.record_type]
                    }
                    if(item.conv_tpye!=null){
                        $rootScope.gridOptions.data[i].conv_tpye = $scope.conv_tpye_cn[item.conv_tpye]
                    }
                });

            });
        };
        refushGridData();
        $scope.onDelete = function (index,grid,row) {
            $scope.onDeleteDialog= ngDialog.open({
                template: '' +
                '<div class="ngdialog-buttons" ><ui><li> 确认删除吗？<span style=" color: red " >（要测试自己新建条删哈！）<span></li></ui>' +
                '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">返回</button>\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="sureonDelete()">确定</button></div>',

                className: 'ngdialog-theme-default',
                plain: true,
                scope: $scope
            });

            $scope.sureonDelete= function(){
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


    });
});
