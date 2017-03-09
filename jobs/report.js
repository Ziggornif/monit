'use strict'
const _ = require('lodash');
const low = require('lowdb');
const moment = require('moment');
const config = require(__base + "config/config");
const reportjobconf = config.jobs.report;
const db = low(config.jobs.sysinfos.acquisition.db);
const mailer = require(__base + "core/mailer/mailer");

module.exports = {
    cronTime: reportjobconf.cronTime,
    onTick: function() {
        if (reportjobconf.active) {
            let datedebut = new Date(moment().subtract(7, 'days').format());
            let results = db.get('monit').filter(function(o) { return new Date(o.date).getTime() > datedebut.getTime(); }).value();
            let alerts = db.get('alert').filter(function(o) { return new Date(o.date).getTime() > datedebut.getTime(); }).size().value();

            let cpumoy = 0;
            let memmoy = 0;
            results.forEach(result => {
                cpumoy += result.cpu;
                memmoy += result.mem;
            });
            cpumoy = Math.round((cpumoy / results.length) * 100) / 100;
            memmoy = Math.round((memmoy / results.length) * 100) / 100;

            let cpumax = _.maxBy(results, function(o) { return o.cpu; }).cpu;
            let memmax = _.maxBy(results, function(o) { return o.mem; }).mem;

            mailer.sendMail({
                subject: 'Rapport hebdomadaire de ' + config.name,
                text: "Rapport hebdomadaire de " + config.name + " \n \
                    Consomation moyenne cpu : " + cpumoy + "% \n \
                    Pic cpu atteint : " + cpumax + "\n \
                    Consomation moyenne mémoire : " + memmoy + "% \n \
                    Pic mémoire atteint : " + memmax + "\n \
                    Nombre d'alertes levées : " + alerts,
                html: "<p>Rapport hebdomadaire de " + config.name + "</p> \
                   <p>Consomation moyenne cpu : " + cpumoy + "%</p> \
                   <p>Pic cpu atteint : " + cpumax + "%</p> \
                   <p>Consomation moyenne mémoire : " + memmoy + "%</p> \
                   <p>Pic mémoire atteint : " + memmax + "%</p> \
                   <p>Nombre d'alertes levées : " + alerts + "%</p>"
            });
        }
    },
    start: false
}