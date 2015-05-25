/**
 * create by wei on 2015-05-19
 */
define(["../app"], function (app) {

    'use strict';

    app.service('DefaultQuotaService', ["$rootScope", function ($rootScope) {

        var dqObj = {
            "extension": {
                "way": ["click", "cost", "pv", "uv", "avgTime", "outRate"]
            },
            "trend": {
                "today": ["pv", "uv", "ip", "outRate", "avgTime"]
            },
            "source": {
                "source": ["pv", "uv", "ip", "outRate", "avgTime"]
            },
            "page": {
                "index": ["pv", "uv", "avgTime"]
            }
        };

        var dgObj = {
            "extension": {
                "way": [
                    {name: "点击量", field: "click"},
                    {name: "消费", field: "cost"},
                    {name: "浏览量(PV)", displayName: "浏览量(PV)", field: "pv"},
                    {name: "访客数(UV)", displayName: '访客数(UV)', field: "uv"},
                    {name: "平均访问时长", field: "avgTime"},
                    {name: "跳出率", field: "outRate"}
                ]
            },
            "trend": {
                "today": [
                    {name: "浏览量(PV)", displayName: "浏览量(PV)", field: "pv"},
                    {name: "访客数(UV)", displayName: '访客数(UV)', field: "uv"},
                    {name: "访问IP", displayName: "访问IP", field: "ip"},
                    {name: "跳出率", field: "outRate"},
                    {name: "平均访问时长", field: "avgTime"}
                ]
            },
            "source": {
                "source": [
                    {name: "浏览量(PV)", displayName: "浏览量(PV)", field: "pv"},
                    {name: "访客数(UV)", displayName: '访客数(UV)', field: "uv"},
                    {name: "访问IP", displayName: "访问IP", field: "ip"},
                    {name: "跳出率", field: "outRate"},
                    {name: "平均访问时长", field: "avgTime"}
                ]
            },
            "page": {
                "index": [
                    {name: "浏览量(PV)", displayName: "浏览量(PV)", field: "pv"},
                    {name: "访客数(UV)", displayName: '访客数(UV)', field: "uv"},
                    {name: "平均访问时长", field: "avgTime"}
                ]
            }
        };

        var defaultQuotaArray = ["pv", "uv", "ip"];

        var defaultQuotaGridArray = [
            {name: "浏览量(PV)", displayName: '浏览量(PV)', filed: "pv"},
            {name: "访客数(UV)", displayName: '访客数(UV)', field: "uv"},
            {name: "访问IP", displayName: "访问IP", field: "ip"}
        ];

        function getQuotaByType(t) {
            return getQuota(t.split("_"), dqObj, 0);
        }

        function getQuota(ta, dq, index) {
            if (dq == undefined) {
                return angular.copy(defaultQuotaArray);
            }
            if (ta.length - 1 == index) {
                var temp = ta[index];
                if (dq[temp] && isArray(dq[temp])) {
                    return angular.copy(dq[temp]);
                } else {
                    return angular.copy(defaultQuotaArray);
                }
            }
            var temp = ta[index];
            return getQuota(ta, dq[temp], ++index);
        }

        function getQuotaGridByType(t) {
            return getQuotaGrid(t.split("_"), dgObj, 0);
        }

        function getQuotaGrid(ta, dg, index) {
            if (dg == undefined) {
                return angular.copy(defaultQuotaGridArray);
            }
            if (ta.length - 1 == index) {
                var temp = ta[index];
                if (dg[temp] && isArray(dg[temp])) {
                    return angular.copy(dg[temp]);
                } else {
                    return angular.copy(defaultQuotaGridArray);
                }
            }
            var temp = ta[index];
            return getQuotaGrid(ta, dg[temp], ++index);
        }

        function isArray(o) {
            return Object.prototype.toString.call(o) === '[object Array]';
        }

        //
        function changeQuotaByType(t) {
            switch (t) {
                case "extension_way" :
                {
                    $rootScope.checkedArray = ["click", "cost", "cpc", "pv", "vc", "avgPage"];
                    $rootScope.gridArray = [
                        {name: "推广方式", displayName: "推广方式", field: "accountName"},
                        {
                            name: " ",
                            cellTemplate: "<div class='table_box'><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' class='table_btn'></a></div>"
                        },
                        {name: "点击", displayName: "点击", field: "click"},
                        {name: "消费", displayName: "消费", field: "cost"},
                        {name: "平均点击价格", displayName: "平均点击价格", field: "cpc"},
                        {name: "浏览量(PV)", displayName: "浏览量(PV)", field: "pv"},
                        {name: "访客数(UV)", displayName: "访客数(UV)", field: "vc"},
                        {name: "平均访问页数", displayName: "平均访问页数", field: "avgPage"}
                    ];
                    return;
                }
                case "extension_search" :
                {
                    $rootScope.searchCheckedArray = ["impression", "cost", "cpc", "outRate", "avgTime", "nuvRate"];
                    $rootScope.searchGridArray = [
                        {
                            name: "计划",
                            displayName: "计划",
                            field: "campaignName",
                            cellTemplate: "<a href='javascript:void(0)' style='color:#0965b8;line-height:30px;margin-left: 10px' ng-click='grid.appScope.getHistoricalTrend(this)'>{{grid.appScope.getDataUrlInfo(grid, row,3)}}</a>"
                        },
                        {
                            name: " ",
                            cellTemplate: "<div class='table_box'><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' class='table_btn'></a></div>"
                        },
                        {name: "展现", displayName: "展现", field: "impression"},
                        {name: "消费", displayName: "消费", field: "cost"},
                        {name: "平均点击价格", displayName: "平均点击价格", field: "cpc"},
                        {name: "跳出率", displayName: "跳出率", field: "outRate"},
                        {name: "平均访问时长", displayName: "平均访问时长", field: "avgTime"},
                        {name: "新访客比率", displayName: "新访客比率", field: "nuvRate"}
                    ];
                    return;
                }
                case "trend_today" :
                case "trend_yesterday" :
                case "trend_month" :
                {
                    $rootScope.checkedArray = ["pv", "uv", "ip", "outRate", "avgTime"];
                    $rootScope.gridArray = [
                        {name: "日期", displayName: "日期", field: "period"},
                        {
                            name: " ",
                            cellTemplate: "<div class='table_box'><button onclick='getMyButton(this)' class='table_nextbtn'></button><div class='table_win'><ul style='color: #45b1ec'><li><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' target='_blank'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看来源分布</a></li></ul></div></div>"
                        },
                        {name: "浏览量(PV)", displayName: "浏览量(PV)", field: "pv"},
                        {name: "访客数(UV)", displayName: "访客数(UV)", field: "uv"},
                        {name: "IP数", displayName: "IP数", field: "ip"},
                        {name: "跳出率", displayName: "跳出率", field: "outRate"},
                        {name: "平均访问时长", displayName: "平均访问时长", field: "avgTime"}
                    ];
                    return;
                }
                case "source_source" :
                {
                    $rootScope.checkedArray = ["vc", "nuvRate", "ip"];
                    $rootScope.gridArray = [
                        {name: "来源类型", displayName: "来源类型", field: "rf_type"},
                        {
                            name: " ",
                            cellTemplate: "<div class='table_box'><button onclick='getMyButton(this)' class='table_nextbtn'></button><div class='table_win'><ul><li><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' target='_blank'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看来源分布</a></li></ul></div></div>"
                        },
                        {name: "访问次数", displayName: "访问次数", field: "vc"},
                        {name: "新访客比率", displayName: "新访客比率", field: "nuvRate"},
                        {name: "IP数", displayName: "IP数", field: "ip"}
                    ];
                    return;
                }
                case "source_searchengine" :
                {
                    $rootScope.checkedArray = ["vc", "uv", "nuvRate", "ip", "avgPage"];
                    $rootScope.gridArray = [
                        {name: "搜索引擎", displayName: "搜索引擎", field: "se"},
                        {
                            name: " ",
                            cellTemplate: "<div class='table_box'><button onclick='getMyButton(this)' class='table_nextbtn'></button><div class='table_win'><ul><li><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' target='_blank'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看来源分布</a></li></ul></div></div>"
                        },
                        {name: "访问次数", displayName: "访问次数", field: "vc"},
                        {name: "访客数(UV)", displayName: "访客数(UV)", field: "uv"},
                        {name: "新访客比率", displayName: "新访客比率", field: "nuvRate"},
                        {name: "平均访问页数", displayName: "平均访问页数", field: "avgPage"},
                        {name: "IP数", displayName: "IP数", field: "ip"}
                    ];
                    return;
                }
                case "source_searchterm" :
                {
                    $rootScope.checkedArray = ["pv", "vc", "nuv", "ip"];
                    $rootScope.gridArray = [
                        {name: "搜索词", displayName: "搜索词", field: "kw"},
                        {
                            name: " ",
                            cellTemplate: "<div class='table_box'><button onclick='getMyButton(this)' class='table_nextbtn'></button><div class='table_win'><ul><li><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' target='_blank'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看来源分布</a></li></ul></div></div>"
                        },
                        {name: "浏览量(PV)", displayName: "浏览量(PV)", field: "pv"},
                        {name: "访问次数", displayName: "访问次数", field: "vc"},
                        {name: "新访客数", displayName: "新访客数", field: "nuv"},
                        {name: "IP数", displayName: "IP数", field: "ip"}
                    ];
                    return;
                }
                case "source_externallinks" :
                {
                    $rootScope.checkedArray = ["uv", "nuv", "nuvRate"];
                    $rootScope.gridArray = [
                        {name: "外部连接", displayName: "外部连接", field: "rf"},
                        {
                            name: " ",
                            cellTemplate: "<div class='table_box'><button onclick='getMyButton(this)' class='table_nextbtn'></button><div class='table_win'><ul><li><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' target='_blank'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看来源分布</a></li></ul></div></div>"
                        },
                        {name: "访客数(UV)", displayName: "访客数(UV)", field: "uv"},
                        {name: "新访客数", displayName: "新访客数", field: "nuv"},
                        {name: "新访客比率", displayName: "新访客比率", field: "nuvRate"},
                    ];
                    return;
                }
                case "page_indexoverview" :
                {
                    $rootScope.checkedArray = ["vc", "uv", "avgTime"];
                    $rootScope.gridArray = [
                        {name: "页面url", displayName: "页面url", field: "loc"},
                        {
                            name: " ",
                            cellTemplate: "<div class='table_box'><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' class='table_btn'></a></div>"
                        },
                        {name: "访问次数", displayName: "访问次数", field: "vc"},
                        {name: "访客数(UV)", displayName: "访客数(UV)", field: "uv"},
                        {name: "平均访问时长", displayName: "平均访问时长", field: "avgTime"}
                    ];
                }
                case "page_entrancepage" :
                {
                    $rootScope.checkedArray = ["pv", "uv", "avgTime"];
                    $rootScope.gridArray = [
                        {name: "页面url", displayName: "页面url", field: "loc"},
                        {
                            name: " ",
                            cellTemplate: "<div class='table_box'><button onclick='getMyButton(this)' class='table_nextbtn'></button><div class='table_win'><ul><li><a ui-sref='history' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' target='_blank'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看来源分布</a></li></ul></div></div>"
                        },
                        {name: "浏览量(PV)", displayName: "浏览量(PV)", field: "pv"},
                        {name: "访客数(UV)", displayName: "访客数(UV)", field: "uv"},
                        {name: "平均访问时长", displayName: "平均访问时长", field: "avgTime"}
                    ];
                }
            }
        }

        return {
            getQuotaByType: getQuotaByType,
            getQuotaGridByType: getQuotaGridByType,
            changeQuotaByType: changeQuotaByType
        }
    }]);

});