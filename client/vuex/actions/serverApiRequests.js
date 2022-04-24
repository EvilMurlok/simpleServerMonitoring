import Vue from "vue";

export default {
    GET_SERVERS_BY_HOSTNAME({commit}, hostname = "%") {
        return Vue.prototype.$http
            .get("/server/retrieve-servers-by-hostname-ip/", {
                params: {
                    hostname: hostname,
                    ip: "%"
                }
            })
            .then(res => {
                commit("SET_SERVERS_BY_HOSTNAME", res.data.requiredUserServers.map(server => server.hostname));
                return res;
            })
            .catch(err => {
                throw err;
            });
    },

    GET_SERVERS_BY_IP({commit}, ip = "%") {
        return Vue.prototype.$http
            .get("/server/retrieve-servers-by-hostname-ip/", {
                params: {
                    hostname: "%",
                    ip: ip
                }
            })
            .then(res => {
                commit("SET_SERVERS_BY_IP", res.data.requiredUserServers.map(server => server.ip));
                return res;
            })
            .catch(err => {
                throw err;
            });
    },
}