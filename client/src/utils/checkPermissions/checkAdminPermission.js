import store from "../../../vuex/store"

const checkAdminPermission = (projectName = "") => {
    const permissionAdminName = `admin${projectName}`;
    for (let permission of store.getters.PERMISSIONS) {
        if (permission.name === permissionAdminName) {
            return true
        }
    }
    return  false;
}
export default {
    checkAdminPermission
};