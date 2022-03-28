const register = require("../prometheus/promClientConfig");
const metrics = require("../prometheus/metrics");

const get_metrics = async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
}

const increment_counter =  async (req, res) => {
    metrics.buttonClicksCounter.inc();
    res.send('Oh, damn monitoring... (￣ヘ￣)');
}

module.exports = {
    get_metrics,
    increment_counter,
};