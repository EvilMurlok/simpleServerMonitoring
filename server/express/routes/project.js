const express = require("express");

const middlewaresAuth = require("../middleware/authorization");
const projectControllers = require("../controllers/project");

const router = express.Router();

router.get("/project/delete-project/:projectId/", middlewaresAuth.checkNotAuthenticated, projectControllers.delete_project);
router.get("/project/retrieve-project/:projectId/", middlewaresAuth.checkNotAuthenticated, projectControllers.retrieve_project);
router.get("/project/retrieve-user-projects/:offset/:limit/", middlewaresAuth.checkNotAuthenticated, projectControllers.retrieve_user_projects);
router.get("/project/retrieve-user-projects-servers/:offset/:limit/", middlewaresAuth.checkNotAuthenticated, projectControllers.retrieve_all_user_projects_servers);
router.get("/project/retrieve-all-user-projects/", middlewaresAuth.checkNotAuthenticated, projectControllers.retrieve_all_user_projects);

router.post("/project/create-project/", middlewaresAuth.checkNotAuthenticated, projectControllers.create_project);
router.post("/project/update-project/:projectId/", middlewaresAuth.checkNotAuthenticated, projectControllers.edit_project);

module.exports = router;
