/**
 * Created by icepros on 2015/6/4.
 */
var es_request = {
    search: function(es, indexes, type, callbackFn){
        //声明 请求参数 变量
        var request = null;
        request = {
            "index": indexes,   //请求的索引 等同于 Databases
            "type": type,       //请求的类型 等同于 Tables
            "body": {

            }
        };

        es.search(request, function(error, response){
            var data = [];
            var h = response.hits.hits;
            for(var k=0; k < h.length; k++){
                var p = h[k]._source.points;
                for(var l=0; l< p.length; l++){
                    var x = p[l].x;
                    var y = p[l].y;
                    data.push({x: x, y: y});
                }
            }
            callbackFn(data);
        });
    }
};

//将请求的数据对象封装到模块中
module.exports = es_request;