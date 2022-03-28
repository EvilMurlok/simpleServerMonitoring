const metrics = require("../prometheus/metrics");
const {getDurationInMilliseconds} = require("../utils/utils");

function monitoringMiddleware (req, res, next){
    const start = process.hrtime();
    const end = metrics.httpRequestTimer.startTimer();
    res.on('finish', () => {
        metrics.totalHttpRequestCount.inc({ route: req.path, code: res.statusCode, method: req.method });
        metrics.totalHttpRequestDuration
            .inc({route: req.path, code: res.statusCode, method: req.method }, getDurationInMilliseconds(start));
        end({ route: req.path, code: res.statusCode, method: req.method });
    });
    next();
}

module.exports = {
    monitoringMiddleware
}