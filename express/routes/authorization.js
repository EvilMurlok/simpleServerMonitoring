const authControllers = require('../controllers/authorization');
const express = require('express');


const router = express.Router();

router.get('/index', authControllers.index);

module.exports = router;