import store from "../../../vuex/store"

const checkDefault = (nameDefaultPermission = "default") => {
    return (store.getters.PERMISSIONS.filter(permission => permission.name === nameDefaultPermission)).length > 0;
}
export default {
    checkDefault
};