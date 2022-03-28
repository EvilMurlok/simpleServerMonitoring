const testControllers = require('../controllers/monitoring');
const express = require('express');


const router = express.Router();

router.get('/metrics', testControllers.get_metrics)

router.post('/increment-counter', testControllers.increment_counter)

module.exports = router;