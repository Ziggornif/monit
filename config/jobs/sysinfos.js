module.exports = {
    name: "sysinfos",
    cronTime: "*/5 * * * *",
    active: true,
    acquisition: {
        active: true,
        db: __base + "/data/monit.json"
    },
    alerte: {
        active: true,
        resendafter: "1200000"
    },
    metrics: {
        cpucritic: 75,
        memcritic: 75
    }
}