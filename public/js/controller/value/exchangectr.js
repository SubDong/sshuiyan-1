/**
 * Created by perfection on 2015/5/29.....
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller('exchangectr', function ($cookieStore, $http, $rootScope, $scope) {
            $scope.selectedIndex = 0;
            $scope.start = -1;//时间偏移量开始
            $scope.end = -1;//时间偏移量结束
            $scope.sites = [];
            $scope.exchange = {};
            //对应域名的点击时间，获取该域名下的层级下数据
            $scope.itemClicked = function (page, $index) {
                $http.get("api/exchange?start=" + $scope.start + ",end=" + $scope.end + ",type=" + page.id).success(function (data) {
                    //注：data里面的数据在name、id、pv和uv与page对象的值不同，数据混乱
                    //原因是type的数量与数据查出来的域名数量不符合，数据库有问题
                    $scope.exchange = {
                        name: page.name,
                        id: page.id,
                        pv: page.pv,
                        uv: page.uv,
                        path1: data[0].path1//层级下数据
                    }
                    $scope.exchange_prefix = {
                        name: page.prefix + page.name,
                        id: page.id,
                        pv: page.pv,
                        uv: page.uv,
                        path1: data[0].path1//层级下数据
                    };
                });
                $scope.selectedIndex = $index;
            };

            //获取前天统计数据
            $scope.beforeyesterday = function () {
                $scope.start = -2;
                $scope.end = -2;
                $scope.init();
            }
            //获取昨天统计数据
            $scope.timechange = function ($index) {
                $scope.start = -1;
                $scope.end = -1;
                $scope.init();
            }


            $scope.usites = $cookieStore.get('usites');

            $scope.exchanges = {};
            var ids = "";
            $scope.usites.forEach(function (item, i) {
                $scope.sites.push({
                    name: item.site_name,
                    id: item.site_id
                });
                ids += item.site_id + ";";
            });

            $scope.exchanges = $scope.sites;
            //根据域名type查询pv和uv

            $scope.init = function () {
                $http.get("api/exchange?start=" + $scope.start + ",end=" + $scope.end + ",type=" + ids.substring(0, ids.length - 1)).success(function (data) {
                    $scope.exchanges = dataSave($scope, data);
                    $scope.exchange = {};
                    $scope.exchange = {
                        name: data[0].pathName.replace(/www./g, ""),
                        id: data[0].id,
                        pv: data[0].pv,
                        uv: data[0].uv,
                        path1: data[0].path1
                    };
                    $scope.exchange_prefix = {
                        name: data[0].pathName,
                        id: data[0].id,
                        pv: data[0].pv,
                        uv: data[0].uv,
                        path1: data[0].path1
                    };
                });
            }

            $scope.init();

            $scope.times = [{}];
            $scope.isCollapsed = false;
            $scope.treeclose = true;

        }
    );

});
var dataSave = function ($scope, data) {
    var text = [];
    var replaceString = new RegExp("www.", "g");
    for (var k = 0; k < data.length; k++) {
        var prefix = "";
        if (data[k].pathName.match(/www./g) != null) {
            prefix = "www.";
        }
        text.push({
            name: data[k].pathName.replace(replaceString, ""),
            id: data[k].id,
            pv: data[k].pv,
            uv: data[k].uv,
            path1: data[k].path1,
            prefix: prefix
        });

    }
    return text;
}