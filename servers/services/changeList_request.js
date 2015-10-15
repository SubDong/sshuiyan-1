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
    search: function (es, indexs, times, callbackFn) {
        var request = {
            index: indexs,
            type: null,
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
                                        "value_count": {
                                            "field": "dm"
                                        }
                                    }
                                }
                            },
                            "pv": {
                                "value_count": {
                                    "field": "dm"
                                }
                            }
                        }
                    }
                }
            }
        };
        //async.map(requests, function (item, callback) {
        //    es.search(item, function (error, response) {
        //        var result = response.aggregations.p.buckets;
        //        var data = {};
        //        var all_pv_data = [];
        //        var all_pv_contrastData = [];
        //        for(var i = 0;i<result.data.buckets.length;i++){
        //            all_pv_data.push({
        //                pathName:result.data.buckets[i].key,
        //                pv:result.data.buckets[i].pv.value
        //            });
        //        }
        //        data={
        //            sum_pv:result.pv.value,
        //            all_pv:all_pv_data
        //        };
        //        callback(null, data);
        //    });
        //}, function (error, results) {
        //    var request = {
        //        index:indexs[1],
        //        type:null,
        //        body:{
        //            "size":0,
        //            "aggs":{
        //                "data":{
        //                    "terms":{
        //                        "field":results.all_pv[0].pathName
        //                    }
        //                }
        //            }
        //        }
        //    }
        //});
        es.search(request, function (error, response) {
            var data = {};
            var all_pv_data = [];
            var all_pv_contrastData = [];
            var pv_data = [];
            if (response != undefined && response.aggregations != undefined) {
                var result = response.aggregations.all_data.buckets;
                for (var i = 0; i < result.data.all_pv.buckets.length; i++) {
                    all_pv_data.push({
                        pathName: result.data.all_pv.buckets[i].key,
                        pv: result.data.all_pv.buckets[i].pv_count.value
                    });
                }
                for (var i = 0; i < result.contrastData.all_pv.buckets.length; i++) {
                    all_pv_contrastData.push({
                        pathName: result.contrastData.all_pv.buckets[i].key,
                        pv: result.contrastData.all_pv.buckets[i].pv_count.value
                    });
                }
                if (result.data.all_pv.buckets.length >= result.contrastData.all_pv.buckets.length) {
                    for (var i = 0; i < result.data.all_pv.buckets.length; i++) {
                        var flag = false;
                        for (var k = 0; k < result.contrastData.all_pv.buckets.length; k++) {
                            if (result.data.all_pv.buckets[i].key == result.contrastData.all_pv.buckets[k].key) {
                                var _pv = result.data.all_pv.buckets[i].pv_count.value;
                                var _contrastPv = result.contrastData.all_pv.buckets[k].pv_count.value;
                                var _percentage = ((_pv - _contrastPv) / _contrastPv) * 100;
                                if (_percentage > 0) {
                                    _percentage = "+" + (_pv - _contrastPv) + "(+" + _percentage.toFixed(2) + "%)"
                                } else {
                                    _percentage = (_pv - _contrastPv) + "(" + _percentage.toFixed(2) + "%)";
                                }
                                pv_data.push({
                                    pathName: result.data.all_pv.buckets[i].key == "-" ? "直接输入网址或标签" : result.data.all_pv.buckets[i].key,
                                    pv: _pv,
                                    contrastPv: _contrastPv,
                                    percentage: _percentage
                                    //percentage: (result.data.all_pv.buckets[i].pv_count.value > result.contrastData.all_pv.buckets[k].pv_count.value ? "+" + (result.data.all_pv.buckets[i].pv_count.value - result.contrastData.all_pv.buckets[k].pv_count.value) : (result.data.all_pv.buckets[i].pv_count.value - result.contrastData.all_pv.buckets[k].pv_count.value)) + "(" + (result.data.all_pv.buckets[i].pv_count.value > result.contrastData.all_pv.buckets[k].pv_count.value ? "+" + ((result.data.all_pv.buckets[i].pv_count.value - result.contrastData.all_pv.buckets[k].pv_count.value) / result.contrastData.all_pv.buckets[k].pv_count.value).toFixed(2) + "%)" : ((result.data.all_pv.buckets[i].pv_count.value - result.contrastData.all_pv.buckets[k].pv_count.value) / result.contrastData.all_pv.buckets[k].pv_count.value).toFixed(2) + "%)")
                                });
                                flag = true;
                            }
                        }
                        if (!flag) {
                            pv_data.push({
                                pathName: result.data.all_pv.buckets[i].key == "-" ? "直接输入网址或标签" : result.data.all_pv.buckets[i].key,
                                pv: result.data.all_pv.buckets[i].pv_count.value,
                                contrastPv: 0,
                                percentage: "+" + result.data.all_pv.buckets[i].pv_count.value + "(+100%)"
                            });
                        }
                    }
                } else {
                    for (var i = 0; i < result.contrastData.all_pv.buckets.length; i++) {
                        var flag = false;
                        for (var k = 0; k < result.data.all_pv.buckets.length; k++) {
                            if (result.data.all_pv.buckets[k].key == result.contrastData.all_pv.buckets[i].key) {
                                var _pv = result.data.all_pv.buckets[k].pv_count.value;
                                var _contrastPv = result.contrastData.all_pv.buckets[i].pv_count.value;
                                var _percentage = ((_pv - _contrastPv) / _contrastPv) * 100;
                                if (_percentage > 0) {
                                    _percentage = "+" + (_pv - _contrastPv) + "(+" + _percentage.toFixed(2) + "%)"
                                } else {
                                    _percentage = (_pv - _contrastPv) + "(" + _percentage.toFixed(2) + "%)";
                                }
                                pv_data.push({
                                    pathName: result.data.all_pv.buckets[k].key == "-" ? "直接输入网址或标签" : result.data.all_pv.buckets[k].key,
                                    pv: _pv,
                                    contrastPv: _contrastPv,
                                    percentage: _percentage
                                    //percentage: (result.data.all_pv.buckets[k].pv_count.value > result.contrastData.all_pv.buckets[i].pv_count.value ? "+" + (result.data.all_pv.buckets[k].pv_count.value - result.contrastData.all_pv.buckets[i].pv_count.value) : result.data.all_pv.buckets[k].pv_count.value - result.contrastData.all_pv.buckets[i].pv_count.value) + "(" + (result.data.all_pv.buckets[k].pv_count.value > result.contrastData.all_pv.buckets[i].pv_count.value ? "+" + ((result.data.all_pv.buckets[k].pv_count.value - result.contrastData.all_pv.buckets[i].pv_count.value) / result.contrastData.all_pv.buckets[i].pv_count.value).toFixed(2) + "%)" : ((result.data.all_pv.buckets[k].pv_count.value - result.contrastData.all_pv.buckets[i].pv_count.value) / result.contrastData.all_pv.buckets[i].pv_count.value).toFixed(2) + "%)")
                                });
                                flag = true;
                            }
                        }
                        if (!flag) {
                            pv_data.push({
                                pathName: result.contrastData.all_pv.buckets[i].key == "-" ? "直接输入网址或标签" : result.contrastData.all_pv.buckets[i].key,
                                pv: 0,
                                contrastPv: result.contrastData.all_pv.buckets[i].pv_count.value,
                                percentage: (0 - result.contrastData.all_pv.buckets[i].pv_count.value) + "(" + (0 - result.contrastData.all_pv.buckets[i].pv_count.value * 100) / result.contrastData.all_pv.buckets[i].pv_count.value + "%)"
                            });
                        }
                    }
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
                        percentage = "+" + sum_pv + "(+100%)";
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
            } else
                callbackFn(data);
        });
    }
};
function getConvertPathName(name) {

}
module.exports = changeList_request;