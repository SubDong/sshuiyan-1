/**
 * Created by baizz on 2015-3-25.
 */
app.service('requestService', ['$rootScope', '$http', function ($rootScope, $http) {
    this.request = function (id, start, end, opt) {
        var chart = echarts.init(document.getElementById(id));
        chart.showLoading({
            text: "正在努力的读取数据中..."
        });
        chart.on(echarts.config.EVENT.LEGEND_SELECTED, function (param) {
            chartUtils.allowSelected(this, param, 2);//定义能选中的item为多少
            var type = chartUtils.convertEnglish(param.target)
            var chartConfig = {
                showTarget: param.target,
                chartType: "line",
                dataValue: "value"
            }
            if (ad.seriesExist(chart, param.target)) {
                $http.get("/api/charts?start=" + start + "&end=" + end + "&type=" + type + "&int=" + opt.interval).success(function (data) {
                    chartFactory.lineChart.chartAddData(data, chart, chartConfig);
                });
            }
        });

        $http.get("/api/charts?start=" + start + "&end=" + end + "&type=" + opt.type + "&int=" + opt.interval).success(function (data) {
            var chartConfig={
                chartObj:chart,//渲染的chart对象Id
                chartType:"line",
                min_max:true,//是否允许最小值,默认显示
                legendData: ["pv", "uv", "跳出率", "抵达率", "平均访问时长", "页面转化"]//显示几种数据
            }
            cf.renderChart(data,chartConfig);
        }).error(function (err) {
            console.error(err)
        })
    },
        this.mapRequest = function (id, start, end, type) {
            var chart = echarts.init(document.getElementById(id));
            chart.showLoading({
                text: "正在努力的读取数据中..."
            });
            $http.get("/api/map?start=" + start + "&end=" + end + "&type=" + type).success(function (data) {
                var chartConfig = {
                    legendData:[data.label],
                    chartType: "bar",
                    chartObj:chart,
                    bGap:true
                }
                cf.renderChart(data,chartConfig);
            }).error(function (err) {
                console.error(err)
            });
        },
        this.pieRequest = function (id, start, end, type) {
            var chart = echarts.init(document.getElementById(id));
            $http.get("/api/pie?start=" + start + "&end=" + end + "&type=" + type).success(function (data) {
                var chartConfig = {
                    chartType:"pie",
                    legendData:data.label,
                    dataKey: "name",
                    chartObj:chart
                }
                //chartFactory.pieChart.chartInit(data, chart, chartConfig);
                cf.renderChart(data,chartConfig);
            }).error(function (err) {
                console.error(err)
            });
        }
    this.gridRequest = function (time, uiGridOpt, type) {
        var start = !time.start ? today_start().getTime() : time.start, end = !time.end ? today_end().getTime() : time.end;
        $http.get("/api/grid?start=" + start + "&end=" + end + "&type=" + type).success(function (data) {
            if (data.data)
                uiGridOpt.data = data.data;
            else
                uiGridOpt.data = [];

        });

    }

}]);

