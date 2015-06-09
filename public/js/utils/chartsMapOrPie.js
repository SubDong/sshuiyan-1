/**
 * Created by SubDong on 2015/4/14.
 */
var mixingMap = {
    mapOrPie: function (data, chart) {
        var max = 200;
        if (data) {
            if (data.chart_data.length) {
                max = data.chart_data.sort(chartUtils.by("value"))[0].value;
            }
        }
        max = Number(max * 1.3).toFixed(0);
        if (!chart) return;
        var option = {
            loadingText: "数据读取中...",
            tooltip: {
                trigger: 'item',
                backgroundColor: '#fff',
                borderColor: '#ededed',
                borderWidth: 1,
                padding: 10,
                textStyle: {
                    color: '#000',
                    decoration: 'none',
                    fontSize: 12
                }
            },
            legend: {
                x: 'right',
                orient: 'vertical',
                data: data.data_name
            },
            dataRange: {
                orient: 'horizontal',
                min: 0,
                max: max,
                text: [chart.quota + ":", '']     // 文本，默认为数值文本
            },
            series: [
                {
                    name: data.title_name,
                    type: 'map',
                    mapType: 'china',
                    mapLocation: {
                        x: '10%'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c}"
                    },
                    itemStyle: {
                        emphasis: {label: {show: true}},
                        normal: {
                            borderWidth: 1,
                            borderColor: '#fff',
                            color: '#E6E6E6',
                            label: {
                                show: false
                            }
                        }
                    },
                    data: data.chart_data
                },
                {
                    name: data.title_name,
                    type: 'pie',
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    center: ['80%', '50%'],
                    radius: ["0", "50%"],
                    selectedMode: false,
                    selected: true,
                    data: data.chart_data
                }
            ]
        };
        chart.setOption(option);
    }
};