/**
 * Created by yousheng on 15/3/24.
 */
//typeOption={type:"xxxxx",data:object....}
var chartFactory = {
    lineChart: {
        chartInit: function (data, chartObj, chartConfig) {
            var option = {
                legend: {
                    orient: chartConfig.ledLayout,
                    data: chartConfig.legendData
                },
                tooltip: {
                    trigger: chartConfig.tt
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: chartConfig.xType,
                        boundaryGap: chartConfig.bGap,
                        data: []
                    }
                ],
                yAxis: [
                    {
                        type: chartConfig.yType,
                        axisLabel: {
                            formatter: chartConfig.axFormat
                        }
                    }
                ],
                series: []
            };
            var serie = {
                name: data.label,
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
            if (data.data[0] != undefined) {
                var json = data.data;
                var xData = [];
                json.forEach(function (item) {
                    xData.push(item[chartConfig.dataKey]);
                    serie.data.push(item[chartConfig.dataValue]);
                });
                option.xAxis[0].data = xData;
                option.series.push(serie);
            }
            chartObj.hideLoading();
            chartObj.setOption(option);
        },
        chartAddData: function (data, chartObj, chartConfig) {

            if (data.data[0] != undefined) {
                var option=chartObj.getOption();
                var json = data.data;
                var xData = [];
                var serie = {
                    name: data.label,
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
                json.forEach(function (item) {
                    serie.data.push(item[chartConfig.dataValue]);
                });
               option.series.push(serie);
                chartObj.setOption(option);
                console.log(option);
            }
        }
    }, mapChart: {
        chartInit: function () {
            //var option = {
            //    tooltip: {
            //        trigger: 'item'
            //    },
            //    legend: {
            //        orient: 'vertical',
            //        x: 'left',
            //        data: ['访客']
            //    },
            //    dataRange: {
            //        min: 0,
            //        max: 2500,
            //        x: 'left',
            //        y: 'bottom',
            //        text: ['高', '低'],           // 文本，默认为数值文本
            //        calculable: true
            //    },
            //    toolbox: {
            //        show: true,
            //        orient: 'vertical',
            //        x: 'right',
            //        y: 'center',
            //        feature: {
            //            mark: {show: true},
            //            dataView: {show: true, readOnly: false},
            //            restore: {show: true},
            //            saveAsImage: {show: true}
            //        }
            //    },
            //    series: []
            //};
            //var name = data.name;
            //var series = {
            //    name: name,
            //    type: 'map',
            //    mapType: 'china',
            //    data: [],
            //    itemStyle: {
            //        normal: {label: {show: true}},
            //        emphasis: {label: {show: true}}
            //    }
            //};
            //var name = data.name;
            //var series = {
            //    name: name,
            //    type: 'map',
            //    mapType: 'china',
            //    data: [],
            //    itemStyle: {
            //        normal: {label: {show: true}},
            //        emphasis: {label: {show: true}}
            //    }
            //}
            //data.data.forEach(function (item) {
            //    series.data.push(item);
            //});
            //option.series.push(series);
            //chart.hideLoading();
            //chart.setOption(option);
        },
        chartAddData: function () {

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