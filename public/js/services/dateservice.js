/**
 * Created by baizz on 2015-3-25.
 */
app.service('requestService', ['$rootScope', '$http', function ($rootScope, $http) {
    this.request = function (id, start, end, opt) {
        var chart = echarts.init(document.getElementById());
        chart.showLoading({
            text: "正在努力的读取数据中..."
        });
        chart.on(echarts.config.EVENT.LEGEND_SELECTED, function (param) {
            chartUtils.allowSelected(this,param,2);//定义能选中的item为多少
            var chartConfig = {
                showTarget: param.target,
                chartType: "line",
                dataValue: "value"
            }
            $http.get("/api/charts?start=" + start + "&end=" + end + "&type=" + param.target + "&int=" + opt.interval).success(function (data) {
                chartFactory.lineChart.chartAddData(data, chart, chartConfig);
            });
        });
        var types = opt.type.toString();
        var queryTypes = [];
        if (types.indexOf(",") > -1)queryTypes = types.split(",");
        else queryTypes.push(types);
        queryTypes.forEach(function (etype) {
            $http.get("/api/charts?start=" + start + "&end=" + end + "&type=" + etype + "&int=" + opt.interval).success(function (data) {
                var chartConfig = {
                    min_max: true,//是否允许最小值,
                    legendData: ["pv", "uv", "outrate"],//显示几种数据
                    ledLayout: "horizontal",//显示数据的按钮排列方式
                    tt: "axis",//鼠标浮动样式
                    bGap: false,//首行缩进
                    xType: "category",//x轴数据类型
                    yType: "value",//y轴数据类型
                    axFormat: "{value} 次访问",//y轴数据格式化格式
                    chartType: opt.chart,//图表类型
                    dataKey: "time",//传入数据的key值
                    dataValue: "value"//传入数据的value值
                }
                chartFactory.lineChart.chartInit(data, chart, chartConfig);
            }).error(function (err) {
                console.error(err)
            })
        });
    },
        this.mapRequest = function (id, start, end, type) {
            var chart = echarts.init(document.getElementById(id));
            chart.showLoading({
                text: "正在努力的读取数据中..."
            });
            $http.get("/api/map?start=" + start + "&end=" + end + "&type=" + type).success(function (data) {
                var chartConfig = {
                    min_max: false,
                    tt: "axis",
                    legendData: [data.label],
                    bGap: true,
                    xType: "category",
                    yType: "value",
                    chartType: "bar",
                    dataKey: "name",
                    dataValue: "value"
                }
                chartFactory.lineChart.chartInit(data, chart, chartConfig);
            }).error(function (err) {
                console.error(err)
            });
        }
}]);

