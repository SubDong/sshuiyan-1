/**
 * Created by yousheng on 15/3/21.
 */

function update(id, start, end, type) {
    $.get("/api/time?start=" + start + "&end=" + end + "&type=" + type).success(function (data) {

        var myChart = echarts.init(document.getElementById(id));


        var jsons = JSON.parse(data);

        var option = {
            calculable: true,
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
            series: [
            ]
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

        myChart.setOption(option);


    }).error(function (err) {
        console.error(err)
    })
}
