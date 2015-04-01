/**
 * Created by XiaoWei on 2015/3/31.
 */
var datautils = {
    send: function (res, obj) {
        res.write(JSON.stringify(obj));
        res.end();
    }
}
module.exports = datautils;