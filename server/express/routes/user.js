const express = require("express");

const middlewaresAuth = require("../middleware/authorization");
const userControllers = require("../controllers/authorization");

const router = express.Router();

router.get("/user/retrieve-user/", middlewaresAuth.checkNotAuthenticated, userControllers.user_retrieve);
router.get("/user/delete-user/", middlewaresAuth.checkNotAuthenticated, userControllers.user_deletion);

router.post("/user/update-user/", middlewaresAuth.checkNotAuthenticated, userControllers.user_edition);

module.exports = router;
