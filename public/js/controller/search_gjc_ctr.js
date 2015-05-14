/**
 * Created by XiaoWei on 2015/5/14.
 */
app.controller('search_gjc_ctr', function ($scope, $rootScope, $q, requestService, areaService, $http, SEM_API_URL) {
    $scope.yesterdayClass = true;

    //table默认信息配置
    $rootScope.tableTimeStart = 0;
    $rootScope.tableTimeEnd = 0;
    $rootScope.tableFilter = null;
    $rootScope.latitude = {name: "搜索引擎", field: "wd"}
    $rootScope.dimen = false;
    //

    $scope.selectedQuota = ["click", "impression"];
    $scope.charts = [
        {
            config: {
                legendId: "indicators_charts_legend",
                legendData: ["浏览量(PV)", "访客数(UV)", "跳出率", "抵达率", "平均访问时长", "页面转化"],//显示几种数据
                legendMultiData: $rootScope.lagerMulti,
                legendAllowCheckCount: 2,
                legendClickListener: $scope.onLegendClickListener,
                legendDefaultChecked: [5, 7],
                min_max: false,
                bGap: true,
                id: "indicators_charts",
                chartType: "bar",//图表类型
                keyFormat: 'none',
                noFormat: true,
                dataKey: "key",//传入数据的key值
                dataValue: "quota"//传入数据的value值
            }
        }
    ];
    $scope.init = function (user, baiduAccount, semType, quotas, start, end, renderLegend) {
        $rootScope.start = -1;
        $rootScope.end = -1;
        var semRequest = $http.get(SEM_API_URL + user + "/" + baiduAccount + "/" + semType + "/" + quotas[0] + "-" + quotas[1] + "-?startOffset=" + start + "&endOffset=" + end);
        $q.all([semRequest]).then(function (final_result) {
            final_result[0].data.sort(chartUtils.by(quotas[0]));
            final_result[0].data = final_result[0].data.slice(0, 20);
            var total_result = chartUtils.getSemBaseData(quotas, final_result,"keywordName");
            var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
            chart.showLoading({
                text: "正在努力的读取数据中..."
            });
            $scope.charts[0].config.instance = chart;
            if (renderLegend) {
                util.renderLegend(chart, $scope.charts[0].config);
            }
            cf.renderChart(total_result, $scope.charts[0].config);
            chart.hideLoading();
        });
    }
    $scope.init($rootScope.user, $rootScope.baiduAccount, "keyword", $scope.selectedQuota, -1, -1, true);


    $scope.$on("ssh_refresh_charts", function (e, msg) {
        $rootScope.targetSearch();
        $scope.init($rootScope.user, $rootScope.baiduAccount, "keyword", $scope.selectedQuota, $rootScope.start, $rootScope.end);
    });

    //点击显示指标
    $scope.visible = true;
    $scope.select = function () {
        $scope.visible = false;
    };
    $scope.clear = function () {
        $scope.page.selected = undefined;
        $scope.city.selected = undefined;
        $scope.country.selected = undefined;
        $scope.continent.selected = undefined;
    };
    $scope.page = {};
    $scope.pages = [
        {name: '全部页面目标'},
        {name: '全部事件目标'},
        {name: '所有页面右上角按钮'},
        {name: '所有页面底部400按钮'},
        {name: '详情页右侧按钮'},
        {name: '时长目标'},
        {name: '访问页数目标'},
    ];
    //日历
    this.selectedDates = [new Date().setHours(0, 0, 0, 0)];
});
