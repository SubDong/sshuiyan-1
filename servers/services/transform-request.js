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
        "nuv": {
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
                "field": "tt"
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
    },
    // 事件点击总数
    "clickTotal": {
        "clickTotal": {
            "value_count": {
                "field": "_type"
            }
        }
    },
    // 转化次数
    "conversions": {
        "conversions": {
            "value_count": {
                "field": "_type"
            }
        }
    },
    //转化率
    "crate": {
        "conversions_crate": {
            "value_count": {
                "field": "_type"
            }
        },
        "vc_crate": {
            "value_count": {
                "field": "tt"
            }
        }
    }
};
var transform = {
    search: function (es, indexs, type, action, querys, callbackFn) {
        var _aggs = {};
        querys.forEach(function (queryOption) {
            for (var key in es_aggs[queryOption]) {
                _aggs[key] = es_aggs[queryOption][key];
            }
        });
        var request = {
            "index": indexs,
            "type": type + "_" + action,
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
                    if (queryOption == "crate") {
                        if (result.new_visitor_aggs.value == "0") {
                            data[queryOption] = "0";
                        } else {
                            data[queryOption] = (result.uv_aggs.value / result.new_visitor_aggs.value).toFixed(2);
                        }
                    } else if (queryOption == "nuvRate") {
                        if (result.conversions_crate.value == "0") {
                            data[queryOption] = 0;
                        } else {
                            data[queryOption] = (result.conversions_crate.value / result.conversions_crate.value).toFixed(2);
                        }
                    }
                    else {
                        data[queryOption] = result[queryOption].value
                    }
                });
                callbackFn(data);
            } else
                callbackFn(data);
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
                        type: type + "_" + action,
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
                    switch (queryOption) {
                        case "pv":
                            for (var i = 0; i < results.length; i++) {
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
                            for (var i = 0; i < results.length; i++) {
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
                            for (var i = 0; i < results.length; i++) {
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
                            for (var i = 0; i < results.length; i++) {
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
                            for (var i = 0; i < results.length; i++) {
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
                            for (var i = 0; i < results.length; i++) {
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
                            for (var i = 0; i < results.length; i++) {
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
                        case "nuvRate":
                            for (var i = 0; i < results.length; i++) {
                                for (var key in results[i]) {
                                    if (key == queryOption) {
                                        if (results[i].new_visitor_aggs.value == "0") {
                                            quotaArry.push(0);
                                        } else {
                                            quotaArry.push((results[i].uv_aggs.value / results[i].new_visitor_aggs.value).toFixed(2));
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
                            for (var i = 0; i < results.length; i++) {
                                for (var key in results[i]) {
                                    if (key == queryOption) {
                                        if (results[i].conversions_crate.value != "0") {
                                            quotaArry.push((results[i].conversions_crate.value / results[i].conversions_crate.value).toFixed(2));
                                        } else {
                                            quotaArry.push(0);
                                        }
                                    }
                                }
                            }
                            quota_data = {
                                label: "crate",
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
                        case "clickTotal":
                            for (var i = 0; i < result.length; i++) {
                                dataArry.push({
                                    clickTotal: result[i].clickTotal.value,
                                    campaignName: result[i].key
                                });
                            }
                            break;
                        case "conversions":
                            for (var i = 0; i < result.length; i++) {
                                dataArry.push({
                                    conversions: result[i].conversions.value,
                                    campaignName: result[i].key
                                });
                            }
                            break;
                        case "nuv":
                            for (var i = 0; i < result.length; i++) {
                                dataArry.push({
                                    nuv: result[i].nuv.value,
                                    campaignName: result[i].key
                                });
                            }
                            break;
                        case "nuvRate":
                            for (var i = 0; i < result.length; i++) {
                                dataArry.push({
                                    nuvRate: (result[i].uv_aggs.value / result[i].new_visitor_aggs.value).toFixed(2) + "%",
                                    campaignName: result[i].key
                                });
                            }
                            break;
                        case "crate":
                            for (var i = 0; i < result.length; i++) {
                                dataArry.push({
                                    crate: (result[i].conversions_crate.value / result[i].vc_crate.value).toFixed(2) + "%",
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
                for (var i = 0; i < result.length; i++) {
                    var data_Arrying = [];
                    dataArry.forEach(function (data) {
                        if (result[i].key == data["campaignName"]) {
                            data_Arrying.push(data);
                        }
                    });
                    data_Arried.push(data_Arrying);
                }
                for (var i = 0; i < data_Arried.length; i++) {
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
                    switch (agg) {
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
                        case "clickTotal":
                            for (var i = 0; i < result.length; i++) {
                                dataArry.push({
                                    clickTotal: result[i].clickTotal.value,
                                    campaignName: result[i].key
                                });
                            }
                            break;
                        case "conversions":
                            for (var i = 0; i < result.length; i++) {
                                dataArry.push({
                                    conversions: result[i].conversions.value,
                                    campaignName: result[i].key
                                });
                            }
                            break;
                        case "nuv":
                            for (var i = 0; i < result.length; i++) {
                                dataArry.push({
                                    nuv: result[i].nuv.value,
                                    campaignName: result[i].key
                                });
                            }
                            break;
                        case "nuvRate":
                            for (var i = 0; i < result.length; i++) {
                                dataArry.push({
                                    nuvRate: (result[i].uv_aggs.value / result[i].new_visitor_aggs.value).toFixed(2) + "%",
                                    campaignName: result[i].key
                                });
                            }
                            break;
                        case "crate":
                            for (var i = 0; i < result.length; i++) {
                                dataArry.push({
                                    crate: (result[i].conversions_crate.value / result[i].vc_crate.value).toFixed(2) + "%",
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
                for (var i = 0; i < result.length; i++) {
                    var data_Arrying = [];
                    dataArry.forEach(function (data) {
                        if (result[i].key == data["campaignName"]) {
                            data_Arrying.push(data);
                        }
                    });
                    data_Arried.push(data_Arrying);
                }
                for (var i = 0; i < data_Arried.length; i++) {
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
                for (var i = 0; i < indexString.length; i++) {
                    requests.push({
                        "index": indexString[i],
                        "type": type + "_" + action,
                        "body": {
                            "size": 0,
                            "aggs": _aggs
                        }
                    });
                }
                for (var i = 0; i < contrast_indexString.length; i++) {
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
                for (var i = 0; i < indexString.length; i++) {
                    keyArr.push(indexString[i].substring(7, indexString[i].length));
                }
                for (var i = 0; i < contrast_indexString.length; i++) {
                    keyArr_contrast.push(contrast_indexString[i].substring(7, contrast_indexString[i].length));
                }
                options.forEach(function (option) {
                    quota_data = {};
                    quotaArry = [];
                    switch (option) {
                        case "pv":
                            for (var i = 0; i < keyArr.length; i++) {
                                quotaArry.push(results[i].pv.value);
                            }
                            quota_data = {
                                label: "pv",
                                key: keyArr,
                                quota: quotaArry
                            };
                            break;
                        case "uv":
                            for (var i = 0; i < keyArr.length; i++) {
                                quotaArry.push(results[i].uv.value);
                            }
                            quota_data = {
                                label: "uv",
                                key: keyArr,
                                quota: quotaArry
                            };
                            break;
                        case "vc":
                            for (var i = 0; i < keyArr.length; i++) {
                                quotaArry.push(results[i].vc.value);
                            }
                            quota_data = {
                                label: "vc",
                                key: keyArr,
                                quota: quotaArry
                            };
                            break;

                        case "ip":
                            for (var i = 0; i < keyArr.length; i++) {
                                quotaArry.push(results[i].ip.value);
                            }
                            quota_data = {
                                label: "ip",
                                key: keyArr,
                                quota: quotaArry
                            };
                            break;
                        case "clickTotal":
                            for (var i = 0; i < keyArr.length; i++) {
                                quotaArry.push(results[i].clickTotal.value);
                            }
                            quota_data = {
                                label: "clickTotal",
                                key: keyArr,
                                quota: quotaArry
                            };
                            break;
                        case "conversions":
                            for (var i = 0; i < keyArr.length; i++) {
                                quotaArry.push(results[i].conversions.value);
                            }
                            quota_data = {
                                label: "conversions",
                                key: keyArr,
                                quota: quotaArry
                            };
                            break;
                        case "nuv":
                            for (var i = 0; i < keyArr.length; i++) {
                                quotaArry.push(results[i].nuv.value);
                            }
                            quota_data = {
                                label: "nuv",
                                key: keyArr,
                                quota: quotaArry
                            };
                            break;
                        case "nuvRate":
                            for (var i = 0; i < keyArr.length; i++) {
                                if (result[i].new_visitor_aggs.value) {
                                    quotaArry.push(0);
                                } else {
                                    quotaArry.push((result[i].uv_aggs.value / result[i].new_visitor_aggs.value).toFixed(2));
                                }
                            }
                            quota_data = {
                                label: "nuvRate",
                                key: keyArr,
                                quota: quotaArry
                            };
                            break;
                        case "crate":
                            for (var i = 0; i < keyArr.length; i++) {
                                if (results[i].conversions_crate.value != "0") {
                                    quotaArry.push((results[i].conversions_crate.value / results[i].conversions_crate.value).toFixed(2));
                                } else {
                                    quotaArry.push(0);
                                }
                            }
                            quota_data = {
                                label: "crate",
                                key: keyArr,
                                quota: quotaArry
                            };
                            break;
                        case "pv_contrast":
                            for (var i = keyArr.length; i < results.length; i++) {
                                quotaArry.push(results[i].pv_contrast.value);
                            }
                            quota_data = {
                                label: "pv_contrast",
                                key: keyArr_contrast,
                                quota: quotaArry
                            };
                            break;
                        case "uv_contrast":
                            for (var i = keyArr.length; i < results.length; i++) {
                                quotaArry.push(results[i].uv_contrast.value);
                            }
                            quota_data = {
                                label: "uv_contrast",
                                key: keyArr_contrast,
                                quota: quotaArry
                            };
                            break;
                        case "vc_contrast":
                            for (var i = keyArr.length; i < results.length; i++) {
                                quotaArry.push(results[i].vc_contrast.value);
                            }
                            quota_data = {
                                label: "vc_contrast",
                                key: keyArr_contrast,
                                quota: quotaArry
                            };
                            break;

                        case "ip_contrast":
                            for (var i = keyArr.length; i < results.length; i++) {
                                quotaArry.push(results[i].ip_contrast.value);
                            }
                            quota_data = {
                                label: "ip_contrast",
                                key: keyArr_contrast,
                                quota: quotaArry
                            };
                            break;
                        case "clickTotal_contrast":
                            for (var i = keyArr.length; i < results.length; i++) {
                                quotaArry.push(results[i].clickTotal_contrast.value);
                            }
                            quota_data = {
                                label: "clickTotal_contrast",
                                key: keyArr_contrast,
                                quota: quotaArry
                            };
                            break;
                        case "conversions_contrast":
                            for (var i = keyArr.length; i < results.length; i++) {
                                quotaArry.push(results[i].conversions_contrast.value);
                            }
                            quota_data = {
                                label: "conversions_contrast",
                                key: keyArr_contrast,
                                quota: quotaArry
                            };
                            break;
                        case "nuv_contrast":
                            for (var i = keyArr.length; i < results.length; i++) {
                                quotaArry.push(results[i].nuv_contrast.value);
                            }
                            quota_data = {
                                label: "nuv_contrast",
                                key: keyArr_contrast,
                                quota: quotaArry
                            };
                            break;
                        case "nuvRate_contrast":
                            for (var i = keyArr.length; i < results.length; i++) {
                                quotaArry.push(results[i].nuvRate_contrast.value);
                            }
                            quota_data = {
                                label: "nuvRate_contrast",
                                key: keyArr_contrast,
                                quota: quotaArry
                            };
                            break;
                        case "crate_contrast":
                            for (var i = keyArr.length; i < results.length; i++) {
                                if (results[i].conversions_crate.value != "0") {
                                    quotaArry.push((results[i].conversions_crate.value / results[i].conversions_crate.value).toFixed(2));
                                } else {
                                    quotaArry.push(0);
                                }
                            }
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
    }
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
                    city: value
                };
            }
            break;
    }
    return queryMap;
};
module.exports = transform;