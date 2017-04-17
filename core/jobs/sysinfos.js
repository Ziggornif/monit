'use strict'
const uuid = require('uuid');
const low = require('lowdb');
const ejs = require('ejs');
const sysinfos = require(__base+"core/services/sysinfos");
const telegramBot = require(__base+"core/bots/telegram");
const mailer = require(__base + "core/mailer/mailer");
const config = require(__base + "config/config");
const message = require(__base + 'config/mails/templates.json');
const sysinfosjobconf = config.jobs.sysinfos;
const db = low(sysinfosjobconf.acquisition.db);

let lastalert = null;

module.exports = {
    cronTime: sysinfosjobconf.cronTime,
    onTick: function () {
        sysinfos.getInfos().then(function (result) {
            let currentTime = new Date();
            let sysinfo = {
                id: uuid(),
                cpu: result.cpu,
                mem: result.mem,
                date: currentTime
            };
            if (sysinfosjobconf.acquisition.active) {
                insertSysInfos(sysinfo);
            }

            if (sysinfosjobconf.alerte.active) {
                checkResourcesLevel(sysinfo);
            }
        });
    },
    start: false
}

function insertSysInfos(data) {
    db.get('monit').push(data).write();
};

function insertAlert(data) {
    db.get('alert').push(data).write();
}

function checkResourcesLevel(data) {
    if (data.cpu >= sysinfosjobconf.metrics.cpucritic || data.mem >= sysinfosjobconf.metrics.memcritic) {
        if (!lastalert || data.date.getTime() - lastalert.getTime() >= sysinfosjobconf.resendafter) {
            lastalert = data.date;
            insertAlert(data);
            data.name = config.name;
            
            if(sysinfosjobconf.alerte.type.email){
                // mailer.sendMail({
            //     subject: ejs.render(message.alert.subject, data),
            //     text: ejs.render(message.alert.text, data),
            //     html: ejs.render(message.alert.html, data)
            // });
            }
            
            if(sysinfosjobconf.alerte.type.telegram){
                telegramBot.sendMessage(config.bots.telegram.alertChannelId, ejs.render(message.alert.text, data));
            }
            
            if(sysinfosjobconf.alerte.type.slack){
                // DO SOMETHING
            }
        }
    }
}
