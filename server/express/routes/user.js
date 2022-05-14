const express = require("express");

const middlewaresAuth = require("../middleware/authorization");
const userControllers = require("../controllers/authorization");

const router = express.Router();

router.get("/user/retrieve-user/", middlewaresAuth.checkNotAuthenticated, userControllers.user_retrieve);
router.get("/user/retrieve-other-users/", middlewaresAuth.checkNotAuthenticated, userControllers.retrieve_other_users);
router.get("/user/retrieve-other-users-without-admin-permission/:projectId/", middlewaresAuth.checkNotAuthenticated, userControllers.retrieve_other_users_without_admin_permissions);
router.get("/user/delete-user/", middlewaresAuth.checkNotAuthenticated, userControllers.user_deletion);

router.post("/user/update-user/", middlewaresAuth.checkNotAuthenticated, userControllers.user_edition);
router.post("/user/change-password/", middlewaresAuth.checkNotAuthenticated, userControllers.user_change_password);

module.exports = router;
