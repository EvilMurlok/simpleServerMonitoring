import store from "../../../vuex/store"

const checkCreatePermission = (projectId = 0) => {
    projectId = parseInt(projectId);
    for (let permission of store.getters.PERMISSIONS) {
        if (permission.projectId === projectId) {
            for (let ability of permission.abilities) {
                if (ability.entity === "Permission" && ability.action === "Create") {
                    return true;
                }
            }
        }
    }
    return  false;
}
export default {
    checkCreatePermission
};