/**
 * Created by john on 2015/3/12.
 */
$(document).ready(function () {
    var myChart = echarts.init(document.getElementById('environment_map'));
    var option = {
        title : {
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient : 'vertical',
            x : 'left',
            data:['移动','PC']
        },
        calculable : true,
        series : [
            {
                name:'移动',
                type:'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'移动'},
                    {value:310, name:'PC'}
                ]
            }
        ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
});
