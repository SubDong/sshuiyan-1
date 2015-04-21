/**
 * Created by yousheng on 15/3/24.
 */
//typeOption={type:"xxxxx",data:object....}
var chartUtils = {
    convertEnglish: function (chi) {
        switch (chi) {
            case "访客数(UV)":
                return "uv";
            case "跳出率":
                return "outRate";
            case "抵达率":
                return "arrivedRate";
                break;
            case "平均访问时长":
                return "avgTime";
                break;
            case "页面转化":
                return "pageConversion";
            case "IP数":
                return "ip";
            case "访问次数":
                return "vc";
            case "新访客数":
                return "nuv";
            case "新访客比率":
                return "nuvRate";
                break
            default :
                return "pv";
        }
    },
    convertChinese: function (eng) {
        switch (eng) {
            case "uv":
                return "访客数(UV)";
            case "outRate":
                return "跳出率";
            case "arrivedRate":
                return "抵达率";
                break;
            case "avgTime":
                return "平均访问时长";
                break;
            case "pageConversion":
                return "页面转化";
            case "ip":
                return "IP数";
            case "vc":
                return "访问次数";
            case "nuv":
                return "新访客数";
            case "nuvRate":
                return "新访客比率";
            default :
                return "浏览量(PV)";
        }
    },
    getDevice: function (number) {
        switch (Number(number)) {
            case 0:
                return "PC"
                break;
            case 1:
                return "移动";
                break;
            default :
                return "其他";
                break;
        }
    },
    getLinked: function (number) {
        switch (Number(number)) {
            case 1:
                return "直接访问";
                break;
            case 2:
                return "搜索引擎";
            break;
            default :
                return "外部链接";
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