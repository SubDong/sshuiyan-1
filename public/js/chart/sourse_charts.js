/**
 * Created by john on 2015/3/12.
 */
$(document).ready(function () {
    var myChart = echarts.init(document.getElementById('sourse_charts'));
    var option = {
        title : {
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        calculable : true,
        series : [
            {
                name:'搜索引擎',
                type:'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'搜索引擎'},
                    {value:310, name:'直接访问'},
                    {value:310, name:'外部连接'}
                ]
            }
        ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
});
