define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('countrules', function ($scope, $http,$rootScope) {

        $scope.rules =[{
            source:"",
            convert:""
        }];
        //排除IP
        $scope.ex_ips=[];
        //排除来源域名
        $scope.ex_refer_urls=[];
        //排除受访域名
        $scope.ex_urls=[];
        //跨域监控
        $scope.cross_sites=[];
        //启用长效转化
        $scope.open_tranver=false;
        //访客点击广告后天数
        $scope.days=1;
        $scope.onSubmitClickListener = function (){
            //console.log($scope.rules[0].source+"**********************"+$scope.rules[0].convert);
            //console.log("**********************"+$scope.ex_ips[0]);
            //console.log("**********************"+$scope.open_tranver);
            //console.log("**********************"+$scope.days);

            console.log(JSON.stringify($scope.rules));
            var strrules = "[";
            $scope.rules.forEach(function (rule, i){
                strrules=strrules+"{\"source\":\""+rule.source+"\",\"convert\":\""+rule.convert+"\"}";
                if(i<$scope.rules.length-1){
                    strrules=strrules+",";
                }
            });
            strrules=strrules+"]";
            //console.log(strrules);
            console.log(JSON.stringify($scope.rules));
            //console.log(JSON.stringify($scope.ex_ips));
            var uid= "test_uid2";
            var site_id="test_site_id2";
            var entity= "{\"uid\":\""+uid+"\",\"site_id\":\""+site_id+"\",\"rules\":"+ strrules+",\"ex_ips\":"+JSON.stringify($scope.ex_ips)+",\"ex_refer_urls\":"
                + JSON.stringify($scope.ex_refer_urls)+",\"ex_urls\":"+ JSON.stringify($scope.ex_urls)+",\"cross_sites\":"+ JSON.stringify($scope.cross_sites)+"}";
            console.log(entity);
            var url= "/api/config?index=0&type='saveOrUpdate'&entity="+entity;

            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                console.log("配置保存结果"+status);
            });
            $scope.clear();
        };


        $scope.clear = function (){
            $scope.rules =[{
                source:"",
                convert:""
            }];

            $scope.ex_ips=[];

            $scope.ex_refer_urls=[];

            $scope.ex_urls=[];

            $scope.cross_sites=[];

            $scope.open_tranver=false;

            $scope.days=1;
        };
        $scope.addRule = function () {
            $scope.rules.push({source:"",convert:""});
        };
    });
});