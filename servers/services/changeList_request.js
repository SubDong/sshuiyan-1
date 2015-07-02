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
        //var requests = [];
        //for (var i = 0; i < 1; i++) {
        //    requests.push({
        //        index: indexs[i],
        //        type: null,
        //        body: {
        //            "size": 0,
        //            "aggs": {
        //                "pv": {
        //                    "value_count": {
        //                        "field": "dm"
        //                    }
        //                },
        //                "data": {
        //                    "terms": {
        //                        "field": "dm"
        //                    }, "aggs": {
        //                        "pv": {
        //                            "value_count": {
        //                                "field": "dm"
        //                            }
        //                        }
        //                    }
        //
        //
        //                }
        //            }
        //        }
        //    });
        //}
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
                                pv_data.push({
                                    pathName: result.data.all_pv.buckets[i].key=="-"?"直接输入网址或标签":result.data.all_pv.buckets[i].key,
                                    pv: result.data.all_pv.buckets[i].pv_count.value,
                                    contrastPv: result.contrastData.all_pv.buckets[k].pv_count.value,
                                    percentage: (result.data.all_pv.buckets[i].pv_count.value > result.contrastData.all_pv.buckets[k].pv_count.value ? "+" + (result.data.all_pv.buckets[i].pv_count.value - result.contrastData.all_pv.buckets[k].pv_count.value) : (result.data.all_pv.buckets[i].pv_count.value - result.contrastData.all_pv.buckets[k].pv_count.value)) + "(" + (result.data.all_pv.buckets[i].pv_count.value > result.contrastData.all_pv.buckets[k].pv_count.value ? "+" + ((result.data.all_pv.buckets[i].pv_count.value - result.contrastData.all_pv.buckets[k].pv_count.value) / result.contrastData.all_pv.buckets[k].pv_count.value).toFixed(2) + "%)" : ((result.data.all_pv.buckets[i].pv_count.value - result.contrastData.all_pv.buckets[k].pv_count.value) / result.contrastData.all_pv.buckets[k].pv_count.value).toFixed(2) + "%)")
                                });
                                flag = true;
                            }
                        }
                        if (!flag) {
                            pv_data.push({
                                pathName: result.data.all_pv.buckets[i].key=="-"?"直接输入网址或标签":result.data.all_pv.buckets[i].key,
                                pv: result.data.all_pv.buckets[i].pv_count.value,
                                contrastPv: 0,
                                percentage: "+" + result.data.all_pv.buckets[i].pv_count.value + "(1.00%)"
                            });
                        }
                    }
                } else {
                    for (var i = 0; i < result.contrastData.all_pv.buckets.length; i++) {
                        var flag = false;
                        for (var k = 0; k < result.data.all_pv.buckets.length; k++) {
                            if (result.data.all_pv.buckets[k].key == result.contrastData.all_pv.buckets[i].key) {
                                pv_data.push({
                                    pathName: result.data.all_pv.buckets[k].key=="-"?"直接输入网址或标签":result.data.all_pv.buckets[k].key,
                                    pv: result.data.all_pv.buckets[k].pv_count.value,
                                    contrastPv: result.contrastData.all_pv.buckets[i].pv_count.value,
                                    percentage: (result.data.all_pv.buckets[k].pv_count.value > result.contrastData.all_pv.buckets[i].pv_count.value ? "+" + (result.data.all_pv.buckets[k].pv_count.value - result.contrastData.all_pv.buckets[i].pv_count.value) : result.data.all_pv.buckets[k].pv_count.value - result.contrastData.all_pv.buckets[i].pv_count.value) + "(" + (result.data.all_pv.buckets[k].pv_count.value > result.contrastData.all_pv.buckets[i].pv_count.value ? "+" + ((result.data.all_pv.buckets[k].pv_count.value - result.contrastData.all_pv.buckets[i].pv_count.value) / result.contrastData.all_pv.buckets[i].pv_count.value).toFixed(2) + "%)" : ((result.data.all_pv.buckets[k].pv_count.value - result.contrastData.all_pv.buckets[i].pv_count.value) / result.contrastData.all_pv.buckets[i].pv_count.value).toFixed(2) + "%)")
                                });
                                flag = true;
                            }
                        }
                        if (!flag) {
                            pv_data.push({
                                pathName: result.contrastData.all_pv.buckets[i].key=="-"?"直接输入网址或标签":result.contrastData.all_pv.buckets[i].key,
                                pv: 0,
                                contrastPv: result.contrastData.all_pv.buckets[i].pv_count.value,
                                percentage: (0 - result.contrastData.all_pv.buckets[i].pv_count.value) + "(" + (0 - result.contrastData.all_pv.buckets[i].pv_count.value) / result.contrastData.all_pv.buckets[i].pv_count.value + "%)"
                            });
                        }
                    }
                }
                data = {
                    sum_pv: result.data.pv.value,
                    contrast_sum_pv: result.contrastData.pv.value,
                    pv: pv_data,
                    percentage: (result.data.pv.value > result.contrastData.pv.value ? "+" + (result.data.pv.value - result.contrastData.pv.value) : result.data.pv.value - result.contrastData.pv.value) + "(" + (result.contrastData.pv.value==0?0+"%)":(result.data.pv.value > result.contrastData.pv.value ? "+" + ((result.data.pv.value - result.contrastData.pv.value) / result.contrastData.pv.value > 1 ? 1 : (result.data.pv.value - result.contrastData.pv.value) / result.contrastData.pv.value).toFixed(2) + "%)" : ((result.data.pv.value - result.contrastData.pv.value) / result.contrastData.pv.value > 1 ? 1 : (result.data.pv.value - result.contrastData.pv.value) / result.contrastData.pv.value).toFixed(2) + "%)"))
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