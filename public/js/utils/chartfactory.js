/**
 * Created by XiaoWei on 2015/4/9.
 */
var checked = [0, 1];
var cf = {
    renderChart: function (data, chartConfig) {
        var _self = op;
        var _clear = clear;
        if (!chartConfig)console.error("chartConfig is required");
        var chartType = !chartConfig.chartType ? "line" : chartConfig.chartType;
        switch (chartType) {
            case "line":
                _self.lineChart(data, chartConfig);
                break;
            case"bar":
                _self.barChart(data, chartConfig);
                break;
            case "pie":
                _self.pieChart(data, chartConfig);
                break;
            case "map":
                _self.mapChart(data, chartConfig);
                break;
            default :
                _self.lineChart(data, chartConfig);
                break;
        }
    }
}
var init = {
    lineChart: function (chartConfig) {
        if (!chartConfig.instance)return;
        var instance = chartConfig.instance;
        var option = {
            legend: {
                show: false,
                selectedMode: false,
                orient: !chartConfig.ledLayout ? "horizontal" : chartConfig.ledLayout,
                data: !chartConfig.legendData ? [data.label] : chartConfig.legendData
            },
            tooltip: {
                trigger: !chartConfig.tt ? "axis" : chartConfig.tt
            },
            calculable: true,
            xAxis: [
                {
                    type: !chartConfig.xType ? "category" : chartConfig.xType,
                    boundaryGap: !chartConfig.bGap ? false : chartConfig.bGap,
                    data: []
                }
            ],
            yAxis: [
                {
                    type: !chartConfig.yType ? "value" : chartConfig.yType,
                    axisLabel: {
                        formatter: chartConfig.axFormat
                    }
                },
                {
                    'type': !chartConfig.yType ? "value" : chartConfig.yType
                }
            ],
            series: []
        }
        chartConfig.toolShow = !chartConfig.toolShow ? false : true;
        if (chartConfig.toolShow) {
            option["toolbox"] = {
                show: true,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            }
        }

        chartConfig.legendData.forEach(function (legend) {
            var serie = {
                name: legend,
                type: !chartConfig.chartType ? "line" : chartConfig.chartType,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: []
            };
            option.series.push(serie);
        });
        instance.setOption(option);
    }
}
var op = {
    lineChart: function (data, chartConfig) {
        if (!data.length) {
            def.defData(chartConfig);
            return;
        }
        var json, labelData = [];
        if (chartConfig.noFormat) {
            json = data;
            chartConfig.legendData = labelData;
        } else {
            json = JSON.parse(eval('(' + data + ')').toString());
        }
        if (!json[0]) {
            chartConfig.instance = echarts.init(document.getElementById(chartConfig.id));
            def.defData(chartConfig);
            return;
        }
        if (!json[0].key.length) {
            def.defData(chartConfig);
            return;
        }
        json.forEach(function (item) {
            labelData.push(item.label);
        });
        if (!chartConfig.instance)return;
        var chartObj = chartConfig.instance;
        chartObj.xAxis = [];
        var option = {
            legend: {
                show: false,
                selectedMode: false,
                orient: !chartConfig.ledLayout ? "horizontal" : chartConfig.ledLayout,
                data: !chartConfig.legendData ? labelData : chartConfig.legendData
            },
            tooltip: {
                trigger: !chartConfig.tt ? "axis" : chartConfig.tt,
                formatter: function (params, ticket, callback) {
                    var res = params[0].name + '<br/>';
                    for (var i = 0, l = params.length; i < l; i++) {
                        var formatType = labelData[i];
                        res += params[i].seriesName + ' : ' + ad.formatFunc(params[i].value, formatType) + '<br/>';
                    }
                    return res;
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: !chartConfig.xType ? "category" : chartConfig.xType,
                    boundaryGap: !chartConfig.bGap ? false : chartConfig.bGap,
                    data: []
                }
            ],
            yAxis: [
                {
                    type: !chartConfig.yType ? "value" : chartConfig.yType,
                    axisLabel: {
                        formatter: chartConfig.axFormat
                    }
                },
                {
                    'type': !chartConfig.yType ? "value" : chartConfig.yType
                }
            ],
            series: []
        };
        if (chartConfig.auotHidex) {
            option.xAxis[0]["axisLabel"] = {
                interval: 0
            }
        }
        if (chartConfig.chartType == "line") {
            option["color"] = ['#ff7f50', '#87cefa']
        }
        chartConfig.toolShow = !chartConfig.toolShow ? false : true;
        if (chartConfig.toolShow) {
            option["toolbox"] = {
                show: true,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            }
        }
        chartConfig.dataKey = !chartConfig.dataKey ? "key" : chartConfig.dataKey;
        chartConfig.dataValue = !chartConfig.dataValue ? "quota" : chartConfig.dataValue;
        var xData = [];
        var select = {};

        json.forEach(function (item) {
            select[chartUtils.convertChinese(item.label)] = true;
            var serie = {
                name: !chartConfig.noFormat ? chartUtils.convertChinese(item.label) : item.label,
                type: !chartConfig.chartType ? "line" : chartConfig.chartType,
                data: item[chartConfig.dataValue]
            };
            if (chartConfig.lineType == undefined) {
                serie.itemStyle = {normal: {areaStyle: {type: 'default'}}}
            }
            if (chartConfig.min_max == undefined) {
                serie["markPoint"] = {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                }
            }
            xData.push(util.getX(item, chartConfig));
            option.series.push(serie);
        });
        if (!chartConfig.twoYz) {
            for (var i = 0; i < labelData.length; i++) {
                if (labelData[i] == "uv" || labelData[i] == "pv") {
                    option.series[0]["yAxisIndex"] = 0;
                } else {
                    var formatType = labelData[i];
                    option.series[i]["yAxisIndex"] = i;
                    ad.renderFormat(option, i, formatType);
                }
            }
        }
        option.xAxis[0].data = xData[0];
        option.legend.selected = select;
        chartObj.setOption(option);
    },
    barChart: function (data, chartConfig) {
        chartConfig.interval = 0;
        this.lineChart(data, chartConfig);
    },
    pieChart: function (data, chartConfig) {
        if (!chartConfig.instance)return;
        var chartObj = chartConfig.instance
        var option = {
            tooltip: {
                trigger: !chartConfig.tt ? "item" : chartConfig.tt,
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                show: !chartConfig.legendShow ? false : chartConfig.legendShow,
                orient: !chartConfig.ledLayout ? "vertical" : chartConfig.ledLayout,
                x: 'left',
                data: !chartConfig.legendData ? data.label : chartConfig.legendData
            },
            calculable: true,
            series: []
        };
        chartConfig.toolShow = !chartConfig.toolShow ? false : true;
        if (chartConfig.toolShow) {
            option["toolbox"] = {
                show: true,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'left',
                                max: 1548
                            }
                        }
                    },
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            }
        }
        var serie = {
            name: !chartConfig.serieName ? "请配置图例说明" : chartConfig.serieName,
            type: "pie",
            radius: '55%',
            center: ['50%', '60%'],
            data: []
        };
        if (chartConfig.status) {
            switch (chartConfig.status) {
                case "hu":
                    serie = {
                        name: !chartConfig.serieName ? "请配置图例说明" : chartConfig.serieName,
                        type: "pie",
                        radius: [40, 80],
                        roseType: 'area',
                        data: []
                    }
                    break;
                default :
                    serie = serie;
                    break;
            }
        }
        if (chartConfig.pieStyle == undefined) {
            serie["itemStyle"] =
            {
                normal: {
                    label: {
                        position: 'inner',
                        formatter: function (params) {
                            return (params.percent - 0).toFixed(0) + '%'
                        }
                    },
                    labelLine: {
                        show: false
                    }
                },
                emphasis: {
                    label: {
                        show: true,
                        formatter: "{b}\n{d}%"
                    }
                }

            };
        }
        chartConfig.dataKey = !chartConfig.dataKey ? "key" : chartConfig.dataKey;
        chartConfig.dataValue = !chartConfig.dataValue ? "quota" : chartConfig.dataValue;
        data.forEach(function (e) {
            for (var i = 0; i < e[chartConfig.dataKey].length; i++) {
                var _val = {};
                _val["name"] = e[chartConfig.dataKey][i]
                _val["value"] = Number(e[chartConfig.dataValue][i]);
                serie.data.push(_val);
            }
        })
        option.series.push(serie);
        chartObj.setOption(option);
    },
    mapChart: function (data, chartConfig) {
        if (!chartConfig.instance)return;
        var chartObj = chartConfig.instance
        var option = {
            title: {
                text: !chartConfig.titleText ? "暂无说明" : chartConfig.titleText,
                x: 'center'
            },
            tooltip: {
                trigger: !chartConfig.tt ? 'item' : chartConfig.tt
            },
            legend: {
                orient: !chartConfig.ledLayout ? 'vertical' : chartConfig.ledLayout,
                x: 'left',
                data: !chartConfig.legendData ? [data.label] : chartConfig.legendData
            },
            series: []
        };
        chartConfig.toolbox = !chartConfig.toolbox ? false : chartConfig.toolbox;
        if (chartConfig.toolbox) {
            option["toolbox"] = {
                show: true,
                orient: 'vertical',
                x: 'right',
                y: 'center',
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            }
        }
        if (chartConfig.dataRange == undefined) {
            option["dataRange"] = {
                min: 0,
                max: 2500,
                x: 'left',
                y: 'bottom',
                text: ['高', '低'],           // 文本，默认为数值文本
                calculable: true
            }
        }
        chartConfig.roamController = !chartConfig.roamController ? false : chartConfig.roamController;
        if (chartConfig.roamController) {
            option["roamController"] = {
                show: true,
                x: 'right',
                mapTypeControl: {
                    'china': true
                }
            }
        }
        var serie = {
            //name: chartConfig.serieName,
            type: chartConfig.chartType,
            mapType: 'china',
            roam: false,
            itemStyle: {
                normal: {label: {show: true}},
                emphasis: {label: {show: true}}
            },
            data: []
        }
        chartConfig.dataKey = !chartConfig.dataKey ? "name" : chartConfig.dataKey;
        chartConfig.dataValue = !chartConfig.dataValue ? "value" : chartConfig.dataValue;
        if (data.data) {
            if (data.data[0]) {
                data.data.forEach(function (e) {
                    serie['name'] = data.label;
                    var push_data = {};
                    push_data[chartConfig.dataKey] = e[chartConfig.dataKey]
                    push_data[chartConfig.dataValue] = e[chartConfig.dataValue];
                    push_data["value"]
                    serie.data.push(push_data);
                });
                option.series.push(serie);
            }
        }
        chartObj.hideLoading();
        chartObj.setOption(option);
    }
}
var ad = {
    addData: function (data, chartObj, chartConfig) {
        if (!chartObj)return;
        if (!data.data)return;
        if (data.data[0]) {
            var option = chartObj.getOption();
            //var option = chartObj.getOption();
            //var s_index = option.series.length - 1;
            //var c_type = option.series[s_index].type;
            //var json = data.data;
            //var serie = {
            //    name: chartConfig.showTarget,
            //    itemStyle: {normal: {areaStyle: {type: 'default'}}},
            //    type: c_type,
            //    data: []
            //};
            //if (data.label != "uv") {
            //    serie["yAxisIndex"] = 1;
            //    option.yAxis[1]["axisLabel"] = {
            //        formatter: function (value) {
            //            return ad.formatFunc(value, !chartConfig.axFormat ? undefined : chartConfig.axFormat);
            //        }
            //    };
            //} else {
            //    serie["yAxisIndex"] = 0;
            //}
            //json.forEach(function (item) {
            //    serie.data.push(item[chartConfig.dataValue]);
            //});
            //option.series.push(serie);
            //chartObj.hideLoading();
            //chartObj.setOption(option);
            //console.log(option);
        }
    },
    seriesExist: function (chartObj, target) {
        var option = chartObj.getOption();
        var old_series = option.series;
        var result = true;
        old_series.forEach(function (e) {
            if (e.name == target) {
                result = false;
            }
        });
        return result;
    },
    formatFunc: function (value, formatType) {
        switch (formatType) {
            case "avgTime":
                var days = Math.floor(value / 1440 / 60);
                var hours = Math.floor((value - days * 1440 * 60) / 3600);
                var minutes = Math.floor((value - days * 1440 * 60 - hours * 3600) / 60);
                var seconds = (value - days * 1440 * 60 - hours * 3600 - minutes * 60);
                return this.getDoubleInteger(hours) + ":" + this.getDoubleInteger(minutes) + ":" + this.getDoubleInteger(seconds);
                break;
            case "平均访问时长":
                var days = Math.floor(value / 1440 / 60);
                var hours = Math.floor((value - days * 1440 * 60) / 3600);
                var minutes = Math.floor((value - days * 1440 * 60 - hours * 3600) / 60);
                var seconds = (value - days * 1440 * 60 - hours * 3600 - minutes * 60);
                return this.getDoubleInteger(hours) + ":" + this.getDoubleInteger(minutes) + ":" + this.getDoubleInteger(seconds);
                break;
            case "outRate":
                return value + "%";
                break;
            case "arrivedRate":
                return value + "%";
                break;
            case "跳出率":
                return value + "%";
                break;
            case "抵达率":
                return value + "%";
                break;
            default :
                return value;
                break;
        }
    },
    renderFormat: function (option, index, matchType) {
        switch (matchType) {
            case "avgTime":
                option.yAxis[index]["axisLabel"] = {
                    formatter: function (value) {
                        return ad.formatFunc(value, "avgTime");
                    }
                };
                break;
            case "outRate":
                option.yAxis[index]["axisLabel"] = {
                    formatter: function (value) {
                        return value + "%";
                    }
                };
                break;
            case "arrivedRate":
                option.yAxis[index]["axisLabel"] = {
                    formatter: function (value) {
                        return value + "%";
                    }
                };
                break;
            case "平均访问时长":
                option.yAxis[index]["axisLabel"] = {
                    formatter: function (value) {
                        return ad.formatFunc(value, "平均访问时长");
                    }
                };
                break;
            case "跳出率":
                option.yAxis[index]["axisLabel"] = {
                    formatter: function (value) {
                        return value + "%";
                    }
                };
                break;
            case "抵达率":
                option.yAxis[index]["axisLabel"] = {
                    formatter: function (value) {
                        return value + "%";
                    }
                };
                break;
            default :
                option.yAxis[index]["axisLabel"] = {
                    formatter: function (value) {
                        return value;
                    }
                };
                break;
        }
    },
    getDoubleInteger: function (val) {
        val = val.toString();
        if (val.length < 2) {
            val = "0" + val.toString();
        }
        return val.toString();
    }
}
var clear = {
    lineChart: function (chartConfig, checkedVal) {
        if (!chartConfig.instance) return;
        var instance = chartConfig.instance, option = instance.getOption();
        var select = {};
        chartConfig.legendData.forEach(function (e) {
            select[e] = false;
        })
        if (checkedVal) {
            checkedVal.forEach(function (item) {
                select[chartUtils.convertChinese(item)] = true;
            });
        }
        option.series = [];
        option.legend.selected = select;
        instance.setOption(option);
        instance.restore();
    }
}
var def = {
    defData: function (chartConfig) {
        var instance = chartConfig.instance;
        var option = {
            legend: {
                show: false,
                selectedMode: false,
                orient: !chartConfig.ledLayout ? "horizontal" : chartConfig.ledLayout,
                data: ['暂无数据']
            },
            tooltip: {
                trigger: !chartConfig.tt ? "axis" : chartConfig.tt
            },
            calculable: true,
            xAxis: [
                {
                    type: !chartConfig.xType ? "category" : chartConfig.xType,
                    boundaryGap: !chartConfig.bGap ? false : chartConfig.bGap,
                    data: []
                }
            ],
            yAxis: [
                {
                    type: !chartConfig.yType ? "value" : chartConfig.yType,
                    axisLabel: {
                        formatter: chartConfig.axFormat
                    }
                },
                {
                    'type': !chartConfig.yType ? "value" : chartConfig.yType
                }
            ],
            series: [{
                name: '暂无数据',
                type: !chartConfig.chartType ? "line" : chartConfig.chartType,
                data: [0]
            }]
        }
        var timeType = 24;
        if (chartConfig.keyFormat) {
            if (chartConfig.keyFormat == "day") {
                timeType = 7;
            }
        }
        for (var i = 0; i < timeType; i++) {
            option.xAxis[0].data.push(i);
        }
        //serie.data.push(0);
        //option.xAxis[0].data = xData;
        //option.series.push(serie);
        //if (chartConfig.chartType == "bar") {
        //    option.legend.data = ["暂无数据"];
        //}
        instance.setOption(option);
    }
}
var util = {
    getX: function (item, chartConfig) {
        var _time = [];
        var key = item[chartConfig.dataKey];
        if (chartConfig.keyFormat) {
            if (chartConfig.keyFormat == "none") {
                if (chartConfig.hideChar) {
                    var xAxis = [];
                    key.forEach(function (k) {
                        if (k.length > chartConfig.hideChar) {
                            xAxis.push(k.substring(0, chartConfig.hideChar) + "...");
                        } else {
                            xAxis.push(k);
                        }
                    });
                    return xAxis;
                } else {
                    return key;
                }
            }
            if (chartConfig.keyFormat == "day") {
                var _time = [];
                key.forEach(function (time) {
                    _time.push(time.toString().substr(0, 10));
                });
            } else {
                var _time = [];
                key.forEach(function (time) {
                    _time.push(Number(time.toString().substring(10, 13)));
                });
            }
        } else {
            var _time = [];
            key.forEach(function (time) {
                _time.push(Number(time.toString().substring(10, 13)));
            });
            return _time;
        }
        return _time;
    },
    renderLegend: function (chartObj, c) {
        if (c.legendMultiData) {
            this.addEventMore(chartObj, c);
        } else {
            if (c.legendData.length > 0 && (c.chartType == "line" || c.chartType == "bar")) {
                if (c.legendAllowCheckCount > 1) {
                    this.makeEvent("checkBox", chartObj, c);
                } else {
                    this.makeEvent("radio", chartObj, c);
                }
            }
        }
    },
    makeEvent: function (renderType, chartObj, c) {
        if (c.legendDefaultChecked) {
            checked = [];
            c.legendDefaultChecked.forEach(function (checkedItem) {
                checked.push(checkedItem);
            });
        }
        var chartDiv = $("#" + c.legendId);
        var legendDiv = $("<div/>");
        legendDiv.attr("id", renderType + "_" + c.id);
        legendDiv.attr("style", "width:100%;position:absolute;margin:0px auto;text-align:center;z-index:10;background: #ffffff;");
        //var colorY = [-77, -51];
        for (var i = 0; i < c.legendData.length; i++) {
            var lab = $("<label/>");
            var spn = $("<b/>");
            var rad = $("<input/>");
            rad.attr("type", renderType);
            if (renderType == "checkBox") {
                checked.forEach(function (def) {
                    if (def == i) {
                        rad.prop("checked", true);
                    }
                });
            } else {
                if (i == 0) {
                    rad.prop("checked", true);
                }
            }
            rad.attr("name", renderType + "_" + c.id);
            rad.attr("value", chartUtils.convertEnglish(c.legendData[i]));
            rad.attr("asc", c.legendAllowCheckCount);
            rad.attr("index", i + "");
            rad.attr("chart", c.id);
            rad.attr("class", "styled");
            if (window.addEventListener) {
                rad.bind("click", function () {
                    if (renderType == "checkBox") {
                        util.allowItem(this);
                    }
                    var checkVal = util.legStr(this);
                    if (c.legendClickListener) {
                        c.legendClickListener(this, chartObj, c, checkVal);
                    }
                });
            }
            lab.append(rad);
            spn.html("&nbsp;" + c.legendData[i] + "&nbsp;&nbsp;");
            lab.append(spn);
            legendDiv.append(lab);
        }
        if (renderType == "checkBox") {
            legendDiv.append("<span>*最多只能勾选2项</span>");
        }
        else {
            legendDiv.append("<span>*可同时选择1项</span>");
        }
        chartDiv.append(legendDiv);
    },
    addEventMore: function (chartObj, c) {
        if (c.legendDefaultChecked) {
            checked = [];
            c.legendDefaultChecked.forEach(function (checkedItem) {
                checked.push(checkedItem);
            });
        }
        var legendDiv = $("#" + c.legendId);
        legendDiv.attr("style", "width:100%;position:absolute;margin:0px auto;text-align:center;z-index:10;background: #ffffff;");
        var button = $("<button/>");
        button.attr({
            type: "button",
            class: "btn btn-default fr btn-sm custom_btn",
            value: "指标："
        })
        var _target = false;
        button.bind("click", function () {
            var checkBoxDiv = $("#" + c.legendId + "_check");
            if (_target) {
                checkBoxDiv.attr("class", "plancheckbox collapse")
                _target = false;
            } else {
                checkBoxDiv.attr("class", "plancheckbox collapse in");
                _target = true;
            }
        });
        var b = $("<b/>");
        b.html("请选择指标");
        var caret = $("<span/>");
        caret.attr("class", "caret");
        button.append(b);
        button.append(caret);
        var checkBoxDiv = $("<div/>");
        checkBoxDiv.attr("class", "plancheckbox collapse");
        checkBoxDiv.attr("id", c.legendId + "_check")
        for (var i = 0; i < c.legendMultiData.length; i++) {
            var lab = $("<label/>");
            var spn = $("<span/>");
            var rad = $("<input/>");
            rad.attr({
                type: "checkBox",
                name: "checkBox_" + c.id,
                value: c.legendMultiData[i].ename,
                asc: c.legendAllowCheckCount,
                index: i + "",
                chart: c.id,
                class: "styled"
            });
            checked.forEach(function (def) {
                if (def == i) {
                    rad.prop("checked", true);
                }
            });
            rad.bind("click", function () {
                util.allowItem(this);
            });
            lab.append(rad);
            spn.html("&nbsp;" + c.legendMultiData[i].name + "&nbsp;&nbsp;");
            lab.append(spn);
            checkBoxDiv.append(lab);
        }
        var submitBtn = $("<button/>");
        submitBtn.html("确定");
        submitBtn.attr("class", "btn btn-primary btn-xs");
        submitBtn.bind("click", function () {
            var checkBoxDiv = $("#" + c.legendId + "_check");
            _target = false;
            checkBoxDiv.attr("class", "plancheckbox collapse");
            var checkVal = [], checkText = [];
            var multiChecks = $("input[name='checkBox_" + c.id + "']");
            for (var i = 0; i < multiChecks.length; i++) {
                if (multiChecks[i].checked == true) {
                    checkVal.push(multiChecks[i].value);
                    checkText.push($(multiChecks[i]).next("span").html());
                }
            }
            button.html("<b>" + checkText.toString() + "</b>");
            if (c.legendClickListener) {
                c.legendClickListener(multiChecks, chartObj, c, checkVal);
            }
        });
        checkBoxDiv.append(submitBtn);
        checkBoxDiv.append("<span>*可同时选择2项</span>");
        legendDiv.append(checkBoxDiv);
        legendDiv.prepend(button);

    },
    allowItem: function (radioObj) {
        var checks = $("input[name='" + radioObj.name + "']");
        var row = parseInt(radioObj.getAttribute("index"))//获取选中下标
        var a = checked.indexOf(row);//获取当前下标在legend数组的位置
        var allowSelectedCount = parseInt(radioObj.getAttribute("asc"));//获取该legend组允许选中的个数
        if (a != -1) {//如果当前选中的位置存在
            checked.splice(a, 1);//
        } else {
            if (checked.length >= allowSelectedCount) {
                var _shift = checked.shift();
                $(checks[_shift]).prev("span").css("background-position", "0px 0px");
                checked.push(row);
            } else {
                checked.push(row);
            }
        }
        //console.log(checks);
        checks.each(function (i, o) {
            $(o).prev("span").css("background-position", "0px 0px");
            $(o).prop("checked", false);
        });
        checked.forEach(function (c, i) {
            switch (i) {
                case 0:
                    $(checks[c]).prev("span").css("background-position", "0px -77px");
                    break;
                case 1:
                    $(checks[c]).prev("span").css("background-position", "0px -51px");
                    break;
            }
            $(checks[c]).prop("checked", true);
        });
        return checked;
    },
    legStr: function (radio) {
        var checkedVal = [];
        var radios = document.getElementsByName(radio.getAttribute("name"));
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked == true) {
                checkedVal.push(radios[i].value);
            }
        }
        return checkedVal;
    }
}