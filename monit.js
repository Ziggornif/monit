'use strict'
global.__base = __dirname + '/';
require(__base + 'core/logger/logger');
const jobSysInfos = require("./jobs/sysinfos");
const jobReport = require("./jobs/report");
const CronJob = require('cron').CronJob;

let sysinfosjob = new CronJob(jobSysInfos);
let reportjob = new CronJob(jobReport);
sysinfosjob.start();
reportjob.start();