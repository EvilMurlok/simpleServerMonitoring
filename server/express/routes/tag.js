const express = require("express");

const middlewaresAuth = require("../middleware/authorization");
const tagControllers = require("../controllers/tag");

const router = express.Router();

router.get("/tag/delete-tag/:tagId/", middlewaresAuth.checkNotAuthenticated, tagControllers.delete_tag);
router.get("/tag/retrieve-tag/:tagId/", middlewaresAuth.checkNotAuthenticated, tagControllers.retrieveTagById);
router.get("/tag/retrieve-all-tags/", middlewaresAuth.checkNotAuthenticated, tagControllers.retrieveAllTags);

router.post("/tag/create-tag/", middlewaresAuth.checkNotAuthenticated, tagControllers.create_tag);
router.post("/tag/edit-tag/:tagId/", middlewaresAuth.checkNotAuthenticated, tagControllers.edit_tag);
router.post("/tag/add-servers/:tagId", middlewaresAuth.checkNotAuthenticated, tagControllers.setServers);

module.exports = router;
