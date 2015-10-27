/**
 * Created by icepros on 2015/7/15.
 */

// �·ÿ���
var _new_visitor_aggs = {
    "filter": {
        "term": {
            "entrance": "1"
        }
    },
    "aggs": {
        "nuv_aggs": {
            "sum": {
                "script": "c=0; if (doc['ct'].value == 0) {c = 1}; c"
            }
        }
    }
};

// �ÿʹ���
var _vc_aggs = {
    "filter": {
        "term": {
            "entrance": "1"
        }
    },
    "aggs": {
        "vc_aggs": {
            "value_count": {
                "field": "tt"
            }
        }
    }
};

var es_aggs = {
    // �������
    "pv": {
        "pv_aggs": {
            "value_count": {
                "field": "loc"
            }
        }
    },
    // ���������
    "contribution": {
        "cpv_aggs": {
            "filter": {
                "term": {
                    "entrance": "1"
                }
            },
            "aggs": {
                "cpv_aggs": {
                    "value_count": {
                        "field": "entrance"
                    }
                }
            }
        }
    },
    // �ÿ���
    "uv": {
        "uv_aggs": {
            "cardinality": {
                "field": "_ucv"
            }
        }
    },
    // ���ʴ���
    "vc": {
        "vc_aggs": _vc_aggs
    },
    // �����
    "outRate": {
        "single_visitor_aggs": {
            "terms": {
                "field": "tt",
                "size": 0,
                "min_doc_count": 2
            }
        },
        "vc_aggs": _vc_aggs
    },
    // ƽ�����ʱ��
    "avgTime": {
        "tvt_aggs": {
            "terms": {
                "field": "tt",
                "size": 0
            },
            "aggs": {
                "min_aggs": {
                    "min": {
                        "field": "utime"
                    }
                },
                "max_aggs": {
                    "max": {
                        "field": "utime"
                    }
                }
            }
        },
        "vc_aggs": _vc_aggs
    },
    // �·ÿ���
    "nuv": {
        "new_visitor_aggs": _new_visitor_aggs
    },
    // �·ÿͱ���
    "nuvRate": {
        "new_visitor_aggs": _new_visitor_aggs,
        "uv_filter": {
            "filter": {
                "term": {"entrance": "1"}
            },
            "aggs": {
                "uv_aggs": {
                    "cardinality": {
                        "field": "_ucv"
                    }
                }
            }
        }
    },
    // ƽ�����ҳ��
    "avgPage": {
        "pv_aggs": {
            "value_count": {
                "field": "loc"
            }
        },
        "vc_aggs": _vc_aggs
    },
    // IP��
    "ip": {
        "ip_aggs": {
            "filter": {
                "term": {
                    "ip_dupli": 1
                }
            },
            "aggs": {
                "ip_aggs1": {
                    "value_count": {
                        "field": "remote"
                    }
                }
            }
        }
    }
};

var buildQuery = function (filters, start, end) {
    var mustQuery = [
        {
            "range": {
                "city": {
                    "gte": start,
                    "lte": end,
                    "time_zone": "+8:00"
                }
            }
        }
    ];

    if (filters != null) {
        filters.forEach(function (filter) {
            mustQuery.push({
                "terms": filter
            });
        });
    }

    return {
        "bool": {
            "must": mustQuery
        }
    }
};

/**
 * ����� pv
 * @param result
 * @returns {{label: string, key: Array, quota: Array}}
 */
var pvFn = function (result) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        Array.prototype.push.call(keyArr, result[i].key);
        Array.prototype.push.call(quotaArr, result[i].pv_aggs.value);
    }

    return {
        "label": "pv",
        "key": keyArr,
        "quota": quotaArr
    };
};
/**
 * �ÿ��� uv
 * @param result
 * @returns {{label: string, key: Array, quota: Array}}
 */
var uvFn = function (result) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        keyArr.push(result[i].key);
        quotaArr.push(result[i].uv_aggs.value);
    }

    return {
        "label": "uv",
        "key": keyArr,
        "quota": quotaArr
    };
};
/**
 * ���ʴ��� vc
 * @param result
 * @returns {{label: string, key: Array, quota: Array}}
 */
var vcFn = function (result) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var vc = result[i].vc_aggs.vc_aggs.value;
        keyArr.push(result[i].key);

        quotaArr.push(vc);
    }

    return {
        "label": "vc",
        "key": keyArr,
        "quota": quotaArr
    };
};
/**
 * ƽ�����ʱ�� avgTime
 * @param result
 * @returns {{label: string, key: Array, quota: Array}}
 */
var avgTimeFn = function (result) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var _tvt_aggs_result = result[i].tvt_aggs.buckets;
        var tvt = 0;
        if (_tvt_aggs_result.length > 0) {
            tvt = parseInt(_tvt_aggs_result[0].max_aggs.value) - parseInt(_tvt_aggs_result[0].min_aggs.value);
        }
        var vc = result[i].vc_aggs.vc_aggs.value;
        keyArr.push(result[i].key);
        var avgTime = 0;
        if (vc > 0) {
            avgTime = Math.ceil(parseFloat(tvt) / 1000 / parseFloat((vc)));
        }
        quotaArr.push(avgTime);
    }

    return {
        "label": "avgTime",
        "key": keyArr,
        "quota": quotaArr
    };
};
/**
 * ����� outRate
 * @param result
 * @returns {{label: string, key: Array, quota: Array}}
 */
var outRateFn = function (result) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var vc = result[i].vc_aggs.vc_aggs.value;
        var svc = parseInt(vc) - result[i].single_visitor_aggs.buckets.length;
        keyArr.push(result[i].key);

        var outRate = 0;
        if (vc > 0) {
            outRate = (parseFloat(svc) / parseFloat(vc) * 100).toFixed(2);
        }

        quotaArr.push(outRate);
    }

    return {
        "label": "outRate",
        "key": keyArr,
        "quota": quotaArr
    };
};
/**
 * �·ÿ� nuv
 * @param result
 * @returns {{label: string, key: Array, quota: Array}}
 */
var nuvFn = function (result) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var nuv = result[i].new_visitor_aggs.nuv_aggs.value;
        keyArr.push(result[i].key);

        quotaArr.push(nuv);
    }

    return {
        "label": "nuv",
        "key": keyArr,
        "quota": quotaArr
    };
};
/**
 * �·ÿͱ��� nuvRate
 * @param result
 * @returns {{label: string, key: Array, quota: Array}}
 */
var nuvRateFn = function (result) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var nuv = result[i].new_visitor_aggs.nuv_aggs.value;
        var uv = result[i].uv_aggs.value;
        //var uv = result[i].uv_filter.uv_aggs.value;
        keyArr.push(result[i].key);

        var nuvRate = 0;
        if (uv > 0) {
            nuvRate = (parseFloat(nuv) / parseFloat(uv) * 100).toFixed(2);
        }

        quotaArr.push(nuvRate);
    }

    return {
        "label": "nuvRate",
        "key": keyArr,
        "quota": quotaArr
    };
};
/**
 * IP
 * @param result
 * @returns {{label: string, key: Array, quota: Array}}
 */
var ipFn = function (result) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        //var ip_count = result[i].ip_aggs.value;
        var ip_count = result[i].ip_aggs.ip_aggs1.value;
        keyArr.push(result[i].key);

        quotaArr.push(ip_count);
    }

    return {
        "label": "ip",
        "key": keyArr,
        "quota": quotaArr
    };
};
/**
 * ƽ�����ҳ��
 * @param result
 * @returns {{label: string, key: Array, quota: Array}}
 */
var avgPageFn = function (result) {
    var keyArr = [];
    var quotaArr = [];
    for (var i = 0, l = result.length; i < l; i++) {
        var pv = result[i].pv_aggs.value;
        var uv = result[i].vc_aggs.vc_aggs.value;
        keyArr.push(result[i].key);
        var avgPage = 0;
        if (uv > 0) {
            avgPage = (parseFloat(pv) / parseFloat(uv)).toFixed(2);
        }
        quotaArr.push(avgPage);
    }

    return {
        "label": "avgPage",
        "key": keyArr,
        "quota": quotaArr
    };
};
/**
 * �ִ��� arrivedRate
 * @param result
 * @returns {{label: string, key: Array, quota: Array}}
 */
var arrivedRateFn = function (result) {
    var keyArr = [];
    var quotaArr = [];

    for (var i = 0, l = result.length; i < l; i++) {
        var vc = result[i].vc_aggs.value;
        keyArr.push(result[i].key);

        quotaArr.push(vc);
    }

    return {
        "label": "arrivedRate",
        "key": keyArr,
        "quota": quotaArr
    };
};

//ES
var ad_request = {
    source: function(es, indexes, type, quotas, dimension, filters, start, end, interval, callbackFn){
        var request = {
            "index": indexes,
            "type": type,
            "body": {
                "query": buildQuery(filters),
                "size": 0,
                "aggs": {
                    "result": {
                        "terms": {
                            "field": "rf"
                        },
                        "aggs": {
                            "pv_aggs": {
                                "cardinality": {
                                    "field": "loc"
                                }
                            },
                            "uv_aggs": {
                                "cardinality": {
                                    "field": "tt"
                                }
                            },
                            "ip_aggs": {
                                "cardinality": {
                                    "field": "remote"
                                }
                            },
                            "entrance_aggs": {
                                "sum": {
                                    "script": "e = 0; if (doc['entrance'].value == 1) {e = 1}; e"
                                }
                            }
                        }
                    }
                }
            }
        };

        es.search(request, function(error, response) {
            var data = [];
            if(response != undefined && response.aggregations != undefined){
                var result = response.aggregations.result.buckets;
                quotas.forEach(function(quota){
                    switch (quota){
                        case "pv":
                            data.push(pvFn(result));
                            break;
                        case "uv":
                            data.push(uvFn(result));
                            break;
                        case "ip":
                            data.push(ipFn(result));
                            break;
                        case "vc":
                            data.push(vcFn(result));
                            break;
                        case "nuv":
                            data.push(nuvFn(result));
                            break;
                        case "nuvRate":
                            data.push(nuvRateFn(result));
                            break;
                        case "avgPage":
                            data.push(avgPageFn(result));
                            break;
                        case "outRate":
                            data.push(outRateFn(result));
                            break;
                        case "avgTime":
                            data.push(avgTimeFn(result));
                            break;
                        default :
                            break;
                    }
                });
                callbackFn(data);
            } else {
                callbackFn(data);
            };
        });
    },
    medium: function(es, indexes, type, quotas, dimension, filters, start, end, interval, callbackFn){
        var request = {};
        es.search(request, function(error, response){
            var data = [];
            if(response != undefined && response.aggregations != undefined){
                var result = response.aggregations;
            }
        });
    },
    plan: function(es, indexes, type, quotas, dimension, filters, start, end, interval, callbackFn){
        var request = {};
        es.search(request, function(error, response){
            var data = [];
            if(response != undefined && response.aggregations != undefined){
                var result = response.aggregations;
            }
        });
    },
    keyword: function(es, indexes, type, quotas, dimension, filters, start, end, interval, callbackFn){
        var request = {};
        es.search(request, function(error, response){
            var data = [];
            if(response != undefined && response.aggregations != undefined){
                var result = response.aggregations;
            }
        });
    },
    creative: function(es, indexes, type, quotas, dimension, filters, start, end, interval, callbackFn){
        var request = {};
        es.search(request, function(error, response){
            var data = [];
            if(response != undefined && response.aggregations != undefined){
                var result = response.aggregations;
            }
        });
    }
};

module.exports = ad_request;