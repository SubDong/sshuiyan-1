/**
 * Created by john on 2015/3/30.
 */
app.controller('SurveyCtrl', function ($scope, $http, $q, $rootScope, areaService, SEM_API_URL) {
    $scope.day_offset = 0;    // 默认是今天(值为0), 值为-1代表昨天, 值为-7代表最近7天, 值为-30代表最近30天
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
        $scope.day_offset = 0;

    };
    $scope.yesterday = function () {
        $scope.reset();
        $scope.yesterdayClass = true;
        $scope.day_offset = -1;
    };
    $scope.sevenDay = function () {
        $scope.reset();
        $scope.sevenDayClass = true;
        $scope.day_offset = -7;
    };
    $scope.month = function () {
        $scope.reset();
        $scope.monthClass = true;
        $scope.day_offset = -30;
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

            $scope.getSemAccountData("jiehun", "baidu-bjjiehun2123585", "account", -1, -1, 0);
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
    $scope.gridOptions1Data = [];
    $scope.gridOptions2Data = [];
    $scope.gridOptions3Data = [];
    $scope.gridOptions4Data = [];

    $scope.gridOptions1 = {
        enableColumnMenus: false,
        enableSorting: false,
        enableScrollbars: false,
        enableGridMenu: false,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        columnDefs: [
            {name: '全部推广方式 - 推广账户', field: "accountName"},
            {name: '消费', field: "cost"},
            {name: '访问次数', field: "vc"}
        ]

    };

    $scope.loadGridOptions1Data = function (user, baiduAccount, type, startOffset, endOffset, device, esType) {
        var url = SEM_API_URL + user + "/" + baiduAccount + "/" + type + "?startOffset=" + startOffset + "&endOffset=" + endOffset + "&device=" + device;
        $http({
            method: 'GET',
            url: url
        }).success(function (data, status) {
            var _obj = {};
            _obj["accountName"] = data[0].accountName;
            _obj["cost"] = data[0].cost;
            $scope.gridOptions1Data.push(_obj);

            $http({
                method: 'GET',
                url: '/api/survey/1?start=' + -1 + "&end=" + -1 + "&type=" + esType
            }).success(function (data, status) {
                var obj = {};
                data.forEach(function (item) {
                    obj[item.label] = item.quota[0];
                });

                $scope.gridOptions1Data[0]["vc"] = obj["vc"];
                $scope.gridOptions1.data = $scope.gridOptions1Data;
            }).error(function (error) {
                console.log(error);
            });

        });
    };

    $scope.gridOptions2 = {
        enableColumnMenus: false,
        enableSorting: false,
        enableScrollbars: false,
        enableGridMenu: false,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        columnDefs: [
            {name: '全部推广方式 - 推广方式', field: "way"},
            {name: '消费', field: "cost"},
            {name: '访问次数', field: "vc"}
        ]

    };

    $scope.loadGridOptions2Data = function (user, baiduAccount, type, startOffset, endOffset, device, esType) {
        var url = SEM_API_URL + user + "/" + baiduAccount + "/" + type + "?startOffset=" + startOffset + "&endOffset=" + endOffset + "&device=" + device;
        $http({
            method: 'GET',
            url: url
        }).success(function (data, status) {
            var _obj = {};
            _obj["way"] = "搜索推广(" + data[0].accountName + ")";
            _obj["cost"] = data[0].cost;
            $scope.gridOptions2Data.push(_obj);

            $http({
                method: 'GET',
                url: '/api/survey/1?start=' + -1 + "&end=" + -1 + "&type=" + esType
            }).success(function (data, status) {
                var obj = {};
                data.forEach(function (item) {
                    obj[item.label] = item.quota[0];
                });

                $scope.gridOptions2Data[0]["vc"] = obj["vc"];
                $scope.gridOptions2.data = $scope.gridOptions2Data;
            }).error(function (error) {
                console.log(error);
            });

        });
    };

    $scope.gridOptions3 = {
        enableColumnMenus: false,
        enableSorting: false,
        enableScrollbars: false,
        enableGridMenu: false,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        columnDefs: [
            {name: '全部推广方式 - 设备', field: "device"},
            {name: '消费', field: "cost"},
            {name: '访问次数', field: "vc"}
        ]

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
            pcObj["cost"] = tmpResult[0][0].cost;
            pcObj["vc"] = tmpResult[2][0].quota[0];
            $scope.gridOptions3Data.push(pcObj);


            var mobileObj = {};
            mobileObj["device"] = "移动设备";
            mobileObj["cost"] = tmpResult[1][0].cost;
            mobileObj["vc"] = tmpResult[3][0].quota[0];
            $scope.gridOptions3Data.push(mobileObj);
            $scope.gridOptions3.data = $scope.gridOptions3Data;

        });
    };

    $scope.gridOptions4 = {
        enableColumnMenus: false,
        enableSorting: false,
        enableScrollbars: false,
        enableGridMenu: false,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        columnDefs: [
            {name: '全部推广方式 - 地域', field: "region"},
            {name: '消费', field: "cost"},
            {name: '访问次数', field: "vc"}
        ]

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
            tmpResult[0].forEach(function (item) {
                var esRegionArr = tmpResult[1][0].key;
                var regionName = item.regionName;
                if ($scope.contains(esRegionArr.toString(), regionName, true)) {
                    for (var i = 0, l = esRegionArr.length; i < l; i++) {
                        if (esRegionArr[i].replace("市", "") == regionName) {
                            var obj = {};
                            obj["region"] = regionName;
                            obj["cost"] = item.cost;
                            obj["vc"] = tmpResult[1][0].quota[i];
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

        $scope.doSearch(-1, -1, trackId);
        $scope.loadGridOptions1Data("jiehun", "baidu-bjjiehun2123585", "account", -1, -1, -1, trackId);
        $scope.loadGridOptions2Data("jiehun", "baidu-bjjiehun2123585", "account", -1, -1, -1, trackId);
        $scope.loadGridOptions3Data("jiehun", "baidu-bjjiehun2123585", "account", -1, -1, trackId);
        $scope.loadGridOptions4Data("jiehun", "baidu-bjjiehun2123585", "region", -1, -1, -1, trackId);
    };

    // initialize
    $scope.init("2");

});
