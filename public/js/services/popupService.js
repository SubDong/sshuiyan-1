/**
 * Created by dolphineor on 2015-5-21.
 */

define(["../app"], function (app) {
    'use strict';
    app.service('popupService', ['$rootScope', 'ngDialog', function ($rootScope, ngDialog) {

        // 获取指定url的来源分布情况
        function showSourceData(kw) {
            ngDialog.open({
                template: '<div id="url-source-distribution"  style="overflow: hidden"><div class="modal-header">查看  <font color="red">' + kw + '</font>' + '  的搜索来路URL</div></div>',
                plain: true,
                className: 'ngdialog-theme-default',
                scope: $rootScope,
                controller: ['$scope', '$http', '$compile', function ($scope, $http, $compile) {
                    $http({
                        method: 'GET',
                        url: "/api/indextable/?start=" + $rootScope.start + "&end=" + $rootScope.end + "&type=" + $rootScope.defaultType + "&indic=vc&dimension=rf&popup=1" + "&filerInfo=[{\"kw\":[\"" + kw + "\"]}]"
                    }).success(function (data, status) {
                        var contentHtml = "<div class='modal-body'><table class='table'><tr><th>次数</th><th>搜索链接</th></tr>";
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
        };

        // 获取指定url为来源的入口页面
        function showEntryPageData(rf) {
            console.log(rf);
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
            console.log(filerInfo);
            ngDialog.open({
                template: '<div id="url-source-distribution"  style="overflow: hidden"><div class="modal-header">查看以  <font color="red">' + rf + '</font>' + '  为来源的入口页面</div></div>',
                plain: true,
                className: 'ngdialog-theme-default',
                scope: $rootScope,
                controller: ['$scope', '$http', '$compile', function ($scope, $http, $compile) {
                    $http({
                        method: 'GET',
                        url: "/api/summary/?start=" + $rootScope.start + "&end=" + $rootScope.end + "&type=" + $rootScope.defaultType + "&quotas=pv&dimension=entrance" + "&filerInfo=" + filerInfo
                    }).success(function (data, status) {
                        var obj = JSON.parse(eval('(' + data + ')').toString())
                        var contentHtml = "<div class='modal-body'><table class='table'><tr><th>排名</th><th>入口页链接</th></tr>";
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
        };

        return {
            showSourceData: showSourceData,
            showEntryPageData: showEntryPageData
        }

    }]);
});