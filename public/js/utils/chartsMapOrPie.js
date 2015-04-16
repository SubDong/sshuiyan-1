/**
 * Created by SubDong on 2015/4/14.
 */
var mixingMap = {
    mapOrPie: function (data, chart) {
        if (!chart) return;
        var option = {
            loadingText:"数据读取中...",
            tooltip : {
                trigger: 'item'
            },
            legend: {
                x:'right',
                orient:'vertical',
                data:data.data_name
            },
            dataRange: {
                orient: 'horizontal',
                min: 0,
                max: 1500,
                text:['高1500','0低'],           // 文本，默认为数值文本
                splitNumber:0
            },
            series: [
                {
                    name: data.title_name,
                    type: 'map',
                    mapType: 'china',
                    mapLocation: {
                        x: '20%'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c}"
                    },
                    itemStyle:{
                        emphasis:{label:{show:true}}
                    },
                    data:data.chart_data
                },
                {
                    name:data.title_name,
                    type: 'pie',
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    center: ['80%', '50%'],
                    selectedMode: false,
                    selected: true,
                    data: data.chart_data
                }
            ]
        };
        chart.setOption(option);
    }
};