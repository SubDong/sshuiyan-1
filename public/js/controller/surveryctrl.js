/**
 * Created by john on 2015/3/30.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller('SurveyCtrl', function ($scope, $http, $q, $rootScope, areaService, SEM_API_URL, requestService) {
            $scope.day_offset = 0;    // 默认是今天(值为0), 值为-1代表昨天, 值为-7代表最近7天, 值为-30代表最近30天
            $scope.yesterdayClass = true;
            $scope.todaySelect = true;
            $scope.datechoice = true;
            $scope.reset = function () {
                $scope.todayClass = false;
                $scope.yesterdayClass = false;
                $scope.sevenDayClass = false;
                $scope.monthClass = false;
                $scope.definClass = false;
            };
            $scope.selectedQuota = ["cost", "vc"];
            $scope.$on("ssh_refresh_charts", function (e, msg) {
                $scope.refreshGrid($rootScope.userType);
                $scope.charts[0].config.qingXie = undefined;
                $scope.compareArray = [];
                if ($rootScope.start > -6) {
                    $(".under_top").show();
                } else {
                    $(".under_top").hide();
                }
                if ($rootScope.start == -29) {
                    $scope.charts[0].config.qingXie = true
                }
                $scope.initGrid($rootScope.user, $rootScope.baiduAccount, "account", $rootScope.start, $rootScope.end, $scope.selectedQuota[0], $scope.selectedQuota[1]);
            });
            $scope.yesterday = function () {
                $(".under_top").show();
                $scope.reset();
                $scope.yesterdayClass = true;
                $scope.day_offset = -1;
                $rootScope.start = -1;
                $rootScope.end = -1;
                $scope.compareArray = [];
                //$scope.reloadGrid();
                $scope.initGrid($rootScope.user, $rootScope.baiduAccount, "account", $rootScope.start, $rootScope.end, $scope.selectedQuota[0], $scope.selectedQuota[1]);
            };
            //$scope.sevenDay = function () {
            //    $(".under_top").hide();
            //    $scope.reset();
            //    $scope.sevenDayClass = true;
            //    $scope.day_offset = -7;
            //    $scope.start = -7;
            //    $scope.end = -1;
            //    $scope.compareArray = [];
            //    //$scope.reloadGrid();
            //    $scope.initGrid($rootScope.user, $rootScope.baiduAccount, "account", $scope.start, $scope.end, $scope.selectedQuota[0], $scope.selectedQuota[1]);
            //};
            //$scope.month = function () {
            //    $(".under_top").hide();
            //    $scope.reset();
            //    $scope.monthClass = true;
            //    $scope.day_offset = -30;
            //    $scope.start = -30;
            //    $scope.end = -1;
            //    $scope.compareArray = [];
            //    //$scope.reloadGrid();
            //    $scope.initGrid($rootScope.user, $rootScope.baiduAccount, "account", $scope.start, $scope.end, $scope.selectedQuota[0], $scope.selectedQuota[1]);
            //};
            $scope.open = function ($event) {
                $scope.reset();
                $scope.definClass = true;
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened = true;
            };
            $scope.checkopen = function ($event) {
                $scope.reset();
                $scope.othersdateClass = true;
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opens = true;
            };

            // 推广概况表格配置项
            $scope.gridOptions = {
                enableColumnMenus: false,
                enableSorting: true,
                enableScrollbars: false,
                enableGridMenu: false,
                enableHorizontalScrollbar: 0,
                enableVerticalScrollbar: 0,
                columnDefs: [
                    {name: ' ', field: 'category'},
                    {name: '消费', field: 'cost'},
                    {name: '展现量', field: 'impression'},
                    {name: '点击量', field: 'click'},
                    {name: '访问次数', field: 'vc'},
                    {name: '页面转化', field: 'page_conv'},
                    {name: '事件转化', field: 'event_conv'},
                    {name: '跳出率', field: 'outRate'},
                    {name: '平均访问时长', field: 'avgTime'}
                ]
            };

            $scope.select = {};

            //数组对象用来给ng-options遍历
            $scope.select.optionsData = [
                {
                    title: "搜索推广"
                },
                {
                    title: "网盟推广"
                }];

            // 投放指标 outQuota
            //推广select
            $scope.disabled = undefined;
            $scope.enable = function () {
                $scope.disabled = false;
            };

            $scope.disable = function () {
                $scope.disabled = false;
            };
            $scope.clear = function () {
                $scope.survey.selected = undefined;
                $scope.outQuotas.selected = undefined;
                $scope.effectQuotas.selected = undefined;

            };
            $scope.survey = {};
            $scope.surveys = [
                {name: '全部推广方式'},
                {name: '搜索推广'},
                {name: '网盟推广'}
            ];
            $scope.outQuotas = {};
            $scope.outQuota = [
                {
                    name: "消费",
                    value: "cost"
                },
                {
                    name: "展现量",
                    value: "impression"
                },
                {
                    name: "点击量",
                    value: "click"
                },
                {
                    name: "点击率",
                    value: "ctr"
                },
                {
                    name: "平均点击价格",
                    value: "cpc"
                }
            ];

            // 效果指标 effectQuota
            $scope.effectQuotas = {};
            $scope.effectQuota = [
                {
                    name: "访问次数",
                    value: "vc"
                },
                {
                    name: "浏览量(PV)",
                    value: "pv"
                },
                {
                    name: "页面转化",
                    value: "pageConversion"
                },
                {
                    name: "跳出率",
                    value: "outRate"
                },
                {
                    name: "抵达率",
                    value: "arrivedRate"
                },
                {
                    name: "平均访问时长",
                    value: "avgTime"
                }
            ];

            // 默认投放指标
            $scope.outQuota_ = "cost";
            // 默认效果指标
            $scope.effectQuota_ = "vc";

            $scope.startDate_ = 0;
            $scope.endDate_ = 0;

            // 根据$scope.day_offset计算startDate和endDate
            $scope.calDatePeriod = function () {
                switch ($scope.day_offset) {
                    case 0:
                        $scope.startDate_ = 0;
                        $scope.endDate_ = 0;
                        break;
                    case -1:
                        $scope.startDate_ = -1;
                        $scope.endDate_ = -1;
                        break;
                    case -7:
                        $scope.startDate_ = -7;
                        $scope.endDate_ = -1;
                        break;
                    case -30:
                        $scope.startDate_ = -30;
                        $scope.endDate_ = -1;
                        break;
                    default :
                        break;
                }
            };

            // 更改指标或日期时刷新数据
            $scope.refreshData = function () {
                $scope.calDatePeriod();

                //$scope.doSearchByEffectQuota("1");

                //$scope.getSemQuotaRealTimeData($rootScope.baiduAccount, "account", $scope.startDate_, $scope.endDate_, 0, 7, PERFORMANCE_DATA);

                var timeInterval = setInterval(function () {
                    if ($scope.effectDataArray.length > 0 && $scope.semDataArray.length > 0) {
                        $scope.loadLineData();
                        clearInterval(timeInterval);
                    }
                }, 500);
            };
            $scope.charts = [
                {
                    config: {
                        legendId: "index_charts_legend",
                        //legendData: ["浏览量(PV)", "访客数(UV)", "跳出率", "抵达率", "平均访问时长", "页面转化"],//显示几种数据
                        //legendAllowCheckCount: 2,
                        //legendClickListener: $scope.onLegendClickListener,
                        //legendDefaultChecked: [0, 1],
                        id: "index_charts",
                        min_max: false,
                        chartType: "line",//图表类型
                        keyFormat: 'none',
                        noFormat: true,
                        auotHidex: true,
                        qingXie: false,
                        dataKey: "key",//传入数据的key值
                        dataValue: "quota"//传入数据的value值
                    }
                }
            ];
            $scope.initGrid = function (user, baiduAccount, type, startOffset, endOffset, quota, estype) {
                var semRegionRequest = $http.get(SEM_API_URL + user + "/" + baiduAccount + "/" + type + "/?startOffset=" + startOffset + "&endOffset=" + endOffset);
                var esRequest = $http.get("/api/charts?start=" + startOffset + "&end=" + endOffset + "&dimension=period&userType=2&type=" + estype);
                $q.all([semRegionRequest, esRequest]).then(function (final_result) {
                    var chart_result = [];
                    if (startOffset == -1 && endOffset == -1) {
                        var tmp = [];
                        var _semData = {};
                        var esJson = JSON.parse(eval("(" + final_result[1].data + ")").toString());
                        var esDate = esJson[0].key[0];
                        if (final_result[0].data.length) {
                            tmp.push(final_result[0].data[0][quota]);
                            _semData["label"] = chartUtils.convertChinese(quota);
                            _semData["quota"] = tmp;
                            _semData["key"] = [final_result[0].data[0].date];
                            chart_result.push(_semData);
                        } else {
                            if (esDate) {
                                chart_result.push({
                                    label: chartUtils.convertChinese(quota),
                                    quota: [0],
                                    key: [esDate.substring(0, 10)]
                                });
                            } else {
                                chart_result.push({
                                    label: chartUtils.convertChinese(quota),
                                    quota: [0],
                                    key: ['']
                                });
                            }
                        }
                        var totalCount = 0;
                        var _esData = {};
                        esJson[0].quota.forEach(function (e) {
                            totalCount += Number(e);
                        });
                        if (estype == "outRate") {
                            totalCount = parseFloat(totalCount / esJson[0].quota.length).toFixed(2);
                        }
                        _esData["label"] = chartUtils.convertChinese(estype);
                        _esData["quota"] = [totalCount];
                        if (esDate) {
                            _esData["key"] = [esDate.substring(0, 10)];
                        } else {
                            _esData["key"] = [''];
                        }
                        chart_result.push(_esData);
                        $scope.charts[0].config.chartType = "bar";
                        $scope.charts[0].config.bGap = true;
                        $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
                        chartUtils.addStep(chart_result,24);
                        cf.renderChart(chart_result, $scope.charts[0].config);
                    } else {
                        var esJson = JSON.parse(eval("(" + final_result[1].data + ")").toString());
                        chartUtils.formatDate(esJson);//格式化日期
                        chartUtils.addSemData(esJson, final_result[0], quota);
                        $scope.charts[0].config.chartType = "line";
                        $scope.charts[0].config.bGap = false;//首行缩进
                        $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
                        cf.renderChart(esJson, $scope.charts[0].config);
                    }

                });
            };
            $scope.yesterday();

            // 触发投放指标的事件
            $scope.setOutQuota = function (outQuota) {
                $scope.outQuota_ = outQuota.value;
                $scope.selectedQuota[0] = outQuota.value;
                $scope.reloadGrid();
                $scope.initGrid($rootScope.user, $rootScope.baiduAccount, "account", $rootScope.start, $rootScope.end, $scope.selectedQuota[0], $scope.selectedQuota[1]);
                //$scope.refreshData();
                //$scope.init($rootScope.user, $rootScope.baiduAccount, "account", -1, -1, -1, 1);
            };

            // 触发效果指标的事件
            $scope.setEffectQuota = function (effectQuota) {
                $scope.effectQuota_ = effectQuota.value;
                $scope.selectedQuota[1] = effectQuota.value;
                $scope.reloadGrid();
                $scope.initGrid($rootScope.user, $rootScope.baiduAccount, "account", $rootScope.start, $rootScope.end, $scope.selectedQuota[0], $scope.selectedQuota[1]);
                //$scope.refreshData();
            };


            $scope.compareSemArray = [];
            $scope.semCompareTo = function (semSelected) {
                if ($scope.compareSemArray.toString().indexOf(semSelected.value) == -1) {
                    $scope.compareSemArray.push( semSelected.value);
                    $http.get(SEM_API_URL + $rootScope.user + "/" + $rootScope.baiduAccount + "/account/" + $scope.selectedQuota[0] + "-?startOffset=" + semSelected.value + "&endOffset=" + semSelected.value).success
                    (function (res) {
                        var c = $scope.charts[0].config.instance;
                        c.addData([
                            [0, res[0][$scope.selectedQuota[0]], true, false]
                        ]);
                    });
                }
            }


            $scope.compareEsArray = [];
            $scope.esCompareTo = function (esSelected) {
                if ($scope.compareEsArray.toString().indexOf(esSelected.value) == -1) {
                    $scope.compareEsArray.push(esSelected.value);
                    $http.get("/api/charts?start=" + esSelected.value + "&end=" + esSelected.value + "&dimension=period&userType="+$rootScope.userType+"&type=" + $scope.selectedQuota[1]).success
                    (function (res) {
                        var json = JSON.parse(eval("(" + res + ")").toString());
                        if (json.length) {
                            var date = json[0].key[0].substring(0, 10);
                            var count = 0;
                            json[0].quota.forEach(function (item) {
                                if ($scope.selectedQuota[1] == "outRate" || $scope.selectedQuota[1] == "arrivedRate") {
                                    count += parseFloat(item);
                                } else {
                                    count += item;
                                }
                            });
                            if ($scope.selectedQuota[1] == "outRate" || $scope.selectedQuota[1] == "arrivedRate") {
                                count = parseFloat(count / json[0].quota.length).toFixed(2);
                            }
                            var c = $scope.charts[0].config.instance;
                            c.addData([
                                [1, count, true, false, date]
                            ]);
                        }
                    });
                }
            }

            // 通过效果指标获取搜索结果
            $scope.doSearchByEffectQuota = function (type) {
                var interval = 24;
                if ($scope.day_offset == -7 || $scope.day_offset == -30)
                    interval = -$scope.day_offset;
                $http({
                    method: 'GET',
                    url: "/api/survey/?start=" + $scope.startDate_ + "&end=" + $scope.endDate_ + "&type=" + type + "&int=" + interval + "&qtype=" + $scope.effectQuota_
                }).success(function (data, status) {
                    data = JSON.parse(eval('(' + data + ')').toString());

                    $scope.effectDataArray.length = 0;
                    $scope.timePeriod.length = 0;

                    data.forEach(function (result) {
                        result.quota.forEach(function (item) {
                            $scope.effectDataArray.push(item);
                        });
                    });

                    data.forEach(function (result) {
                        result.key.forEach(function (item) {
                            $scope.timePeriod.push(item);
                        });
                    });

                }).error(function (error) {
                    console.log(error);
                });
            };

            // 线型图的时间段
            $scope.timePeriod = [];


            $scope.surveyData1 = [];

            // 推广概况获取
            $scope.doSearch = function (startDate, endDate, type) {
                $http({
                    method: 'GET',
                    url: '/api/survey/1?start=' + startDate + "&end=" + endDate + "&type=" + type
                }).success(function (data, status) {
                    $scope.surveyData1 = [];
                    var obj = {};
                    data.forEach(function (item) {
                        obj[item.label] = item.quota[0];
                    });
                    obj["page_conv"] = 0;
                    obj["outRate"] = obj["outRate"] + "%";
                    obj["event_conv"] = 0;

                    $scope.surveyData1.push(obj);

                    $scope.getSemAccountData($rootScope.user, $rootScope.baiduAccount, "account", -1, -1, 0);
                }).error(function (error) {
                    console.log(error);
                });
            };

            // 帐户实时数据报告
            $scope.getSemAccountData = function (user, baiduAccount, type, startOffset, endOffset, device) {
                var url = SEM_API_URL + user + "/" + baiduAccount + "/" + type + "?startOffset=" + startOffset + "&endOffset=" + endOffset + "&device=" + device;
                $http({
                    method: 'GET',
                    url: url
                }).success(function (data, status) {
                    var obj = $scope.surveyData1[0];
                    obj["category"] = "昨日";
                    obj["cost"] = data[0].cost;
                    obj["impression"] = data[0].impression;
                    obj["click"] = data[0].click;

                    $scope.gridOptions.data = [obj];
                });
            };

            $scope.contains = function (orgStr, subStr, isIgnoreCase) {
                if (isIgnoreCase) {
                    orgStr = orgStr.toLowerCase();
                    subStr = subStr.toLowerCase();
                }
                var startChar = subStr.substring(0, 1);
                var strLen = subStr.length;
                for (var j = 0, l = orgStr.length - strLen + 1; j < l; j++) {
                    if (orgStr.charAt(j) == startChar) { //如果匹配起始字符, 开始查找
                        if (orgStr.substring(j, j + strLen) == subStr) { //如果从j开始的字符与str匹配, ok
                            return true;
                        }
                    }
                }
                return false;
            };

            // =============== 推广概况底部表格数据展示 ===============

            $scope.reloadGrid = function () {
                $scope.columns1.splice($scope.columns1.length - 1, 1);
                $scope.columns1.splice($scope.columns1.length - 1, 1);
                $scope.columns2.splice($scope.columns2.length - 1, 1);
                $scope.columns2.splice($scope.columns2.length - 1, 1);
                $scope.columns3.splice($scope.columns3.length - 1, 1);
                $scope.columns3.splice($scope.columns3.length - 1, 1);
                $scope.columns4.splice($scope.columns4.length - 1, 1);
                $scope.columns4.splice($scope.columns4.length - 1, 1);

                $scope.columns1.push({
                    name: $scope.quotaMap.get($scope.outQuota_),
                    displayName: $scope.quotaMap.get($scope.outQuota_),
                    field: $scope.outQuota_
                });
                $scope.columns1.push({
                    name: $scope.quotaMap.get($scope.effectQuota_),
                    displayName: $scope.quotaMap.get($scope.effectQuota_),
                    field: $scope.effectQuota_
                });

                $scope.columns2.push({
                    name: $scope.quotaMap.get($scope.outQuota_),
                    displayName: $scope.quotaMap.get($scope.outQuota_),
                    field: $scope.outQuota_
                });
                $scope.columns2.push({
                    name: $scope.quotaMap.get($scope.effectQuota_),
                    displayName: $scope.quotaMap.get($scope.effectQuota_),
                    field: $scope.effectQuota_
                });

                $scope.columns3.push({
                    name: $scope.quotaMap.get($scope.outQuota_),
                    displayName: $scope.quotaMap.get($scope.outQuota_),
                    field: $scope.outQuota_
                });
                $scope.columns3.push({
                    name: $scope.quotaMap.get($scope.effectQuota_),
                    displayName: $scope.quotaMap.get($scope.effectQuota_),
                    field: $scope.effectQuota_
                });

                $scope.columns4.push({
                    name: $scope.quotaMap.get($scope.outQuota_),
                    displayName: $scope.quotaMap.get($scope.outQuota_),
                    field: $scope.outQuota_
                });
                $scope.columns4.push({
                    name: $scope.quotaMap.get($scope.effectQuota_),
                    displayName: $scope.quotaMap.get($scope.effectQuota_),
                    field: $scope.effectQuota_
                });

                // refresh grid data
                // TODO replace trackId
                $scope.loadGridOptions1Data($rootScope.user, $rootScope.baiduAccount, "account", $scope.start, $scope.end, -1, 2);
                $scope.loadGridOptions2Data($rootScope.user, $rootScope.baiduAccount, "account", $scope.start, $scope.end, -1, 2);
                $scope.loadGridOptions3Data($rootScope.user, $rootScope.baiduAccount, "account", $scope.start, $scope.end, 2);
                $scope.loadGridOptions4Data($rootScope.user, $rootScope.baiduAccount, "region", $scope.start, $scope.end, -1, 2);
            };

            $scope.gridOptions1Data = [];
            $scope.gridOptions2Data = [];
            $scope.gridOptions3Data = [];
            $scope.gridOptions4Data = [];

            $scope.columns1 = [
                {name: '全部推广方式 - 推广账户', field: "accountName"},
                {name: '消费', field: "cost"},
                {name: '访问次数', field: "vc"}
            ];

            $scope.gridOptions1 = {
                enableColumnMenus: false,
                enableSorting: false,
                enableScrollbars: false,
                enableGridMenu: false,
                enableHorizontalScrollbar: 0,
                enableVerticalScrollbar: 0,
                columnDefs: $scope.columns1

            };

            $scope.loadGridOptions1Data = function (user, baiduAccount, type, startOffset, endOffset, device, esType) {
                var url = SEM_API_URL + user + "/" + baiduAccount + "/" + type + "?startOffset=" + startOffset + "&endOffset=" + endOffset + "&device=" + device;
                $http({
                    method: 'GET',
                    url: url
                }).success(function (data, status) {
                    var _obj = {};
                    _obj["accountName"] = data[0].accountName;
                    _obj[$scope.outQuota_] = $scope.outQuota_ == "ctr" ? data[0][$scope.outQuota_] + "%" : data[0][$scope.outQuota_];
                    $scope.gridOptions1Data = [];
                    $scope.gridOptions1Data.push(_obj);

                    $http({
                        method: 'GET',
                        url: '/api/survey/1?start=' + -1 + "&end=" + -1 + "&type=" + esType
                    }).success(function (data, status) {
                        var obj = {};
                        data.forEach(function (item) {
                            obj[item.label] = item.quota[0];
                        });

                        $scope.gridOptions1Data[0][$scope.effectQuota_] = ($scope.effectQuota_ == "outRate" || $scope.effectQuota_ == "arrivedRate") ? obj[$scope.effectQuota_] + "%" : obj[$scope.effectQuota_];
                        $scope.gridOptions1.data = $scope.gridOptions1Data;
                    }).error(function (error) {
                        console.log(error);
                    });

                });
            };

            $scope.columns2 = [
                {name: '全部推广方式 - 推广方式', field: "way"},
                {name: '消费', field: "cost"},
                {name: '访问次数', field: "vc"}
            ];

            $scope.gridOptions2 = {
                enableColumnMenus: false,
                enableSorting: false,
                enableScrollbars: false,
                enableGridMenu: false,
                enableHorizontalScrollbar: 0,
                enableVerticalScrollbar: 0,
                columnDefs: $scope.columns2

            };

            $scope.loadGridOptions2Data = function (user, baiduAccount, type, startOffset, endOffset, device, esType) {
                var url = SEM_API_URL + user + "/" + baiduAccount + "/" + type + "?startOffset=" + startOffset + "&endOffset=" + endOffset + "&device=" + device;
                $http({
                    method: 'GET',
                    url: url
                }).success(function (data, status) {
                    var _obj = {};
                    _obj["way"] = "搜索推广(" + data[0].accountName + ")";
                    _obj[$scope.outQuota_] = $scope.outQuota_ == "ctr" ? data[0][$scope.outQuota_] + "%" : data[0][$scope.outQuota_];
                    $scope.gridOptions2Data = [];
                    $scope.gridOptions2Data.push(_obj);

                    $http({
                        method: 'GET',
                        url: '/api/survey/1?start=' + -1 + "&end=" + -1 + "&type=" + esType
                    }).success(function (data, status) {
                        var obj = {};
                        data.forEach(function (item) {
                            obj[item.label] = item.quota[0];
                        });

                        $scope.gridOptions2Data[0][$scope.effectQuota_] = ($scope.effectQuota_ == "outRate" || $scope.effectQuota_ == "arrivedRate") ? obj[$scope.effectQuota_] + "%" : obj[$scope.effectQuota_];
                        $scope.gridOptions2.data = $scope.gridOptions2Data;
                    }).error(function (error) {
                        console.log(error);
                    });

                });
            };

            $scope.columns3 = [
                {name: '全部推广方式 - 设备', field: "device"},
                {name: '消费', field: "cost"},
                {name: '访问次数', field: "vc"}
            ];

            $scope.gridOptions3 = {
                enableColumnMenus: false,
                enableSorting: false,
                enableScrollbars: false,
                enableGridMenu: false,
                enableHorizontalScrollbar: 0,
                enableVerticalScrollbar: 0,
                columnDefs: $scope.columns3

            };

            $scope.loadGridOptions3Data = function (user, baiduAccount, type, startOffset, endOffset, esType) {
                var semPCRequest = $http.get(SEM_API_URL + user + "/" + baiduAccount + "/" + type + "?startOffset=" + startOffset + "&endOffset=" + endOffset + "&device=0");
                var semMobileRequest = $http.get(SEM_API_URL + user + "/" + baiduAccount + "/" + type + "?startOffset=" + startOffset + "&endOffset=" + endOffset + "&device=1");
                var esPCRequest = $http.get("/api/survey/2?start=" + startOffset + "&end=" + endOffset + "&type=" + esType + "&filter=" + JSON.stringify([{"pm": [0]}]));
                var esMobileRequest = $http.get("/api/survey/2?start=" + startOffset + "&end=" + endOffset + "&type=" + esType + "&filter=" + JSON.stringify([{"pm": [1]}]));

                $q.all([semPCRequest, semMobileRequest, esPCRequest, esMobileRequest]).then(function (result) {
                    var tmp = [];
                    angular.forEach(result, function (response) {
                        tmp.push(response.data);
                    });
                    return tmp;
                }).then(function (tmpResult) {
                    var pcObj = {};
                    pcObj["device"] = "计算机";
                    pcObj[$scope.outQuota_] = tmpResult[0][0][$scope.outQuota_];
                    pcObj[$scope.outQuota_] = $scope.outQuota_ == "ctr" ? pcObj[$scope.outQuota_] + "%" : pcObj[$scope.outQuota_];
                    pcObj[$scope.effectQuota_] = tmpResult[2][0].quota[0];
                    pcObj[$scope.effectQuota_] = ($scope.effectQuota_ == "outRate" || $scope.effectQuota_ == "arrivedRate") ? pcObj[$scope.effectQuota_] + "%" : pcObj[$scope.effectQuota_];
                    $scope.gridOptions3Data = [];
                    $scope.gridOptions3Data.push(pcObj);


                    var mobileObj = {};
                    mobileObj["device"] = "移动设备";
                    mobileObj[$scope.outQuota_] = tmpResult[1][0][$scope.outQuota_];
                    mobileObj[$scope.outQuota_] = $scope.outQuota_ == "ctr" ? mobileObj[$scope.outQuota_] + "%" : mobileObj[$scope.outQuota_];
                    mobileObj[$scope.effectQuota_] = tmpResult[3][0].quota[0];
                    mobileObj[$scope.effectQuota_] = ($scope.effectQuota_ == "outRate" || $scope.effectQuota_ == "arrivedRate") ? mobileObj[$scope.effectQuota_] + "%" : mobileObj[$scope.effectQuota_];
                    $scope.gridOptions3Data.push(mobileObj);
                    $scope.gridOptions3.data = $scope.gridOptions3Data;

                });
            };

            $scope.columns4 = [
                {name: '全部推广方式 - 地域', field: "region"},
                {name: '消费', field: "cost"},
                {name: '访问次数', field: "vc"}
            ];

            $scope.gridOptions4 = {
                enableColumnMenus: false,
                enableSorting: false,
                enableScrollbars: false,
                enableGridMenu: false,
                enableHorizontalScrollbar: 0,
                enableVerticalScrollbar: 0,
                columnDefs: $scope.columns4

            };

            $scope.loadGridOptions4Data = function (user, baiduAccount, type, startOffset, endOffset, device, esType) {
                var semRegionRequest = $http.get(SEM_API_URL + user + "/" + baiduAccount + "/" + type + "?startOffset=" + startOffset + "&endOffset=" + endOffset);
                var esRegionRequest = $http.get("/api/survey/3?start=" + startOffset + "&end=" + endOffset + "&type=" + esType);

                $q.all([semRegionRequest, esRegionRequest]).then(function (result) {
                    var tmp = [];
                    angular.forEach(result, function (response) {
                        tmp.push(response.data);
                    });
                    return tmp;
                }).then(function (tmpResult) {
                    $scope.gridOptions4Data = [];
                    tmpResult[0].forEach(function (item) {
                        var esRegionArr = tmpResult[1][0].key;
                        var regionName = item.regionName;
                        if ($scope.contains(esRegionArr.toString(), regionName, true)) {
                            for (var i = 0, l = esRegionArr.length; i < l; i++) {
                                if (esRegionArr[i].replace("市", "") == regionName) {
                                    var obj = {};
                                    obj["region"] = regionName;
                                    obj[$scope.outQuota_] = $scope.outQuota_ == "ctr" ? item[$scope.outQuota_] + "%" : item[$scope.outQuota_];
                                    obj[$scope.effectQuota_] = tmpResult[1][0].quota[i];
                                    obj[$scope.effectQuota_] = ($scope.effectQuota_ == "outRate" || $scope.effectQuota_ == "arrivedRate") ? obj[$scope.effectQuota_] + "%" : obj[$scope.effectQuota_];
                                    $scope.gridOptions4Data.push(obj);
                                }
                            }
                        }
                    });

                    $scope.gridOptions4.data = $scope.gridOptions4Data;

                });

            };
            // ===================================================


            // 初始化操作
            $scope.init = function (trackId) {
                $scope.quotaMap = new Map();
                $scope.quotaMap.put("pv", "浏览量(PV)");
                $scope.quotaMap.put("vc", "访问次数");
                $scope.quotaMap.put("outRate", "跳出率");
                $scope.quotaMap.put("pageConversion", "页面转化");
                $scope.quotaMap.put("arrivedRate", "抵达率");
                $scope.quotaMap.put("avgTime", "平均访问时长");
                $scope.quotaMap.put("cost", "消费");
                $scope.quotaMap.put("impression", "展现量");
                $scope.quotaMap.put("click", "点击量");
                $scope.quotaMap.put("ctr", "点击率");
                $scope.quotaMap.put("cpc", "平均点击价格");

                $scope.doSearch($rootScope.start, $rootScope.end, trackId);
                $scope.loadGridOptions1Data($rootScope.user, $rootScope.baiduAccount, "account", $rootScope.start, $rootScope.end, -1, trackId);
                $scope.loadGridOptions2Data($rootScope.user, $rootScope.baiduAccount, "account", $rootScope.start, $rootScope.end, -1, trackId);
                $scope.loadGridOptions3Data($rootScope.user, $rootScope.baiduAccount, "account", $rootScope.start, $rootScope.end, trackId);
                $scope.loadGridOptions4Data($rootScope.user, $rootScope.baiduAccount, "region", $rootScope.start, $rootScope.end, -1, trackId);
            };

            $scope.refreshGrid = function (trackId) {
                $scope.doSearch($rootScope.start, $rootScope.end, trackId);
                $scope.loadGridOptions1Data($rootScope.user, $rootScope.baiduAccount, "account", $rootScope.start, $rootScope.end, -1, trackId);
                $scope.loadGridOptions2Data($rootScope.user, $rootScope.baiduAccount, "account", $rootScope.start, $rootScope.end, -1, trackId);
                $scope.loadGridOptions3Data($rootScope.user, $rootScope.baiduAccount, "account", $rootScope.start, $rootScope.end, trackId);
                $scope.loadGridOptions4Data($rootScope.user, $rootScope.baiduAccount, "region", $rootScope.start, $rootScope.end, -1, trackId);
            }
            // initialize
            $scope.init($rootScope.userType);
        }
    )
    ;
});
