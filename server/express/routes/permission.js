const express = require("express");

const middlewaresAuth = require("../middleware/authorization");
const permissionControllers = require("../controllers/permission");

const router = express.Router();

router.post("/permission/create-admin-with-project/:projectId/", middlewaresAuth.checkNotAuthenticated,
    permissionControllers.create_admin_permission_with_project
);

router.post("/permission/update-admin/:projectId/", middlewaresAuth.checkNotAuthenticated,
    permissionControllers.update_admin_permission_with_project);

router.post("/permission/create-custom/:projectId/", middlewaresAuth.checkNotAuthenticated,
    permissionControllers.create_custom_permission);

router.post("/permission/edit-custom/:permissionId/", middlewaresAuth.checkNotAuthenticated,
    permissionControllers.edit_custom_permission);

router.get("/permission/get-sub/:permissionId/", middlewaresAuth.checkNotAuthenticated,
    permissionControllers.get_sub_permissions);

router.get("/permission/get-parents/:permissionId/", middlewaresAuth.checkNotAuthenticated,
    permissionControllers.get_parent_permissions);

router.get("/permission/delete-permission/:permissionId/", middlewaresAuth.checkNotAuthenticated,
    permissionControllers.delete_permission);

router.get("/permission/retrieve-all-by-name/", permissionControllers.retrieve_permissions_by_name);

router.get("/permission/retrieve-all-projects-user-permissions/", middlewaresAuth.checkNotAuthenticated,
    permissionControllers.retrieve_all_projects_user_permissions);

router.get("/permission/retrieve-common-user-permissions/", middlewaresAuth.checkNotAuthenticated,
    permissionControllers.retrieve_common_user_permissions);


module.exports = router;
