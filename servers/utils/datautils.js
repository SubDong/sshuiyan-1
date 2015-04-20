/**
 * Created by XiaoWei on 2015/3/31.
 */
var datautils = {
    send: function (res, obj) {
        res.end(JSON.stringify(obj), function (err) {
            if (err) {
                console.log(err)
            }
        });

    }
}
module.exports = datautils;