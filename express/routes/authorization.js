const express = require('express');
const passport = require('passport');

const middlewaresAuth = require('../middleware/authorization');
const authControllers = require('../controllers/authorization');

const router = express.Router();

router.get('/register/', middlewaresAuth.checkAuthenticated, authControllers.user_register);
router.post('/register/', authControllers.user_register_post);
router.get('/login/', middlewaresAuth.checkAuthenticated, authControllers.user_login);
router.post('/login/', passport.authenticate('local', {
        successRedirect: '/show-servers/',
        failureRedirect: '/login/',
        failureFlash: true
    })
);
router.get('/logout/', middlewaresAuth.checkNotAuthenticated, authControllers.user_logout);

module.exports = router;