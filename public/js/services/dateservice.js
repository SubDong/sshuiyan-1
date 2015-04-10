/**
 * Created by baizz on 2015-3-25.
 */
app.service('requestService', ['$rootScope', '$http', function ($rootScope, $http) {
    this.request = function (start, end, opt,chartConfig) {
        var chart = echarts.init(document.getElementById(chartConfig.chartId));
        chart.showLoading({
            text: "正在努力的读取数据中..."
        });
        chart.on(echarts.config.EVENT.LEGEND_SELECTED, function (param) {
            chartUtils.allowSelected(this, param, 2);//定义能选中的item为多少
            var type = chartUtils.convertEnglish(param.target)

            if (ad.seriesExist(chart, param.target)) {
                $http.get("/api/charts?start=" + start + "&end=" + end + "&type=" + type + "&int=" + opt.interval).success(function (data) {
                    var chartConfig = {
                        showTarget: param.target,
                        dataValue: data.config.dataValue
                    }
                    if(data.format) chartConfig["axFormat"]=data.format;
                    ad.addData(data, chart, chartConfig);
                });
            }
        });
        $http.get("/api/charts?start=" + start + "&end=" + end + "&type=" + opt.type + "&int=" + opt.interval).success(function (data) {
            chartConfig.chartObj=chart;
            cf.renderChart(data,chartConfig);
        }).error(function (err) {
            console.error(err)
        })
    },
        this.mapRequest = function (start, end, type,chartConfig) {
            var chart =echarts.init(document.getElementById(chartConfig.chartId));
            chart.showLoading({
                text: "正在努力的读取数据中..."
            });
            $http.get("/api/map?start=" + start + "&end=" + end + "&type=" + type).success(function (data) {
                chartConfig.legendData=[data.label];
                chartConfig.chartObj=chart;
                cf.renderChart(data,chartConfig);
            }).error(function (err) {
                console.error(err)
            });
        },
        this.pieRequest = function ( start, end, type,chartConfig) {
            var chart =echarts.init(document.getElementById(chartConfig.chartId));
            $http.get("/api/pie?start=" + start + "&end=" + end + "&type=" + type).success(function (data) {
                chartConfig.legendData=data.label;
                chartConfig.chartObj=chart;
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

