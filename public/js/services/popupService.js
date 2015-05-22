/**
 * Created by dolphineor on 2015-5-21.
 */

define(["../app"], function (app) {
    'use strict';
    app.service('popupService', ['$rootScope', 'ngDialog', function ($rootScope, ngDialog) {

        // 获取指定url的来源分布情况
        this.showSourceData = function (kw) {
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
                        var contentHtml = "<div class='modal-body'><ul><li><div>次数</div><div>搜索链接</div></li>";
                        data.forEach(function (item, i) {
                            if (i == 10) {
                                return false;
                            }
                            var _url = item.rf;
                            var _index = _url.indexOf('?') + 20;
                            if (_index < _url.length) {
                                _url = _url.substring(0, _index) + "...";
                            }
                            contentHtml += "<li><div>" + item.vc + "</div><div><a href='" + item.rf + "'>" + _url + "</a></div></li>"
                        });
                        contentHtml += "</ul></div>";
                        angular.element(document.getElementById('url-source-distribution')).append($compile(contentHtml)($scope));
                    }).error(function (error) {
                        console.log(error);
                    });
                }]
            });
        };

    }]);
});