const ostb = require('os-toolbox');
const q = require('q');
const childProcess = require('child_process');

exports.getInfos = function () {
    let deferred = q.defer();
    q.all([
        ostb.cpuLoad(),
        ostb.memoryUsage()
    ]).then(function (results) {
        deferred.resolve({
            cpu: results[0],
            mem: results[1]
        });
    });
    return deferred.promise;
}

exports.getInfosFull = function () {
    let deferred = q.defer();
    q.all([
        ostb.cpuLoad(),
        ostb.memoryUsage(),
        ostb.platform(),
        ostb.uptime(),
        ostb.currentProcesses()
    ]).then(function (results) {
        deferred.resolve({
            cpu: results[0],
            mem: results[1],
            platform: results[2],
            uptime: results[3],
            processes: results[4]
        });
    });
    return deferred.promise;
}

exports.uptime = function () {
    let uptime = ostb.uptime();
    let secondsInAMinute = 60;
    let secondsInAnHour = 60 * secondsInAMinute;
    let secondsInADay = 24 * secondsInAnHour;

    // extract days
    let days = Math.round(uptime / secondsInADay);

    // extract hours
    let hourSeconds = uptime % secondsInADay;
    let hours = Math.round(hourSeconds / secondsInAnHour);

    // extract minutes
    let minuteSeconds = hourSeconds % secondsInAnHour;
    let minutes = Math.round(minuteSeconds / secondsInAMinute);
    return {
        days: days,
        hours: hours,
        minutes: minutes
    };
}

exports.freecache = function () {
    let deferred = q.defer();
    childProcess.exec('echo 3 > /proc/sys/vm/drop_caches', (err) => {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}