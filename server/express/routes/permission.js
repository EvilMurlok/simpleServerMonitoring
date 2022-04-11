const express = require("express");

const middlewaresAuth = require("../middleware/authorization");
const permissionControllers = require("../controllers/permission");

const router = express.Router();

router.post(
    "/permission/create-admin/:projectId",
    middlewaresAuth.checkNotAuthenticated,
    permissionControllers.create_admin_permission
);

router.post(
    "/permission/update-admin/:projectId",
    middlewaresAuth.checkNotAuthenticated,
    permissionControllers.update_admin_permission);

router.post(
    "/permission/create-custom/:projectId",
    middlewaresAuth.checkNotAuthenticated,
    permissionControllers.create_custom_permission);

router.post(
    "/permission/edit-custom/:permissionId",
    middlewaresAuth.checkNotAuthenticated,
    permissionControllers.edit_custom_permission);

router.get(
    "/permission/get-sub/:permissionId",
    middlewaresAuth.checkNotAuthenticated,
    permissionControllers.get_sub_permissions);

router.get(
    "/delete-permission/:permissionId",
    middlewaresAuth.checkNotAuthenticated,
    permissionControllers.delete_permission);


module.exports = router;
