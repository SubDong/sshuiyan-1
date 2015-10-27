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
        $scope.adtrack_add = angular.copy($scope.ipArea);
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
         * 初始化 entity
         * @type {{uid: string, site_id: string, targetUrl: string, mediaPlatform: string, adTypes: string, planName: string, keywords: string, creative: string, produceUrl: string}}
         */
        $scope.adtrack_model = {
            uid: "",            //用户ID
            site_id: "",        //站点ID
            targetUrl: "",      //目标URL
            mediaPlatform: "",  //媒体平台
            adTypes: "",        //广告类型
            planName: "",       //计划名称
            keywords: "",       //关键词
            creative: "",       //创意
            produceUrl: "",      //生成的URL
            tid: ""
        };

        /**
         * 接收页面输入的值
         * @type {{targetUrl: string, mediaPlatform: string, adTypes: string, planName: string, keywords: string, creative: string}}
         */
        $scope.adTrack = {
            targetUrl: "",
            mediaPlatform: "",
            temMediaPlatform: "", /*暂存的mediaPlatform*/
            adTypes: "",
            temAdTypes: "", /*暂存的adTypes*/
            planName: "",
            keywords: "",
            creative: ""
        };

        /**
         * 去重
         * @returns {Array}
         */
        Array.prototype.unique = function () {
            var res = [];
            var json = {};
            for (var i = 0; i < this.length; i++) {
                if (!json[this[i]]) {
                    res.push(this[i]);
                    json[this[i]] = 1;
                }
            }
            return res;
        }

        /**
         * 根据 keywords 来进行回车符换行拆分
         */
        $scope.allSubmit = function () {
            var kVal = $scope.adTrack.keywords;
            var includeObj = kVal.indexOf("\\n");
            if (includeObj < -1) {
                $scope.submit();
            } else {
                var kVal2 = $scope.adTrack.keywords;
                var splArray = kVal2.split("\n").unique();  //拆分回车换行符并去重
                for (var i = 0; i < splArray.length; i++) {
                    var kwObj = splArray[i];
                    $scope.submit(kwObj);
                }
            }
        };

        /**
         * show URL
         */
        $scope.keywordsWrap = function () {
            $scope.str = function (kw) {
                var strUrl = "";
                var sourceUrl = $scope.adTrack.targetUrl;
                var yesParam = "?rf=" + $scope.adTrack.mediaPlatform;
                var noParam = "&rf=" + $scope.adTrack.mediaPlatform;
                var notHostName = "&media=" + $scope.adTrack.adTypes
                    + "&cpna=" + $scope.adTrack.planName
                    + "&kwna=" + kw
                    + "&crt=" + $scope.adTrack.creative
                    + "&t=" + $rootScope.siteTrackId
                    + "&atk=1"
                    + "&tt=0";

                if (sourceUrl != null && sourceUrl != "") {
                    if (sourceUrl.indexOf("?") == -1) {
                        if (sourceUrl.indexOf("http://") == -1) {
                            strUrl = "http://" + sourceUrl + yesParam + notHostName;
                        } else {
                            strUrl = sourceUrl + yesParam + notHostName;
                        }

                    } else {
                        if (sourceUrl.indexOf("http://") == -1) {
                            strUrl = "http://" + sourceUrl + noParam + notHostName;
                        } else {
                            strUrl = sourceUrl + noParam + notHostName;
                        }
                    }
                }
                return encodeURI(strUrl.trim());
            }

            var kVal2 = $scope.adTrack.keywords;
            var splArray = kVal2.split("\n").unique();  //拆分回车换行符并去重
            $scope.ssssss = "";

            for (var i = 0; i < splArray.length; i++) {
                var kw = splArray[i];
                $scope.ssssss += $scope.str(kw) + "\n";
            }
        };

        /**
         * 返回列表
         */
        $scope.onCancel = function () {
            $state.go('adtrack');
        };

        /**
         * 继续添加
         */
        $scope.addAdTrack = function () {
            window.location.reload();
        };

        $scope.submit = function (obj) {
            var model = angular.copy($scope.adtrack_model);
            model.targetUrl = $scope.adTrack.targetUrl;
            model.mediaPlatform = $scope.adTrack.mediaPlatform;
            model.adTypes = $scope.adTrack.adTypes;
            model.planName = $scope.adTrack.planName;
            model.keywords = obj;
            model.creative = $scope.adTrack.creative;
            model.site_id = $rootScope.siteId;
            model.uid = $cookieStore.get("uid")
            model.tid = $rootScope.siteTrackId;

            //保存
            var url = "/config/adtrack?type=save&entity=" + JSON.stringify(model);
            $http({method: 'GET', url: url}).success(function (dataConfig, status) {

            });
        };

        /**
         * 清除 form 表单输入的内容
         */
        $scope.clear = function () {
            $scope.urlDialog = ngDialog.open({
                template: '<div class="ngdialog-buttons" ><div class="ngdialog-tilte">来自网页的消息</div><ul class="admin-ng-content"><li>  您确认要清空当前填写的内容吗？</li></ul>' + '<div class="ng-button-div"><button type="button" class="ngdialog-button ng-button " ng-click="sureClear()">确认</button>\
                  <button type="button" class="ngdialog-button ngdialog-button-secondary " ng-click="closeThisDialog(0)">取消</button></div></div>',
                className: 'ngdialog-theme-default admin_ngdialog',
                plain: true,
                scope: $scope
            });
            //var isNoClear = confirm("您确认要清空当前填写的内容吗？");
            $scope.sureClear = function () {
                //document.getElementById('adTrackForm').reset();
                window.location.reload();
            }
        };

        /**
         * 高级选项
         */
        $scope.advancedOpt = function (obj, type) {
            if (type == 1) {
                if (obj.name == "其他") {
                    $scope.adTrack.mediaPlatform = "";
                    document.getElementById("mediaPlatform").removeAttribute("disabled");
                    document.getElementById("mediaPlatform").focus();
                } else if (obj == "other") {
                    $scope.adTrack.mediaPlatform = $scope.adTrack.temMediaPlatform;
                } else {
                    document.getElementById("mediaPlatform").setAttribute("disabled", "disabled");
                    $scope.adTrack.mediaPlatform = obj.name;
                }
                if ($scope.adTrack.mediaPlatform != null && $scope.adTrack.mediaPlatform != "") {
                    for (var i = 0; i < 4; i++) {
                        document.getElementsByClassName("adTypes")[i].removeAttribute("disabled")
                    }
                } else {
                    for (var j = 0; j < 4; j++) {
                        document.getElementsByClassName("adTypes")[j].setAttribute("disabled", "disabled");
                    }
                }
            } else if (type == 2) {
                if (obj == "其他") {
                    $scope.adTrack.adTypes = "";
                    document.getElementById("adTypes").removeAttribute("disabled");
                    document.getElementById("adTypes").focus();
                } else if (obj == "other") {
                    $scope.adTrack.adTypes = document.getElementById("adTypes").value;
                } else {
                    $scope.adTrack.adTypes = obj;
                    document.getElementById("adTypes").setAttribute("disabled", "disabled")
                }
                if ($scope.adTrack.adTypes != null && $scope.adTrack.adTypes != "") {
                    document.getElementById("planName").removeAttribute("disabled");
                } else {
                    document.getElementById("planName").setAttribute("disabled", "disabled");
                }
            } else if (type == 3) {
                if ($scope.adTrack.planName != null && $scope.adTrack.planName != "") {
                    document.getElementById("keywords").removeAttribute("disabled");
                } else {
                    document.getElementById("keywords").setAttribute("disabled", "disabled");
                }
            } else if (type == 4) {
                if ($scope.adTrack.keywords != "" && $scope.adTrack.keywords != null) {
                    document.getElementById("creative").removeAttribute("disabled");
                } else {
                    document.getElementById("creative").setAttribute("disabled", "disabled");
                }
            }


            /*if($scope.adTrack.adTypes == null || $scope.adTrack.adTypes == ""){
             document.getElementById("planName").disabled = "disabled";
             }else{
             document.getElementById("planName").disabled = "";
             }
             if($scope.adTrack.planName == null || $scope.adTrack.planName == ""){
             document.getElementById("keywords").disabled = "disabled";
             }else{
             document.getElementById("keywords").disabled = "";
             }
             if($scope.adTrack.keywords == null || $scope.adTrack.keywords == ""){
             document.getElementById("creative").disabled = "disabled";
             }else{
             document.getElementById("creative").disabled = "";
             }*/
        };
        //提示
        $scope.fzk = {
            "help": false//是否显示帮组信息
        };
        $scope.targetUrlHelp = {
            "help": false//是否显示帮组信息
        };
        $scope.mediaPlatformhelp = {
            "help": false//是否显示帮组信息
        };
        $scope.addblur = function (obj) {
            obj.help = false;
        };
        $scope.addfocus = function (obj) {
            obj.help = true;
            $scope.mediaPlatformFocus = true;
        };
        Custom.initCheckInfo();//页面check样式js调用
        $scope.adtrack_checked = {};
        $scope.adtrack_checkeds = [
            {name: '搜狐'},
            {name: '新浪'},
            {name: '网易'},
            {name: '博客'},
            {name: '微博'},
            {name: '微信'},
            {name: '贴吧 '},
            {name: '论坛/BBS'},
            {name: '其他'}
        ];
        //$scope.adtrack_checkeds=[  'fzk1', 'fzk2'];

    });
});