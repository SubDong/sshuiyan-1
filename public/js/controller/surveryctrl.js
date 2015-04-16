/**
 * Created by john on 2015/3/30.
 */
app.controller('SurveyCtrl', function ($scope, $http, SEM_API_URL, PERFORMANCE_DATA) {
    $scope.timeType = 0;    // 默认是今天(值为0), 值为1代表昨天, 值为7代表最近7天, 值为30代表最近30天
    $scope.todayClass = true;
    $scope.reset = function () {
        $scope.todayClass = false;
        $scope.yesterdayClass = false;
        $scope.sevenDayClass = false;
        $scope.monthClass = false;
        $scope.definClass = false;
    };
    $scope.today = function () {
        $scope.reset();
        $scope.todayClass = true;
        $scope.timeType = 0;
        $scope.refreshData();

    };
    $scope.yesterday = function () {
        $scope.reset();
        $scope.yesterdayClass = true;
        $scope.timeType = 1;
        $scope.refreshData();
    };
    $scope.sevenDay = function () {
        $scope.reset();
        $scope.sevenDayClass = true;
        $scope.timeType = 7;
        $scope.refreshData();
    };
    $scope.month = function () {
        $scope.reset();
        $scope.monthClass = true;
        $scope.timeType = 30;
        $scope.refreshData();
    };
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
        enableHorizontalScrollbar: 0,
        enableSorting: false,
        enableScrollbars: false,
        enableVerticalScrollbar: 0,
        columnDefs: [
            {name: ' ', field: 'category'},
            {name: '消费', field: 'cost'},
            {name: '展现量', field: 'impression'},
            {name: '点击量', field: 'click'},
            {name: '访问次数', field: 'uv'},
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
    $scope.enable = function() {
        $scope.disabled = false;
    };

    $scope.disable = function() {
        $scope.disabled = true;
    };
    $scope.clear = function() {
        $scope.survey.selected = undefined;
    }
    $scope.survey = {};
    $scope.surveys = [
        { name: '全部推广方式'},
        { name: '搜索推广'},
        { name: '网盟推广'},
    ];
    $scope.select.outQuota = [
        {
            title: "消费",
            value: "cost"
        },
        {
            title: "展现量",
            value: "impression"
        },
        {
            title: "点击量",
            value: "click"
        },
        {
            title: "点击率",
            value: "ctr"
        },
        {
            title: "平均点击价格",
            value: "cpc"
        }
    ];

    // 效果指标 effectQuota
    $scope.select.effectQuota = [
        {
            title: "访问次数",
            value: "vc"
        },
        {
            title: "浏览量(PV)",
            value: "pv"
        },
        {
            title: "页面转化",
            value: "pageConversion"
        },
        {
            title: "跳出率",
            value: "outRate"
        },
        {
            title: "抵达率",
            value: "arrivedRate"
        },
        {
            title: "平均访问时长",
            value: "avgTime"
        }
    ];

    // 默认投放指标
    $scope.outQuota_ = "cost";
    // 默认效果指标
    $scope.effectQuota_ = "pv";

    $scope.startDate_ = today_start().valueOf();
    $scope.endDate_ = today_end().valueOf();

    // 根据$scope.timeType计算startDate和endDate
    $scope.calDatePeriod = function () {
        switch ($scope.timeType) {
            case 0:
                $scope.startDate_ = today_start().valueOf();
                $scope.endDate_ = today_end().valueOf();
                break;
            case 1:
                $scope.startDate_ = yesterday_start().valueOf();
                $scope.endDate_ = yesterday_end().valueOf();
                break;
            case 7:
                $scope.startDate_ = lastWeek_start().valueOf();
                $scope.endDate_ = lastWeek_end().valueOf();
                break;
            case 30:
                $scope.startDate_ = lastMonth_start().valueOf();
                $scope.endDate_ = lastMonth_end().valueOf();
                break;
            default :
                break;
        }
    };

    // 更改指标或日期时刷新数据
    $scope.refreshData = function () {
        $scope.calDatePeriod();

        $scope.doSearchByEffectQuota("1");

        $scope.getSemQuotaRealTimeData("baidu-bjjiehun2123585", "account", $scope.startDate_, $scope.endDate_, 0, 7, PERFORMANCE_DATA);

        var timeInterval = setInterval(function () {
            if ($scope.effectDataArray.length > 0 && $scope.semDataArray.length > 0) {
                $scope.loadLineData();
                clearInterval(timeInterval);
            }
        }, 500);
    };

    // 触发投放指标的事件
    $scope.setOutQuota = function (outQuota) {
        $scope.outQuota_ = outQuota.value;
        $scope.refreshData();
    };

    // 触发效果指标的事件
    $scope.setEffectQuota = function (effectQuota) {
        $scope.effectQuota_ = effectQuota.value;
        $scope.refreshData();
    };

    // 通过效果指标获取搜索结果
    $scope.doSearchByEffectQuota = function (type) {
        var interval = 24;
        if ($scope.timeType == 7 || $scope.timeType == 30)
            interval = $scope.timeType;
        $http({
            method: 'GET',
            url: "/api/survey/?start=" + $scope.startDate_ + "&end=" + $scope.endDate_ + "&type=" + type + "&int=" + interval + "&qtype=" + $scope.effectQuota_
        }).success(function (data, status) {
            data = JSON.parse(eval('(' + data + ')').toString());

            $scope.effectDataArray.length = 0;
            $scope.timePeriod.length = 0;

            data.quota.forEach(function (item, i) {
                $scope.effectDataArray.push(item);
            });

            data.time.forEach(function (item, i) {
                $scope.timePeriod.push(item);
            });

        }).error(function (error) {
            alert(error);
        });
    };

    // 线型图的时间段
    $scope.timePeriod = [];

    // 加载线型图数据
    $scope.loadLineData = function () {
        var chart = echarts.init(document.getElementById("index_charts"));
        //chart.showLoading({
        //    text: "正在努力的读取数据中..."
        //});
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            calculable: true,
            legend: {
                data: [
                    $scope.quotaMap.get($scope.outQuota_),
                    $scope.quotaMap.get($scope.effectQuota_)
                ],
                selectedMode: false
            },
            xAxis: [
                {
                    //type: 'category',
                    boundaryGap: false,
                    data: $scope.timePeriod
                }
            ],
            yAxis: [
                {
                    //name : '降水量',
                    axisLabel: {
                        formatter: function (value) {
                            switch ($scope.outQuota_) {
                                case 'cost':
                                    return value + '元';
                                    break;
                                case 'impression':
                                    return value + '次';
                                    break;
                                case 'click':
                                    return value + '次';
                                    break;
                                case 'ctr':
                                    return value + '%';
                                    break;
                                case 'cpc':
                                    return value + '元';
                                    break;
                                default :
                                    break;
                            }
                        }
                    }
                },
                {
                    //type: 'value',
                    //name: '温度',
                    axisLabel: {
                        formatter: function (value) {
                            switch ($scope.effectQuota_) {
                                case "pv":
                                    return value + '次';
                                    break;
                                case "vc":
                                    return value + '次';
                                    break;
                                case "avgTime":
                                    return new Date(value).Format("hh:mm:ss");
                                    break;
                                case "outRate":
                                    return value + '%';
                                    break;
                                case "arrivedRate":
                                    return value + '%';
                                    break;
                                case "pageConversion":
                                    return value + '次';
                                    break;
                                case "eventConversion":
                                    return value + '次';
                                    break;
                            }
                        }
                    }
                }
            ],
            series: [
                {
                    name: $scope.quotaMap.get($scope.outQuota_),
                    type: 'line',
                    data: $scope.semDataArray,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}}
                },
                {
                    name: $scope.quotaMap.get($scope.effectQuota_),
                    type: 'line',
                    yAxisIndex: 1,
                    data: $scope.effectDataArray,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}}
                }
            ]
        };
        chart.setOption(option, true);
    };

    $scope.map = new Map();

    $scope.surveyData = [];

    // 推广概况获取
    $scope.doSearch = function (startDate, endDate, type, category) {
        $http({
            method: 'GET',
            url: '/api/survey/?start=' + startDate + "&end=" + endDate + "&type=" + type + "&c=" + category + "&qtype=0"
        }).success(function (data, status) {
            var _data = JSON.parse(eval('(' + data + ')').toString());
            var obj = {};
            obj["uv"] = _data.uv;
            obj["outRate"] = _data.outRate;
            obj["avgTime"] = _data.avgTime;
            obj["page_conv"] = _data.page_conv;
            obj["event_conv"] = _data.event_conv;

            switch (_data.category) {
                case "t":
                    obj["category"] = "今天";
                    break;
                case "y":
                    obj["category"] = "昨日";
                    break;
                default :
                    break;
            }

            $scope.map.put(endDate, obj);
        }).error(function (error) {
            alert(error);
        });
    };

    // 帐户实时数据报告
    $scope.getAccountSemRealTimeData = function (bun, type, startDate, endDate, device, unitOfTime, performanceData) {
        var url = SEM_API_URL + "?bun=" + bun + "&type=" + type + "&start=" + startDate + "&end=" + endDate + "&device=" + device + "&uot=" + unitOfTime + "&pd=" + performanceData;

        $http({
            method: 'GET',
            url: url
        }).success(function (data, status) {
            var obj = $scope.map.get(endDate);
            obj["cost"] = data[0].kPIs[0];
            obj["impression"] = data[0].kPIs[1];
            obj["click"] = data[0].kPIs[2];
            $scope.map.put(endDate, obj);
            $scope.gridOptions.data = $scope.map.values();
        });
    };

    $scope.semDataArray = [];   // 投放指标数据
    $scope.effectDataArray = [];    // 效果指标数据

    // 根据投放指标获取相应的SEM实时数据报告
    $scope.getSemQuotaRealTimeData = function (bun, type, startDate, endDate, device, unitOfTime, performanceData) {
        var url = SEM_API_URL + "?bun=" + bun + "&type=" + type + "&start=" + startDate + "&end=" + endDate + "&device=" + device + "&uot=" + unitOfTime + "&pd=" + performanceData;

        $http({
            method: 'GET',
            url: url
        }).success(function (data, status) {
            var index = 0;

            switch ($scope.outQuota_) {
                case "cost":
                    index = 0;
                    break;
                case "impression":
                    index = 1;
                    break;
                case "click":
                    index = 2;
                    break;
                case "ctr":
                    index = 3;
                    break;
                case "cpc":
                    index = 4;
                    break;
                default :
                    break;
            }

            $scope.semDataArray.length = 0;
            data.forEach(function (item, i) {
                $scope.semDataArray.push(item.kPIs[index]);
            });

        });
    };

    // 初始化操作
    $scope.init = function (trackId) {
        $scope.today();

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

        //var performanceData = "cost,impression,click,ctr,cpc";
        var now = new Date().valueOf();
        $scope.doSearch(today_start().valueOf(), now, trackId, "t");
        $scope.getAccountSemRealTimeData("baidu-bjjiehun2123585", "account", today_start().valueOf(), now, 0, 5, PERFORMANCE_DATA);
        $scope.doSearch(yesterday_start().valueOf(), yesterday_end().valueOf(), trackId, "y");
        $scope.getAccountSemRealTimeData("baidu-bjjiehun2123585", "account", yesterday_start().valueOf(), yesterday_end().valueOf(), 0, 5, PERFORMANCE_DATA);

        $scope.doSearchByEffectQuota("1");
        $scope.getSemQuotaRealTimeData("baidu-bjjiehun2123585", "account", $scope.startDate_, $scope.endDate_, 0, 7, PERFORMANCE_DATA);

        var timeInterval = setInterval(function () {
            if ($scope.effectDataArray.length > 0 && $scope.semDataArray.length > 0) {
                $scope.loadLineData();
                clearInterval(timeInterval);
            }
        }, 500);

    };


    // initialize
    $scope.init("1");

}).controller('UconcentCtrl', function ($scope, $http) {
    $scope.gridOptions = {
        enableScrollbars: false,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        columnDefs: [
            {name: '推广账户'},
            {name: '消费'},
            {name: '页面转化'}
        ]

    };
}).controller('EconcentCtrl', function ($scope, $http) {
    $scope.gridOptions = {
        enableScrollbars: false,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        columnDefs: [
            {name: '设备'},
            {name: '消费'},
            {name: '页面转化'}
        ]
    };
}).controller('SearchCtrl', function ($scope, $http) {
    $scope.gridOptions = {
        enableScrollbars: false,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        columnDefs: [
            {name: '推广方式'},
            {name: '点击量'},
            {name: '消费'},
            {name: '浏览量(PV)'},
            {name: '跳出率'},
            {name: '平均访问时长'},
            {name: '转化次数'}
        ]
    };
});



