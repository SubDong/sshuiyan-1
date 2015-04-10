/**
 * Created by baizz on 2015-3-25.
 */
app.service('requestService', ['$rootScope', '$http', function ($rootScope, $http) {
    this.request = function (id, start, end, opt,chartConfig) {
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
            if (chartFactory.lineChart.chartSerieExist(chart, param.target)) {
                $http.get("/api/charts?start=" + start + "&end=" + end + "&type=" + type + "&int=" + opt.interval).success(function (data) {
                    chartFactory.lineChart.chartAddData(data, chart, chartConfig);
                });
            }
        });
        $http.get("/api/charts?start=" + start + "&end=" + end + "&type=" + opt.type + "&int=" + opt.interval).success(function (data) {
            chartFactory.lineChart.chartInit(data, chart, chartConfig);
        }).error(function (err) {
            console.error(err)
        })
    },
        this.mapRequest = function (id, start, end, type,chartConfig) {
            var chart = echarts.init(document.getElementById(id));
            chart.showLoading({
                text: "正在努力的读取数据中..."
            });
            $http.get("/api/map?start=" + start + "&end=" + end + "&type=" + type).success(function (data) {
                chartConfig.legendData=[data.label];
                chartFactory.lineChart.chartInit(data, chart, chartConfig);
            }).error(function (err) {
                console.error(err)
            });
        },
        this.pieRequest = function (id, start, end, type,chartConfig) {
            var chart = echarts.init(document.getElementById(id));
            $http.get("/api/pie?start=" + start + "&end=" + end + "&type=" + type).success(function (data) {
                chartConfig.legendData=data.label;
                chartFactory.pieChart.chartInit(data, chart, chartConfig);
            }).error(function (err) {
                console.error(err)
            });
        }
    this.gridRequest = function (time, uiGridOpt, type) {
        var start = time.start == undefined ? today_start().getTime() : time.start, end = time.end == undefined ? today_end().getTime() : time.end;
        $http.get("/api/grid?start=" + start + "&end=" + end + "&type=" + type).success(function (data) {
            if (data.data != undefined)
                uiGridOpt.data = data.data;
            else
                uiGridOpt.data = [];

        });

    }

}]);

