/**
 * Created by XiaoWei on 2015/3/31.
 */
var date = require('../utils/date');
var datautils = {
    chartData: function (res, esBody, qtype) {
        var result = esBody.aggregations;
        var resultData = {};
        if (result != undefined) {
            var pv = result.result;
            var uv_Data = [];
            pv.buckets.forEach(function (e) {
                var vo = {};
                vo["time"] = date.formatTime(e.key);
                vo["value"] = e.doc_count;
                uv_Data.push(vo);
            });
            resultData["label"] = qtype;
            resultData["data"] = uv_Data;
            res.write(JSON.stringify(resultData));
            res.end();
        } else {
            res.write(JSON.stringify(resultData));
            res.end();
        }

    },
    mapData: function (res, esBody, qtype) {
        var data = {};
        var result = esBody.aggregations;
        var qData = result[qtype];
        if (qData.region != undefined) {
            var region = qData.region;
            var result_data = [];
            region.buckets.forEach(function (e) {
                var data = {};
                var name = e.key;
                if (name.indexOf("自治") > -1)data["name"] = name.slice(0, 2); else data["name"] = name.slice(0, -1);
                data["value"] = e.doc_count;
                result_data.push(data);
            });
            data["label"] = qtype;
            data["data"] = result_data;
            res.write(JSON.stringify(data));
            res.end();
        } else {
            res.write(JSON.stringify(data));
            res.end();
        }
    }
}
module.exports = datautils;