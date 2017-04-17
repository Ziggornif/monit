'use strict'
const sysinfos = require(__base+"core/services/sysinfos");
const config = require(__base + "config/config");
const freememjobconf = config.jobs.freemem;

module.exports = {
    cronTime: freememjobconf.cronTime,
    onTick: function () {
        sysinfos.freecache().then(function () {
        }, function(error){
            throw error;
        });
    },
    start: false
}