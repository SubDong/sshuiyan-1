/**
 * Created by perfection on 15-7-6.
 */

var async = require("async");
var es_aggs = {
    // 浏览量　事件和页面转化通用
    "pv": {
        "pv": {
            "value_count": {
                "field": "_type"
            }
        }
    },
    // 访客数　事件和页面转化通用
    "uv": {
        "uv": {
            "cardinality": {
                "field": "tt"
            }
        }
    },
    // 访问次数　事件和页面转化通用
    "vc": {
        "vc": {
            "value_count": {
                "field": "tt"
            }
        }
    },
    // 新访客数　事件和页面转化通用
    "nuv": {
        "nuv": {
            "sum": {
                "field": "ct"
            }
        }
    },
    // 新访客比率　事件和页面转化通用
    "nuvRate": {
        "new_visitor_aggs": {
            "sum": {
                "field": "ct"
            }
        },
        "uv_aggs": {
            "cardinality": {
                "field": "tt"
            }
        }
    },
    // IP数 事件和页面转化通用
    "ip": {
        "ip": {
            "cardinality": {
                "field": "remote"
            }
        }
    },
    // 事件点击总数　事件转化
    "clickTotal": {
        "clickTotal": {
            "value_count": {
                "field": "_type"
            }
        }
    },
    // 转化次数　事件和页面转化通用
    "conversions": {
        "conversions": {
            "value_count": {
                "field": "_type"
            }
        }
    },
    //转化率　事件转化
    "crate": {
        "crate": {
            "value_count": {
                "field": "_type"
            }
        }
    },
    //唯一访客事件数　事件转化
    "visitNum": {
        "visitNum": {
            "value_count": {
                "field": "tt"
            }
        }
    },
    //平均转化成本 事件转化
    "transformCost": {
        "transformCost": {
            "value_count": {
                "field": "tt"
            }
        }
    },
    //订单数
    "orderNum": {
        "orderNum": {
            "value_count": {
                "field": "p_record"
            }
        }
    },
    //收益　预期每次转化收益*转化次数
    "benefit": {
        "benefit": {
            "terms": {
                "field": "p_income"
            }
        },
        "convertTime": {
            "value_count": {
                "field": "_type"
            }
        }
    },
    //利润　暂时查询出收益
    "profit": {
        "profit_benefit": {
            "terms": {
                "field": "p_income"
            }
        },
        "profit_convertTime": {
            "value_count": {
                "field": "_type"
            }
        }
    },
    "orderNumRate": {
        "orderNumRate_orderNum": {
            "value_count": {
                "field": "p_record"
            }
        },
        "orderNumRate_convertTime": {
            "value_count": {
                "field": "_type"
            }
        }
    },
    "avgCost": {
        "avgCost": {
            "value_count": {
                "field": "tt"
            }
        }
    }
};
var transform = {
        search: function (es, indexs, type, action, querys, callbackFn) {
            var requests = [];
            for (var i = 0; i < indexs.length; i++) {
                requests.push({
                    index: indexs[i]
                });
            }
            async.map(requests, function (item, callback) {
                es.indices.exists(item, function (error, exists) {
                    callback(null, exists);
                });
            }, function (error, results) {
                var newIndexs = [];
                for (var i = 0; i < indexs.length; i++) {
                    if (results[i] == true) {
                        newIndexs.push(indexs[i]);
                    }
                }
                var _aggs = {};
                querys.forEach(function (queryOption) {
                    for (var key in es_aggs[queryOption]) {
                        _aggs[key] = es_aggs[queryOption][key];
                    }
                });
                var request = {
                    "index": newIndexs,
                    "type": type,//+ "_" + action,
                    "body": {
                        "size": 0,
                        "aggs": _aggs
                    }
                };
                es.search(request, function (error, response) {
                    var data = {};
                    if (response != undefined && response.aggregations != undefined) {
                        var result = response.aggregations;
                        querys.forEach(function (queryOption) {
                            var isExit = false;
                            var i = 0;
                            switch (queryOption) {
                                case "nuvRate":
                                    if (result.new_visitor_aggs.value == "0") {
                                        data[queryOption] = 0;
                                    } else {
                                        data[queryOption] = (result.uv_aggs.value / result.new_visitor_aggs.value).toFixed(2) + "%";

                                    }
                                    break;
                                case "benefit":
                                    if (result.benefit.buckets.length == 0) {
                                        data[queryOption] = 0;//不存在记录
                                    } else {

                                        for (i = 0; i < result.benefit.buckets.length; i++) {
                                            if (result.benefit.buckets[i] != "") {
                                                data[queryOption] = Number(result.benefit.buckets[0].key) * Number(results.convertTime.value);
                                                isExit = true;
                                            }
                                        }
                                        if (!isExit) {
                                            data[queryOption] = "-";//未定义预期收益
                                        }
                                    }
                                    break;
                                case "profit":
                                    if (result.profit_benefit.buckets.length == 0) {
                                        data[queryOption] = 0;//不存在记录
                                    } else {
                                        for (i = 0; i < result.profit_benefit.buckets.length; i++) {
                                            if (result.profit_benefit.buckets[i] != "") {
                                                data[queryOption] = Number(result.profit_benefit.buckets[0].key) * Number(results.profit_convertTime.value);
                                                isExit = true;
                                            }
                                        }
                                        if (!isExit) {
                                            data[queryOption] = "-";//未定义预期收益
                                        }
                                    }
                                    break;
                                case "orderNumRate":
                                    data[queryOption] = (Number(result.orderNumRate_orderNum.value) / Number(result.orderNumRate_convertTime.value)).toFixed(2) + "%";
                                    break;
                                default :
                                    data[queryOption] = result[queryOption].value;
                                    break;
                            }
                        });
                        callbackFn(data);
                    } else
                        callbackFn(data);
                });
            });
        },
        searchByShowTypeAndQueryOption: function (es, indexs, type, action, showType, queryOptions, callbackFn) {
            var _aggs = {};
            queryOptions.forEach(function (queryOption) {
                for (var key in es_aggs[queryOption]) {
                    _aggs[key] = es_aggs[queryOption][key];
                }
            });
            var requests = [];
            switch (showType) {
                case "hour":
                    break;
                case "day":
                    for (var i = 0; i < indexs.length; i++) {
                        requests.push({
                            index: indexs[i],
                            type: type,//+ "_" + action,
                            body: {
                                "size": 0,
                                "aggs": _aggs
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
                var quota_data = {};
                var keyArr = [];
                var quotaArry = [];
                if (results[0] != null) {
                    for (var i = 0; i < indexs.length; i++) {
                        keyArr.push(indexs[i].substring(7, indexs[i].length));
                    }
                    queryOptions.forEach(function (queryOption) {
                        quota_data = {};
                        quotaArry = [];
                        var i = 0;
                        var isExit = false;
                        switch (queryOption) {
                            case "pv":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                        }
                                        quotaArry.push(results[i].pv.value);
                                    }

                                }
                                quota_data = {
                                    label: "pv",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "uv":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].uv.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "uv",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "vc":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].vc.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "vc",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;

                            case "ip":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].ip.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "ip",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "clickTotal":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].clickTotal.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "clickTotal",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "conversions":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].conversions.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "conversions",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "nuv":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].nuv.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "nuv",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "visitNum":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].visitNum.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "visitNum",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "nuvRate":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            if (results[i].new_visitor_aggs.value == "0") {
                                                quotaArry.push(0);
                                            } else {
                                                quotaArry.push((results[i].uv_aggs.value / results[i].new_visitor_aggs.value).toFixed(2) + "%");
                                            }
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "nuvRate",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "crate":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].crate.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "crate",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "transformCost":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].transformCost.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "transformCost",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "orderNum":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].orderNum.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "orderNum",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "benefit":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            if (results[i].benefit.buckets.length == 0) {
                                                quotaArry.push("0");//不存在记录
                                            } else {
                                                for (i = 0; i < results[i].benefit.buckets.length; i++) {
                                                    if (results[i].benefit.buckets[i] != "") {
                                                        quotaArry.push(Number(results[i].benefit.buckets[0].key) * Number(results[i].convertTime.value));
                                                        isExit = true;
                                                    }
                                                }
                                                if (!isExit) {
                                                    quotaArry.push("-");//未定义预期收益
                                                }
                                            }
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "benefit",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "profit":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            if (key == queryOption) {
                                                if (results[i].profit_benefit.buckets.length == 0) {
                                                    quotaArry.push("0");//不存在记录
                                                } else {
                                                    for (i = 0; i < results[i].profit_benefit.buckets.length; i++) {
                                                        if (results[i].profit_benefit.buckets[i] != "") {
                                                            quotaArry.push(Number(results[i].profit_benefit.buckets[0].key) * Number(results[i].profit_convertTime.value));
                                                            isExit = true;
                                                        }
                                                    }
                                                    if (!isExit) {
                                                        quotaArry.push("-");//未定义预期收益
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "profit",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "orderNumRate":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(Number(results[i].orderNumRate_orderNum.value) / Number(results[i].orderNumRate_convertTime.value));
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "orderNumRate",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "avgCost":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].avgCost.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "avgCost",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            default :
                                break;
                        }
                        if (quota_data != null || quota_data != []) {
                            data.push(quota_data);
                        }

                    });
                }
                callbackFn(data);
            });
        },
        SearchPromotion: function (es, indexs, type, action, queryOptions, callbackFn) {
            var requests = [];
            for (var i = 0; i < indexs.length; i++) {
                requests.push({
                    index: indexs[i]
                });
            }
            async.map(requests, function (item, callback) {
                es.indices.exists(item, function (error, exists) {
                    callback(null, exists);
                });
            }, function (error, results) {
                var newIndexs = [];
                for (var i = 0; i < indexs.length; i++) {
                    if (results[i] == true) {
                        newIndexs.push(indexs[i]);
                    }
                }
                var _aggs = {};

                queryOptions.forEach(function (queryOption) {
                    for (var key in es_aggs[queryOption]) {
                        _aggs[key] = es_aggs[queryOption][key];
                    }
                });
                var request = {
                    "index": newIndexs,
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
                            var i = 0;
                            var isExit = false;
                            switch (queryOption) {
                                case "pv":
                                    for (i = 0; i < result.length; i++) {
                                        dataArry.push({
                                            pv: result[i].pv.value,
                                            campaignName: result[i].key
                                        });
                                    }
                                    break;
                                case "uv":
                                    for (i = 0; i < result.length; i++) {
                                        dataArry.push({
                                            uv: result[i].uv.value,
                                            campaignName: result[i].key
                                        });
                                    }
                                    break;
                                case "vc":
                                    for (i = 0; i < result.length; i++) {
                                        dataArry.push({
                                            vc: result[i].vc.value,
                                            campaignName: result[i].key
                                        });
                                    }
                                    break;

                                case "ip":
                                    for (i = 0; i < result.length; i++) {
                                        dataArry.push({
                                            ip: result[i].ip.value,
                                            campaignName: result[i].key
                                        });
                                    }
                                    break;
                                case "clickTotal":
                                    for (i = 0; i < result.length; i++) {
                                        dataArry.push({
                                            clickTotal: result[i].clickTotal.value,
                                            campaignName: result[i].key
                                        });
                                    }
                                    break;
                                case "conversions":
                                    for (i = 0; i < result.length; i++) {
                                        dataArry.push({
                                            conversions: result[i].conversions.value,
                                            campaignName: result[i].key
                                        });
                                    }
                                    break;
                                case "nuv":
                                    for (i = 0; i < result.length; i++) {
                                        dataArry.push({
                                            nuv: result[i].nuv.value,
                                            campaignName: result[i].key
                                        });
                                    }
                                    break;
                                case "nuvRate":
                                    for (i = 0; i < result.length; i++) {
                                        dataArry.push({
                                            nuvRate: (result[i].uv_aggs.value / result[i].new_visitor_aggs.value).toFixed(2) + "%",
                                            campaignName: result[i].key
                                        });
                                    }
                                    break;
                                case "crate":
                                    for (i = 0; i < result.length; i++) {
                                        dataArry.push({
                                            crate: (result[i].crate.value),
                                            campaignName: result[i].key
                                        });
                                    }
                                    break;
                                case "transformCost":
                                    for (i = 0; i < result.length; i++) {
                                        dataArry.push({
                                            transformCost: result[i].transformCost.value,
                                            campaignName: result[i].key
                                        });
                                    }
                                    break;
                                case "avgCost":
                                    for (i = 0; i < result.length; i++) {
                                        dataArry.push({
                                            avgCost: result[i].avgCost.value,
                                            campaignName: result[i].key
                                        });
                                    }
                                    break;
                                case "visitNum":
                                    for (i = 0; i < result.length; i++) {
                                        dataArry.push({
                                            visitNum: result[i].visitNum.value,
                                            campaignName: result[i].key
                                        });
                                    }
                                    break;
                                case "orderNum":
                                    for (i = 0; i < result.length; i++) {
                                        dataArry.push({
                                            orderNum: result[i].orderNum.value,
                                            campaignName: result[i].key
                                        });
                                    }
                                    break;
                                case "benefit":
                                    for (i = 0; i < result.length; i++) {
                                        isExit = false;
                                        if (result[i].benefit.buckets.length == 0) {
                                            dataArry.push({
                                                benefit: "0",
                                                campaignName: result[i].key
                                            });
                                        } else {
                                            for (i = 0; i < result[i].benefit.buckets.length; i++) {
                                                if (result[i].benefit.buckets[i] != "") {
                                                    dataArry.push({
                                                        benefit: Number(result[i].benefit.buckets[0].key) * Number(result[i].convertTime.value),
                                                        campaignName: result[i].key
                                                    });
                                                    isExit = true;
                                                }
                                            }
                                            //if(!isExit){
                                            //    dataArry.push({
                                            //        benefit: "-",
                                            //        campaignName: result[i].key
                                            //    });
                                            //}
                                        }
                                    }
                                    break;
                                case "profit":
                                    for (i = 0; i < result.length; i++) {
                                        isExit = false;
                                        if (result[i].profit_benefit.buckets.length == 0) {
                                            dataArry.push({
                                                profit: "0",
                                                campaignName: result[i].key
                                            });
                                        } else {
                                            for (i = 0; i < result[i].profit_benefit.buckets.length; i++) {
                                                if (result[i].profit_benefit.buckets[i] != "") {
                                                    dataArry.push({
                                                        profit: Number(result[i].profit_benefit.buckets[0].key) * Number(result[i].profit_convertTime.value),
                                                        campaignName: result[i].key
                                                    });
                                                    isExit = true;
                                                }
                                            }
                                            //if(!isExit){
                                            //    dataArry.push({
                                            //        profit_benefit: "-",
                                            //        campaignName: result[i].key
                                            //    });
                                            //}
                                        }
                                    }
                                    break;
                                case "orderNumRate":
                                    for (i = 0; i < result.length; i++) {
                                        dataArry.push({
                                            orderNumRate: Number(result[i].orderNumRate_orderNum.value) / Number(result[i].orderNumRate_convertTime.value),
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
                        var i = 0;
                        for (i = 0; i < result.length; i++) {
                            var data_Arrying = [];
                            dataArry.forEach(function (data) {
                                if (result[i].key == data["campaignName"]) {
                                    data_Arrying.push(data);
                                }
                            });
                            data_Arried.push(data_Arrying);
                        }
                        for (i = 0; i < data_Arried.length; i++) {
                            var data_success = {};
                            for (var keyNumber in data_Arried[i]) {
                                for (var keyString in data_Arried[i][keyNumber]) {
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
            });
        },
        searchAdvancedData: function (es, indexs, type, action, queryOptions, aggs, callbackFn) {
            var _aggs = {};
            aggs.forEach(function (agg) {
                for (var key in es_aggs[agg]) {
                    _aggs[key] = es_aggs[agg][key];
                }
            });
            var request = {
                "index": indexs,
                "type": type + "_" + action,
                "body": {
                    "size": 0,
                    "query": createQuery(queryOptions),
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
                    aggs.forEach(function (agg) {
                        var i = 0;
                        var isExit = false;
                        switch (agg) {
                            case "pv":
                                for (i = 0; i < result.length; i++) {
                                    dataArry.push({
                                        pv: result[i].pv.value,
                                        campaignName: result[i].key
                                    });
                                }
                                break;
                            case "uv":
                                for (i = 0; i < result.length; i++) {
                                    dataArry.push({
                                        uv: result[i].uv.value,
                                        campaignName: result[i].key
                                    });
                                }
                                break;
                            case "vc":
                                for (i = 0; i < result.length; i++) {
                                    dataArry.push({
                                        vc: result[i].vc.value,
                                        campaignName: result[i].key
                                    });
                                }
                                break;

                            case "ip":
                                for (i = 0; i < result.length; i++) {
                                    dataArry.push({
                                        ip: result[i].ip.value,
                                        campaignName: result[i].key
                                    });
                                }
                                break;
                            case "clickTotal":
                                for (i = 0; i < result.length; i++) {
                                    dataArry.push({
                                        clickTotal: result[i].clickTotal.value,
                                        campaignName: result[i].key
                                    });
                                }
                                break;
                            case "conversions":
                                for (i = 0; i < result.length; i++) {
                                    dataArry.push({
                                        conversions: result[i].conversions.value,
                                        campaignName: result[i].key
                                    });
                                }
                                break;
                            case "nuv":
                                for (i = 0; i < result.length; i++) {
                                    dataArry.push({
                                        nuv: result[i].nuv.value,
                                        campaignName: result[i].key
                                    });
                                }
                                break;
                            case "nuvRate":
                                for (i = 0; i < result.length; i++) {
                                    dataArry.push({
                                        nuvRate: (result[i].uv_aggs.value / result[i].new_visitor_aggs.value).toFixed(2) + "%",
                                        campaignName: result[i].key
                                    });
                                }
                                break;
                            case "crate":
                                for (i = 0; i < result.length; i++) {
                                    dataArry.push({
                                        crate: (result[i].crate.value ),
                                        campaignName: result[i].key
                                    });
                                }
                                break;
                            case "visitNum":
                                for (i = 0; i < result.length; i++) {
                                    dataArry.push({
                                        visitNum: result[i].visitNum.value,
                                        campaignName: result[i].key
                                    });
                                }
                                break;
                            case "transformCost":
                                for (i = 0; i < result.length; i++) {
                                    dataArry.push({
                                        transformCost: result[i].transformCost.value,
                                        campaignName: result[i].key
                                    });
                                }
                                break;
                            case "orderNum":
                                for (i = 0; i < result.length; i++) {
                                    dataArry.push({
                                        orderNum: result[i].orderNum.value,
                                        campaignName: result[i].key
                                    });
                                }
                                break;
                            case "benefit":
                                for (i = 0; i < result.length; i++) {
                                    isExit = false;
                                    if (result[i].benefit.buckets.length == 0) {
                                        dataArry.push({
                                            benefit: "0",
                                            campaignName: result[i].key
                                        });
                                    } else {
                                        for (i = 0; i < result[i].benefit.buckets.length; i++) {
                                            if (result[i].benefit.buckets[i] != "") {
                                                dataArry.push({
                                                    benefit: Number(result[i].benefit.buckets[0].key) * Number(result[i].convertTime.value),
                                                    campaignName: result[i].key
                                                });
                                                isExit = true;
                                            }
                                        }
                                        if (!isExit) {
                                            dataArry.push({
                                                benefit: "-",
                                                campaignName: result[i].key
                                            });
                                        }
                                    }
                                }
                                break;
                            case "profit":
                                for (i = 0; i < result.length; i++) {
                                    isExit = false;
                                    if (result[i].profit_benefit.buckets.length == 0) {
                                        dataArry.push({
                                            profit: "0",
                                            campaignName: result[i].key
                                        });
                                    } else {
                                        for (i = 0; i < result[i].profit_benefit.buckets.length; i++) {
                                            if (result[i].benefit.buckets[i] != "") {
                                                dataArry.push({
                                                    profit: Number(result[i].profit_benefit.buckets[0].key) * Number(result[i].profit_convertTime.value),
                                                    campaignName: result[i].key
                                                });
                                                isExit = true;
                                            }
                                        }
                                        if (!isExit) {
                                            dataArry.push({
                                                profit: "-",
                                                campaignName: result[i].key
                                            });
                                        }
                                    }
                                }
                                break;
                            case "orderNumRate":
                                for (i = 0; i < result.length; i++) {
                                    dataArry.push({
                                        orderNumRate: Number(result[i].orderNumRate_orderNum.value) / Number(result[i].orderNumRate_convertTime.value),
                                        campaignName: result[i].key
                                    });
                                }
                                break;
                            case "avgCost":
                                for (i = 0; i < result.length; i++) {
                                    dataArry.push({
                                        avgCost: result[i].avgCost.value,
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
                    var i = 0;
                    for (i = 0; i < result.length; i++) {
                        var data_Arrying = [];
                        dataArry.forEach(function (data) {
                            if (result[i].key == data["campaignName"]) {
                                data_Arrying.push(data);
                            }
                        });
                        data_Arried.push(data_Arrying);
                    }
                    for (i = 0; i < data_Arried.length; i++) {
                        var data_success = {};
                        for (var keyNumber in data_Arried[i]) {
                            for (var keyString in data_Arried[i][keyNumber]) {
                                data_success[keyString] = data_Arried[i][keyNumber][keyString];
                            }
                        }
                        data.push(data_success);
                    }
                    //==================================================================================
                    callbackFn(data);
                } else {
                    callbackFn(data);
                }
            });
        },
        SearchContrast: function (es, indexString, contrast_indexString, type, action, showType, queryOptions, callbackFn) {
            var requests = [];
            var _aggs = {};
            var contrast_aggs = {};
            _aggs[queryOptions] = es_aggs[queryOptions][queryOptions];
            contrast_aggs[queryOptions + "_contrast"] = es_aggs[queryOptions][queryOptions];
            var options = [queryOptions + "_contrast", queryOptions];
            switch (showType) {
                case "hour":
                    break;
                case "day":
                    var i = 0;
                    for (i = 0; i < indexString.length; i++) {
                        requests.push({
                            "index": indexString[i],
                            "type": type + "_" + action,
                            "body": {
                                "size": 0,
                                "aggs": _aggs
                            }
                        });
                    }
                    for (i = 0; i < contrast_indexString.length; i++) {
                        requests.push({
                            "index": contrast_indexString[i],
                            "type": type + "_" + action,
                            "body": {
                                "size": 0,
                                "aggs": contrast_aggs
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
                var quota_data = {};
                var keyArr = [];
                var keyArr_contrast = [];
                var quotaArry = [];
                if (results[0] != null) {
                    for (var k = 0; k < indexString.length; k++) {
                        keyArr.push(indexString[k].substring(7, indexString[k].length));
                    }
                    for (var i = 0; i < contrast_indexString.length; i++) {
                        keyArr_contrast.push(contrast_indexString[i].substring(7, contrast_indexString[i].length));
                    }
                    options.forEach(function (option) {
                        quota_data = {};
                        quotaArry = [];
                        var i;
                        var isExit = false;
                        switch (option) {
                            case "pv":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "pv",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "uv":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "uv",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "vc":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "vc",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;

                            case "ip":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "ip",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "clickTotal":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "clickTotal",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "conversions":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "conversions",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "nuv":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "nuv",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "nuvRate":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            if (result.new_visitor_aggs.value) {
                                                quotaArry.push(0);
                                            } else {
                                                quotaArry.push((result.uv_aggs.value / result.new_visitor_aggs.value).toFixed(2) + "%");
                                            }
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "nuvRate",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "crate":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result.crate.value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "crate",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "visitNum":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "visitNum",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "transformCost":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "transformCost",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "orderNum":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "orderNum",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "benefit":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            isExit = false;
                                            if (result.benefit.buckets.length == 0) {
                                                quotaArry.push("0");
                                            } else {
                                                for (i = 0; i < result.benefit.buckets.length; i++) {
                                                    if (result.benefit.buckets[i] != "") {
                                                        quotaArry.push(Number(result.benefit.buckets[0].key) * Number(result.convertTime.value));
                                                        isExit = true;
                                                    }
                                                }
                                                if (!isExit) {
                                                    quotaArry.push("-");
                                                }
                                            }
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "benefit",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "profit":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            isExit = false;
                                            if (result.profit_benefit.buckets.length == 0) {
                                                quotaArry.push("0");
                                            } else {
                                                for (i = 0; i < result.profit_benefit.buckets.length; i++) {
                                                    if (result.profit_benefit.buckets[i] != "") {
                                                        quotaArry.push(Number(result.profit_benefit.buckets[0].key) * Number(result.profit_convertTime.value));
                                                        isExit = true;
                                                    }
                                                }
                                                if (!isExit) {
                                                    quotaArry.push("-");
                                                }
                                            }
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "profit",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "orderNumRate":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(Number(result.orderNumRate_orderNum.value) / Number(result.orderNumRate_convertTime.value));
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "orderNumRate",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "avgCost":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "avgCost",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "avgCost_contrast":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "avgCost_contrast",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "orderNumRate_contrast":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value / Number(result.orderNumRate_convertTime.value));
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "orderNumRate_contrast",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "profit_contrast":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            isExit = false;
                                            if (result.profit_benefit_contrast.buckets.length == 0) {
                                                quotaArry.push("0");
                                            } else {
                                                for (i = 0; i < result.profit_benefit_contrast.buckets.length; i++) {
                                                    if (result.profit_benefit_contrast.buckets[i] != "") {
                                                        quotaArry.push(Number(result.profit_benefit_contrast.buckets[0].key) * Number(result.profit_convertTime.value));
                                                        isExit = true;
                                                    }
                                                }
                                                if (!isExit) {
                                                    quotaArry.push("-");
                                                }
                                            }
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "profit_contrast",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "benefit_contrast":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            isExit = false;
                                            if (result.benefit_contrast.buckets.length == 0) {
                                                quotaArry.push("0");
                                            } else {
                                                for (i = 0; i < result.benefit_contrast.buckets.length; i++) {
                                                    if (result.benefit_contrast.buckets[i] != "") {
                                                        quotaArry.push(Number(result.benefit_contrast.buckets[0].key) * Number(result.convertTime.value));
                                                        isExit = true;
                                                    }
                                                }
                                                if (!isExit) {
                                                    quotaArry.push("-");
                                                }
                                            }
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "benefit_contrast",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "orderNum_contrast":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "orderNum_contrast",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "transformCost_contrast":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "transformCost_contrast",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "visitNum_contrast":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "_contrast",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "pv_contrast":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "pv_contrast",
                                    key: keyArr_contrast,
                                    quota: quotaArry
                                };
                                break;
                            case "uv_contrast":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "uv_contrast",
                                    key: keyArr_contrast,
                                    quota: quotaArry
                                };
                                break;
                            case "vc_contrast":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "vc_contrast",
                                    key: keyArr_contrast,
                                    quota: quotaArry
                                };
                                break;

                            case "ip_contrast":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "ip_contrast",
                                    key: keyArr_contrast,
                                    quota: quotaArry
                                };
                                break;
                            case "clickTotal_contrast":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "clickTotal_contrast",
                                    key: keyArr_contrast,
                                    quota: quotaArry
                                };
                                break;
                            case "conversions_contrast":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "conversions_contrast",
                                    key: keyArr_contrast,
                                    quota: quotaArry
                                };
                                break;
                            case "nuv_contrast":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "nuv_contrast",
                                    key: keyArr_contrast,
                                    quota: quotaArry
                                };
                                break;
                            case "nuvRate_contrast":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "nuvRate_contrast",
                                    key: keyArr_contrast,
                                    quota: quotaArry
                                };
                                break;
                            case "crate_contrast":
                                results.forEach(function (result) {
                                    for (var key in result) {
                                        if (key == option) {
                                            quotaArry.push(result[key].value);
                                        }
                                    }
                                });
                                quota_data = {
                                    label: "crate_contrast",
                                    key: keyArr_contrast,
                                    quota: quotaArry
                                };
                                break;
                            default :
                                break;
                        }
                        if (quota_data != null || quota_data != []) {

                            data.push(quota_data);
                        }

                    });
                }
                callbackFn(data);
            });
        },

        searchByUrls: function (es, indexs, type, queryOptions, showType, callbackFn) {
            var requests = [];
            for (var i = 0; i < indexs.length; i++) {
                requests.push({
                    index: indexs[i]
                });
            }
            async.map(requests, function (item, callback) {
                es.indices.exists(item, function (error, exists) {
                    callback(null, exists);
                });
            }, function (error, results) {
                var newIndexs = [];
                for (var i = 0; i < indexs.length; i++) {
                    if (results[i] == true) {
                        newIndexs.push(indexs[i]);
                    }
                }
                if (newIndexs.length == 0) {
                    var null_data = []
                    if (showType == "total") {
                        null_data.push({
                            crate_pv: 0,
                            date_time: indexs[0].substring(7, indexs[0].length) + "~" + indexs[indexs.length - 1].substring(7, indexs[indexs.length - 1].length)
                        });
                    } else {
                        for (var k = 0; k < indexs.length; k++) {
                            null_data.push({
                                crate_pv: 0,
                                date_time: indexs[k].substring(7, indexs[k].length)
                            });
                        }
                    }
                    callbackFn(null_data);
                } else {
                    var requests = [];
                    switch (showType) {
                        case "hour":
                            break;
                        case "day":
                            var i = 0;
                            for (i = 0; i < newIndexs.length; i++) {
                                requests.push({
                                    "index": newIndexs[i],
                                    "type": type,
                                    "body": {
                                        "size": 0,
                                        "query": createQueryByUrls(queryOptions),
                                        "aggs": {
                                            "pv": {
                                                "value_count": {
                                                    "field": "_type"
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        case "week":
                            break;
                        case "month":
                            break;
                        default :
                            requests.push({
                                "index": newIndexs,
                                "type": type,
                                "body": {
                                    "size": 0,
                                    "query": createQueryByUrls(queryOptions),
                                    "aggs": {
                                        "pv": {
                                            "value_count": {
                                                "field": "_type"
                                            }
                                        }
                                    }
                                }
                            });
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
                        if (showType == "total") {
                            data.push({
                                "crate_pv": results[0].pv.value,
                                "date_time": indexs[0].substring(7, indexs[0].length) + "~" + indexs[indexs.length - 1].substring(7, indexs[indexs.length - 1].length)
                            });
                        } else {
                            for (var i = 0; i < indexs.length; i++) {
                                var flag = false;
                                for (var c = 0; c < newIndexs.length; c++) {
                                    if (indexs[i] == newIndexs[c]) {
                                        data.push({
                                            "crate_pv": results[c].pv.value,
                                            "date_time": newIndexs[c].substring(7, newIndexs[c].length)
                                        });
                                        flag = true;
                                        break;
                                    }
                                }
                                if (!flag) {
                                    data.push({
                                        "crate_pv": 0,
                                        "date_time": indexs[i].substring(7, indexs[i].length)
                                    });
                                }

                            }
                        }
                        callbackFn(data);
                    });
                }

            });

        },


/////////////////////MrDeng 新增 页面转化不问查询
        /**
         * 获取页面转化下的基础数据 类似于来源分析
         * @param es
         * @param indexs
         * @param startNum
         * @param endNum
         * @param type
         * @param pages
         * @param queryOptionsStr
         * @param callbackFn
         */
        searchPageBasePVs: function (es, indexs, startNum, endNum, type, pages, queryOptionsStr, filters, callbackFn) {
            var requests = [];
            for (var i = 0; i < indexs.length; i++) {
                requests.push({
                    index: indexs[i]
                });
            }
            async.map(requests, function (item, callback) {
                es.indices.exists(item, function (error, exists) {
                    callback(null, exists);
                });
            }, function (error, results) {
                var newIndexs = [];
                for (var i = 0; i < indexs.length; i++) {
                    if (results[i] == true) {
                        newIndexs.push(indexs[i]);
                    }
                }
                //查询内容
                var _aggs = {};
                var queryOptions = queryOptionsStr.split(",")
                queryOptions.forEach(function (queryOption) {
                    for (var key in es_aggs[queryOption]) {
                        _aggs[key] = es_aggs[queryOption][key];
                    }
                });
                var querys = []
                var boolQuery = [];


                pages.forEach(function (page) {
                    for (var i = 0; i < page.page_urls.length; i++) {
                        var filterQuery = []
                        if (filters != undefined && filters.length > 0) {
                            var jfilters = JSON.parse(filters)
                            jfilters.forEach(function (filter) {
                                filterQuery.push({"match": filter})
                            })
                        }
                        filterQuery.push({"match": {"loc": page.page_urls[i]}});
                        boolQuery.push({
                            "bool": {
                                "must": filterQuery
                            }
                        });
                    }
                })
                querys.push({
                    "index": newIndexs,
                    "type": type,
                    "body": {
                        "size": 0,
                        query: {
                            "bool": {
                                "should": boolQuery
                            }
                        },
                        "aggs": {
                            "pagePVs": {
                                "terms": {
                                    "script": "doc['rf_type'].value == 0 ? 3 : doc['rf_type'].value",
                                    "size": 0
                                },
                                "aggs": _aggs
                            }
                        },
                    }
                })
                var pvs = []
                //console.log("****************************")
                //console.log(JSON.stringify(querys[0]))
                es.search(querys[0], function (error, result) {
                    var datas = []
                    if (result != undefined && result.aggregations != undefined && result.aggregations.pagePVs != undefined && result.aggregations.pagePVs.buckets != undefined) {
                        var pvs = result.aggregations.pagePVs.buckets

                        pvs.forEach(function (pv) {
                            var data = {}
                            data["rf_type"] = pv["key"]
                            data["campaignName"] = pv["key"] == 1 ? "直接访问" : (pv["key"] == 2 ? "外部链接" : "搜索引擎")
                            queryOptions.forEach(function (queryOption) {
                                switch (queryOption) {
                                    case "nuvRate":
                                        if (pv.new_visitor_aggs.value == "0") {
                                            data[queryOption] = 0;
                                        } else {
                                            data[queryOption] = (pv.uv_aggs.value / pv.new_visitor_aggs.value).toFixed(2) + "%";
                                        }
                                        break;
                                    default :
                                        if (pv[queryOption] != undefined)
                                            data[queryOption] = pv[queryOption].value;
                                        break;
                                }
                            })
                            datas.push(data)
                        })
                        callbackFn(datas)
                    } else {
                        callbackFn(datas)
                    }
                });
            });
        },
        searchPageSePVs: function (es, indexs, startNum, endNum, type, rfType, pages, queryOptionsStr, filters, callbackFn) {
            var requests = [];
            for (var i = 0; i < indexs.length; i++) {
                requests.push({
                    index: indexs[i]
                });
            }
            async.map(requests, function (item, callback) {
                es.indices.exists(item, function (error, exists) {
                    callback(null, exists);
                });
            }, function (error, results) {
                var newIndexs = [];
                for (var i = 0; i < indexs.length; i++) {
                    if (results[i] == true) {
                        newIndexs.push(indexs[i]);
                    }
                }
                //查询内容
                var _aggs = {};
                var queryOptions = queryOptionsStr.split(",")
                queryOptions.forEach(function (queryOption) {
                    for (var key in es_aggs[queryOption]) {
                        _aggs[key] = es_aggs[queryOption][key];
                    }
                });
                var querys = []
                var boolQuery = [];
                pages.forEach(function (page) {
                    for (var i = 0; i < page.page_urls.length; i++) {
                        var filterQuery = []
                        if (filters != undefined && filters.length > 0) {
                            var jfilters = JSON.parse(filters)
                            jfilters.forEach(function (filter) {
                                filterQuery.push({"match": filter})
                            })
                        }
                        filterQuery.push({"match": {"rf_type": rfType}})
                        filterQuery.push({"match": {"loc": page.page_urls[i]}})
                        boolQuery.push({
                            "bool": {
                                "must": filterQuery
                            }
                        });
                    }
                })
                querys.push({
                    "index": newIndexs,
                    "type": type,
                    "body": {
                        "size": 0,
                        "query": {
                            "bool": {
                                "should": boolQuery
                            }
                        },
                        "aggs": {
                            "pagePVs": {
                                "terms": {
                                    "field": "se",
                                },
                                "aggs": _aggs
                            }
                        },
                    }
                })
                var pvs = []
                //console.log("****************************")
                //console.log(JSON.stringify(querys[0]))
                es.search(querys[0], function (error, result) {
                    var datas = []
                    if (result != undefined && result.aggregations != undefined && result.aggregations.pagePVs != undefined && result.aggregations.pagePVs.buckets != undefined) {
                        var pvs = result.aggregations.pagePVs.buckets

                        pvs.forEach(function (pv) {
                            var data = {}
                            //data["rf_type"] = pv["key"]
                            data["se"] = pv["key"]
                            data["campaignName"] = pv["key"] == "-" ? "未知来源" : pv["key"]
                            queryOptions.forEach(function (queryOption) {
                                switch (queryOption) {
                                    case "nuvRate":
                                        if (pv.new_visitor_aggs.value == "0") {
                                            data[queryOption] = 0;
                                        } else {
                                            data[queryOption] = (pv.uv_aggs.value / pv.new_visitor_aggs.value).toFixed(2) + "%";
                                        }
                                        break;
                                    default :
                                        if (pv[queryOption] != undefined)
                                            data[queryOption] = pv[queryOption].value;
                                        break;
                                }
                            })
                            datas.push(data)
                        })
                        callbackFn(datas)
                    } else {
                        callbackFn(datas)
                    }
                });
            });
        },

        /**
         * 查询页面转化的基础信息 按照rf_type 分组
         * @param es
         * @param indexs
         * @param startNum
         * @param endNum
         * @param type
         * @param pages
         * @param queryOptionsStr
         * @param callbackFn
         */
        searchPageBaseInfo: function (es, indexs, startNum, endNum, type, pages, queryOptionsStr, filters, callbackFn) {
            var requests = [];
            for (var i = 0; i < indexs.length; i++) {
                requests.push({
                    index: indexs[i]
                });
            }
            async.map(requests, function (item, callback) {
                es.indices.exists(item, function (error, exists) {
                    callback(null, exists);
                });
            }, function (error, results) {
                var newIndexs = [];
                for (var i = 0; i < indexs.length; i++) {
                    if (results[i] == true) {
                        newIndexs.push(indexs[i]);
                    }
                }
                //查询内容
                var _aggs = {};
                var queryOptions = queryOptionsStr.split(",")
                queryOptions.forEach(function (queryOption) {
                    for (var key in es_aggs[queryOption]) {
                        _aggs[key] = es_aggs[queryOption][key];
                    }
                });
                var querys = []
                var boolQuery = [];
                pages.forEach(function (page) {
                    for (var i = 0; i < page.page_urls.length; i++) {
                        var filterQuery = []
                        if (filters != undefined && filters.length > 0) {
                            var jfilters = JSON.parse(filters)
                            jfilters.forEach(function (filter) {
                                filterQuery.push({"match": filter})
                            })
                        }
                        filterQuery.push({"match": {"loc": page.page_urls[i]}})
                        boolQuery.push({
                            "bool": {
                                "must": filterQuery
                            }
                        });
                    }
                })
                querys.push({
                    "index": newIndexs,
                    "type": type + "_page",
                    "body": {
                        "size": 0,
                        query: {
                            "bool": {
                                "should": boolQuery
                            }
                        },
                        "aggs": {
                            "pagePVs": {
                                "terms": {
                                    "script": "doc['rf_type'].value == 0 ? 3 : doc['rf_type'].value",
                                    "size": 0
                                },
                                "aggs": {
                                    "conversions": {
                                        "value_count": {
                                            "field": "_type"
                                        }
                                    },
                                    "benefit": {
                                        "sum": {
                                            "script": "doc['p_income'].value"
                                        }
                                    },
                                    "orderNum": {
                                        "value_count": {
                                            "field": "p_orderid"
                                        }
                                    }
                                }
                            }
                        },
                    }
                })
                //console.log("****************************")
                //console.log(JSON.stringify(querys[0]))
                es.search(querys[0], function (error, result) {
                    var results = {}
                    if (result != undefined && result.aggregations != undefined && result.aggregations.pagePVs != undefined && result.aggregations.pagePVs.buckets != undefined) {
                        var infos = result.aggregations.pagePVs.buckets
                        infos.forEach(function (info) {
                            var key = info["key"] == 1 ? "直接访问" : (info["key"] == 2 ? "外部链接" : "搜索引擎")
                            results[key] = info
                        })
                    }
                    callbackFn(results)
                });
            });
        },

        searchPageConvInfo: function (es, indexs, startNum, endNum, type, rfType, se, queryOptionsStr, filters, callbackFn) {
            var requests = [];
            for (var i = 0; i < indexs.length; i++) {
                requests.push({
                    index: indexs[i]
                });
            }
            async.map(requests, function (item, callback) {
                es.indices.exists(item, function (error, exists) {
                    callback(null, exists);
                });
            }, function (error, results) {
                var newIndexs = [];
                for (var i = 0; i < indexs.length; i++) {
                    if (results[i] == true) {
                        newIndexs.push(indexs[i]);
                    }
                }
                //查询内容
                var _aggs = {};
                var queryOptions = queryOptionsStr.split(",")
                queryOptions.forEach(function (queryOption) {
                    for (var key in es_aggs[queryOption]) {
                        _aggs[key] = es_aggs[queryOption][key];
                    }
                });
                var filterQuery = []
                if (filters != undefined && filters.length > 0) {
                    var jfilters = JSON.parse(filters)
                    jfilters.forEach(function (filter) {
                        filterQuery.push({"match": filter})
                    })
                }
                filterQuery.push({"match": {"rf_type": rfType}})
                filterQuery.push({"match": {"loc": page.page_urls[i]}})
                var query = {
                    "index": newIndexs,
                    "type": type + "_page",
                    "body": {
                        "size": 0,
                        query: {
                            "bool": {
                                "must": filterQuery
                            }
                        },
                        "aggs": {
                            "pagePVs": {
                                "terms": {
                                    "field": "p_name"
                                },
                                "aggs": {
                                    "conversions": {
                                        "value_count": {
                                            "field": "_type"
                                        }
                                    },
                                    "benefit": {
                                        "sum": {
                                            "script": "doc['p_income'].value"
                                        }
                                    },
                                    "orderNum": {
                                        "value_count": {
                                            "field": "p_orderid"
                                        }
                                    }
                                }
                            }
                        },
                    }
                }
                //console.log("****************************")
                //console.log(JSON.stringify(query))
                es.search(query, function (error, result) {
                    if (result != undefined && result.aggregations != undefined && result.aggregations.pagePVs != undefined && result.aggregations.pagePVs.buckets != undefined) {
                        var infos = result.aggregations.pagePVs.buckets
                        callbackFn(infos)
                    }
                    callbackFn([])
                });
            });
        },

        searchDayPagePVs: function (es, indexs, type, showType, queryOptions, urls, filters, callbackFn) {
            var _aggs = {};
            queryOptions.forEach(function (queryOption) {
                for (var key in es_aggs[queryOption]) {
                    _aggs[key] = es_aggs[queryOption][key];
                }
            });
            var requests = [];
            switch (showType) {
                case "hour":
                    break;
                case "day":
                    for (var i = 0; i < indexs.length; i++) {
                        var boolQuery = []
                        urls.forEach(function (url) {
                            var filterQuery = []
                            if (filters != undefined && filters.length > 0) {
                                var jfilters = JSON.parse(filters)
                                jfilters.forEach(function (filter) {
                                    filterQuery.push({"match": filter})
                                })
                            }
                            filterQuery.push({"match": {"loc": url}})
                            boolQuery.push({
                                "bool": {
                                    "must": filterQuery
                                }
                            });
                        })
                        requests.push({
                            index: indexs[i],
                            type: type,
                            "body": {
                                "size": 0,
                                query: {
                                    bool: {
                                        "should": boolQuery
                                    }
                                },
                                "aggs": _aggs
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
                //console.log("****************************")
                //console.log(JSON.stringify(item))
                es.search(item, function (error, result) {
                    if (result != undefined && result.aggregations != undefined) {
                        callback(null, result.aggregations);
                    } else {
                        callback(null, null);
                    }
                });
            }, function (error, results) {
                var data = [];
                var quota_data = {};
                var keyArr = [];
                var quotaArry = [];
                if (results[0] != null) {
                    for (var i = 0; i < indexs.length; i++) {
                        keyArr.push(indexs[i].substring(7, indexs[i].length));
                    }
                    queryOptions.forEach(function (queryOption) {
                        quota_data = {};
                        quotaArry = [];
                        var i = 0;
                        var isExit = false;
                        switch (queryOption) {
                            case "pv":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].pv.value);
                                        }
                                    }

                                }
                                quota_data = {
                                    label: "pv",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "uv":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].uv.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "uv",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "vc":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].vc.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "vc",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;

                            case "ip":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].ip.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "ip",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "clickTotal":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].clickTotal.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "clickTotal",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "conversions":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].conversions.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "conversions",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "nuv":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].nuv.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "nuv",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "visitNum":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].visitNum.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "visitNum",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "nuvRate":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            if (results[i].new_visitor_aggs.value == "0") {
                                                quotaArry.push(0);
                                            } else {
                                                quotaArry.push((results[i].uv_aggs.value / results[i].new_visitor_aggs.value).toFixed(2) + "%");
                                            }
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "nuvRate",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "crate":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].crate.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "crate",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "transformCost":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].transformCost.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "transformCost",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "orderNum":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].orderNum.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "orderNum",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "benefit":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            if (results[i].benefit.buckets.length == 0) {
                                                quotaArry.push("0");//不存在记录
                                            } else {
                                                for (i = 0; i < results[i].benefit.buckets.length; i++) {
                                                    if (results[i].benefit.buckets[i] != "") {
                                                        quotaArry.push(Number(results[i].benefit.buckets[0].key) * Number(results[i].convertTime.value));
                                                        isExit = true;
                                                    }
                                                }
                                                if (!isExit) {
                                                    quotaArry.push("-");//未定义预期收益
                                                }
                                            }
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "benefit",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "profit":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            if (key == queryOption) {
                                                if (results[i].profit_benefit.buckets.length == 0) {
                                                    quotaArry.push("0");//不存在记录
                                                } else {
                                                    for (i = 0; i < results[i].profit_benefit.buckets.length; i++) {
                                                        if (results[i].profit_benefit.buckets[i] != "") {
                                                            quotaArry.push(Number(results[i].profit_benefit.buckets[0].key) * Number(results[i].profit_convertTime.value));
                                                            isExit = true;
                                                        }
                                                    }
                                                    if (!isExit) {
                                                        quotaArry.push("-");//未定义预期收益
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "profit",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "orderNumRate":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(Number(results[i].orderNumRate_orderNum.value) / Number(results[i].orderNumRate_convertTime.value));
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "orderNumRate",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            case "avgCost":
                                for (i = 0; i < results.length; i++) {
                                    for (var key in results[i]) {
                                        if (key == queryOption) {
                                            quotaArry.push(results[i].avgCost.value);
                                        }
                                    }
                                }
                                quota_data = {
                                    label: "avgCost",
                                    key: keyArr,
                                    quota: quotaArry
                                };
                                break;
                            default :
                                break;
                        }
                        if (quota_data != null || quota_data != []) {
                            data.push(quota_data);
                        }

                    });
                }
                callbackFn(data);
            });
        },


        /////////////////////////MrDeng 新增 事件转化部分查询
        searchEventPVs: function (es, indexs, startNum, endNum, type, events, queryOptionsStr, filters, callbackFn) {
            var requests = [];
            for (var i = 0; i < indexs.length; i++) {
                requests.push({
                    index: indexs[i]
                });
            }
            async.map(requests, function (item, callback) {
                es.indices.exists(item, function (error, exists) {
                    callback(null, exists);
                });
            }, function (error, results) {
                var newIndexs = [];
                for (var i = 0; i < indexs.length; i++) {
                    if (results[i] == true) {
                        newIndexs.push(indexs[i]);
                    }
                }
                //查询内容
                var _aggs = {};
                var queryOptions = queryOptionsStr.split(",")
                queryOptions.forEach(function (queryOption) {
                    for (var key in es_aggs[queryOption]) {
                        _aggs[key] = es_aggs[queryOption][key];
                    }
                });

                var querys = []
                events.forEach(function (event) {
                    var filterQuery = []
                    if (filters != undefined && filters.length > 0) {
                        var jfilters = JSON.parse(filters)
                        jfilters.forEach(function (filter) {
                            filterQuery.push({
                                "term": filter
                            })
                        })
                    }
                    filterQuery.push({
                        "range": {
                            "utime": {
                                "from": (startNum > event.update_time ? startNum : event.update_time ),
                                "to": endNum
                            }//开始时间取大的
                        }
                    })

                    filterQuery.push({
                        "term": {"loc": event.event_page}
                    })
                    querys.push({
                        "index": newIndexs,
                        "type": type,
                        "body": {
                            "size": 0,
                            query: {
                                bool: {
                                    "must": filterQuery
                                }
                            },
                            "aggs": _aggs
                        }
                    })
                })
                var pvs = []
                async.eachSeries(querys, function (item, callback) {

                    es.search(item, function (error, result) {
                        if (result != undefined && result.aggregations != undefined) {
                            pvs.push(result.aggregations)
                            callback(null, result.aggregations);
                        } else {
                            callback(null, null);
                        }
                    });

                }, function (error, results) {
                    var datas = []
                    pvs.forEach(function (pv) {
                        var data = {}
                        queryOptions.forEach(function (queryOption) {
                            switch (queryOption) {
                                case "nuvRate":
                                    if (pv.new_visitor_aggs.value == "0") {
                                        data[queryOption] = 0;
                                    } else {
                                        data[queryOption] = ((pv.uv_aggs.value / pv.new_visitor_aggs.value) * 100).toFixed(2) + "%";
                                    }
                                    break;
                                default :
                                    data[queryOption] = pv[queryOption].value;
                                    break;
                            }
                        })
                        datas.push(data)
                    })
                    callbackFn(datas);
                });
            });
        },
        searchConvEvents: function (es, indexs, startNum, endNum, type, eventPages, showType, filters, callback) {
            var indexQurey = []
            for (var i = 0; i < indexs.length; i++) {
                indexQurey.push({
                    index: indexs[i]
                });
            }
            async.map(indexQurey,
                //集合不存在情况处理
                function (item, callback) {
                    es.indices.exists(item, function (error, exists) {
                        callback(null, exists);
                    });
                },
                //存在集合情况处理
                function (error, results) {
                    var newIndexs = [];
                    for (var i = 0; i < indexs.length; i++) {
                        if (results[i] == true) {
                            newIndexs.push(indexs[i]);
                        }
                    }
                    if (newIndexs.length == 0) {//不存在集合
                        var null_data = []
                        callback(null_data);
                    }
                    else {
                        var querys = []
                        eventPages.forEach(function (eventPage) {
                            var filterQuery = []
                            if (filters != undefined && filters.length > 0) {
                                var jfilters = JSON.parse(filters)
                                jfilters.forEach(function (filter) {
                                    filterQuery.push({
                                        "term": filter
                                    })
                                })
                            }
                            filterQuery.push({
                                "term": {"loc": eventPage.event_page}
                            })
                            filterQuery.push({
                                "range": {
                                    "utime": {
                                        "from": (startNum > eventPage.update_time ? startNum : eventPage.update_time ),
                                        "to": endNum
                                    }//开始时间取大的
                                }
                            })
                            querys.push({
                                    eventPage: eventPage.event_page,
                                    query: {
                                        "index": newIndexs,
                                        "type": type + "_event",
                                        "body": {
                                            "size": 0,
                                            query: {
                                                bool: {
                                                    "must": filterQuery
                                                }
                                            },
                                            "aggs": {
                                                "etIdTerms": {
                                                    "terms": {
                                                        "field": "et_category"
                                                    },
                                                    "aggs": {
                                                        "convCount": {
                                                            "sum": {
                                                                "field": "et_target"
                                                            }
                                                        },
                                                        "eventCount": {
                                                            "value_count": {
                                                                "field": "et_category"
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            )
                        })
                        var pageEvents = {}
                        async.eachSeries(querys, function (item, callback) {
                                //console.log("*************ConvEvent*****************")
                                //console.log(JSON.stringify(item))
                                es.search(item.query, function (error, result) {
                                    if (result != undefined && result.aggregations != undefined) {
                                        if (result.aggregations.etIdTerms.buckets != undefined) {
                                            result.aggregations.etIdTerms.buckets.forEach(function (buck) {
                                                var res = {}
                                                pageEvents[item.eventPage + "_" + buck.key] = {
                                                    eventCount: buck.eventCount == undefined ? 0 : buck.eventCount.value,
                                                    convCount: buck.convCount == undefined ? 0 : buck.convCount.value
                                                }
                                            })
                                        }
                                        callback(null, result);
                                    }
                                    else {
                                        callback(null, null);
                                    }
                                });
                            },
                            function (error, results) {
                                callback(pageEvents);
                            }
                        );
                    }
                }
            )
        },
        searchConvEvent: function (es, indexs, type, showType, filters, callback) {
            var indexQurey = []
            for (var i = 0; i < indexs.length; i++) {
                indexQurey.push({
                    index: indexs[i]
                });
            }
            async.map(indexQurey,
                //集合不存在情况处理
                function (item, callback) {
                    es.indices.exists(item, function (error, exists) {
                        callback(null, exists);
                    });
                },
                //存在集合情况处理
                function (error, results) {
                    var newIndexs = []
                    for (var eindex in results) {
                        if (results[eindex])
                            newIndexs.push(indexQurey[eindex])
                    }
                    if (newIndexs.length == 0) {//不存在集合
                        var null_data = []
                        if (showType == "total") {
                            null_data.push({
                                crate_pv: 0,
                                date_time: indexs[0].substring(7, indexs[0].length) + "~" + indexs[indexs.length - 1].substring(7, indexs[indexs.length - 1].length)
                            });
                        } else {
                            for (var k = 0; k < indexs.length; k++) {
                                null_data.push({
                                    crate_pv: 0, date_time: indexs[k].substring(7, indexs[k].length)
                                });
                            }
                        }
                        callback(null_data);
                    } else {
                        var requests = [];

                        switch (showType) {
                            case "day":
                                for (i = 0; i < newIndexs.length; i++) {
                                    var filterQuery = []
                                    if (filters != undefined && filters.length > 0) {
                                        var jfilters = JSON.parse(filters)
                                        jfilters.forEach(function (filter) {
                                            filterQuery.push({
                                                "term": filter
                                            })
                                        })
                                    }
                                    requests.push({
                                        "index": newIndexs[i].index,
                                        "type": type + "_event",
                                        "body": {
                                            "size": 0,
                                            query: {
                                                bool: {
                                                    "must": filterQuery
                                                }
                                            },
                                            "aggs": {
                                                "countTarget": {
                                                    "terms": {
                                                        "field": "et_target"
                                                    }
                                                },
                                            }
                                        }
                                    });
                                }
                                break;
                            default :
                                requests.push({
                                    "index": newIndexs[0].index,
                                    "type": type + "_event",
                                    "body": {
                                        "size": 0,
                                        "aggs": {
                                            "countTarget": {
                                                "terms": {
                                                    "field": "et_target"
                                                }
                                            },
                                        }
                                    }
                                });
                                break;
                        }
                        async.map(requests, function (item, callback) {
                            //console.log("****************************")
                            //console.log(JSON.stringify(item))
                            es.search(item, function (error, result) {
                                if (result != undefined && result.aggregations != undefined) {
                                    callback(null, result.aggregations);
                                } else {
                                    callback(null, null);
                                }
                            });
                        }, function (error, results) {
                            var data = []
                            if (showType == "tatol") {
                                var eventCount = 0;
                                var convCount = 0;
                                results[0].countTarget.buckets.forEach(function (item) {
                                    if (item.key == "true") {
                                        convCount = item.doc_count
                                        eventCount += item.doc_count
                                    } else {
                                        eventCount += item.doc_count
                                    }
                                })
                                data.push({
                                    "eventCount": eventCount,
                                    "convCount": convCount,
                                    "date_time": indexs[0].substring(7, indexs[0].length) + "~" + indexs[indexs.length - 1].substring(7, indexs[indexs.length - 1].length)
                                });
                            } else if (showType == "day") {
                                results.forEach(function (item) {
                                    var eventCount = 0;
                                    var convCount = 0;
                                    item.countTarget.buckets.forEach(function (item) {
                                        if (item.key == "true") {
                                            convCount = item.doc_count
                                            eventCount += item.doc_count
                                        } else {
                                            eventCount += item.doc_count
                                        }
                                    })
                                    data.push({
                                        "eventCount": eventCount,
                                        "convCount": convCount,
                                        "date_time": indexs[0].substring(7, indexs[0].length) + "~" + indexs[indexs.length - 1].substring(7, indexs[indexs.length - 1].length)
                                    });
                                })
                            }
                            callback(data);
                        });
                    }
                })
        },
    }
    ;
var createQueryByUrls = function (urls) {
    var boolQuery = [];
    for (var i = 0; i < urls.length; i++) {
        boolQuery.push({
            "term": {
                "loc": urls[i]
            }
        });
    }
    return {bool: {should: boolQuery}};
};
var createQuery = function (querys) {
    var queryString = [];
    querys.forEach(function (query) {
        for (var key in query) {
            if (query[key] != "all") {
                queryString.push({
                    "term": createQueryMap(key, query[key])
                });
            }
        }
    });
    var queryText = {
        "bool": {
            "must": queryString
        }
    };
    return queryText;
};
var createQueryMap = function (key, value) {
    var queryMap = {};
    switch (key) {
        case "souce":
            queryMap = {"rf_type": value};
            break;
        case "browser":
            queryMap = {"se": value};
            break;
        case "all_rf":
            queryMap = {};
            break;
        case "uv_type":
            if (value == "all") {
                queryMap = {};
            } else {
                queryMap = {
                    ct: value
                };
            }
            break;
        case "city":
            if (value == "all") {
                queryMap = {};
            } else {
                queryMap = {
                    remote: value
                };
            }
            break;
        case "terminal_type":
            if (value == "all") {
                queryMap = {};
            } else {
                queryMap = {
                    pm: value
                };
            }
            break;
    }
    return queryMap;
};
module.exports = transform;