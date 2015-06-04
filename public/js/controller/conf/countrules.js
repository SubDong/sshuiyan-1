define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('countrules', function ($scope, $http,$rootScope,$cookieStore) {


        //规则IP
        $scope.rules =[{
            source:"",
            convert:""
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
        $scope.ex_urls_area =angular.copy($scope.ipArea);//排除受访域名
        $scope.cross_sites_area =angular.copy($scope.ipArea);//跨域监控
        $scope.open_tranver_area =angular.copy($scope.ipArea);
        $scope.days_area =angular.copy($scope.ipArea);

        /**
         * 数据初始化
         */
        $scope.init= function(){
            var uid= $cookieStore.get("uid");
            var site_id=$rootScope.userType;
            var url= "/api/config?index=0&type=search&query={\"uid\":\""+uid+"\",\"site_id\":\""+site_id+"\"}";
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                console.log("获取配置结果"+status);
                if(dataConfig!=null){
                    $scope.rules = dataConfig[0].rules;
                    $scope.ex_ips_area =convertIpArea(dataConfig[0].ex_ips);
                    $scope.ex_refer_urls_area= convertIpArea(dataConfig[0].ex_refer_urls);
                    $scope.ex_urls_area= convertIpArea(dataConfig[0].ex_urls);
                    $scope.cross_sites_area= convertIpArea(dataConfig[0].cross_sites);
                    $scope.open_tranver_area= dataConfig[0].open_tranver;
                    $scope.days_area= dataConfig[0].days;
                }
            });

        };
        $scope.init();

        $scope.onSubmitClickListener = function (){
            var uid= $cookieStore.get("uid");
            var site_id=$rootScope.userType;//从conf_sites中获取
            var query= "/api/config?index=0&type=search&query={\"uid\":\""+uid+"\",\"site_id\":\""+site_id+"\"}";
            $http({
                method: 'GET',
                url: query
            }).success(function (dataConfig, status) {
                if(dataConfig==null||dataConfig.length==0){//不存在配置 save
                    var entity= "{\"uid\":\""+uid+"\",\"site_id\":\""+site_id+"\",\"rules\":"+ angular.toJson($scope.rules)+",\"ex_ips\":[\""+$scope.ex_ips_area.tText.replace(/\n/g,"\",\"")+"\"],\"ex_refer_urls\":[\""
                        + $scope.ex_refer_urls_area.tText.replace(/\n/g,"\",\"")+"\"],\"ex_urls\":[\""+ $scope.ex_urls_area.tText.replace(/\n/g,"\",\"")+"\"],\"cross_sites\":[\""+ $scope.cross_sites_area.tText.replace(/\n/g,"\",\"")+"\"]}";
                    console.log(entity);
                    var url= "/api/config?index=0&type=save&entity="+entity;
                    $http({
                        method: 'GET',
                        url: url
                    }).success(function (dataConfig, status) {

                    });
                }else{//update
                    var updates= "{\"uid\":\""+uid+"\",\"site_id\":\""+site_id+"\",\"rules\":"+ angular.toJson($scope.rules)+",\"ex_ips\":[\""+$scope.ex_ips_area.tText.replace(/\n/g,"\",\"")+"\"],\"ex_refer_urls\":[\""
                        + $scope.ex_refer_urls_area.tText.replace(/\n/g,"\",\"")+"\"],\"ex_urls\":[\""+ $scope.ex_urls_area.tText.replace(/\n/g,"\",\"")+"\"],\"cross_sites\":[\""+ $scope.cross_sites_area.tText.replace(/\n/g,"\",\"")+"\"]}";
                    console.log(updates);
                    var url= "/api/config?index=0&type=update&query={\"uid\":\""+uid+"\",\"site_id\":\""+site_id+"\"}&updates="+updates;
                    $http({
                        method: 'GET',
                        url: url
                    }).success(function (dataConfig, status) {

                    });

                }

            });

        };
        //
        //$scope.addRule = function () {
        //    $scope.rules.push({source:"",convert:""});
        //////};
        ////点击效果
        //$scope.obj = {
        //    "tNum": "1",
        //    "tText": "",
        //    "count": 1,
        //    "helpFlag": false
        //};
        //$scope.ipObj = angular.copy($scope.obj);
        //$scope.tyymdzObj = angular.copy($scope.obj);
        //$scope.pclywzObj =angular.copy($scope.obj);
        //$scope.pcsfwzobj =angular.copy($scope.obj);
        //$scope.gyjkobj =angular.copy($scope.obj);
        //$scope.qdcxzhobj =angular.copy($scope.obj);
        //$scope.ips = [];
        //$scope.init = function () {
        //    var ips = new Array(20);
        //    for (var i = 0; i < ips.length; i++) {
        //        ips[i] = {
        //            "id": ""
        //        };
        //        $scope.ips.push(ips[i]);
        //    }
        //};
        //$scope.init();
        //    $scope.addRule = function (o) {
            //点击效果
            //$scope.obj = {
            //    "tNum": "1",
            //    "tText": "",
            //    "count": 1,
            //    "helpFlag": false
            //};
            //$scope.ipObj = angular.copy($scope.obj);
            //$scope.tyymdzObj = angular.copy($scope.obj);
            //$scope.pclywzObj = angular.copy($scope.obj);
            //$scope.pcsfwzobj = angular.copy($scope.obj);
            //$scope.gyjkobj = angular.copy($scope.obj);
            //$scope.qdcxzhobj = angular.copy($scope.obj);
            //$scope.ips = [];

            $scope.addRule = function (o) {
                o.push({});
            };

            $scope.addIP = function (e, obj) {
                var f = e.currentTarget;
                var d = f.value.replace(/\r/gi, "");
                var s = d.split("\n").length;
                var num = "";
                for (var i = 0; i < s; i++) {
                    num += (i + 1) + "\r\n";
                }
                obj.count = s;
                obj.tNum = num;
                obj.tText = f.value;
                $(f.previousElementSibling).scrollTop(f.scrollTop);
            };

            $scope.myFocus = function (obj) {
                obj.helpFlag = true;
            };

            $scope.myBlur = function (obj) {
                obj.helpFlag = false;
            };

            var convertIpArea = function (ips) {
                var ips_area = angular.copy($scope.ipArea);
                ips_area.tNum = ips.length;
                ips_area.count = ips.length;
                ips_area.tText = ips.toString().replace(/\,/g, "\n");
                return ips_area;
            }

    });
});