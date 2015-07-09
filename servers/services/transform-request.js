/**
 * Created by perfection on 15-7-6.
 */

var async = require("async");
var es_aggs = {
    // 浏览量
    "pv": {
        "pv": {
            "value_count": {
                "field": "_type"
            }
        }
    },
    // 访客数
    "uv": {
        "uv": {
            "cardinality": {
                "field": "tt"
            }
        }
    },
    // 访问次数
    "vc": {
        "vc": {
            "value_count": {
                "field": "tt"
            }
        }
    },
    // 新访客数
    "nuv": {
        "new_visitor_aggs": {
            "sum": {
                "script": "c = 0; if (doc['ct'].value == 0) { c = 1 }; c"
            }
        }
    },
    // 新访客比率
    "nuvRate": {
        "new_visitor_aggs": {
            "sum": {
                "script": "c = 0; if (doc['ct'].value == 0) { c = 1 }; c"
            }
        },
        "uv_aggs": {
            "cardinality": {
                "field": "_ucv"
            }
        }
    },
    // IP数
    "ip": {
        "ip": {
            "cardinality": {
                "field": "vid"
            }
        }
    }
};
//"浏览量", "访客数", "转化次数", "订单数", "订单金额", "订单转化率", "平均转化成本"
var queryString = function (queryOption) {
    var query = {};
    switch (queryOption) {
        case "pv":
            query = {
                "value_count": {
                    "field": "_type"
                }
            };
            break;
        case "uv":
            query = {
                "cardinality": {
                    "field": "tt"
                }
            };
            break;
        case "ip":
            break;
        case "vc":
            break;
        case "conversions":
            break;
        case "percentOrderTransform":
            break;
        case "transformCost":
            break;
        default :
            query = {
                "terms": {
                    "field": ""
                }
            };
            break;
    }

    return query;

};
var transform = {
    search: function (es, indexs, type, action, callbackFn) {
        var request = {
            "index": indexs,
            "type": type + "_" + action,
            "body": {
                "size": 0,
                "aggs": {
                    "pv": {
                        "value_count": {
                            "field": "_type"
                        }
                    },
                    "uv": {
                        "cardinality": {
                            "field": "tt"
                        }
                    },
                    "ip": {
                        "cardinality": {
                            "field": "vid"
                        }
                    },
                    "newUser": {
                        "value_count": {
                            "field": "ct"
                        }
                    }
                }
            }
        };
        es.search(request, function (error, response) {
            var data = {};
            if (response != undefined && response.aggregations != undefined) {
                var result = response.aggregations;
                data = {
                    pv: result.pv.value,
                    uv: result.uv.value,
                    ip: result.ip.value,
                    newUser: result.newUser.value
                };
                callbackFn(data);
            } else
                callbackFn(data);
        });
    },
    searchByShowTypeAndQueryOption: function (es, indexs, type, action, showType, queryOptions, callbackFn) {
        var requests = [];
        switch (showType) {
            case "hour":
                break;
            case "day":
                for (var i = 0; i < indexs.length; i++) {
                    requests.push({
                        index: indexs[i],
                        type: type + "_" + action,
                        body: {
                            "size": 0,
                            "aggs": {
                                "pv": queryString(queryOptions[0]),
                                "uv": queryString(queryOptions[1]),
                                "ip": queryString(queryOptions[2]),
                                "vc": queryString(queryOptions[3]),
                                "conversions": queryString(queryOptions[4]),
                                "percentOrderTransform": queryString(queryOptions[5]),
                                "transformCost": queryString(queryOptions[6])
                            }
                        }
                    });
                }
                break;
            case "week":
                break;
            case "month":
                break;
        }
        async.map(requests, function (item, callback) {
            es.search(item, function (error, result) {
                if (result != undefined && result.aggregations != undefined) {
                    callback(null, result.aggregations);
                } else {
                    callback(null, null);
                }
            });
        }, function (error, results) {
            var data = [];
            var data1 = {};
            var data2 = {};
            var keyArr = [];
            if (results[0] != null) {
                for (var i = 0; i < indexs.length; i++) {
                    keyArr.push(indexs[i].substring(7, indexs[i].length));
                }
                var quotaArry = [];
                for (var i = 0; i < results.length; i++) {
                    quotaArry.push(results[i].pv.value);
                }
                data1 = {
                    "label": "pv",
                    "key": keyArr,
                    "quota": quotaArry
                };
                quotaArry = [];
                for (var i = 0; i < results.length; i++) {
                    quotaArry.push(results[i].uv.value);
                }
                data2 = {
                    "label": "uv",
                    "key": keyArr,
                    "quota": quotaArry
                };
                data.push(data1);
                data.push(data2);
            }
            callbackFn(data);
        });
    },
    SearchPromotion: function (es, indexs, type, action, queryOptions, callbackFn) {
        var _aggs = {};

        queryOptions.forEach(function (queryOption) {
            for (var key in es_aggs[queryOption]) {
                _aggs[key] = es_aggs[queryOption][key];
            }
        });
        var request = {
            "index": indexs,
            "type": type + "_" + action,
            "body": {
                "size": 0,
                "aggs": {
                    "eventName": {
                        "terms": {
                            "field": "et_label"
                        },
                        "aggs": _aggs
                    }
                }
            }
        };
        es.search(request, function (error, response) {
            var data = [];
            var dataArry = [];
            if (response != undefined && response.aggregations != undefined) {
                var result = response.aggregations.eventName.buckets;
                queryOptions.forEach(function (queryOption) {
                    switch (queryOption) {
                        case "pv":
                            for (var i = 0; i < result.length; i++) {
                                dataArry.push({
                                    pv: result[i].pv.value,
                                    campaignName: result[i].key
                                });
                            }
                            break;
                        case "uv":
                            for (var i = 0; i < result.length; i++) {
                                dataArry.push({
                                    uv: result[i].uv.value,
                                    campaignName: result[i].key
                                });
                            }
                            break;
                        case "vc":
                            for (var i = 0; i < result.length; i++) {
                                dataArry.push({
                                    vc: result[i].vc.value,
                                    campaignName: result[i].key
                                });
                            }
                            break;

                        case "ip":
                            for (var i = 0; i < result.length; i++) {
                                dataArry.push({
                                    ip: result[i].ip.value,
                                    campaignName: result[i].key
                                });
                            }
                            break;
                        default :
                            break;
                    }
                });
                //================================ 数据算法 ==========================================
                var data_Arried = [];
                dataArry.forEach(function (data) {
                    var data_Arrying = [];
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].key == data["campaignName"]) {
                            data_Arrying.push(data)
                        }
                    }

                });
                for(var i = 0;i<result.length;i++){
                    var data_Arrying = [];
                    dataArry.forEach(function (data) {
                        if(result[i].key == data["campaignName"]){
                            data_Arrying.push(data);
                        }
                    });
                    data_Arried.push(data_Arrying);
                }
                for(var i = 0;i<data_Arried.length;i++){
                    var data_success = {};
                    for(var keyNumber in data_Arried[i]){
                        for(var keyString in data_Arried[i][keyNumber]){
                            data_success[keyString] = data_Arried[i][keyNumber][keyString];
                        }
                    }
                    data.push(data_success);
                }
                //==================================================================================
                callbackFn(data);
            } else
                callbackFn(data);
        });
    }
};

module.exports = transform;