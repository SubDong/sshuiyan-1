/**
 * Created by XiaoWei on 2015/4/9.
 */
var cf = {
    renderChart: function (data, chartConfig) {
        var _self = op;
        if (!chartConfig)console.error("chartConfig is required");
        if (!chartConfig.legendData)console.error("legendData is required");
        var chartType = !chartConfig.chartType ? "line" : chartConfig.chartType;
        switch (chartType) {
            case "line":
                _self.lineChart(data, chartConfig);
                break;
            case"bar":
                _self.barChart(data, chartConfig);
                break;
            case "pie":
                _self.pieChart(data, chartConfig);
                break;
            case "map":
                _self.mapChart(data, chartConfig);
            default :
                _self.lineChart(data, chartConfig);
                break;
        }
    }
}
var op = {
    lineChart: function (data, chartConfig) {
        if (!chartConfig.chartObj)return;
        var chartObj = chartConfig.chartObj;
        var option = {
            legend: {
                orient: !chartConfig.ledLayout ? "horizontal" : chartConfig.ledLayout,
                data: !chartConfig.legendData ? [data.label] : chartConfig.legendData
            },
            tooltip: {
                trigger: chartConfig.tt == undefined ? "axis" : chartConfig.tt
            },
            calculable: true,
            xAxis: [
                {
                    type: !chartConfig.xType ? "category" : chartConfig.xType,
                    boundaryGap: !chartConfig.bGap ? false : chartConfig.bGap,
                    data: []
                }
            ],
            yAxis: [
                {
                    type: !chartConfig.yType ? "value" : chartConfig.yType,
                    axisLabel: {
                        formatter: chartConfig.axFormat
                    }
                },
                {
                    'type': 'value',
                    'name': '平均访问时间'
                }
            ],
            series: []
        };
        chartConfig.toolShow = !chartConfig.toolShow ? false : true;
        if (chartConfig.toolShow) {
            option["toolbox"] = {
                show: true,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            }
        }
        var serie = {
            name: data.label,
            type: !chartConfig.chartType ? "line" : chartConfig.chartType,
            data: []
        };
        chartConfig.min_max = !chartConfig.min_max ? false : true;
        if (chartConfig.min_max) {
            serie["markPoint"] = {
                data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                ]
            }
        }
        chartConfig.dataKey = !chartConfig.dataKey ? "time" : chartConfig.dataKey;
        chartConfig.dataValue = !chartConfig.dataValue ? "value" : chartConfig.dataValue;
        if (data.data) {
            if (data.data[0]) {
                var json = data.data;
                var xData = [];
                json.forEach(function (item) {
                    xData.push(item[chartConfig.dataKey]);
                    serie.data.push(item[chartConfig.dataValue]);
                });
                option.xAxis[0].data = xData;
                option.series.push(serie);
            } else {
                def.lineDefData(serie, option, chartConfig);
            }
        } else {
            def.lineDefData(serie, option, chartConfig);
        }
        console.log(chartObj);
        chartObj.hideLoading();
        chartObj.setOption(option);
    },
    barChart: function (data, chartConfig) {
        this.lineChart(data, chartConfig);
    },
    pieChart: function (data, chartConfig) {

    },
    mapChart: function (data, chartConfig) {

    }
}
var def = {
    lineDefData: function (serie, option, chartConfig) {
        var xData = [0];
        serie.data.push(0);
        option.xAxis[0].data = xData;
        option.series.push(serie);
        if (chartConfig.chartType == "bar") {
            option.legend.data = ["暂无数据"];
        }
    }
}