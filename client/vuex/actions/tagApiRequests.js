import Vue from "vue";

export default {
    GET_TAGS_BY_NAME({commit}, tagName) {
        return Vue.prototype.$http
            .get("/tag/retrieve-tags-by-name/", {
                params: {
                    tagName: tagName
                }
            })
            .then(res => {
                commit("SET_TAGS_BY_NAME", res.data.tagsByName);
                return res;
            })
            .catch(err => {
                throw err;
            });
    },
}