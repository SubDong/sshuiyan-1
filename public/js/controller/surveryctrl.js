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
            {name: '展现量', filed: 'show'},
            {name: '点击量', field: 'click'},
            {name: '访问次数', field: 'visitCount'},
            {name: '页面转化', field: 'pageTrans'},
            {name: '事件转化', field: 'eventTrans'},
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
            title: "消费"
        },
        {
            title: "展现量"
        },
        {
            title: "点击量"
        },
        {
            title: "访问次数"
        },
        {
            title: "页面转化"
        },
        {
            title: "事件转化"
        },
        {
            title: "跳出率"
        },
        {
            title: "平均访问时长"
        }
    ];

    // 效果指标 effectQuota
    $scope.select.effectQuota = [
        {
            title: "消费"
        },
        {
            title: "展现量"
        },
        {
            title: "点击量"
        },
        {
            title: "访问次数"
        },
        {
            title: "页面转化"
        },
        {
            title: "事件转化"
        },
        {
            title: "跳出率"
        },
        {
            title: "平均访问时长"
        }
    ];

    $scope.surveyData = [];

    // 推广概况获取
    $scope.doSearch = function (start, end, type, category, qtype) {
        $http({
            method: 'GET',
            url: '/api/survey/?start=' + start + "&end=" + end + "&type=" + type + "&c=" + category + "&qtype=" + qtype
        }).success(function (data, status) {
            var _data = JSON.parse(eval('(' + data + ')').toString());
            var _surveyObj = {};
            _surveyObj[_data.label] = _data.data;

            switch (_data.category) {
                case "t":
                    _surveyObj["category"] = "今天";
                    break;
                case "y":
                    _surveyObj["category"] = "昨日";
                    break;
                default :
                    break;
            }

            $scope.surveyData.push(_surveyObj);
        }).error(function (error) {
            alert(error);
        });
    };

    $scope.init = function () {
        //if ($scope.surveyData.length > 0)
        //    $scope.surveyData = [{'category':'今天', 'click': 312,'outRate':'65.00%'}];
        $scope.doSearch(today_start().valueOf(), new Date().valueOf(), "1", "t", "outRate");
        $scope.doSearch(yesterday_start().valueOf(), yesterday_end().valueOf(), "1", "y", "outRate");
        $scope.gridOptions.data = $scope.surveyData;
    };


    // initialize
    $scope.today();
    $scope.init();

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



