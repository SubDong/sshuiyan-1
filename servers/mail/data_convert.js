/**
 * Created by xiaowei on 15-8-20.
 */
var data_convert = {
    convertData: function (data, rule_url, dismension) {
        try {
            var result = [];
            switch (rule_url) {
                case "month":
                    data = data_convert.getByHourByDayData(data);
                    break;
                case "seven":
                    data = data_convert.getByHourByDayData(data);
                    break;
            }
            data[0].key.forEach(function (key, index) {
                var _tmp = {};
                switch (dismension) {
                    case "rf_type":
                        _tmp["来源类型"] = data_convert.getLinked(key);
                        break;
                    case "se":
                        _tmp["搜索引擎"] = key != "-" ? key : "其他";
                        break;
                    case "kw":
                        _tmp["搜索词"] = key;
                        break;
                    case "rf":
                        _tmp["外部连接"] = key;
                        break;
                    case "loc":
                        _tmp["受访页面"] = key;
                        break;
                    default:
                        switch (rule_url) {
                            case "month":
                                _tmp["时间"] = key + ":00 - " + key + ":59";
                                break;
                            case "seven":
                                _tmp["时间"] = key + ":00 - " + key + ":59";
                                break;
                            default :
                                var dateFormat = new Date(key).LocalFormat("yyyy-MM-dd hh:mm:ss");
                                _tmp["时间"] = dateFormat.substring(dateFormat.indexOf(" "), dateFormat.length - 3) + " - " + dateFormat.substring(dateFormat.indexOf(" "), dateFormat.length - 5) + "59";
                                break;
                        }
                        break;
                }
                data.forEach(function (d, count) {
                    switch (d.label) {
                        case "outRate":
                            _tmp[data_convert.convertChinese(d.label)] = d.quota[index] + "%"
                            break;
                        case "nuvRate":
                            _tmp[data_convert.convertChinese(d.label)] = d.quota[index] + "%"
                            break;
                        case "avgTime":
                            var value = d.quota[index];
                            var days = Math.floor(value / 1440 / 60);
                            var hours = Math.floor((value - days * 1440 * 60) / 3600);
                            var minutes = Math.floor((value - days * 1440 * 60 - hours * 3600) / 60);
                            var seconds = Math.floor((value - days * 1440 * 60 - hours * 3600 - minutes * 60));
                            _tmp[data_convert.convertChinese(d.label)] = data_convert.getDoubleInteger(hours) + ":" + data_convert.getDoubleInteger(minutes) + ":" + data_convert.getDoubleInteger(seconds);
                            break;
                        default :
                            _tmp[data_convert.convertChinese(d.label)] = d.quota[index];
                            break;
                    }
                })
                result.push(_tmp);
            });
            return (result);
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
    },
    getDoubleInteger: function (val) {
        val = val.toString();
        if (val.length < 2) {
            val = "0" + val.toString();
        }
        return val.toString();
    },
    arrayMerge: function (a, b) {
        if (b.length > a.length) {
            var t = a
            a = b
            b = t
        }
        return a.map(function (v, i) {
            return v + (b[i] || 0)
        })
    },
    getByHourByDayData: function (data) {
        var json = data;
        var final_result = [];
        json.forEach(function (data) {
            var tmp = {};
            var label = [];
            var key = [];
            var quota = [];
            label.push(data.label);
            var time = [];
            for (var i = 0; i < data.key.length; i++) {
                for (var j = 0; j < 24; j++) {
                    if (i == j) {
                        time.push(j);
                    }
                }
            }
            var length = data.quota.length / 24;
            var final_tmp = [];
            for (var i = 0; i < 24; i++) {
                final_tmp.push(0);
            }
            for (var i = 0; i < length; i++) {
                var _tmp = [];
                for (var j = i * 24; j < (i + 1) * 24; j++) {
                    switch (data.label) {
                        case "avgTime":
                            _tmp.push(parseInt(data.quota[j] / length));
                            break;
                        case "outRate":
                            _tmp.push(parseInt(data.quota[j] / length));
                            break;
                        case "nuvRate":
                            _tmp.push(parseInt(data.quota[j] / length));
                            break;
                        default :
                            _tmp.push(parseInt(data.quota[j]));
                            break;
                    }

                }
                final_tmp = data_convert.arrayMerge(final_tmp, _tmp);
            }
            tmp["label"] = data.label;
            tmp["key"] = time;
            tmp["quota"] = final_tmp;
            final_result.push(tmp);
        });
        //console.log(final_result);
        return final_result;
    },
    getLinked: function (number) {
        switch (Number(number)) {
            case 0:
                return "内站访问";
                break;
            case 1:
                return "直接访问";
                break;
            case 2:
                return "搜索引擎";
                break;
            default :
                return "外部链接";
        }
    },
    convertChangeListData: function (data, ss, css) {
        var result = [];
        result.push({
            "站点名称": "站点首页",
            "www.best-ad.cn": "best-ad.cn",
            " ": "",
            "  ": ""
        });
        result.push({
            "站点名称": "来源分析-来源升降榜(来路域名)(指标：pv)(" + ss + "对比" + css + ")",
            "www.best-ad.cn": "",
            " ": "",
            "  ": ""
        });
        result.push({
            "站点名称": "来路域名",
            "www.best-ad.cn": ss,
            " ": css,
            "  ": "变化情况"
        });
        data["pv"].forEach(function (d, count) {
            var _tmp = {
                "站点名称": d["pathName"],
                "www.best-ad.cn": d["pv"],
                " ": d["contrastPv"],
                "  ": d["percentage"]
            };
            result.push(_tmp);
        });
        result.push({
            "站点名称": "全站统计",
            "www.best-ad.cn": data["sum_pv"],
            " ": data["contrast_sum_pv"],
            "  ": data["percentage"]
        });
        result.push({
            "站点名称": "Power by best-ad.cn",
            "www.best-ad.cn": "",
            " ": "",
            "  ": ""
        });
        return result;
    }
}

module.exports = data_convert;