const jobs = require('./jobs/jobs.js');
const bots = require('./bots/bots.js');
const mail = require('./mails/mail.js');

module.exports = {
    name: "monit",
    jobs: jobs,
    mail: mail,
    bots: bots
}