/**
 * Created by john on 2015/4/1.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('pagechange', function ($http,$scope, $q, $rootScope,$cookieStore) {
        $scope.page_schema_model = {
            //id: String,
            uid: "",//用户ID
            site_id: "", // 站点ID
            target_name: "",//目标名称
            target_url: [""],//目标URL
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
                    step_urls: [{url:""}, {url:""}]//步骤URL 最多三个
                }]

            }],
            conv_tpye: ""//转换类型，regist,communicate,place_order,othre_order
        };
        //配置默认指标
        $rootScope.checkedArray = ["target_name", "target_url", "needPath","record_type","conv_tpye"   ];
        $rootScope.gridArray = [
            {name: "目标名称", displayName: "目标名称", field: "target_name"},
            {name: "路径", displayName: "目标路径", field: "target_url"},
            {name: "是否需要经过路径", displayName: "是否需要经过路径", field: "needPath"},
            {name: "记录方式", displayName: "记录方式", field: "record_type"},
            {name: "转化类型", displayName: "转化类型", field: "conv_tpye"}
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
            var site_id = $rootScope.userType;
            var url = "/config/page_conv?type=search&query={\"uid\":\"" + uid + "\",\"site_id\":\"" + site_id + "\"}";
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                $rootScope.gridOptions.data=dataConfig;
                //修改数据
                dataConfig.forEach(function(item,i){
                    if(item.paths==null||item.paths.length==0){
                        $rootScope.gridOptions.data[i].needPath="否";
                    }else{
                        $rootScope.gridOptions.data[i].needPath="是";
                    }
                });

            });
        };

        refushGridData();

    });
});
