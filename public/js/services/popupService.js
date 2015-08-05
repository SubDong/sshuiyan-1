/**
 * Created by dolphineor on 2015-5-21.
 */

define(["../app"], function (app) {
    'use strict';
    app.service('popupService', ['$rootScope', 'ngDialog', function ($rootScope, ngDialog) {

        // 获取指定url的来源分布情况
        function showSourceData(kw) {
            ngDialog.open({
                template: '<div id="url-source-distribution"  style="overflow: hidden"><div class="modal-header source-modal-header">查看  <font color="red">' + kw + '</font>' + '  的搜索来路URL</div></div>',
                plain: true,
                className: 'ngdialog-theme-default',
                scope: $rootScope,
                controller: ['$scope', '$http', '$compile', function ($scope, $http, $compile) {
                    $http({
                        method: 'GET',
                        url: "/api/indextable/?start=" + $rootScope.start + "&end=" + $rootScope.end + "&type=" + $rootScope.defaultType + "&indic=vc&dimension=rf&popup=1" + "&filerInfo=[{\"kw\":[\"" + kw + "\"]}]"
                    }).success(function (data, status) {
                        var contentHtml = "<div class='modal-body source_modal_body'><table class='table'><tr><th>次数</th><th>搜索链接</th></tr>";
                        data.forEach(function (item, i) {
                            if (i == 10) {
                                return false;
                            }
                            var _url = item.rf;
                            var _index = _url.indexOf('?') + 20;
                            if (_index < _url.length) {
                                _url = _url.substring(0, _index) + "...";
                            }
                            contentHtml += "<tr><td>" + item.vc + "</td><td><a href='" + item.rf + "'>" + _url + "</a></td></tr>"
                        });
                        contentHtml += "</table></div>";
                        angular.element(document.getElementById('url-source-distribution')).append($compile(contentHtml)($scope));
                    }).error(function (error) {
                        console.log(error);
                    });
                }]
            });
        }

        // 获取指定url为来源的入口页面
        function showEntryPageData(rf) {
            var filerInfo = "";
            if (rf == "直接访问") {
                filerInfo = "[{\"rf_type\": [\"1\"]}]";
            } else if (rf == "搜索引擎") {
                filerInfo = "[{\"rf_type\": [\"2\"]}]";
            } else if (rf == "外部链接") {
                filerInfo = "[{\"rf_type\": [\"3\"]}]";
            } else if (rf.indexOf("http") != -1) {
                if (rf.lastIndexOf("/") == rf.length - 1) {
                    rf = rf.substring(0, rf.length - 1);
                }
                filerInfo = "[{\"dm\": [\"" + rf + "\"]}]";
            } else {
                filerInfo = "[{\"se\": [\"" + rf + "\"]}]";
            }
            ngDialog.open({
                template: '<div id="url-source-distribution"  style="overflow: hidden"><div class="modal-header source_modal_header">查看以  <font color="red">' + rf + '</font>' + '  为来源的入口页面</div></div>',
                plain: true,
                className: 'ngdialog-theme-default',
                scope: $rootScope,
                controller: ['$scope', '$http', '$compile', function ($scope, $http, $compile) {
                    $http({
                        method: 'GET',
                        url: "/api/index_summary/?start=" + $rootScope.start + "&end=" + $rootScope.end + "&type=" + $rootScope.defaultType + "&indic=pv&dimension=loc" + "&filerInfo=" + filerInfo
                    }).success(function (data, status) {
                        var obj = JSON.parse(eval('(' + data + ')').toString())
                        var contentHtml = "<div class='modal-body source_modal_body'><table class='table'><tr><th>排名</th><th>入口页链接</th></tr>";
                        obj.forEach(function (item, i) {
                            item.key.forEach(function (ik_r, _i) {
                                if (_i == 10) {
                                    return false;
                                }
                                var _url = ik_r;
                                var _index = _url.indexOf('?') + 20;
                                if (_index > _url.length) {
                                    _url = _url.substring(0, _index) + "...";
                                }
                                contentHtml += "<tr><td>" + (_i + 1) + "</td><td><a href='" + ik_r + "' target='_blank'>" + _url + "</a></td></tr>"
                            });
                        });
                        contentHtml += "</table></div>";
                        angular.element(document.getElementById('url-source-distribution')).append($compile(contentHtml)($scope));
                    }).error(function (error) {
                        console.log(error);
                    });
                }]
            });
        }

        /**
         * 入口页面的来源分布
         * @param entrance
         */
        function showSourceDistributionData(entrance) {
            ngDialog.open({
                template: "<div style=\'overflow: hidden\' class=\'pop_title\'><ul>" +
                "<li ng-click=\'showCategory()\' ng-class=\"{'current':liexingClass}\">来源类型</li>" +
                "<li ng-click=\'showUrl()\' ng-class=\"{'current':laiyuanClass}\">来源URL</li>" +
                "</ul><div id=\"source_box\"></div></div>",
                plain: true,
                className: 'ngdialog-theme-default',
                scope: $rootScope,
                controller: ['$scope', '$http', '$compile', function ($scope, $http, $compile) {
                    $scope.liexingClass = true;
                    $scope.showUrl = function () {
                        $scope.liexingClass = false;
                        $scope.laiyuanClass = true;
                        $http({
                            method: 'GET',
                            url: "/api/indextable/?start=" + $rootScope.start + "&end=" + $rootScope.end + "&type=" + $rootScope.defaultType + "&indic=contribution,pv&dimension=rf&popup=1" + "&filerInfo=[{\"entrance\":[\"" + entrance + "\"]}]"
                        }).success(function (data, status) {
                            var contentHtml = "<div class='modal-body'><table class='table'><tr><th>来源URL TOP10</th><th>来源次数</th><th>带来浏览量</th></tr>";
                            data.forEach(function (item, i) {
                                if (i == 10) {
                                    return false;
                                }
                                var _url = item.rf;
                                var _index = _url.indexOf('?') + 20;
                                if (_index < _url.length) {
                                    _url = _url.substring(0, _index) + "...";
                                }
                                contentHtml += "<tr><td><a href='" + item.rf + "'>" + _url + "</a></td><td>" + item.contribution + "</td><td>" + item.pv + "</td></tr>"
                            });
                            contentHtml += "</table></div>";
                            var sourceUrl = angular.element(document.getElementById('source_box'));
                            sourceUrl.find("div").remove();
                            sourceUrl.append($compile(contentHtml)($scope));
                        }).error(function (error) {
                            console.log(error);
                        });
                        if (document.getElementById('source_box') != null) {
                            angular.element(document.getElementById('source_box').getElementsByTagName("div")).css("display", "none");
                        }
                    };

                    $scope.showCategory = function () {
                        $scope.laiyuanClass = false;
                        $scope.liexingClass = true;
                        $http({
                            method: 'GET',
                            url: "/api/indextable/?start=" + $rootScope.start + "&end=" + $rootScope.end + "&type=" + $rootScope.defaultType + "&indic=contribution&dimension=rf_type&popup=1" + "&filerInfo=[{\"entrance\":[\"" + entrance + "\"]}]"
                        }).success(function (data, status) {
                            var contentHtml = "<div class='modal-body'><table class='table'>";
                            var result = 0;
                            var _direct = 0;
                            var _search = 0;
                            var _other = 0;
                            data.forEach(function (item, i) {
                                switch (item.rf_type) {
                                    case "直接访问":
                                        _direct = item.contribution;
                                        result += parseFloat(_direct);
                                        break;
                                    case "搜索引擎":
                                        _search = item.contribution;
                                        result += parseFloat(_search);
                                        break;
                                    case "外部链接":
                                        _other = item.contribution;
                                        result += parseFloat(_other);
                                        break;
                                    default :
                                        break;
                                }

                            });

                            if (result === 0) {
                                contentHtml += "<tr><td>外部链接</td><td>0%</td></tr>";
                                contentHtml += "<tr><td>直接访问</td><td>0%</td></tr>";
                                contentHtml += "<tr><td>搜索引擎</td><td>0%</td></tr>";
                            } else {
                                contentHtml += "<tr><td>外部链接</td><td>" + (parseFloat(_other) / parseFloat(result) * 100).toFixed(2) + "%</td></tr>";
                                contentHtml += "<tr><td>直接访问</td><td>" + (parseFloat(_direct) / parseFloat(result) * 100).toFixed(2) + "%</td></tr>";
                                contentHtml += "<tr><td>搜索引擎</td><td>" + (parseFloat(_search) / parseFloat(result) * 100).toFixed(2) + "%</td></tr>";
                            }

                            contentHtml += "</table></div>";
                            var sourceCategory = angular.element(document.getElementById('source_box'));
                            sourceCategory.find("div").remove();
                            sourceCategory.append($compile(contentHtml)($scope));
                        }).error(function (error) {
                            console.log(error);
                        });

                        if (document.getElementById('source_box') != null) {
                            angular.element(document.getElementById('source_box').getElementsByTagName("div")).css("display", "none");
                        }
                    };

                    $scope.showCategory();
                }]
            });
        }

        return {
            showSourceData: showSourceData,
            showEntryPageData: showEntryPageData,
            showSourceDistributionData: showSourceDistributionData
        }

    }]);
});