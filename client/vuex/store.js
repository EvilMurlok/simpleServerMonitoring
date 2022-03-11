import Vue from 'vue'
import Vuex from 'vuex'

// import getters from "./getters/getters";
// import mutations from "./mutations/mutations";

Vue.use(Vuex);

let store = new Vuex.Store({
    state: {
        username: localStorage.getItem("username") || '',
        isLoggedIn: localStorage.getItem("isLoggedIn") || "out",
        user_id: parseInt(localStorage.getItem("id")) || 0
    },
    mutations: {
        SET_USERNAME(state, username){
            state.username = username;
        },
        SET_LOGGED_IN(state, isLoggedIn){
            state.isLoggedIn = isLoggedIn;
        },
        SET_USER_ID(state, user_id){
            state.user_id = user_id;
        }
    },
    actions: {
        SET_USERNAME({commit}, username){
            commit('SET_USERNAME', username);
        },
        SET_LOGGED_IN({commit}, isLoggedIn){
            commit('SET_LOGGED_IN', isLoggedIn);
        },
        SET_USER_ID({commit}, user_id){
            commit('SET_USER_ID', user_id);
        }
    },
    getters: {
        USERNAME(state) {
            return state.username;
        },
        IS_LOGGED_IN(state) {
            return state.isLoggedIn;
        },
        USER_ID(state){
            return state.user_id;
        }
    },
});

export default store;