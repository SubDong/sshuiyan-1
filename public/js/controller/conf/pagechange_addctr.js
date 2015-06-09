/**
 * Created by ss on 2015/6/4.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('pagechange_addctr', function ($scope, $http, $rootScope, $cookieStore) {    //$scope.
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
        $scope.page_schema = angular.copy($scope.page_schema_model);

        $scope.page_schema.site_id = $rootScope.userType;
        $scope.page_schema.uid=$cookieStore.get("uid");

        $scope.target = false;
        $scope.targetFocus = function () {
            $scope.target = true;
        };
        $scope.targetBlur = function () {
            $scope.target = false;
        };
        $scope.record = false;
        $scope.benefitSet = false;
        $scope.pathType = false;
        $scope.changeType = false;

        $scope.showRemove = false;
        $scope.targetRemoves = [];
        $scope.removeTargetUrl = function(targets,targetRemoves,_index) {
            targets.splice(_index+1,1);
            targetRemoves.splice(_index,1);
        }
        $scope.isAddPath = true;
        $scope.addPaths = function (paths) {
            paths.push({
                path_name: "",//路径名称
                path_mark: false,//只有经过此路径的目标记为转化
                steps: [{
                    step_name: "",//步骤名称
                    step_urls: [{url:""}, {url:""}]//步骤URL 最多三个
                }]

            });
        };
        $scope.removePath = function (steps, _index) {
            steps.splice(_index, 1);
        };
        $scope.cancelAdd = "cancelAdd";
        $scope.addSteps = function (path, steps) {
            path.steps.push({
                step_name: "",//步骤名称
                step_urls: [{url:""},{url:""}]//步骤URL 最多三个
            });
        };
        $scope.removeStepUrls = function (step_urls, _index) {
            step_urls.splice(_index, 1);
        };
        $scope.addStepUrls = function (step, turl) {
            console.log(step.step_urls);
            step.step_urls.push({url:turl});
        };
        $scope.chooseRecord=function(){
            console.log("choose redio")
        }
        Custom.initCheckInfo();//页面check样式js调用

        /**
         * 提交
         */
        $scope.submit = function () {

            var url = "/config/page_conv?type=search&query={\"uid\":\"" +  $scope.page_schema.uid + "\",\"site_id\":\"" + $scope.page_schema.site_id + "\",\"target_name\":\""+ $scope.page_schema.target_name+"\"}";

            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                //重组数据
                //$scope.page_schema.target_url.forEach(
                    //www.开头替换为http://www
                    //function(item,i){
                    //    if(item.)
                    //}
                //)
                //console.log("save"+JSON.stringify($scope.page_schema));
                if (dataConfig == null||dataConfig.length==0) {//不存在配置 保存
                    //console.log("save"+JSON.stringify($scope.page_schema));
                    var url = "/config/page_conv?type=save&entity="+JSON.stringify($scope.page_schema);
                    $http({
                        method: 'GET',
                        url: url
                    }).success(function (dataConfig, status) {

                    });
                } else {//存在配置 更新
                    console.log("update");
                    var url ="/config/page_conv?type=update&query={\"uid\":\"" + $scope.page_schema.uid + "\",\"site_id\":\"" + $scope.page_schema.site_id  + "\",target_name"+ $scope.page_schema.target_name+ "\"}&updates="+JSON.stringify($scope.page_schema);
                    $http({
                        method: 'GET',
                        url: url
                    }).success(function (dataConfig, status) {
                    });
                }
            });
        }

    })
});