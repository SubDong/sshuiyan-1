/**
 * Created by john on 2015/3/30.
 */
app.controller('SurveyCtrl', function ($scope, $http) {
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

    };
    $scope.yesterday = function () {
        $scope.reset();
        $scope.yesterdayClass = true;

    };
    $scope.sevenDay = function () {
        $scope.reset();
        $scope.sevenDayClass = true;


    };
    $scope.month = function () {
        $scope.reset();
        $scope.monthClass = true;


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
            title: "页面转化",
            value: "page_conv"
        },
        {
            title: "事件转化",
            value: "event_conv"
        },
        {
            title: "跳出率",
            value: "outRate"
        },
        {
            title: "平均访问时长",
            value: "avgTime"
        }
    ];

    $scope.outQuota_ = "cost";
    $scope.effectQuota_ = "vc";
    $scope.time = today_start().valueOf();

    $scope.setOutQuota = function (outQuota) {
        $scope.outQuota_ = outQuota.value;
        $scope.getSemQuotaRealTimeData("baidu-bjjiehun2123585", "account", $scope.time, today_end().valueOf(), 0, 7, $scope.outQuota_);
    };

    $scope.setEffectQuota = function (effectQuota) {
        $scope.effectQuota_ = effectQuota.value;
    };

    $scope.loadLineData = function () {
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

    $scope.getAccountSemRealTimeData = function (bun, type, startDate, endDate, device, unitOfTime, performanceData) {
        var url = "http://192.168.1.105:9080/?bun=" + bun + "&type=" + type + "&start=" + startDate + "&end=" + endDate + "&device=" + device + "&uot=" + unitOfTime + "&pd=" + performanceData;

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

    $scope.getSemQuotaRealTimeData = function (bun, type, startDate, endDate, device, unitOfTime, performanceData) {
        var url = "http://192.168.1.105:9080/?bun=" + bun + "&type=" + type + "&start=" + startDate + "&end=" + endDate + "&device=" + device + "&uot=" + unitOfTime + "&pd=" + performanceData;

        $http({
            method: 'GET',
            url: url
        }).success(function (data, status) {
            console.log(JSON.stringify(data));
            //=====================================
            //var chart = echarts.init(document.getElementById("index_charts"));
            //chart.showLoading({
            //    text: "正在努力的读取数据中..."
            //});

            //=====================================
        });
    };

    $scope.init = function (trackId) {
        //
        var performanceData = "cost,impression,click,ctr,cpc";
        //
        var now = new Date().valueOf();
        $scope.doSearch(today_start().valueOf(), now, trackId, "t");
        $scope.getAccountSemRealTimeData("baidu-bjjiehun2123585", "account", today_start().valueOf(), now, 0, 5, performanceData);
        $scope.doSearch(yesterday_start().valueOf(), yesterday_end().valueOf(), trackId, "y");
        $scope.getAccountSemRealTimeData("baidu-bjjiehun2123585", "account", yesterday_start().valueOf(), yesterday_end().valueOf(), 0, 5, performanceData);
        // 分小时数据
        //$scope.getSemRealTimeData("baidu-bjjiehun2123585", "account", yesterday_start().valueOf(), yesterday_end().valueOf(), 0, 7);
    };


    // initialize
    $scope.today();
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



