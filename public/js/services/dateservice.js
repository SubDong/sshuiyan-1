/**
 * Created by weims on 2015/5/15.
 */
define(["../app"], function (app) {
    'use strict';
    app.service('requestService', ['$rootScope', '$http', function ($rootScope, $http) {
        $rootScope.defaultcb = function (data, chartconfig) {
            cf.renderChart(data, chartconfig);
        }
        //$rootScope.user = "jiehun";
        //$rootScope.baiduAccount = "baidu-bjjiehun2123585";
        //$rootScope.userType = 2;
        $rootScope.start = 0;
        $rootScope.end = 0;
        $rootScope.interval = 1;
        this.refresh = function (charts) {
            charts.forEach(function (chart) {
                chart.config.instance.showLoading({
                    text: "正在努力的读取数据中..."
                });
            });
                charts.forEach(function (e) {
                    var req = e.url + "?type=" + e.types + "&dimension=" + e.dimension + "&start=" + $rootScope.start + "&end=" + $rootScope.end + "&userType=" + $rootScope.userType;
                    if ($rootScope.interval) {
                        req = req + "&int=" + $rootScope.interval;
                    }
                    if (e.filter) {
                        req = req + "&filter=" + e.filter;
                    }
                    if (e.topN) {
                        req += "&topN=" + e.topN;
                    }
                    $http.get(req).success(function (result) {
                        if (e.cb) {
                            e.cb(result, e.config, e);
                        } else {
                            $rootScope.defaultcb(result, e.config, e);
                        }
                    });
                });
        }
        this.gridRefresh = function (grids) {
            grids.forEach(function (grid) {
                $http.get(grid.url + "?start=" + $rootScope.start + "&end=" + $rootScope.end + "&type=" + grid.types + "&dimension=" + grid.dimension + "&userType=" + $rootScope.userType).success(function (data) {
                    var json = JSON.parse((eval("(" + data + ")").toString()));
                    grid.config.gridOptions.data = [];
                    json.forEach(function (item) {
                        for (var i = 0; i < item["key"].length; i++) {
                            var _val = {};
                            if (item["key"][i] != "-" && item["key"][i] != "") {
                                var formatType = grid.types.toString();
                                _val["name"] = item["key"][i];
                                _val["value"] = ad.formatFunc(parseInt(item["quota"][i]), formatType);
                                grid.config.gridOptions.data.push(_val);
                            }
                        }
                    })
                });

            })
        }
    }]);
});
