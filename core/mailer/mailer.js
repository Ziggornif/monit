'use strict';
const nodemailer = require('nodemailer');
const logger = require("winston");
const config = require(__base +'config/config');
const mailconf = config.mail;

exports.sendMail = function(data) {
    console.log(mailconf);

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(mailconf.config);

    // setup email data with unicode symbols
    let mailOptions = {
        from: mailconf.config.auth.user, // sender address
        to: mailconf.contacts.join(','), // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.html // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return logger.error(error);
        }
        logger.info('Message %s sent: %s', info.messageId, info.response);
    });
}