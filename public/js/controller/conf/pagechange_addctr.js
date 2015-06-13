/**
 * Created by ss on 2015/6/4.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('pagechange_addctr', function ($scope, $http, $rootScope, $cookieStore,$state) {    //$scope.
        $scope.page_schema_model = {
            //id: String,
            uid: "",//用户ID
            site_id: "", // 站点ID
            target_name: "",//目标名称
            target_url: [{url: ""}],//目标URL
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

        $scope.radio_record = {
            visit_times: true,
            pv: false,
            order_conv: false
        };
        $scope.radio_conv = {
            regist: false,
            communicate: false,
            place_order: false,
            other: true
        };


        $scope.page_schema = angular.copy($scope.page_schema_model);
        $scope.t_conv_text = "";//路径类型其他
        //UID 和site_id初始化
        $scope.page_schema.site_id = $rootScope.userType;
        $scope.page_schema.uid = $cookieStore.get("uid");

        $scope.record = false;
        $scope.benefitSet = false;
        $scope.pathType = false;
        $scope.changeType = false;

        $scope.showRemove = false;


        $scope.isAddPath = true;
        // 添加目标URL
        $scope.targetRemoves = [];
        $scope.targetUrlAdd = function (targets, targetRemoves) {
            if(targets.length == 4){
                $("#addTargetUrl").html("");
            }else {
                $("#addTargetUrl").html("添加页面");
            }
            $scope.showRemove = true;
            targets.push({url: ""});
            targetRemoves.push({url: ""});
        }
        $scope.removeTargetUrl = function (targets, targetRemoves, _index) {
            if(targets.length <= 5){
                $("#addTargetUrl").text("添加页面");
            }
            targets.splice(_index + 1, 1);
            targetRemoves.splice(_index, 1);
        }
        $scope.addPaths = function (paths) {
            paths.push({
                path_name: "",//路径名称
                path_mark: false,//只有经过此路径的目标记为转化
                steps: [{
                    step_name: "",//步骤名称
                    step_urls: [{url: ""}, {url: ""}]//步骤URL 最多三个
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
                step_urls: [{url: ""}, {url: ""}]//步骤URL 最多三个
            });
        };
        $scope.removeStepUrls = function (step_urls, _index) {
            step_urls.splice(_index, 1);
        };
        $scope.addStepUrls = function (step, turl) {
            console.log(step.step_urls);
            step.step_urls.push({url: turl});
        };
        $scope.chooseRecordType = function (curType) {
            //console.
            $scope.radio_record.visit_times = false;
            $scope.radio_record.pv = false;
            $scope.radio_record.order_conv = false;
            $scope.radio_record[curType] = true;
            $scope.page_schema.record_type = curType;
        };
        $scope.chooseConvType = function (curType) {
            $scope.radio_conv.regist = false;
            $scope.radio_conv.communicate = false;
            $scope.radio_conv.place_order = false;
            $scope.radio_conv.other = false;
            $scope.radio_conv[curType] = true;
            $scope.page_schema.conv_tpye = curType;
            if(! $scope.radio_conv.other){//去掉非其他情况时conv_text的值
                $scope.page_schema.conv_text = $scope.t_conv_text;
                $scope.t_conv_text="";
            }else{
                $scope.t_conv_text= $scope.page_schema.conv_text;
            }
        }
        Custom.initCheckInfo();//页面check样式js调用

        /**
         * 提交
         */
        $scope.submit = function () {

            var url = "/config/page_conv?type=search&query={\"uid\":\"" + $scope.page_schema.uid + "\",\"site_id\":\"" + $scope.page_schema.site_id + "\",\"target_name\":\"" + $scope.page_schema.target_name + "\"}";

            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                if (dataConfig == null || dataConfig.length == 0) {//不存在配置 保存

                    //存在配置 更新
                    if(!$scope.radio_conv.other){//去掉非其他情况时conv_text的值
                        $scope.page_schema.conv_text = "";
                    }else{
                        $scope.page_schema.conv_text= $scope.t_conv_text;
                    }
                    console.log($scope.page_schema.conv_text);
                    var url = "/config/page_conv?type=save&entity=" + JSON.stringify($scope.page_schema);
                    $http({
                        method: 'GET',
                        url: url
                    }).success(function (dataConfig, status) {
                        //跳转到修改界面
                        $scope.onUpdate = function (entity) {

                        }
                    });
                }
                $state.go('pagechange');
            });
        }

    })
});