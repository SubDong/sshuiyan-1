/**
 * Created by Fzk lwek on 2015/6/4.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('adtrack_add', function ($scope, $rootScope, $http, $cookieStore, $state, ngDialog) {
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

        //初始化 entity
        $scope.adtrack_model = {
            uid: "",            //用户ID
            site_id: "",        //站点ID
            targetUrl: "",      //目标URL
            mediaPlatform: "",  //媒体平台
            adTypes: "",        //广告类型
            planName: "",       //计划名称
            keywords: "",       //关键词
            creative: "",       //创意
            produceUrl: ""      //生成的URL
        };
        //接收页面输入的值
        $scope.urlconfig = {
            targetUrl: "",
            mediaPlatform: "",
            adTypes: "",
            planName: "",
            keywords: "",
            creative: "",
            produceUrl: ""
        };

        //去重
        Array.prototype.unique = function(){
            var res = [];
            var json = {};
            for(var i = 0; i < this.length; i++){
                if(!json[this[i]]){
                    res.push(this[i]);
                    json[this[i]] = 1;
                }
            }
            return res;
        }

        //根据 keywords 来进行回车符换行拆分
        $scope.allSubmit = function(){
            var kVal = $scope.urlconfig.keywords;
            var includeObj = kVal.indexOf("\\n");
            if( includeObj < -1) {
                $scope.submit();
            } else {
                var kVal2 = $scope.urlconfig.keywords;
                var splArray = kVal2.split("\n").unique();  //拆分回车换行符并去重
                for (var i=0 ; i< splArray.length ; i++) {
                    var kwObj = splArray[i];
                    $scope.submit(kwObj);
                }
            }
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

        //返回列表
        $scope.onCancel = function () {
            $state.go('adtrack');
        }
        //继续添加
        $scope.onAdd = function () {
            $state.go('adtrack_add');
        }

        $scope.submit = function (obj) {
            var model = angular.copy($scope.adtrack_model);
            model.targetUrl = $scope.urlconfig.targetUrl;
            model.mediaPlatform = $scope.urlconfig.mediaPlatform;
            model.adTypes = $scope.urlconfig.adTypes;
            model.planName = $scope.urlconfig.planName;
            model.keywords = obj;
            model.creative = $scope.urlconfig.creative;
            //model.produceUrl = $scope.parseUrl();
            model.site_id = $rootScope.siteId;
            model.uid = $cookieStore.get("uid");

            //保存
            var url = "/config/adtrack?type=save&entity=" + JSON.stringify(model);
            if(model.targetUrl == undefined || model.targetUrl == ""){
                return alert("请输入目标URL");
            }else if(model.mediaPlatform == undefined || model.mediaPlatform == ""){
                return alert("请输入媒介平台");
            }else{
                $http({method: 'GET', url: url}).success(function (dataConfig, status) {
                    $scope.urlDialog = ngDialog.open({
                        preCloseCallback: function() {
                            $state.go('adtrack');
                        },
                        template: '\
                        <div class="ngdialog-buttons" >\
                            <span><h4>保存成功</h4></span>\
                        </div>',
                        className: 'ngdialog-theme-default',
                        plain: true,
                        scope: $scope
                    });
                });
            }
        };
    });
});