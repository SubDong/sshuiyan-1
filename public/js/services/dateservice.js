/**
 * Created by baizz on 2015-3-25.
 */
app.service('requestService', ['$rootScope', '$http', function ($rootScope, $http) {
    this.request = function (id, start, end, opt) {
        var chart = echarts.init(document.getElementById(id));
        chart.showLoading({
            text: "正在努力的读取数据中..."
        });
        //chart.on(echarts.EVENT.LEGEND_SELECTED, function (param){
        //    console.log(param);
        //});
        chart.on(echarts.config.EVENT.LEGEND_SELECTED, function (param) {
            console.log(param);
            var chartConfig={
                chartType:"line",
                dataValue: "value"
            }
            $http.get("/api/charts?start=" + start + "&end=" + end + "&type=" + param.target + "&int=" + opt.interval).success(function (data) {
                chartFactory.lineChart.chartAddData(data,chart,chartConfig);
            });
        });
        var types = opt.type.toString();
        var queryTypes = [];
        if (types.indexOf(",") > -1)queryTypes = types.split(",");
        else queryTypes.push(types);
        queryTypes.forEach(function (etype) {
            $http.get("/api/charts?start=" + start + "&end=" + end + "&type=" + etype + "&int=" + opt.interval).success(function (data) {
                var chartConfig = {
                    legendData: ["pv", "uv", "outrate"],
                    ledLayout: "horizontal",
                    tt: "axis",
                    bGap: false,
                    xType: "category",
                    yType: "value",
                    axFormat: "{value} 次访问",
                    chartType: "line",
                    dataKey: "time",
                    dataValue: "value"
                }
                if (data.data[0] != undefined) {
                    chartFactory.lineChart.chartInit(data, chart, chartConfig);
                }
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
                    tt: "axis",
                    legendData: [data.label],
                    bGap: true,
                    xType: "category",
                    yType: "value",
                    chartType: "bar",
                    dataKey: "name",
                    dataValue: "value"
                }
                if (data.data[0] != undefined) {
                    chartFactory.lineChart.chartInit(data, chart, chartConfig);
                }
            }).error(function (err) {
                console.error(err)
            });
        }
}]);

