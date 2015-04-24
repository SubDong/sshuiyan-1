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
    },
    getObjectTime: function (json, start) {
        var time = [];
        json.forEach(function (e) {
            if (start <= -7) {
                time.push((e.key_as_string).toString().substr(0, 10));
            } else {
                time.push(Number((e.key_as_string).toString().substring(10, 13)));
            }
        })
        return time
    },
    getObject: function (json, key, types) {
        var val = [];
        json.forEach(function (e) {
            var _val = 0;
            var buckets = e.dimension.buckets
            if (buckets) {
                buckets.forEach(function (buc) {
                    if (buc) {
                        if (buc.key == key) {
                            var aggs = chartUtils.getAggs(types.toString());
                            if (buc[aggs + "_aggs"]) {
                                _val = buc[aggs + "_aggs"].value;
                            }
                        }
                    }
                })
            }
            val.push(_val);
        });
        return val;
    },
    getRf_type: function (json, start, labelType, types) {
        var time = chartUtils.getObjectTime(json, start);
        var label = chartUtils.getLabel(json);
        var result = []
        label.forEach(function (label) {
            var tmp = {};
            var val = chartUtils.getObject(json, label, types);
            if (labelType) {
                tmp['label'] = label;
            } else {
                tmp['label'] = chartUtils.getLinked(label);
            }
            tmp['key'] = time;
            tmp['quota'] = val;
            result.push(tmp);
        });
        return result;
    },
    getLabel: function (json) {
        var label = [];
        json.forEach(function (e) {
            var buckets = e.dimension.buckets;
            if (buckets) {
                buckets.forEach(function (item) {
                    label.push(item.key);
                });
            }
        });
        return label.removal();
    },
    getAggs: function (res) {
        switch (res) {
            case "nuv":
                return "new_visitor";
            default :
                return res;
        }
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
    getEnginePie: function (data) {
        if (data) {
            var result_data = [];
            var _label = [];
            var _data = []
            var result = {};
            data.forEach(function (e) {
                _label.push(e.label);
                var _val = 0;
                e.quota.forEach(function (val) {
                    if (val != 0) {
                        _val += val;
                    }
                });
                _data.push(_val);
            });
            result["key"] = _label;
            result["quota"] = _data;
            result_data.push(result);
            return result_data;
        }
        return data;
    },
    getEngine: function (data) {
        if (data) {
            var final_result = [];
            var result_baidu = {};
            var result_360 = {};
            var result_sdog = {};
            var s_baidu = [];
            var s_360 = [];
            var s_dog = [];
            for (var i = 0; i < 24; i++) {
                s_baidu.push(0);
                s_360.push(0);
                s_dog.push(0);
            }
            var time = [];
            data.forEach(function (item) {
                if (item.label.indexOf("baidu") > -1) {
                    s_baidu = chartUtils.arrayMerge(s_baidu, item.quota);
                } else if (item.label.indexOf("haosou") > -1) {
                    s_360 = chartUtils.arrayMerge(s_360, item.quota);
                } else if (item.label.indexOf("sogou") > -1) {
                    s_dog = chartUtils.arrayMerge(s_dog, item.quota);
                }
                time = item.key;
            });
            result_baidu["label"] = "百度";
            result_baidu["key"] = time;
            result_baidu["quota"] = s_baidu;
            final_result.push(result_baidu);
            result_360["label"] = "360";
            result_360["key"] = time;
            result_360["quota"] = s_360;
            final_result.push(result_360);
            result_sdog["label"] = "搜狗";
            result_sdog["key"] = time;
            result_sdog["quota"] = s_dog;
            final_result.push(result_sdog);

            return final_result;
        }
        return data;
    },
    getExternalinkPie: function (result) {
        if (result) {
            var regex = /(baidu)+|(sogou)+|(haosou)+/, final_result = [];
            result.forEach(function (e) {
                var _val = {}
                if (!regex.test(e.label) && e.label != '-') {
                    _val['label'] = e.label;
                    _val['key'] = e.key;
                    _val['quota'] = e.quota;
                    final_result.push(_val);
                }
            });
            return final_result;
        }
        return result
    }
}
Array.prototype.removal = function () {
    this.sort();
    var re = [this[0]];
    for (var i = 1; i < this.length; i++) {
        if (this[i] !== re[re.length - 1]) {
            re.push(this[i]);
        }
    }
    return re;
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