/**
 * Created by john on 2015/3/25.
 */

/*console.log('init menu.')*/
app.controller('menuctr', function ($scope) {
    $scope.oneAtATime = true;

    $scope.groups = [
        {
            title: '趋向分析 ',
            content: 'Dynamic Group Body - 1',
            template: "<h3>Hello, Directive</h3>"
        },
        {
            title: 'Dynamic Group Header - 2',
            content: 'Dynamic Group Body - 2'
        }
    ];

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


