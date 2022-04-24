import Vue from "vue";

export default {
    GET_PROJECTS_BY_NAME({commit}, projectName) {
        return Vue.prototype.$http
            .get("/project/retrieve-user-projects-by-name/", {
                params: {
                    projectName: projectName
                }
            })
            .then(res => {
                commit("SET_PROJECTS_BY_NAME", res.data.userProjectsByName);
                return res;
            })
            .catch(err => {
                throw err;
            });
    },
}