const prometheus = require("prom-client");

const buttonClicksCounter = new prometheus.Counter ({
    name: 'button_clicks',
    help: 'counts the number of clicks on button'
})

module.exports = {
    buttonClicksCounter
}