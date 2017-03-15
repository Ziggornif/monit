const jobs = require('./jobs/jobs.js');
const mail = require('./mails/mail.js');

module.exports = {
    name: "monit",
    jobs: jobs,
    mail: mail
}