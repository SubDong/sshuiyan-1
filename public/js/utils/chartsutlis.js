/**
 * Created by yousheng on 15/3/24.
 */
//typeOption={type:"xxxxx",data:object....}
var chartFactory = {
    lineChart: {
        chartInit: function (data, chartObj, chartConfig) {
            var option = {
                legend: {
                    orient: chartConfig.ledLayout == undefined ? "horizontal" : chartConfig.ledLayout,
                    data: chartConfig.legendData
                },
                tooltip: {
                    trigger: chartConfig.tt == undefined ? "axis" : chartConfig.tt
                },
                calculable: true,
                xAxis: [
                    {
                        type: chartConfig.xType == undefined ? "category" : chartConfig.xType,
                        boundaryGap: chartConfig.bGap,
                        data: []
                    }
                ],
                yAxis: [
                    {
                        type: chartConfig.yType == undefined ? "value" : chartConfig.yType,
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
            chartConfig.toolShow = chartConfig.toolShow == undefined ? false : true;
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
                type: chartConfig.chartType,
                data: []
            };
            chartConfig.min_max = chartConfig.min_max == undefined ? true : false;
            if (chartConfig.min_max) {
                serie["markPoint"] = {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                }
            }
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
                    this.chartDefaultData(serie, option, chartConfig);
                }
            } else {
                this.chartDefaultData(serie, option, chartConfig);
            }
            chartObj.hideLoading();
            chartObj.setOption(option);
        },
        chartAddData: function (data, chartObj, chartConfig) {
            if (!data.data)return;
            if (data.data[0]) {
                var option = chartObj.getOption();
                var json = data.data;
                var serie = {
                    name: chartConfig.showTarget,
                    type: chartConfig.chartType,
                    data: [],
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    }
                };
                if (data.label != "uv")
                    serie["yAxisIndex"] = 1;
                else
                    serie["yAxisIndex"] = 0;

                json.forEach(function (item) {
                    serie.data.push(item[chartConfig.dataValue]);
                });
                option.series.push(serie);
                chartObj.setOption(option);
            }
        }, chartDefaultData: function (serie, option, chartConfig) {
            var xData = [0];
            serie.data.push(0);
            option.xAxis[0].data = xData;
            option.series.push(serie);
            if (chartConfig.chartType == "bar") {
                option.legend.data = ["暂无数据"];
            }
        },
        chartSerieExist: function (chartObj, target) {
            var option = chartObj.getOption();
            var old_series = option.series;
            var result = true;
            old_series.forEach(function (e) {
                if (e.name == target) {
                    result = false;
                }
            });
            return result;
        }
    }, mapChart: {
        chartInit: function () {
        },
        chartAddData: function () {

        }
    }, pieChart: {
        chartInit: function (data, chartObj, chartConfig) {
            var option = {
                tooltip: {
                    trigger: chartConfig.tt == undefined ? "item" : chartConfig.tt,
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: chartConfig.ledLayout == undefined ? "vertical" : chartConfig.ledLayout,
                    x: 'left',
                    data: chartConfig.legendData == undefined ? ["暂无数据"] : chartConfig.legendData
                },
                calculable: true,
                series: []
            };
            chartConfig.toolShow = chartConfig.toolShow == undefined ? false : true;
            if (chartConfig.toolShow) {
                option["toolbox"] = {
                    show: true,
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {
                            show: true,
                            type: ['pie', 'funnel'],
                            option: {
                                funnel: {
                                    x: '25%',
                                    width: '50%',
                                    funnelAlign: 'left',
                                    max: 1548
                                }
                            }
                        },
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                }
            }
            var serie = {
                name: chartConfig.serieName,
                type: "pie",
                radius: '55%',
                center: ['50%', '60%'],
                itemStyle: {
                    normal: {
                        label: {
                            position: 'inner',
                            formatter: function (params) {
                                return (params.percent - 0).toFixed(0) + '%'
                            }
                        },
                        labelLine: {
                            show: false
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            formatter: "{b}\n{d}%"
                        }
                    }

                },
                data: []
                //{value: 335, name: '直接访问'},
                //{value: 310, name: '邮件营销'}
            }
            if (!data.data) {
                return;
            }
            var jsonData = data.data;
            if (jsonData) {
                jsonData.forEach(function (item) {
                    var push_data = {};
                    push_data[chartConfig.dataKey] = item[chartConfig.dataKey];
                    push_data[chartConfig.dataValue] = item[chartConfig.dataValue];
                    serie.data.push(push_data);
                });
            }
            option.series.push(serie);
            chartObj.hideLoading();
            chartObj.setOption(option);

        },
        chartDefault: function (serie, option, chartConfig) {

        }
    }
}
var chartUtils = {
    allowSelected: function (chartObj, param, allSelectedItem) {
        var selectedCount = [];
        var legend = chartObj.getOption().legend.data;
        var selected = param.selected;
        legend.forEach(function (e) {
            if (selected[e] == true) {
                selectedCount.push(selected[e]);
            }
        });
        if (selectedCount.length > allSelectedItem) {
            selected[param.target] = false;
        }
    },
    convertEnglish: function (chi) {
        switch (chi) {
            case "uv":
                return "uv";
            case "跳出率":
                return "outRate";
            case "抵达率":
                return "arrRate";
                break;
            case "平均访问时长":
                return "avgVisitTime";
                break;
            case "页面转化":
                return "convertRate";
            default :
                return "pv";
        }
    },
    convertChinese: function (eng) {
        switch (eng) {
            case "uv":
                return "uv";
            case "outRate":
                return "跳出率";
            case "arrRate":
                return "抵达率";
                break;
            case "avgVisitTime":
                return "平均访问时长";
                break;
            case "convertRate":
                return "页面转化";
            default :
                return "pv";
        }
    }

}

function chart_factory(params) {


    params['type']
    var options = {
        calculable: false,
        animation: true,
        title: {
            show: true
        },
        toolbox: {
            show: false
        },
        tooltip: {
            show: true,
            trigger: 'item'
        },
        legend: {
            show: true,
            orient: "horizontal" // vertical
        }
    }
}