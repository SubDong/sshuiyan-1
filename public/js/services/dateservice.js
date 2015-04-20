/**
 * Created by baizz on 2015-3-25.
 */
app.service('requestService', ['$rootScope', '$http', function ($rootScope, $http) {
    $rootScope.defaultcb = function (data, chartconfig) {
        cf.renderChart(data, chartconfig);
    }
    $rootScope.start = today_start().getTime();
    $rootScope.end = today_end().getTime();
    $rootScope.interval = 24;

    this.initCharts = function (charts) {
        charts.forEach(function (chart) {
            init.lineChart(chart.config);
        });
    }
    this.refresh = function (charts) {
        charts.forEach(function (chart) {
            chart.config.instance.showLoading({
                text: "正在努力的读取数据中..."
            });
        });
        charts.forEach(function (e) {
            var req = e.url + "?type=" + e.types + "&quote=" + e.quota + "&start=" + $rootScope.start + "&end=" + $rootScope.end;
            if (e.interval) {
                req = req + "&int=" + e.interval;
            }
            $http.get(req).success(function (result) {
                if (e.cb) {
                    e.cb(result);
                } else {
                    $rootScope.defaultcb(result, e.config);
                }
                e.config.instance.hideLoading();
            });
        })
    }
    //this.request = function (start, end, opt, chartConfig) {
    //    var chart = echarts.init(document.getElementById(chartConfig.chartId));
    //    chart.showLoading({
    //        text: "正在努力的读取数据中..."
    //    });
    //    //chart.on(echarts.config.EVENT.LEGEND_SELECTED, function (param) {
    //    //    if (chartConfig.onLegendClick) {
    //    //        chartConfig.onLegendClick(this, param, start, end, opt);
    //    //    } else {
    //    //        var type = chartUtils.convertEnglish(param.target);
    //    //        var allowSelected = chartUtils.allowSelected(this, param, 2);//定义能选中的item为多少
    //    //        if (!allowSelected) {
    //    //            chart.hideLoading();
    //    //            return;
    //    //        }
    //    //        if (ad.seriesExist(chart, param.target)) {
    //    //            chart.showLoading({
    //    //                text: "正在努力的读取数据中..."
    //    //            });
    //    //            $http.get("/api/charts?start=" + start + "&end=" + end + "&type=" + type + "&int=" + opt.interval).success(function (data) {
    //    //                var chartConfig = {
    //    //                    showTarget: param.target
    //    //                }
    //    //                if (data.config)chartConfig["dataValue"] = data.config.dataValue;
    //    //                chartConfig["axFormat"] = type;
    //    //                ad.addData(data, chart, chartConfig);
    //    //                chart.hideLoading();
    //    //            });
    //    //        }
    //    //    }
    //    //});
    //    $http.get("/api/charts?start=" + start + "&end=" + end + "&type=" + opt.type + "&int=" + opt.interval).success(function (data) {
    //        chartConfig.chartObj = chart;
    //        data.label = chartUtils.convertChinese(data.label);
    //        util.renderLegend(chartConfig.chartId, chartConfig.legendData, chartConfig.legendAllowCheckCount, chartConfig.legendClickListener(chart,start,end,opt));
    //        cf.renderChart(data, chartConfig);
    //    }).error(function (err) {
    //        console.error(err)
    //    })
    //},
    //    this.mapRequest = function (start, end, type, chartConfig) {
    //        var chart = echarts.init(document.getElementById(chartConfig.chartId));
    //        chart.showLoading({
    //            text: "正在努力的读取数据中..."
    //        });
    //        $http.get("/api/map?start=" + start + "&end=" + end + "&type=" + type).success(function (data) {
    //            chartConfig.legendData = [data.label];
    //            chartConfig.chartObj = chart;
    //            cf.renderChart(data, chartConfig);
    //        }).error(function (err) {
    //            console.error(err)
    //        });
    //    },
    //    this.pieRequest = function (start, end, opt, chartConfig) {
    //        var chart = echarts.init(document.getElementById(chartConfig.chartId));
    //        chart.showLoading({
    //            text: "正在努力的读取数据中..."
    //        });
    //        var pieType = opt.pieType ? opt.pieType : undefined;
    //        switch (pieType) {
    //            case "vapie":
    //                $http.get("/api/vapie?start=" + start + "&end=" + end + "&type=" + opt.type).success(function (data) {
    //                    chartConfig.legendData = data.label;
    //                    chartConfig.chartObj = chart;
    //                    cf.renderChart(data, chartConfig);
    //                }).error(function (err) {
    //                    console.error(err)
    //                });
    //                break;
    //            default :
    //                $http.get("/api/pie?start=" + start + "&end=" + end + "&type=" + opt.type).success(function (data) {
    //                    chartConfig.legendData = data.label;
    //                    chartConfig.chartObj = chart;
    //                    cf.renderChart(data, chartConfig);
    //                }).error(function (err) {
    //                    console.error(err)
    //                });
    //                break;
    //        }
    //    }
    this.gridRefresh = function (grids) {
        grids.forEach(function (grid) {
            $http.get(grid.url + "?start=" + $rootScope.start + "&end=" + $rootScope.end + "&type=" + grids.types).success(function (data) {
                if (data.data)
                    grid.config.gridOptions.data = data.data;
                else
                    grid.config.gridOptions.data = [];
            });
        })


    }

}]);

