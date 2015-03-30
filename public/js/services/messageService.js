/**
 * Created by baizz on 2015-3-30.
 */

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