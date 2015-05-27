/**
 * Created by perfection on 15-5-26.
 */
//
//var getTest = {
// search:function(es){
//     console.log("进口")
//     getPV(es, "access-2015-05-21", 1, 'path0', "北京市", "perfect-cn.cn", function(res){
//         console.log(res);
//     });
//     getUVAndPV(es,"access-2015-05-21",1,"百度",2,"北京市",'path0',"perfect-cn.cn",function(da){
//         console.log(da);
//     });
//     console.log("测试数据结束")
// }
//}
function getPath(path, address) {
    switch (path) {
        case "path0":
            return {"path0": address};
            break;
        case "path1":
            return {"path1": address};
            break;
        case "path2":
            return {"path2": address};
            break;
        default :
            return {};
            break;
    }
}

//
//根据时间段获取pv
function getPV(es, indexes, type, path, region, address, callbackFn) {
    console.log("数据测试开始")
    var request = {
        index: indexes,
        type: type,
        body: {
            "size": 0,
            "query": {
                "match": {
                    "region": region
                }
            },
            "aggs": {
                "path_count": {
                    "filter": {
                        "term": getPath(path, address)
                    },
                    "aggs": {
                        "pv": {
                            "value_count": {
                                "field": path
                            }
                        }
                    }
                }
            }
        }
    }
    es.search(request, function (error, response) {
        var data = [];
        if (response != undefined && response.aggregations != undefined) {
            var result = response.aggregations.path_count.pv.value;
            data.push({"pv": result});
            callbackFn(data);
        } else
            callbackFn(data);
    });
}

//一天之内您网站的独立访客数(以Cookie为依据)，一天内同一访客多次访问您网站只计算1个访客(uv)
//获取pv
//address为网址即paths的值
//path为字段值 有path0，path1等等
//其他参数参考js设定参数文档
function getUVAndPV(es, indexes, type, se, rf_type,region,path,address, callbackFn) {
    var request = {
        index: indexes,
        type: type,
        body: {
            "size": 0,
            "query": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "se": se
                            }
                        },
                        {
                            "term": {
                                "rf_type": rf_type
                            }
                        },
                        {
                            "term":{
                                "region":region
                            }
                        },
                        {
                            "term": getPath(path, address)
                        }
                    ]
                }
            },
            "aggs": {
                "all_uv": {
                    "cardinality": {
                        "field": "vid"
                    }
                },
                "all_pv":{
                    "value_count":{
                        "field":path
                    }
                }
            }
        }
    }
    es.search(request, function (error, response) {
        var data = [];
        if (response != undefined && response.aggregations != undefined) {
            var result = response.aggregations;
            data.push({"uv":result.all_uv.value,"pv":result.all_pv.value});
            callbackFn(data);
        } else
            callbackFn(data);
    });
}

//浏览器版本信息
//格式
/*
 "aggregations": {
 "all_index": {
 "doc_count_error_upper_bound": 0,
 "sum_other_doc_count": 2133,
 "buckets": [
 {
 "key": "access-2015-05-04",
 "doc_count": 247,
 "all_User-Agent": {
 "doc_count_error_upper_bound": 0,
 "sum_other_doc_count": 3,
 "buckets": [
 {
 "key": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:37.0) Gecko/20100101 Firefox/37.0",
 "doc_count": 193,
 "all_count": {
 "value": 193,
 "value_as_string": "193.0"
 }
 }
 */

function getBVI(es, indexes, type, filters, start, end, callbackFn) {
    var request = {
        index: indexes,
        type: type,
        body: {
            "size": 0,
            "query": {
                "range": {
                    "utime": {
                        "gt": start,
                        "lt": end
                    }
                }
            },
            "aggs": {
                "all_index": {
                    "terms": {
                        "field": "_index"
                    },
                    "aggs": {
                        "all_br": {
                            "terms": {
                                "field": "br"
                            },
                            "aggs": {
                                "all_count": {
                                    "sum": {
                                        "script": "1"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    es.search(request, function (error, response) {
        var data = [];
        if (response != undefined && response.aggregations != undefined) {
            var result = response.aggregations.all_index.buckets;
            for (var i = 0; i < result.length; i++) {
                data.push({"key": result[i].key, "br": result[i].all_br.buckets});
            }
            callbackFn(data);
        } else
            callbackFn(data);
    });

}
//新老访客查询
//格式
/*"aggregations": {
 "all_index": {
 "doc_count_error_upper_bound": 0,
 "sum_other_doc_count": 904,
 "buckets": [
 {
 "key": "access-2015-05-18",
 "doc_count": 102,
 "nuv": {
 "value": 102,
 "value_as_string": "102.0"
 }
 }*/
function getNUV(es, indexes, type, ct, filters, start, end, callbackFn) {
    var request = {
        index: indexes,
        type: type,
        body: {
            "size": 0,
            "query": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "ct": ct
                            }
                        },
                        {
                            "range": {
                                "utime": {
                                    "gt": start,
                                    "lt": end
                                }
                            }
                        }
                    ]
                }
            },
            "aggs": {
                "all_index": {
                    "terms": {
                        "field": "_index"
                    },
                    "aggs": {
                        "nuv": {
                            "sum": {
                                "script": "1"
                            }
                        }
                    }
                }
            }
        }
    }
    es.search(request, function (error, response) {
        var data = [];
        if (response != undefined && response.aggregations != undefined) {
            var result = response.aggregations.all_index.buckets;
            for (var i = 0; i < result.length; i++) {
                data.push({"key": result[i].key, "nuv": result[i].nuv.value});
            }
            callbackFn(data);
        } else
            callbackFn(data);
    });
}
//新访客比例
function getNuvRate(es, indexes, type, filters, start, end, callbackFn) {
    var request = {
        index: indexes,
        type: type,
        body: {
            "size": 0,
            "query": {
                "range": {
                    "utime": {
                        "gt": start,
                        "lt": end
                    }
                }
            },
            "aggs": {
                "all_index": {
                    "terms": {
                        "field": "_index"
                    },
                    "aggs": {
                        "all_uv": {
                            "sum": {
                                "script": "1"
                            }
                        }
                    }
                }
            }
        }
    }
    es.search(request, function (error, response) {
        var data = [];
        if (response != undefined && response.aggregations != undefined) {
            var result = response.aggregations.all_index.buckets;
            getNUV(es, indexes, type, 0, filters, start, end, function (nuv) {
                for (var i = 0; i < result.length; i++) {
                    data.push({
                        "key": result[i].key,
                        "nuv": ((result[i].all_uv.value / nuv[i].nuv) * 100).toFixed(2) + "%"
                    });
                }
            });
            callbackFn(data);
        } else
            callbackFn(data);
    });

}
//获取IP数
function getIP(es, indexes, type, filters, start, end, callbackFn) {
    var request = {
        index: indexes,
        type: type,
        body: {
            "size": 0,
            "query": {
                "range": {
                    "utime": {
                        "gt": start,
                        "lt": end
                    }
                }
            },
            "aggs": {
                "all_index": {
                    "terms": {
                        "field": "_index"
                    },
                    "aggs": {
                        "ip": {
                            "cardinality": {
                                "field": "remote"
                            }
                        }
                    }
                }
            }
        }
    }
    es.search(request, function (error, response) {
        var data = [];
        if (response != undefined && response.aggregations != undefined) {
            var result = response.aggregations.all_index.buckets;
            for (var i = 0; i < result.length; i++) {
                data.push({"key": result[i].key, "ip": result[i].ip.value});
            }
            callbackFn(data);
        } else
            callbackFn(data);
    });
}
//访问次数查询
function getVC(es, indexes, type, filters, start, end, callbackFn) {
    var request = {
        index: indexes,
        type: type,
        body: {
            "size": 0,
            "query": {
                "range": {
                    "utime": {
                        "gt": 0
                    }
                }
            },
            "aggs": {
                "all_index": {
                    "terms": {
                        "field": "_index"
                    },
                    "aggs": {
                        "ip": {
                            "cardinality": {
                                "field": "tt"
                            }
                        }
                    }
                }
            }
        }
    }
    es.search(request, function (error, response) {
        var data = [];
        if (response != undefined && response.aggregations != undefined) {
            var result = response.aggregations.all_index.buckets;
            for (var i = 0; i < result.length; i++) {
                data.push({"key": result[i].key, "vc": result[i].ip.value});
            }
            callbackFn(data);
        } else
            callbackFn(data);
    });

}


module.exports = getTest;
































