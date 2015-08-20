/**
 * Created by xiaowei on 15-8-20.
 */
var data_convert = {
    convertData: function (data) {
        try {
            var result = [];
            data.forEach(function (item) {
                item.key.forEach(function (k, index) {
                    var _tmp = {};
                    _tmp["label"] = data_convert.convertChinese(item.label);
                    _tmp["value"] = item.quota[index];
                    _tmp["key"] = k;
                    result.push(_tmp);
                });
            });
            console.log(result);
        } catch (e) {

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
            case "conversions":
                return "转化次数";
            case "ip":
                return "IP数";
            case "vc":
                return "访问次数";
            case "nuv":
                return "新访客数";
            case "nuvRate":
                return "新访客比率";
            case "cost":
                return "消费";
            case "click":
                return "点击量";
            case "ctr":
                return "点击率";
            case "impression":
                return "展现量";
            case "cpc":
                return "平均点击价格";
            case "avgPage":
                return "平均访问页数";
                break;
            case "transformCost":
                return "平均转化成本(事件)";
                break;
            case "avgCost":
                return "平均转化成本(页面)";
                break;
            case "crate":
                return "转化率";
                break;
            case "clickTotal":
                return "事件点击总数";
            case "visitNum":
                return "唯一访客事件数";
            case "benefit":
                return "收益";
                break;
            case "profit":
                return "利润";
                break;
            case "orderNum":
                return "订单数";
                break;
            case "orderMoney":
                return "订单金额";
                break;
            case "orderNumRate":
                return "订单转化率";
                break;
            default :
                return "浏览量(PV)";
        }
    }
}

module.exports = data_convert;