/**
 * Created by baizz on 2015-3-25.
 */
app.service('requestService', ['$rootScope', '$http', function ($rootScope, $http) {
    this.request = function (id, start, end, opt) {
        var chart = echarts.init(document.getElementById(id));
        chart.showLoading({
            text: "正在努力的读取数据中..."
        });
        //chart.on(echarts.EVENT.LEGEND_SELECTED, function (param){
        //    console.log(param);
        //});
        chart.on(echarts.config.EVENT.LEGEND_SELECTED, function (param){
            console.log(param.target);
        });
        var types = opt.type.toString();
        var queryTypes = [];
        if (types.indexOf(",") > -1)queryTypes = types.split(",");
        else queryTypes.push(types);
        queryTypes.forEach(function (etype) {
            $http.get("/api/charts?start=" + start + "&end=" + end + "&type=" + etype + "&int=" + opt.interval).success(function (data) {
                if (data.data[0] != undefined) {
                    initChartFunc(data, chart);
                }
            }).error(function (err) {
                console.error(err)
            })
        });
    },
        this.mapRequest = function (id, start, end, type) {
            var chart = echarts.init(document.getElementById(id));
            chart.showLoading({
                text: "正在努力的读取数据中..."
            });
            $http.get("/api/map?start=" + start + "&end=" + end + "&type=" + type).success(function (data) {
                var option = {
                    title: {
                        text: '访客分布图',
                        subtext: '测试阶段',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: ['访客']
                    },
                    dataRange: {
                        min: 0,
                        max: 2500,
                        x: 'left',
                        y: 'bottom',
                        text: ['高', '低'],           // 文本，默认为数值文本
                        calculable: true
                    },
                    toolbox: {
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
                    },
                    series: []
                };
                var name = data.name;
                var series = {
                    name: name,
                    type: 'map',
                    mapType: 'china',
                    data: [],
                    itemStyle: {
                        normal: {label: {show: true}},
                        emphasis: {label: {show: true}}
                    }
                };
            var name = data.name;
            var series = {
                name: name,
                type: 'map',
                mapType: 'china',
                data: [],
                itemStyle: {
                    normal: {label: {show: true}},
                    emphasis: {label: {show: true}}
                }
            }
            data.data.forEach(function (item) {
                series.data.push(item);
            });
            option.series.push(series);
            chart.hideLoading();
            chart.setOption(option);
        }).error(function (err) {
            console.error(err)
        });
    }
}]);
function initChartFunc(data, chart) {
    var json = data.data;
    var times = [];
    json.forEach(function (e) {
        times.push(e.time);
    });
    var option = {
        calculable: true,
        legend: {
            data: ['pv', 'uv','outrate']
        },
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: times
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    formatter: '{value} 次访问'
                }
            }
        ],
        series: []
    };
    var serie = {
        name: data.label,
        type: "line",
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
        serie.data.push(item.value);
    });
    option.series.push(serie)
    chart.hideLoading();
    chart.setOption(option);
}
