/**
 * Created by SubDong on 2015/4/9.
 * 访客基础数据
 */
var initial = {
    /**
     *
     * @param es
     * @param intervals
     * @param indexs es文档
     * @param type ͳ统计js安装id
     * @param qtype
     * @param fields
     * @param cb
     */
    VisitorMapBasic: function (es, start, end, intervals, indexs, type) {
        var request = {
            "index": index.toString(),
            "type": type,
            "size": 0,
            "query": {
                "range": {
                    "utime": {
                        "gte": start,
                        "lte": end
                    }
                }
            },
            "aggs": {
                "pu": {
                    "global": {},
                    "aggs": {
                        "value_count": {
                            "terms": {
                                "field": "tt",
                                "size": 0
                            }
                        }
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
                }
            }
        };
        es.search(request, function (err, response) {
            if (response != undefined) {
                console.log(response)
            }
        });
    }
}