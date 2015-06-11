/**
 * Created by Fzk lwek on 2015/6/4.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('adtrack_add', function ($scope, $rootScope, $http, $cookieStore) {
        $scope.ipArea = {
            "tNum": "1",//当前个数？
            "tText": "",//内容
            "count": 1,//个数
            "helpFlag": false//是否显示帮组信息
        };
        $scope.adtrack_add =angular.copy($scope.ipArea);
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


        /**
         * 对应Mongo
         * @type {{uid: string, type_id: string, track_id: string, site_url: string, site_name: string, site_pause: boolean, track_status: string}}
         */
        $scope.adtrack_model = {
            //_id: "", // mongoid
            uid: "", // user id 用户ID
            type_id: "", // es type id ( hidden in front-end) 对应ES ID
            track_id: "", // js track id 随机生成
            targetUrl: "", // 目标URL
            mediaPlatform: "", // 媒体平台
            adTypes: "",    //广告类型
            planName: "", //计划名称
            keywords: "",   //关键词
            creative: "", //创意
            produceUrl: ""
        };
        $scope.urlconfig = {
            targetUrl: "",
            mediaPlatform: "",
            adTypes: "",
            planName: "",
            keywords: "",
            creative: "",
            produceUrl: ""
        };

        /*$scope.parseUrl = function() {
            var strUrl = "http://" + $scope.urlconfig.targetUrl
                + "?hmsr=" + $scope.urlconfig.mediaPlatform
                + "&_hmmd=" + $scope.urlconfig.adTypes
                + "&_hmpl=" + $scope.urlconfig.planName
                + "&_hmkw=" + $scope.urlconfig.keywords
                + "&_hmci=" + $scope.urlconfig.creative;
            return encodeURI(strUrl);
        };*/

        $scope.submit = function () {
            var model = angular.copy($scope.adtrack_model);
            model.targetUrl = $scope.urlconfig.targetUrl;
            model.mediaPlatform = $scope.urlconfig.mediaPlatform;
            model.adTypes = $scope.urlconfig.adTypes;
            model.planName = $scope.urlconfig.planName;
            model.keywords = $scope.urlconfig.keywords;
            model.creative = $scope.urlconfig.creative;
            //model.produceUrl = $scope.parseUrl();
            model.uid = $cookieStore.get("uid");

            var query = "/config/adtrack?type=search&query={\"uid\":\"" + model.uid + "\",\"targetUrl\":\"" + model.targetUrl + "\"}";
            $http({method: 'GET', url: query}).success(function (dataConfig, status) {


                if (dataConfig == null || dataConfig.length == 0) {
                    var url = "/config/adtrack?type=save&entity=" + JSON.stringify(model);
                    $http({method: 'GET', url: url}).success(function (dataConfig, status) {

                    });
                } else {
                    model.type_id = dataConfig.type_id;
                    model.track_id = dataConfig.track_id;
                    if (dataConfig.site_name != model.site_name) {
                        var url = "/config/adtrack?type=update&query={\"uid\":\"" + model.uid + "\",\"targetUrl\":\"" + model.targetUrl + "\"}&updates=" + JSON.stringify(model);
                        $http({method: 'GET', url: url}).success(function (dataConfig, status) {

                        });
                    }
                }
            });
        };
    });
});