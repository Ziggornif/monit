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
        type: {
            email: true,
            telegram: true,
            slack: false
        },
        resendafter: "1200000"
    },
    metrics: {
        cpucritic: 75,
        memcritic: 75
    }
}