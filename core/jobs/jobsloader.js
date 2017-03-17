const jobSysInfos = require("./sysinfos");
const jobReport = require("./report");
const CronJob = require('cron').CronJob;

module.exports = {
    startJobs: function(){
        let sysinfosjob = new CronJob(jobSysInfos);
        let reportjob = new CronJob(jobReport);
        sysinfosjob.start();
        reportjob.start();
    }
}
