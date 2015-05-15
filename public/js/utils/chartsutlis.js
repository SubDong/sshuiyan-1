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
            case "转化":
                return "conversion";
            case "IP数":
                return "ip";
            case "访问次数":
                return "vc";
            case "新访客数":
                return "nuv";
            case "新访客比率":
                return "nuvRate";
            case "消费":
                return "cost";
            case "点击量":
                return "click";
            case "点击率":
                return "ctr";
            case "展现量":
                return "impression";
            case "平均点击价格":
                return "cpc";
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
            case "conversion":
                return "转化";
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
        var result = [];
        label.forEach(function (label) {
            if (label) {
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
            }
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
    getEnginePie: function (data, split) {
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
                    if (split) {
                        _label.push(e.label.split(split)[0]);
                    } else {
                        _label.push(e.label);
                    }
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
                    switch (data.label) {
                        case "avgTime":
                            _tmp.push(parseInt(data.quota[j] / length));
                            break;
                        case "outRate":
                            _tmp.push(parseInt(data.quota[j] / length));
                            break;
                        case "outRate":
                            _tmp.push(parseInt(data.quota[j] / length));
                            break;
                        default :
                            _tmp.push(parseInt(data.quota[j]));
                            break;
                    }

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
    getExternalinkPie: function (result, split) {
        if (result) {
            var regex = /(baidu)+|(sogou)+|(haosou)+/, final_result = [];
            result.forEach(function (e) {
                var _val = {}
                if (!regex.test(e.label) && e.label != '-') {
                    var _label = e.label;
                    if (_label) {
                        if (split) {
                            if (_label.indexOf(split) > -1) {
                                _label = _label.split(split)[0];
                            }
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
    },
    by: function (name) {
        return function (o, p) {
            var a, b;
            if (typeof o === "object" && typeof p === "object" && o && p) {
                a = o[name];
                b = p[name];
                if (a === b) {
                    return 0;
                }
                if (typeof a === typeof b) {
                    return a < b ? 1 : -1;
                }
                return typeof a < typeof b ? 1 : -1;
            }
            else {
                throw ("error");
            }
        }
    },
    addStep: function (json, number) {
        json.forEach(function (e) {
            var _key = [];
            var _value = []
            for (var i = 0; i < number / 2; i++) {
                _key.push("");
                _value.push(0);
            }
            for (var i = 0; i < e.key.length; i++) {
                _key.push(e.key[i]);
                _value.push(e.quota[i]);
            }
            for (var i = number / 2; i < number; i++) {
                _key.push("");
                _value.push(0);
            }
            e.key = _key;
            e.quota = _value;
        });
    },
    formatDate: function (esJson) {
        esJson.forEach(function (a) {
            var formatKey = [];
            a.key.forEach(function (e) {
                formatKey.push(e.substring(0, 10));
            });
            a.key = formatKey;
            a.label = chartUtils.convertChinese(a.label);
        });
    },
    addSemData: function (esJson, semJson, semType) {
        var _tmp = {};
        var _label = [];
        var _value = [];
        esJson[0].key.forEach(function (esItem, index) {
            //if (esItem == final_result[0].data[index].date) {
            _value.push(semJson.data[index][semType]);
            //}
            //console.log(final_result[0].data[index].date+">>"+final_result[0].data[index][semType]);
        });
        _tmp["label"] = chartUtils.convertChinese(semType);
        _tmp["key"] = esJson[0].key;
        _tmp["quota"] = _value;
        esJson.push(_tmp);
    },
    getSemBaseData: function (quotas, final_result,semName) {
        var total_result = [];
        quotas.forEach(function (quota) {
            var _key = [];
            var _value = [];
            var _tmp = {};
            final_result[0].data.forEach(function (e) {
                _key.push(e[semName]);
                _value.push(e[quota]);
            });
            _tmp["label"] = chartUtils.convertChinese(quota);
            _tmp["key"] = _key;
            _tmp["quota"] = _value;
            total_result.push(_tmp);
        });
        return total_result;
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