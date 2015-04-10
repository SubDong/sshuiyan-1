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
                break;
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
                trigger: !chartConfig.tt ? "axis" : chartConfig.tt
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
        if (chartConfig.min_max == undefined) {
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
        chartObj.hideLoading();
        chartObj.setOption(option);
    },
    barChart: function (data, chartConfig) {
        chartConfig.dataKey = !chartConfig.dataKey ? "name" : chartConfig.dataKey;
        this.lineChart(data, chartConfig);
    },
    pieChart: function (data, chartConfig) {
        if (!chartConfig.chartObj)return;
        var chartObj =chartConfig.chartObj
        var option = {
            tooltip: {
                trigger: !chartConfig.tt ? "item" : chartConfig.tt,
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: !chartConfig.ledLayout ? "vertical" : chartConfig.ledLayout,
                x: 'left',
                data: !chartConfig.legendData ? [data.label] : chartConfig.legendData
            },
            calculable: true,
            series: []
        };
        chartConfig.toolShow = !chartConfig.toolShow ? false : true;
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
            name: !chartConfig.serieName ? "请配置图例说明" : chartConfig.serieName,
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
        }
        if (!data.data) {
            return;
        }
        chartConfig.dataKey = !chartConfig.dataKey ? "name" : chartConfig.dataKey;
        chartConfig.dataValue = !chartConfig.dataValue ? "value" : chartConfig.dataValue;
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
    mapChart: function (data, chartConfig) {
        if (!chartConfig.chartObj)return;
        var chartObj = chartConfig.chartObj
        var option = {
            title: {
                text: !chartConfig.titleText ? "暂无说明" : chartConfig.titleText,
                x: 'center'
            },
            tooltip: {
                trigger: !chartConfig.tt ? 'item' : chartConfig.tt
            },
            legend: {
                orient: !chartConfig.ledLayout ? 'vertical' : chartConfig.ledLayout,
                x: 'left',
                data: !chartConfig.legendData ? [data.label] : chartConfig.legendData
            },
            series: []
        };
        chartConfig.toolbox = !chartConfig.toolbox ? false : chartConfig.toolbox;
        if (chartConfig.toolbox) {
            option["toolbox"] = {
                show: true,
                orient: 'vertical',
                x: 'right',
                y: 'center',
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            }
        }
        if (chartConfig.dataRange == undefined) {
            option["dataRange"] = {
                min: 0,
                max: 2500,
                x: 'left',
                y: 'bottom',
                text: ['高', '低'],           // 文本，默认为数值文本
                calculable: true
            }
        }
        chartConfig.roamController = !chartConfig.roamController ? false : chartConfig.roamController;
        if (chartConfig.roamController) {
            option["roamController"] = {
                show: true,
                x: 'right',
                mapTypeControl: {
                    'china': true
                }
            }
        }
        var serie = {
            //name: chartConfig.serieName,
            type: chartConfig.chartType,
            mapType: 'china',
            roam: false,
            itemStyle: {
                normal: {label: {show: true}},
                emphasis: {label: {show: true}}
            },
            data: []
        }
        chartConfig.dataKey = !chartConfig.dataKey ? "name" : chartConfig.dataKey;
        chartConfig.dataValue = !chartConfig.dataValue ? "value" : chartConfig.dataValue;
        if (data.data) {
            if (data.data[0]) {
                data.data.forEach(function (e) {
                    serie['name'] = data.label;
                    var push_data = {};
                    push_data[chartConfig.dataKey] = e[chartConfig.dataKey]
                    push_data[chartConfig.dataValue] = e[chartConfig.dataValue];
                    push_data["value"]
                    serie.data.push(push_data);
                });
                option.series.push(serie);
            }
        }
        chartObj.hideLoading();
        chartObj.setOption(option);
    }
}
var ad = {
    addData: function (data,chartObj, chartConfig) {
        if (!chartObj)return;
        if (!data.data)return;
        if (data.data[0]) {
            var option = chartObj.getOption();
            var s_index = option.series.length - 1;
            var c_type = option.series[s_index].type;
            var json = data.data;
            var serie = {
                name: chartConfig.showTarget,
                type: c_type,
                data: []
            };
            if (option.series[s_index].markPoint) {
                serie["markPoint"] = option.series[s_index].markPoint;
            }
            if (data.label != "uv") {
                serie["yAxisIndex"] = 1;
                option.yAxis[1]["axisLabel"] = {
                    formatter: !chartConfig.axFormat ? undefined : "{value}" +chartConfig.axFormat
                };
            } else {
                serie["yAxisIndex"] = 0;
            }
            json.forEach(function (item) {
                serie.data.push(item[chartConfig.dataValue]);
            });
            option.series.push(serie);
            chartObj.setOption(option);
        }
    },
    seriesExist: function (chartObj, target) {
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