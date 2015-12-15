define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('countrules', function ($scope, $http, $rootScope, $cookieStore, ngDialog) {


        //规则IP
        $scope.rules = [{
            source: "",
            convert: ""
        }];
        //点击效果
        $scope.ipArea = {
            "tNum": "1",//当前个数？
            "tText": "",//内容
            "count": 1,//个数
            "helpFlag": false//是否显示帮组信息
        };
        $scope.rules_area = angular.copy($scope.ipArea); //规则IP 与其他域不同 该与不使用其text
        $scope.ex_ips_area = angular.copy($scope.ipArea);//排除IP
        $scope.ex_refer_urls_area = angular.copy($scope.ipArea);//排除来源域名
        $scope.ex_urls_area = angular.copy($scope.ipArea);//排除受访域名
        $scope.cross_sites_area = angular.copy($scope.ipArea);//跨域监控
        $scope.open_tranver_area = angular.copy($scope.ipArea);
        $scope.days_area = angular.copy($scope.ipArea);

        /**
         * 数据初始化
         */
        $scope.init = function () {
            var uid = $cookieStore.get("uid");
            var site_id = $rootScope.siteId;
            var url = "/config/conf?index=0&type=search&query={\"uid\":\"" + uid + "\",\"site_id\":\"" + site_id + "\"}";
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                if (dataConfig != null && dataConfig.length > 0) {


                    $scope.rules = dataConfig[0].rules;
                    $scope.ex_ips_area = convertIpArea(dataConfig[0].ex_ips);
                    $scope.ex_refer_urls_area = convertIpArea(dataConfig[0].ex_refer_urls);
                    $scope.ex_urls_area = convertIpArea(dataConfig[0].ex_urls);
                    $scope.cross_sites_area = convertIpArea(dataConfig[0].cross_sites);
                    $scope.open_tranver_area = dataConfig[0].open_tranver;
                    $scope.days_area = dataConfig[0].days;
                }
            });

        };
        $scope.init();

        $scope.onSubmitClickListener = function () {
            //console.log($scope.rule.source);
            var content = "";
            if ($scope.rules[0].source == "") {
                content = "请输入URL地址"
            }
            else {
                content = "设置保存成功"
                var uid = $cookieStore.get("uid");
                var site_id = $rootScope.siteId;//从conf_sites中获取
                var query = "/config/conf?index=0&type=search&query={\"uid\":\"" + uid + "\",\"site_id\":\"" + site_id + "\"}";
                $http({
                    method: 'GET',
                    url: query
                }).success(function (dataConfig, status) {
                    if (dataConfig == null || dataConfig.length == 0) {//不存在配置 save
                        var entity = "{\"uid\":\"" + uid + "\",\"site_id\":\"" + site_id + "\",\"rules\":" + angular.toJson($scope.rules) + ",\"ex_ips\":[\"" + $scope.ex_ips_area.tText.replace(/\n/g, "\",\"") + "\"],\"ex_refer_urls\":[\""
                            + $scope.ex_refer_urls_area.tText.replace(/\n/g, "\",\"") + "\"],\"ex_urls\":[\"" + $scope.ex_urls_area.tText.replace(/\n/g, "\",\"") + "\"],\"cross_sites\":[\"" + $scope.cross_sites_area.tText.replace(/\n/g, "\",\"") + "\"]}";
                        //console.log(entity);
                        var url = "/config/conf?index=0&type=save&entity=" + entity;
                        $http({
                            method: 'GET',
                            url: url
                        }).success(function (dataConfig, status) {

                        });
                    } else {//update
                        var updates = "{\"uid\":\"" + uid + "\",\"site_id\":\"" + site_id + "\",\"rules\":" + angular.toJson($scope.rules) + ",\"ex_ips\":[\"" + $scope.ex_ips_area.tText.replace(/\n/g, "\",\"") + "\"],\"ex_refer_urls\":[\""
                            + $scope.ex_refer_urls_area.tText.replace(/\n/g, "\",\"") + "\"],\"ex_urls\":[\"" + $scope.ex_urls_area.tText.replace(/\n/g, "\",\"") + "\"],\"cross_sites\":[\"" + $scope.cross_sites_area.tText.replace(/\n/g, "\",\"") + "\"]}";
                        //console.log(updates);
                        var url = "/config/conf?index=0&type=update&query={\"uid\":\"" + uid + "\",\"site_id\":\"" + site_id + "\"}&updates=" + updates;
                        $http({
                            method: 'GET',
                            url: url
                        }).success(function (dataConfig, status) {

                        });

                    }

                });
            }
            $scope.urlDialog = ngDialog.open({
                template: '<div class="ngdialog-buttons" ><div class="ngdialog-tilte">来自网页的消息</div><ul class="admin-ng-content" ><li>' + content + '</li></ul>' +
                ' <div class="ng-button-div"><button type="button" class="ngdialog-button ng-button" ng-click="closeThisDialog()">确定</button></div></div>',
                className: 'ngdialog-theme-default admin_ngdialog',
                plain: true,
                scope: $scope
            });


        };


        $scope.addRule = function (o) {
            o.push({});
        };

        $scope.addIP = function (e, obj) {
            var f = e.currentTarget;
            var d = f.value.replace(/\r/gi, "");
            var s = d.split("\n").length;
            var g = d.split("\n");
            var num = "";
            var reg = /((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))/g;

            for (var i = 0; i < s; i++) {
                num += (i + 1) + "\r\n";
            }
            $scope.IPtishi = function (content) {
                if (content == "") {
                    $scope.IPshow = false;
                } else {
                    $scope.IPshow = true;
                }
                $(e.target).parent().find("span").empty();
                $(e.target).parent().find("span").append(content);
            };
            for (var z = 0; z < g.length; z++) {
                var c = g[z];
                if (s > 20) {
                    $scope.IPtishi("您最多可输入20个");
                }else if(g[z]=="" && g[z+1]=="") {
                    $scope.IPtishi("请依次输入IP");
                    break;
                }  else if (g[z] == ""  ) {
                    $scope.IPtishi("");
                }
                else {
                    if (!c.match(reg)) {
                        $scope.IPtishi("您设置的IP格式错误");
                        break;
                    }
                    else {
                        $scope.IPtishi("");
                    }
                }

            }

            obj.count = s;
            obj.tNum = num;
            obj.tText = f.value;
            $(f.previousElementSibling).scrollTop(f.scrollTop);


        };

        $scope.myFocus = function (obj) {
            obj.helpFlag = true;
        };
        $scope.myBlur = function (obj, id) {
            obj.helpFlag = false;

            if (id != undefined) {
                //if(id.$error.sshUrl!=undefined){
                for (var i = 0; i <= 9; i++) {
                    if (id['source' + i].$error.sshUrl == true || id['convert' + i].$error.sshUrl == true) {
                        $scope.show = true;
                        break;
                    } else {
                        $scope.show = false
                    }
                }
            }
        };

        var convertIpArea = function (ips) {
            var ips_area = angular.copy($scope.ipArea);
            ips_area.tNum = "";
            for (var i = 0; i < ips.length; i++) {
                ips_area.tNum += (i + 1) + "\r\n";
            }
            ips_area.count = ips.length;
            ips_area.tText = ips.toString().replace(/\,/g, "\n");
            return ips_area;
        };
        //域名验证


        Custom.initCheckInfo();//页面check样式js调用
    });
});