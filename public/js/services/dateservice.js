/**
 * Created by baizz on 2015-3-25.
 */
app.service('requestService', ['$rootScope', '$http', function ($rootScope, $http) {
    this.request = function (id, start, end, opt) {
        var chart = echarts.init(document.getElementById(id));
        chart.showLoading({
            text: "正在努力的读取数据中..."
        });

        $http.get("/api/charts?start=" + start + "&end=" + end + "&type=" + opt.type + "&int=" + opt.interval).success(function (data) {
            //var jsonObj = JSON.parse(data);
            //
            //var option = {
            //    calculable: true,
            //    legend: {
            //        data: ['PV', 'UV']
            //    },
            //    tooltip: {
            //        trigger: 'axis'
            //    },
            //    toolbox: {
            //        show: true,
            //        feature: {
            //            mark: {show: true},
            //            magicType: {show: true, type: ['line', 'bar']},
            //            restore: {show: true},
            //            saveAsImage: {show: true}
            //        }
            //    },
            //    xAxis: [
            //        {
            //            type: 'category',
            //            boundaryGap: false,
            //            data: jsonObj.lables
            //        }
            //    ],
            //    yAxis: [
            //        {
            //            type: 'value',
            //            axisLabel: {
            //                formatter: '{value} 次访问'
            //            }
            //        }
            //    ],
            //    series: []
            //};
            //
            //var types = opt.type.split(",");
            //var lables = [];
            //types.forEach(function (item) {
            //    var serie = {
            //        name: item,
            //        type: "line",
            //        data: jsonObj[item],
            //        markPoint: {
            //            data: [
            //                {type: 'max', name: '最大值'},
            //                {type: 'min', name: '最小值'}
            //            ]
            //        },
            //        markLine: {
            //            data: [
            //                {type: 'average', name: '平均值'}
            //            ]
            //        }
            //    };
            //    option.series.push(serie)
            //});
            //
            //chart.hideLoading();
            //chart.setOption(option);

        }).error(function (err) {
            console.error(err);
        })
    };

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
