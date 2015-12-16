/**
 * Created by xiaowei on 15-7-21.
 */
var nodemail = require('nodemailer');

var transporter = nodemail.createTransport({
    service: '126',
    "auth": {
        "user": "sshuiyanhost@126.com",
        "pass": "uqllbevsxlsucfhv"
    }
});

var mail = {
    send: function (mailOptions, fb) {
        transporter.sendMail(mailOptions, fb);
    }
}

module.exports = mail;