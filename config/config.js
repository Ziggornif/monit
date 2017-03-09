const jobs = require('./jobs/jobs.js');
const mail = require('./mail.js');

module.exports = {
    name: "monit",
    jobs: jobs,
    mail: mail
}