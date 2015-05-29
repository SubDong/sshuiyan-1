/**
 * Created by weiMS on 2015/5/18.....
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller('exchangectr', function ($cookieStore, $http, $rootScope, $scope) {
            $scope.selectedIndex = 0;
            $scope.start = -1;
            $scope.end = -1;
            $scope.sites = [];
            $scope.itemClicked = function (ui) {
                $scope.exchange = ui;
                $http.get("api/exchange?start=" + $scope.start + ",end=" + $scope.end + ",type=" + ui.id).success(function (data) {
                    $scope.exchanges_ = data
                });
            };
            $scope.beforeyesterday = function () {
                $scope.start = -2;
                $scope.end = -2;
                $scope.init();
            }
            $scope.timechange = function ($index) {
                $scope.start = -1;
                $scope.end = -1;
                $scope.init();
            }


            $scope.usites = $cookieStore.get('usites');
            $scope.sites = [];
            $scope.exchanges = {};
            var ids ="";
            $scope.usites.forEach(function (item, i) {
                //console.log(data[0].pv + "   " + data[0].uv);
                $scope.sites.push({
                    name: item.site_name,
                    id: item.site_id
                });
                ids += item.site_id+";";
            });

            $scope.exchanges = $scope.sites;
            $scope.init = function () {
                $http.get("api/exchange?start=" + $scope.start + ",end=" + $scope.end + ",type=" + ids.substring(0,ids.length-1)).success(function (data) {
                    //for(var k=0;k<$scope.sites.length;k++){
                    //
                    //}
                    $scope.exchanges = dataSave($scope,data);
                    $scope.exchange = {
                        name: $scope.sites[0].name,
                        id: $scope.sites[0].name,
                        pv: data[0].pv,
                        uv: data[0].uv
                    };
                });
                $http.get("api/exchange?start=" + $scope.start + ",end=" + $scope.end + ",type=1" ).success(function (data) {
                    $scope.exchanges_ = data
                });
            }

            $scope.init();

            $scope.times = [{}];
            $scope.isCollapsed = false;
            $scope.treeclose = true;

        }
    );

});
var dataSave = function ($scope,data) {
    var text = [];
    for (var k = 0; k < data.length; k++) {
        text.push({
            name: $scope.sites[k].name,
            id: $scope.sites[k].name,
            pv: data[k].pv,
            uv: data[k].uv
        })
    }
    return text;
}
var exchange = function ($scope, sites) {
    exchange($scope, sites);
}