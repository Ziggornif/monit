'use strict'
const uuid = require('uuid');
const low = require('lowdb');
const q = require('q');
const ostb = require('os-toolbox');
const mailer = require(__base + "core/mailer/mailer");
const config = require(__base + "config/config");
const sysinfosjobconf = config.jobs.sysinfos;
const db = low(sysinfosjobconf.acquisition.db);

let lastalert = null;

module.exports = {
    cronTime: sysinfosjobconf.cronTime,
    onTick: function() {
        getSysInfos().then(function(result) {
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
            mailer.sendMail({
                subject: 'Alerte ressources VPS',
                text: 'Niveau de ressources critique sur le VPS CPU : ' + data.cpu + ' MEM : ' + data.mem,
                html: '<p>Niveau de ressources critique sur le VPS <b>CPU : ' + data.cpu + ' MEM : ' + data.mem + '</b></p>'
            });

        }
    }
}

function getSysInfos() {
    let deferred = q.defer();
    q.all([
        ostb.cpuLoad(),
        ostb.memoryUsage()
    ]).then(function(results) {
        deferred.resolve({
            cpu: results[0],
            mem: results[1]
        });
    });
    return deferred.promise;
}