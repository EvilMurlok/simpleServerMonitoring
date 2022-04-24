import Vue from "vue";

export default {
    GET_PERMISSIONS_FROM_API({commit}) {
        return Vue.prototype.$http
            .get("/auth/user-profile/")
            .then(res => {
                if (res.data.isLoggedIn === false) {
                    commit("SET_USER", {username: "", phone: "", email: ""});
                    throw ({type: res.data.status, messages: res.data.messages});
                } else {
                    commit("SET_ALL_PERMISSIONS", res.data.user.permissions);
                    commit("SET_USER", res.data.user);
                    return res;
                }
            })
            .catch(err => {
                throw err;
            });
    },

    GET_PERMISSIONS_BY_NAME({commit}, permissionName = "%") {
        return Vue.prototype.$http
            .get("/permission/retrieve-all-by-name/", {
                params: {
                    permissionName: permissionName
                }
            })
            .then(res => {
                commit("SET_PERMISSIONS_BY_NAME", res.data.permissionsByName);
                return res;
            })
            .catch(err => {
                console.error(err);
            })
    }
}