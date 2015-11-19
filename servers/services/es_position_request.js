/**
 * Created by perfection on 15-6-29.
 */
var async = require("async");
var es_position_request = {
    /**
     * @param es
     * @param indexs　索引数组
     * @param times　毫秒为单位的时间数组
     * @param callbackFn　回调函数
     */
    searchTwo: function (es, indexs, type, loc, callbackFn) {
        var request = {
            index: indexs,
            type: type,
            body: {
                "query": {
                    "bool": {
                        "must": [
                            {
                                "match": {
                                    "loc": loc
                                }
                            }
                        ]
                    }
                },
                "fields": [
                    "xy.x",
                    "xy.y",
                    "dh",
                    "loc"
                ]
            }
        };
        // 改变下计算方法
        es.search(request, function (error, response) {
            var obj = {
                dh : 1000,
                pointArr : []
            };
            if (response != undefined && response.hits != undefined) {
                var hitsArray = response.hits.hits;
                hitsArray.forEach(function (item) {
                    // 获取高度
                    if (item["fields"]["dh"] && parseInt(item["fields"]["dh"][0]) > obj.dh) {
                        obj.dh = parseInt(item["fields"]["dh"][0]);
                    }
                    var xArr = item["fields"]["xy.x"];
                    var yArr = item["fields"]["xy.y"];
                    xArr.forEach(function (_p, i) {
                        obj.pointArr.push([
                            _p,
                            yArr[i],
                            Math.random()
                        ]);
                    });
                });
                callbackFn(obj);
            } else {
                callbackFn(obj);
            }
        });
    }
};
module.exports = es_position_request;