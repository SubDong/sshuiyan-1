/**
 * Created by MrDeng on 2015/6/7.
 */
var crypto = require('crypto');
var randstring ={
    rand_string: function () {
        var chars =['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        var res = "";
        for(var i = 0; i < 32 ; i ++) {
            var id = Math.ceil(Math.random()*31);
            res += chars[id];
        }
        var content = res;
        var md5 = crypto.createHash('md5');
        md5.update(content);
        var d = md5.digest('hex');
        return d;
    }
};
module.exports =randstring;