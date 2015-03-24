/**
 * Created by yousheng on 15/3/21.
 */

function request(id, start, end, option) {
    var chart = echarts.init(document.getElementById(id));

    chart.showLoading({
        text: "正在努力的读取数据中..."
    })

    $.get("/api/data?start=" + start + "&end=" + end + "&type=" + type).success(function (data) {

        var jsons = JSON.parse(data);

        var option = {
            calculable: true,
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: jsons.lables
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: []
        };

        var types = type.split(",")
        var lables = [];
        types.forEach(function (item) {

            var serie = {
                name: item,
                type: 'line',
                data: jsons[item],
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

            //var buckets = aggs[item].buckets
            //buckets.forEach(function (bucket) {
            //    serie.data.push(bucket['doc_count'])
            //    lables.push(bucket['key'])
            //})
            option.series.push(serie)
        })

        //datas.forEach(function (data) {
        //    option.xAxis[0].data.push(data['key'])
        //})


        chart.hideLoading();

        chart.setOption(option);


    }).error(function (err) {
        console.error(err)
    })
}