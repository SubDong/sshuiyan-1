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
    getLanguage: function (str) {
        switch (str) {
            case "zh-CN":
                return "简体中文";
                break;
            default :
                return "其他";
        }
    },
    getCustomDevice: function (val, dimension) {
        switch (dimension.toString()) {
            case "pm":
                return this.getDevice(val);
                break;
            case "ja":
                return this.getSupport(val);
                break;
            case "ck":
                return this.getSupport(val);
                break;
            case "lg":
                return this.getLanguage(val);
                break;
            default :
                return val;
        }
    },
    getSupport: function (number) {
        if (number == "1") {
            return "支持";
        } else {
            return "不支持";
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
        var label = chartUtils.getLabel(json);//去重
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
            } else {
                label.push("暂无数据");
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

                var _val = 0;
                e.quota.forEach(function (val) {
                    if (val != 0) {
                        _val += val;
                    }
                });
                if (_val != 0) {
                    _data.push(_val);
                    _label.push(e.label);
                }
            });
            result["key"] = _label;
            result["quota"] = _data;
            result_data.push(result);
            return result_data;
        }
        return data;
    },
    getByHourByDayData: function (data) {
        var json = JSON.parse(eval("(" + data + ")").toString());
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
                    _tmp.push(data.quota[j]);
                }
                final_tmp = chartUtils.arrayMerge(final_tmp, _tmp);
            }
            tmp["label"] = chartUtils.convertChinese(data.label);
            tmp["key"] = time;
            tmp["quota"] = final_tmp;
            final_result.push(tmp);
        });
        return final_result;
    },
    getExternalinkPie: function (result) {
        if (result) {
            var regex = /(baidu)+|(sogou)+|(haosou)+/, final_result = [];
            result.forEach(function (e) {
                var _val = {}
                if (!regex.test(e.label) && e.label != '-') {
                    var _label = e.label;
                    if (_label) {
                        if (_label.indexOf('?') > -1) {
                            _label = _label.split('?')[0];
                        }
                    }
                    _val['label'] = _label;
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