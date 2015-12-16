/**
 * Created by xiaowei on 15-7-21.
 */
var nodemail = require('nodemailer');

var config = require("../../config.json");
var transporter = nodemail.createTransport({
    service: '126',
    auth: config["mail"]["auth"]
});

var mail = {
    send: function (mailOptions, fb) {
        transporter.sendMail(mailOptions, fb);
    }
}

module.exports = mail;