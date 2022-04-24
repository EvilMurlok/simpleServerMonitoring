export default {
    SET_SERVERS_BY_HOSTNAME(state, foundServers) {
        state.serversByHostname = foundServers;
    },

    SET_SERVERS_BY_IP(state, foundServers) {
        state.serversByIp = foundServers;
    }
}