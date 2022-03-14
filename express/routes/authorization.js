const express = require('express');
const passport = require('passport');

const middlewaresAuth = require('../middleware/authorization');
const authControllers = require('../controllers/authorization');

const router = express.Router();

router.post('/register/', authControllers.user_register_post);
router.post('/login/', passport.authenticate('local', {}),
    function (req, res) {
        res.send({
            status: "success",
            id: req.user.id,
            username: req.user.username,
            isLoggedIn: req.isAuthenticated()
        });
    }
);
router.get('/logout/', middlewaresAuth.checkNotAuthenticated, authControllers.user_logout);

module.exports = router;
