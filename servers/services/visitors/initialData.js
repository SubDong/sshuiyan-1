/**
 * Created by SubDong on 2015/4/9.
 * 访客基础数据
 */
var Map = require("../../utils/Map");
var initial = {
    /** 
     *
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
                    jump = (parseFloat(response.aggregations.jump.doc_count) / parseFloat(response.hits.total)).toFixed(2) * 100 + "%";

                result["avgTime"] = new Date(calAvgTime).Format("hh:mm:sss");
                result["jump"] = jump;
                result["pv"] = response.aggregations.pv.value;
                result["uv"] = response.hits.total;
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
    }
};
module.exports = initial;