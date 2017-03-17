const ostb = require('os-toolbox');
const q = require('q');

exports.getInfos = function() {
    let deferred = q.defer();
    q.all([
        ostb.cpuLoad(),
        ostb.memoryUsage()
    ]).then(function(results) {
        deferred.resolve({
            cpu: results[0],
            mem: results[1]
        });
    });
    return deferred.promise;
}