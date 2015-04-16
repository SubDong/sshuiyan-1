/**
 * Created by SubDong on 2015/4/9.
 * 访客基础数据
 */
var Map = require("../../utils/Map");
var initial = {
    /** 
     *  基础数据
     * @param es
     * @param index es文档
     * @param type ͳ统计js安装id
     */
    visitorMapBasic: function (es, index, type, callbackFn) {
        var request = {
            "index": index.toString(),
            "type": type,
            "body": {
                "query": {
                    "match_all": {}
                },
                "size": 0,
                "aggs": {
                    "pv": {
                        "value_count": {
                            "field": "loc"
                        }
                    },
                    "ip": {
                        "global": {},
                        "aggs": {
                            "value_count": {
                                "terms": {
                                    "field": "remote",
                                    "size": 0
                                }
                            }
                        }
                    },
                    "uv": {
                        "value_count": {
                            "field": "_ucv"
                        }
                    },
                    "jump": {
                        "filter": {
                            "script": {
                                "script": "doc[\"loc\"].values.size() == param1",
                                "params": {
                                    "param1": 1
                                }
                            }
                        }
                    },
                    "avgTime": {
                        "sum": {
                            "script": "sum_time = 0; tmp = 0; for (t in doc['utime'].values) { if (tmp > 0) { sum_time += (t - tmp) }; tmp = t}; sum_time"
                        }
                    }
                }
            }
        };
        es.search(request, function (err, response) {
            if (response != undefined) {
                var result = {};
                //平均访问时间
                var calAvgTime = response.aggregations.avgTime.value / response.aggregations.pv.value;
                //跳出率
                var jump;
                if (response.hits.total == 0)
                    jump = "0%";
                else
                    jump = (parseFloat(response.aggregations.jump.doc_count) / parseFloat(response.hits.total) * 100).toFixed(2)  + "%";

                result["avgTime"] = new Date(calAvgTime).Format("hh:mm:sss");
                result["jump"] = jump;
                result["pv"] = response.aggregations.pv.value;
                result["uv"] = response.aggregations.uv.value;
                var s = response.aggregations.ip.value_count.buckets;
                var map =  new Map();
                for(var t = 0; t < s.length; t++){
                    var d = s[t].key.substring(0, s[t].key.indexOf(":"));
                    if(!map.containsKey(d)){
                        map.put(d,d);
                    }
                }
                result["ip"] = map.size();
                callbackFn(result)
            } else {
                console.log(err);
            }
        });
    },

    /**
     *
     * @param es
     * @param index
     * @param type
     * @param areas 地域分组
     * @param property  统计依据
     * @param callbackFn
     */
    chartData: function(es, index, type, areas, property, callbackFn){
        var mapRequest = {};
        if(property == 'ct'){
            mapRequest = {
                "index": index.toString(),
                "type": type,
                "body": {
                    "query": {
                        "match_all": {}
                    },
                    "size": 0,
                    "aggs": {
                        "areas": {
                            "terms": {
                                "field": "region",
                                "order": {
                                    "data_count": "desc"
                                }
                            },
                            "aggs": {
                                "data_count": {
                                    "sum": {
                                        "script": "v1=0; if (doc['ct'].value == 0) { v1 +=1;};v1"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }else{
            mapRequest = {
                "index": index.toString(),
                "type": type,
                "body": {
                    "query": {
                        "match_all": {}
                    },
                    "size": 0,
                    "aggs": {
                        "areas": {
                            "terms": {
                                "field": areas,
                                "order": {
                                    "data_count": "desc"
                                }
                            },
                            "aggs": {
                                "data_count": {
                                    "value_count": {
                                        "field": property
                                    }
                                }
                            }
                        }
                    }
                }
            };
        }

        es.search(mapRequest, function (err, response) {
            if(response != undefined){
                var result = {};
                var chart_data_array = new Array();
                var data_name = new Array();

                var areas = response.aggregations.areas.buckets;
                for(var i = 0 ; i < 10; i++){
                    if(areas[i] != undefined){
                        var chart_data = {};
                        data_name.push(areas[i].key.replace("市","").replace("省",""));
                        chart_data["name"] = areas[i].key.replace("市","").replace("省","");
                        chart_data["value"] = areas[i].data_count.value;
                        chart_data_array.push(chart_data);
                    }
                }
                if(areas.length >=10){
                    var chart_data = {};
                    var other = 0;
                    for(var a = 10 ; a < areas.length; a++){
                        other+= areas[a].data_count.value
                    }
                    data_name.push("其他");
                    chart_data["name"] = "其他";
                    chart_data["value"] = other;
                    chart_data_array.push(chart_data);
                }
                result["data_name"] = data_name;
                result["chart_data"] = chart_data_array;
                callbackFn(result)
            }else{
                console.log(err)
            }
        });
    }
};
module.exports = initial;