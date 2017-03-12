'use strict'
const _ = require('lodash');
var ejs = require('ejs');
const low = require('lowdb');
const moment = require('moment');
const config = require(__base + "config/config");
var message = require(__base + 'config/mails/messages.json');
const reportjobconf = config.jobs.report;
const db = low(config.jobs.sysinfos.acquisition.db);
const mailer = require(__base + "core/mailer/mailer");

module.exports = {
    cronTime: reportjobconf.cronTime,
    onTick: function () {
        if (reportjobconf.active) {
            let report = {};
            report.name = config.name;
            let datedebut = new Date(moment().subtract(7, 'days').format());
            let results = db.get('monit').filter(function (o) {
                return new Date(o.date).getTime() > datedebut.getTime();
            }).value();
            
            if (results) {
                report.nbalerts = db.get('alert').filter(function (o) {
                    return new Date(o.date).getTime() > datedebut.getTime();
                }).size().value();

                let cpumoy = 0;
                let memmoy = 0;
                results.forEach(result => {
                    cpumoy += result.cpu;
                    memmoy += result.mem;
                });
                report.cpumoy = Math.round((cpumoy / results.length) * 100) / 100;
                report.memmoy = Math.round((memmoy / results.length) * 100) / 100;
                report.cpumax = _.maxBy(results, function (o) {
                    return o.cpu;
                }).cpu;
                report.memmax = _.maxBy(results, function (o) {
                    return o.mem;
                }).mem;

                mailer.sendMail({
                    subject: ejs.render(message.report.subject, report),
                    text: ejs.render(message.report.text, report),
                    html: ejs.render(message.report.html, report)
                });
            }
        }
    },
    start: false
}