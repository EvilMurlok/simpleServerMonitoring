const prometheus = require("prom-client");
const metrics = require("./metrics");
const register = new prometheus.Registry();

prometheus.collectDefaultMetrics({
    app: 'simple-server-monitoring-app',
    timeout: 10000,
    gcDurationBuckets: [0.005, 0.05, 0.5, 2],
    register
});

register.registerMetric(metrics.buttonClicksCounter);
register.registerMetric(metrics.totalHttpRequestDuration);
register.registerMetric(metrics.totalHttpRequestCount);
register.registerMetric(metrics.httpRequestTimer);

module.exports = register;