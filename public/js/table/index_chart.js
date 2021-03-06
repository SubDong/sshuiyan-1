/**
 * Created by john on 2015/3/11.
 */


/**
 * param:
 * id chart_div_id
 * option: {
 *  xdata:[ category items],
 *  datas: [{
 *      name: "",
 *      values:[]
 *  }]
 *
 * }
 */
function refresh(id, option) {
    var myChart = echarts.init(document.getElementById(id));
    var option = {
        calculable: true,
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: option['xdata']
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

    var datas = option.datas;
    if(!datas){
        datas.forEach(function(data){
            option.series.push({
                name: data['name'],
                type: 'line',
                data: data['values'],
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
            })
        })
    }
    // 为echarts对象加载数据
    myChart.setOption(option);
    //var myChart = echarts.init(document.getElementById('gest_map'));
    //var option = {
    //    calculable: true,
    //    xAxis: [
    //        {
    //            type: 'category',
    //            data: ['北京', '广州', '内蒙', '澳门', '武汉', '长沙', '福建', '河北', '辽宁', '陕西']
    //        }
    //    ],
    //    yAxis: [
    //        {
    //            type: 'value'
    //        }
    //    ],
    //    series: [
    //        {
    //            name: '蒸发量',
    //            type: 'bar',
    //            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
    //            markPoint: {
    //                data: [
    //                    {type: 'max', name: '最大值'},
    //                    {type: 'min', name: '最小值'}
    //                ]
    //            },
    //            markLine: {
    //                data: [
    //                    {type: 'average', name: '平均值'}
    //                ]
    //            }
    //        },
    //        {
    //            name: '降水量',
    //            type: 'bar',
    //            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
    //            markPoint: {
    //                data: [
    //                    {name: '年最高', value: 182.2, xAxis: 7, yAxis: 183, symbolSize: 18},
    //                    {name: '年最低', value: 2.3, xAxis: 11, yAxis: 3}
    //                ]
    //            },
    //            markLine: {
    //                data: [
    //                    {type: 'average', name: '平均值'}
    //                ]
    //            }
    //        }
    //    ]
    //};
    //// 为echarts对象加载数据
    //myChart.setOption(option);

};