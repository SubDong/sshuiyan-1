/**
 * Created by xiaowei on 15-7-21.
 */
var nodemail=require('nodemailer');


var transporter = nodemail.createTransport({
    service: 'QQ',
    auth: {
        user: '70285622@qq.com',
        pass: '1987924a..'
    }
});

var mail={
    send:function(mailOptions,fb){
        transporter.sendMail(mailOptions,fb);
    }
}

module.exports=mail;