/**
 * Created by weims on 2015/5/15.
 */
define(["../app"], function (app) {
    'use strict';
    app.service('messageService', ['$rootScope', 'ngDialog', function ($rootScope, ngDialog) {
        $rootScope.message = "";

        this.alertMsg = function (message) {
            $rootScope.message = message;
            ngDialog.open({
                template: 'alertMsgDialog',
                className: 'ngdialog-theme-default',
                scope: $rootScope
            });
        };
    }]);
});
