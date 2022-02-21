const testControllers = require('../controllers/testControllers');
const express = require('express');


const router = express.Router();

router.get('/', testControllers.hello);
router.get('/users', testControllers.findAll);
router.post('/users', testControllers.addUser);

module.exports = router;