/**
 * Created by ss on 2015/6/4.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('pagechange_addctr', function ($scope, $http, $rootScope, $cookieStore, $state, ngDialog) {    //$scope.

        $scope.target_name = null;

        $scope.target_urls = [{url: ""}];//默认存在第一个空的URL 页面显示使用对象数组
        $scope.record_type = ""//记录方式
        //收益设置
        $scope.expected_yield = null//预期收益
        $scope.pecent_yield = null//预期收益率

        $scope.conv_tpye = "other"//转换类型，regist,communicate,place_order,other
        $scope.conv_text = ""
        $scope.t_conv_text = "";//路径类型其他


        //单个Url
        var singleUrl = {
            url: ""
        }
        //单个步骤
        var singleStep = {
            step_name: "",
            step_urls: [angular.copy(singleUrl)]
        };
        //单步Path
        var singlePath = {
            path_name: "",
            path_mark: false,
            steps: [angular.copy(singleStep)
            ]
        };
        //初始化路径 默认有一个空的单个Path
        $scope.paths = [angular.copy(singlePath)];

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


        //增删 目标URL
        $scope.addTargetUrl = function (target_urls, cur_url, index) {
            checkAndForceUrls(target_urls);
            target_urls.push(angular.copy(singleUrl));
        };
//        确认弹出框
        $scope.removeTargetUrl = function (target_urls,index) {
            $scope.openTargetUrlConfirmDialog = ngDialog.openConfirm({
                template:'<div class="ngdialog-buttons" ><div class="ngdialog-tilte">来自目标URL的消息</div>' +
                    '<ul class="admin-ng-content">' +
                    '<li> 你确定删除这个目标URL吗？</li></ul>' +
                    '<div class="ng-button-div"> <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">返回</button>' +
                    '<button type="button" class="ngdialog-button ng-button" ng-click="confirm()">确定</button></div>' +
                    '</div>',
                className: 'ngdialog-theme-default admin_ngdialog',
                plain: true,
                scope : $scope
            }).then(function () {
                target_urls.splice(index, 1);
            }, function (reason) {
                return;
            });
        };

        //增删步骤URL
        $scope.removeStepUrl = function (step_urls, index) {
            $scope.openStepUrlConfirmDialog = ngDialog.openConfirm({
                template:'<div class="ngdialog-buttons" ><div class="ngdialog-tilte">来自路径类型的消息</div>' +
                    '<ul class="admin-ng-content">' +
                    '<li> 你确定删除这个步骤URL吗？</li></ul>' +
                    '<div class="ng-button-div"> <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">返回</button>' +
                    '<button type="button" class="ngdialog-button ng-button" ng-click="confirm()">确定</button></div>' +
                    '</div>',
                className: 'ngdialog-theme-default admin_ngdialog',
                plain: true,
                scope : $scope
            }).then(function () {
                step_urls.splice(index, 1);
            }, function (reason) {
                return;
            });
        };
        $scope.addStepUrl = function (step_urls, step_url, index) {
            checkAndForceUrls(step_urls);
            step_urls.push(angular.copy(singleUrl));
        };
        //增删步骤
        $scope.addSteps = function (steps) {
            steps.push(angular.copy(singleStep));
        };
        //增删路径
        $scope.addPaths = function (paths) {
            paths.push(angular.copy(singlePath));
        };
        $scope.removePath = function (steps, _index) {
            $scope.openPathConfirmDialog = ngDialog.openConfirm({
                template:'<div class="ngdialog-buttons" ><div class="ngdialog-tilte">来自路径类型的消息</div>' +
                    '<ul class="admin-ng-content">' +
                    '<li> 你确定删除这个路径吗？</li></ul>' +
                    '<div class="ng-button-div"> <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">返回</button>' +
                    '<button type="button" class="ngdialog-button ng-button" ng-click="confirm()">确定</button></div>' +
                    '</div>',
                className: 'ngdialog-theme-default admin_ngdialog',
                plain: true,
                scope : $scope
            }).then(function () {
                steps.splice(_index, 1);
            }, function (reason) {
                return;
            });
        };

        $scope.insertOrder = function(){
            $scope.target_urls[$scope.target_urls.length-1].url = "目标URL[[[*]]]";
        }

        var menu_conv_type = {
            regist: "注册",
            communicate: "沟通",
            place_order: "下单",
            other:"其他"
        }
        $scope.chooseRecordType = function (curType) {
            //console.
            $scope.radio_record.visit_times = false;
            $scope.radio_record.pv = false;
            $scope.radio_record.order_conv = false;
            $scope.radio_record[curType] = true;
            $scope.record_type = curType;
        };
        $scope.chooseConvType = function (curType) {
            $scope.radio_conv.regist = false;
            $scope.radio_conv.communicate = false;
            $scope.radio_conv.place_order = false;
            $scope.radio_conv.other = false;
            $scope.radio_conv[curType] = true;
            $scope.conv_tpye = curType;
            if (!$scope.radio_conv.other) {//去掉非其他情况时conv_text的值
                document.getElementById("convTypeText").readOnly = true;
            } else {
                document.getElementById("convTypeText").readOnly = false;
            }
            $scope.t_conv_text = menu_conv_type[curType];
        };
        Custom.initCheckInfo();//页面check样式js调用


        $scope.showMsg = function (msgTemplate) {
            $scope.msgWindow = ngDialog.open({
                template: msgTemplate,
                className: 'ngdialog-theme-default admin_ngdialog',
                plain: true,
                scope: $scope
            });
        }

        $scope.showInputErrMsg = function (errMsg) {
            if (errMsg != "") {
                var template = '<div class="ngdialog-buttons" ><div class="ngdialog-tilte">输入项信息错误</div><ul class="admin-ng-content"><li>' + errMsg + '</li></ul>'
                    + '<div class="ng-button-div"><button type="button" class="ngdialog-button ng-button " \
                  <button type="button" class="ngdialog-button ngdialog-button-secondary " ng-click="closeThisDialog(0)">返回</button></div></div>';
                $scope.showMsg(template);
            }
        }
        //检查并规范去重URL数组，如果无任何填写 返回False ，否则返回true并清除URL数组中的空URL和去掉重复元素
        //url 必须为singleUrl类型
        var checkAndForceUrls = function (urls) {


            var tempTargUrls = [], hash = {};
            for (var index = urls.length - 1; index >= 0; index--) {
                if (urls[index].url != null && urls[index].url != "" && !hash[urls[index].url]) {
                    tempTargUrls.push(urls[index]);
                    hash[urls[index].url] = true;
                } else {
                    if (urls.length > 1) {
                        urls.splice(index, 1);
                    }
                }
            }
            urls = tempTargUrls;
            if (urls.length > 0) {
                return true;
            } else {
                urls.push(angular.copy(singleUrl));//清空所有后，如果为空 则需要添加一个空

            }
            return false;
        }

        //Url数组转字符串数组
        var forceUrlsToArray = function (urls) {
            var arr = [];
            for (var i = 0; i < urls.length; i++) {
                arr.push(urls[i].url);
            }
            return arr;
        }

        //检查路径下的步骤正确性
        //相邻步骤之间不能有重复URL
        var checkSinglePath = function (path, pathIndex) {
            if (path.steps.length == 0) {
                //showInputErrMsg("路径" + pathIndex + " 未添加任何步骤，至少添一个步骤，请返回并完善信息")
                return true;
            }
            if (path.steps.length == 1) {
                if (!checkAndForceUrls(path.steps[0].step_urls)) {
                    //$scope.showInputErrMsg("路径" + pathIndex + "-->步骤1 未填写任何步骤URL，至少填写一个步骤URL，请返回并完善信息");
                    return true;
                }
            }else{
                //先check掉第一组StepUrl
                if (!checkAndForceUrls(path.steps[0].step_urls)) {
                    //$scope.showInputErrMsg("路径" + pathIndex + "-->步骤1 未填写任何步骤URL，至少填写一个步骤URL，请返回并完善信息");
                    return true;
                }
                for (var index = 0; index < path.steps.length - 1; index++) {
                    //判断相邻两组URL是否有相等
                    if (!checkAndForceUrls(path.steps[index + 1].step_urls)) {
                        //$scope.showInputErrMsg("路径" + pathIndex + "-->步骤" + (index + 2) + " 未填写任何步骤URL，至少填写一个步骤URL，请返回并完善信息");
                        return true;
                    }
                    for (var i = 0; i < path.steps[index].step_urls.length; i++) {
                        for (var j = 0; j < path.steps[index + 1].step_urls.length; j++) {
                            if (path.steps[index].step_urls[i].url == path.steps[index + 1].step_urls[j].url) {
                                $scope.showInputErrMsg("路径" + pathIndex + "中 步骤" + (index + 1) + "与步骤" + (index + 2) + "存在相同URL，请返回并修改");
                                return false;
                            }
                        }
                    }
                }
            }
            for(var i = 0;i<path.steps[path.steps.length-1].step_urls.length;i++){
                for(var tindex=0;tindex<$scope.target_urls.length;tindex++){
                    if(path.steps[path.steps.length-1].step_urls[i].url==$scope.target_urls[tindex].url){
                        $scope.showInputErrMsg("路径" + pathIndex + "中 最后一步中的URL["+path.steps[path.steps.length-1].step_urls[i].url+"]与目标URL["+$scope.target_urls[tindex].url+"]相同URL，请返回并修改");
                        return false;
                    }
                }
            }
            return true;
        }

        var forcePathStepUrls = function (pcid) {
            var page_conv_step_urls = [];
            for (var pathIndex = 0; pathIndex < $scope.paths.length; pathIndex++) {
                for (var level = 0; level < $scope.paths[pathIndex].steps.length; level++) {
                    var purlArr = (level == 0) ? [] : forceUrlsToArray($scope.paths[pathIndex].steps[level - 1].step_urls);
                    var curlArr = (level == ($scope.paths[pathIndex].steps.length - 1)) ? [] : forceUrlsToArray($scope.paths[pathIndex].steps[level + 1].step_urls)
                    //for (var i = 0; i < $scope.paths[pathIndex].steps[level].step_urls.length; i++) {
                    var page_conv_step_url = {
                        page_conv_id: pcid,
                        path: pathIndex + 1,//路径 编号
                        step_level: level + 1, //步骤 编号 等于层次
                        urls: forceUrlsToArray($scope.paths[pathIndex].steps[level].step_urls), //urls
                        is_leaf: level == ($scope.paths[pathIndex].steps.length - 1) ? true : false,//是否未叶子
                        purls: purlArr,//父步骤Url
                        curls: curlArr//子步骤Url
                    }
                    page_conv_step_urls.push(page_conv_step_url);
                    //}
                }
            }

            return page_conv_step_urls;
        }
        /**
         * 提交
         */
        $scope.submit = function () {

            //提交数据前检测
            if ($scope.target_name == null || $scope.target_name == "") {
                $scope.showInputErrMsg("目标名称未填写，请返回修改");
                return;
            }
            if (!checkAndForceUrls($scope.target_urls)) {
                $scope.showInputErrMsg("目标URL未填写，至少填写一个URL，请返回并完善信息");
                return;
            }
            for (var index = 0; index < $scope.paths.length; index++) {
                if (!checkSinglePath($scope.paths[index], index + 1))
                    return;
            }
            var page_conv_entity = {
                uid: $cookieStore.get("uid"),
                site_id: $rootScope.siteId,
                target_name: $scope.target_name,//目标名称
                target_urls: $scope.target_urls,//目标URL
                record_type: $scope.record_type,//记录方式
                //收益设置
                expected_yield: $scope.expected_yield,//预期收益
                pecent_yield: $scope.pecent_yield,//预期收益率
                //路径类型
                paths: $scope.paths,
                conv_tpye: $scope.conv_tpye,//转换类型，regist,communicate,place_order,othre_order
                conv_text:$scope.conv_tpye=="other"?($scope.t_conv_text.trim()==""?menu_conv_type["other"]:$scope.t_conv_text.trim()):menu_conv_type[$scope.conv_tpye],
                update_time: new Date().getTime()
            }
            var savePageConv = "/config/page_conv?type=save&entity=" + JSON.stringify(page_conv_entity);
            $http({
                method: 'GET',
                url: savePageConv
            }).success(function (ins, status) {
                if (status == 200) {
                    var page_conv_urls = forcePathStepUrls(ins._id);
                    var saveUrls = "/config/page_conv_urls?type=saveAll&entitys=" + JSON.stringify(page_conv_urls);
                    $http({
                        method: 'GET',
                        url: saveUrls
                    }).success(function (data, status) {
                        if (status != 200) {
                            return;
                        }
                    });
                }
                $state.go('pagechange');
            });
        }
    })
});