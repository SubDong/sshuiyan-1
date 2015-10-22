/**
 * Created by perfection on 15-6-29.
 */
var async = require("async");
var changeList_request = {
    /**
     * @param es
     * @param indexs　索引数组
     * @param times　毫秒为单位的时间数组
     * @param callbackFn　回调函数
     */
    search: function (es, indexs, times, type, filterType, callbackFn) {
        var request = {
            index: indexs,
            type: type,
            body: {
                "size": 0,
                "aggs": {
                    "all_data": {
                        "filters": {
                            "filters": {
                                "contrastData": {
                                    "range": {
                                        "utime": {
                                            "gte": times[2],
                                            "lte": times[3]
                                        }
                                    }
                                },
                                "data": {
                                    "range": {
                                        "utime": {
                                            "gte": times[0],
                                            "lte": times[1]
                                        }
                                    }
                                }
                            }
                        },
                        "aggs": {
                            "all_pv": {
                                "terms": {
                                    "field": "dm"
                                },
                                "aggs": {
                                    "pv_count": {
                                        "filter": {
                                            "term": {
                                                "entrance": "1"
                                            }
                                        },
                                        "aggs": {
                                            "pv_count_aggs": {
                                                "value_count": {
                                                    "field": "tt"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "pv": {
                                "filter": {
                                    "term": {
                                        "entrance": "1"
                                    }
                                },
                                "aggs": {
                                    "pv_aggs": {
                                        "value_count": {
                                            "field": "tt"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        // 改变下计算方法
        es.search(request, function (error, response) {
            var data = {};
            var pv_data = [];
            var pathNameArray = [];
            var dataPathName = [];
            var contrastDataPathName = [];
            if (response != undefined && response.aggregations != undefined) {
                var result = response.aggregations.all_data.buckets;
                // 获取全部的来源域名
                for (var i = 0; i < result.data.all_pv.buckets.length; i++) {
                    pathNameArray.push(result.data.all_pv.buckets[i].key);
                    dataPathName.push(result.data.all_pv.buckets[i].key);
                }
                for (var i = 0; i < result.contrastData.all_pv.buckets.length; i++) {
                    var _t_key = result.contrastData.all_pv.buckets[i].key;
                    contrastDataPathName.push(_t_key);
                    if (pathNameArray.indexOf(_t_key) == -1) {
                        pathNameArray.push(result.contrastData.all_pv.buckets[i].key);
                    }
                }

                for (var i = 0; i < pathNameArray.length; i++) {
                    var _d_i = dataPathName.indexOf(pathNameArray[i]);
                    var _c_d_i = contrastDataPathName.indexOf(pathNameArray[i]);
                    var _t_o = {
                        pathName: pathNameArray[i] == "-" ? "直接输入网址或标签" : pathNameArray[i],
                        pv: 0,
                        contrastPv: 0,
                        percentage: "0(-)"
                    };

                    if (_d_i != -1) {
                        _t_o.pv = parseInt(result.data.all_pv.buckets[_d_i].pv_count.pv_count_aggs.value);
                    }

                    if (_c_d_i != -1) {
                        _t_o.contrastPv = parseInt(result.contrastData.all_pv.buckets[_c_d_i].pv_count.pv_count_aggs.value);
                    }
                    
                    var percentage = 0;
                    if (_t_o.contrastPv == 0) {
                        if (_t_o.pv == 0) {
                            percentage = "0(0)";
                        } else {
                            percentage = "+" + _t_o.pv + "(-)";
                        }
                    } else {
                        if (_t_o.pv == 0) {
                            percentage = "-" + _t_o.contrastPv + "(-100%)";
                        } else {
                            percentage = ((_t_o.pv - _t_o.contrastPv) / _t_o.contrastPv) * 100;
                            if (percentage > 0) {
                                percentage = "+" + (_t_o.pv - _t_o.contrastPv) + "(" + percentage.toFixed(2) + "%)";
                            } else {
                                percentage = (_t_o.pv - _t_o.contrastPv) + "(" + percentage.toFixed(2) + "%)";
                            }
                        }
                    }
                    _t_o.percentage = percentage;
                    pv_data.push(_t_o);
                }

                var sum_pv = 0;
                var contrast_sum_pv = 0;
                pv_data.forEach(function (d) {
                    sum_pv += d["pv"];
                    contrast_sum_pv += d["contrastPv"];
                })
                var percentage = 0;
                if (contrast_sum_pv == 0) {
                    if (sum_pv == 0) {
                        percentage = "0(0)";
                    } else {
                        percentage = "+" + sum_pv + "(-)";
                    }
                } else {
                    if (sum_pv == 0) {
                        percentage = "-" + contrast_sum_pv + "(-100%)";
                    } else {
                        percentage = ((sum_pv - contrast_sum_pv) / contrast_sum_pv) * 100;
                        if (percentage > 0) {
                            percentage = "+" + (sum_pv - contrast_sum_pv) + "(" + percentage.toFixed(2) + "%)";
                        } else {
                            percentage = (sum_pv - contrast_sum_pv) + "(" + percentage.toFixed(2) + "%)";
                        }
                    }
                }
                data = {
                    sum_pv: sum_pv,
                    contrast_sum_pv: contrast_sum_pv,
                    pv: pv_data,
                    percentage: percentage
                };
                callbackFn(data);
            } else {
                callbackFn(data);
            }
        });

        //es.search(request, function (error, response) {
        //    var data = {};
        //    var all_pv_data = [];
        //    var all_pv_contrastData = [];
        //    var pv_data = [];
        //    if (response != undefined && response.aggregations != undefined) {
        //        var result = response.aggregations.all_data.buckets;
        //        for (var i = 0; i < result.data.all_pv.buckets.length; i++) {
        //            all_pv_data.push({
        //                pathName: result.data.all_pv.buckets[i].key,
        //                pv: result.data.all_pv.buckets[i].pv_count.pv_count_aggs.value
        //            });
        //        }
        //        for (var i = 0; i < result.contrastData.all_pv.buckets.length; i++) {
        //            all_pv_contrastData.push({
        //                pathName: result.contrastData.all_pv.buckets[i].key,
        //                pv: result.contrastData.all_pv.buckets[i].pv_count.pv_count_aggs.value
        //            });
        //        }
        //        if (result.data.all_pv.buckets.length >= result.contrastData.all_pv.buckets.length) {
        //            for (var i = 0; i < result.data.all_pv.buckets.length; i++) {
        //                var flag = false;
        //                for (var k = 0; k < result.contrastData.all_pv.buckets.length; k++) {
        //                    if (result.data.all_pv.buckets[i].key == result.contrastData.all_pv.buckets[k].key) {
        //                        var _pv = result.data.all_pv.buckets[i].pv_count.pv_count_aggs.value;
        //                        var _contrastPv = result.contrastData.all_pv.buckets[k].pv_count.pv_count_aggs.value;
        //                        var _percentage = ((_pv - _contrastPv) / _contrastPv) * 100;
        //                        if (_percentage > 0) {
        //                            _percentage = "+" + (_pv - _contrastPv) + "(+" + _percentage.toFixed(2) + "%)";
        //                        } else {
        //                            _percentage = (_pv - _contrastPv) + "(" + _percentage.toFixed(2) + "%)";
        //                        }
        //                        pv_data.push({
        //                            pathName: result.data.all_pv.buckets[i].key == "-" ? "直接输入网址或标签" : result.data.all_pv.buckets[i].key,
        //                            pv: _pv,
        //                            contrastPv: _contrastPv,
        //                            percentage: _percentage
        //                            //percentage: (result.data.all_pv.buckets[i].pv_count.pv_count_aggs.value > result.contrastData.all_pv.buckets[k].pv_count.value ? "+" + (result.data.all_pv.buckets[i].pv_count.pv_count_aggs.value - result.contrastData.all_pv.buckets[k].pv_count.value) : (result.data.all_pv.buckets[i].pv_count.pv_count_aggs.value - result.contrastData.all_pv.buckets[k].pv_count.value)) + "(" + (result.data.all_pv.buckets[i].pv_count.pv_count_aggs.value > result.contrastData.all_pv.buckets[k].pv_count.value ? "+" + ((result.data.all_pv.buckets[i].pv_count.pv_count_aggs.value - result.contrastData.all_pv.buckets[k].pv_count.value) / result.contrastData.all_pv.buckets[k].pv_count.value).toFixed(2) + "%)" : ((result.data.all_pv.buckets[i].pv_count.pv_count_aggs.value - result.contrastData.all_pv.buckets[k].pv_count.value) / result.contrastData.all_pv.buckets[k].pv_count.value).toFixed(2) + "%)")
        //                        });
        //                        flag = true;
        //                    }
        //                }
        //                if (!flag) {
        //                    pv_data.push({
        //                        pathName: result.data.all_pv.buckets[i].key == "-" ? "直接输入网址或标签" : result.data.all_pv.buckets[i].key,
        //                        pv: result.data.all_pv.buckets[i].pv_count.pv_count_aggs.value,
        //                        contrastPv: 0,
        //                        percentage: "+" + result.data.all_pv.buckets[i].pv_count.pv_count_aggs.value + "(-)"
        //                    });
        //                }
        //            }
        //        } else {
        //            for (var i = 0; i < result.contrastData.all_pv.buckets.length; i++) {
        //                var flag = false;
        //                for (var k = 0; k < result.data.all_pv.buckets.length; k++) {
        //                    if (result.data.all_pv.buckets[k].key == result.contrastData.all_pv.buckets[i].key) {
        //                        var _pv = result.data.all_pv.buckets[k].pv_count.pv_count_aggs.value;
        //                        var _contrastPv = result.contrastData.all_pv.buckets[i].pv_count.pv_count_aggs.value;
        //                        var _percentage = ((_pv - _contrastPv) / _contrastPv) * 100;
        //                        if (_percentage > 0) {
        //                            _percentage = "+" + (_pv - _contrastPv) + "(+" + _percentage.toFixed(2) + "%)"
        //                        } else {
        //                            _percentage = (_pv - _contrastPv) + "(" + _percentage.toFixed(2) + "%)";
        //                        }
        //                        pv_data.push({
        //                            pathName: result.data.all_pv.buckets[k].key == "-" ? "直接输入网址或标签" : result.data.all_pv.buckets[k].key,
        //                            pv: _pv,
        //                            contrastPv: _contrastPv,
        //                            percentage: _percentage
        //                            //percentage: (result.data.all_pv.buckets[k].pv_count.value > result.contrastData.all_pv.buckets[i].pv_count.pv_count_aggs.value ? "+" + (result.data.all_pv.buckets[k].pv_count.value - result.contrastData.all_pv.buckets[i].pv_count.pv_count_aggs.value) : result.data.all_pv.buckets[k].pv_count.value - result.contrastData.all_pv.buckets[i].pv_count.pv_count_aggs.value) + "(" + (result.data.all_pv.buckets[k].pv_count.value > result.contrastData.all_pv.buckets[i].pv_count.pv_count_aggs.value ? "+" + ((result.data.all_pv.buckets[k].pv_count.value - result.contrastData.all_pv.buckets[i].pv_count.pv_count_aggs.value) / result.contrastData.all_pv.buckets[i].pv_count.pv_count_aggs.value).toFixed(2) + "%)" : ((result.data.all_pv.buckets[k].pv_count.value - result.contrastData.all_pv.buckets[i].pv_count.pv_count_aggs.value) / result.contrastData.all_pv.buckets[i].pv_count.pv_count_aggs.value).toFixed(2) + "%)")
        //                        });
        //                        flag = true;
        //                    }
        //                }
        //                if (!flag) {
        //                    pv_data.push({
        //                        pathName: result.contrastData.all_pv.buckets[i].key == "-" ? "直接输入网址或标签" : result.contrastData.all_pv.buckets[i].key,
        //                        pv: 0,
        //                        contrastPv: result.contrastData.all_pv.buckets[i].pv_count.pv_count_aggs.value,
        //                        percentage: (0 - result.contrastData.all_pv.buckets[i].pv_count.pv_count_aggs.value) + "(" + (0 - result.contrastData.all_pv.buckets[i].pv_count.pv_count_aggs.value * 100) / result.contrastData.all_pv.buckets[i].pv_count.pv_count_aggs.value + "%)"
        //                    });
        //                }
        //            }
        //        }
        //
        //        var sum_pv = 0;
        //        var contrast_sum_pv = 0;
        //        pv_data.forEach(function (d) {
        //            sum_pv += d["pv"];
        //            contrast_sum_pv += d["contrastPv"];
        //        })
        //        var percentage = 0;
        //        if (contrast_sum_pv == 0) {
        //            if (sum_pv == 0) {
        //                percentage = "0(0)";
        //            } else {
        //                percentage = "+" + sum_pv + "(-)";
        //            }
        //        } else {
        //            if (sum_pv == 0) {
        //                percentage = "-" + contrast_sum_pv + "(-100%)";
        //            } else {
        //                percentage = ((sum_pv - contrast_sum_pv) / contrast_sum_pv) * 100;
        //                if (percentage > 0) {
        //                    percentage = "+" + (sum_pv - contrast_sum_pv) + "(" + percentage.toFixed(2) + "%)";
        //                } else {
        //                    percentage = (sum_pv - contrast_sum_pv) + "(" + percentage.toFixed(2) + "%)";
        //                }
        //            }
        //        }
        //        data = {
        //            sum_pv: sum_pv,
        //            contrast_sum_pv: contrast_sum_pv,
        //            pv: pv_data,
        //            percentage: percentage
        //        };
        //        callbackFn(data);
        //    } else {
        //        callbackFn(data);
        //    }
        //});
    }
};
function getConvertPathName(name) {

}
module.exports = changeList_request;