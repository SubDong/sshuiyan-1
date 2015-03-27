/**
 * Created by john on 2015/3/25.
 */
app.controller('AccordionDemoCtrl', function ($scope) {
    $scope.oneAtATime = true;
    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function () {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
    };
    $scope.currentMenu = "menuFirst";
    $scope.selectMenu = function (menu) {
        $scope.currentMenu = menu;
    }

});
/*********nav-select*********/
app.controller('ngSelect', function ($scope) {

    var vm = $scope.vm = {};

    //数组对象用来给ng-options遍历
    vm.optionsData = [{
        title : "www.perfect.com"
    },{
        title : "www.perfect.com"
    },{
        title : "www.perfect.com"
    },{
        title : "www.perfect.com"
    }];

})


