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
                        url: "/api/indextable/?start=" + $rootScope.start + "&end=" + $rootScope.end + "&type=2&indic=vc&dimension=rf&popup=1" + "&filerInfo=[{\"kw\":[\"" + kw + "\"]}]"
                    }).success(function (data, status) {
                        console.log(JSON.stringify(data));
                        angular.element(document.getElementById('url-source-distribution')).append($compile("<div class='modal-body'><ul><li>出来了哇</li></ul></div>")($scope));
                    }).error(function (error) {
                        console.log(error);
                    });
                }]
            });
        };

    }]);
});