const jobSysInfos = require("./sysinfos");
const jobReport = require("./report");
const jobFreemem = require("./freemem");
const CronJob = require('cron').CronJob;

module.exports = {
    startJobs: function(){
        let sysinfosjob = new CronJob(jobSysInfos);
        let reportjob = new CronJob(jobReport);
        let freememjob = new CronJob(jobFreemem);
        sysinfosjob.start();
        reportjob.start();
        freememjob.start();
    }
}
