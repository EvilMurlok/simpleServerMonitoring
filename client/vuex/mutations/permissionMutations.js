export default {
    SET_ALL_PERMISSIONS(state, newPermissions) {
        state.permissions = newPermissions;
    },

    SET_PERMISSIONS_BY_NAME(state, newPermissionsByName) {
        state.permissionsByName = newPermissionsByName;
    }
}