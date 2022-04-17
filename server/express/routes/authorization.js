const express = require('express');
const passport = require('passport');

const middlewaresAuth = require('../middleware/authorization');
const authControllers = require('../controllers/authorization');

const router = express.Router();

router.post('/auth/register/', authControllers.user_register_post);
router.post('/auth/login/', passport.authenticate('local', {}),
    function (req, res) {
        res.send({
            status: "success",
            user: req.user,
        });
    }
);
router.get('/auth/logout/', middlewaresAuth.checkNotAuthenticated, authControllers.user_logout);

// main router which gives all user permissions
// this router is called every time when user changes the page
router.get("/auth/user-profile/", middlewaresAuth.checkNotAuthenticated,
    (req, res) => {
        res.send({
            status: "success",
            user: req.user,

        });
    });

module.exports = router;
