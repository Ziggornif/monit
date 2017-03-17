'use strict'
global.__base = __dirname + '/';
const jobsloader = require(__base + "core/jobs/jobsloader");
const botsloader = require(__base +"core/bots/botsloader");

jobsloader.startJobs();
botsloader.startBots();