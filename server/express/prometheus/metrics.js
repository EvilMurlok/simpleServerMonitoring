const prometheus = require("prom-client");

const buttonClicksCounter = new prometheus.Counter({
    name: 'button_clicks',
    help: 'counts the number of clicks on button'
});

const totalHttpRequestCount = new prometheus.Counter({
    name: 'nodejs_http_total_count',
    help: 'total request number',
    labelNames: ['method', 'route', 'code'],
});

const totalHttpRequestDuration = new prometheus.Gauge({
    name: 'nodejs_http_total_duration',
    help: 'the last duration or response time of last request',
    labelNames: ['method', 'route', 'code'],
});

const httpRequestTimer = new prometheus.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.005, 0.05, 0.5, 2] // 1 millisecond to 5000 milliseconds
});

module.exports = {
    buttonClicksCounter,
    totalHttpRequestCount,
    totalHttpRequestDuration,
    httpRequestTimer
}