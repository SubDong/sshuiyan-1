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
                time.push((e.key_as_string).toString().substr(10, 12));
            }
        })
        return time
    },
    getObject: function (json, key) {
        var val = [];
        json.forEach(function (e) {
            var _val = 0;
            var buckets = e.dimension.buckets
            if (buckets) {
                buckets.forEach(function (buc) {
                    if (buc) {
                        if (buc.key == key) {
                            _val = buc.doc_count;
                        }
                    }
                })
            }
            val.push(_val);
        });
        return val;
    },
    getRf_type: function (json, start, labelType) {
        var time = chartUtils.getObjectTime(json, start);
        var label = chartUtils.getLabel(json);
        var result = []
        label.forEach(function (label) {
            var tmp = {};
            var val = chartUtils.getObject(json, label);
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