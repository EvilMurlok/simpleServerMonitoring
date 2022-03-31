const express = require("express");

const middlewaresAuth = require("../middleware/authorization");
const projectControllers = require("../controllers/project");

const router = express.Router();

router.get("/delete-project/:projectId/", middlewaresAuth.checkNotAuthenticated, projectControllers.delete_project);
router.get("/retrieve-user-projects/", middlewaresAuth.checkNotAuthenticated, projectControllers.retrieve_user_projects);

router.post("/create-project/", middlewaresAuth.checkNotAuthenticated, projectControllers.create_project);
router.post("/update-project/:projectId/", middlewaresAuth.checkNotAuthenticated, projectControllers.edit_project);

module.exports = router;
