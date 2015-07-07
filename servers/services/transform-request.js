/**
 * Created by perfection on 15-7-6.
 */

var async = require("async");

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
        case "transformCount":
            break;
        case "orderCount":
            break;
        case "orderMoney":
            break;
        case "percentOrderTransform":
            break;
        case "transformCost":
            break;
        default :
            query = {
                "terms":{
                    "field":""
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
                                "transformCount": queryString(queryOptions[2]),
                                "orderCount": queryString(queryOptions[3]),
                                "orderMoney": queryString(queryOptions[4]),
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
                callback(null, result.aggregations);
            });
        }, function (error, results) {
            var data = [];
            var data1 = {};
            var data2 = {};
            var keyArr = [];
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
            callbackFn(data);
        });
    }
};

module.exports = transform;