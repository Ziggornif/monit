'use strict';
const nodemailer = require('nodemailer');
const logger = require("winston");
const config = require(__base +'config/config');
const mailconf = config.mail;

exports.sendMail = function(mail) {
    let transporter = nodemailer.createTransport(mailconf.config);
    let mailOptions = {
        from: mailconf.config.auth.user, // sender address
        to: mailconf.contacts.join(','), // list of receivers
        subject: mail.subject, // Subject line
        text: mail.text, // plain text body
        html: mail.html // html body
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return logger.error(error);
        }
        logger.info('Message %s sent: %s', info.messageId, info.response);
    });
}