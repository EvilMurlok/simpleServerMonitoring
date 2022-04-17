import Vue from 'vue'
import Vuex from 'vuex'

import templateGetters from "./getters/templateGetters";
import permissionGetters from "./getters/permissionGetters";
import userGetters from "./getters/userGetters";

import templateMutations from "./mutations/templateMutations";
import permissionMutations from "./mutations/permissionMutations";
import userMutations from "./mutations/userMutations";

import permissionApiRequests from "./actions/permissionApiRequests";
// import permissionActions from "./actions/permissionActions";
import userActions from "./actions/userActions";

Vue.use(Vuex);

const getters = {...templateGetters, ...permissionGetters, ...userGetters};
const mutations = {...templateMutations, ...permissionMutations, ...userMutations};
const actions = {...permissionApiRequests, ...userActions};


export default new Vuex.Store({
    state: {
        app: {
            name: 'OneUI Vue Edition',
            version: process.env.PACKAGE_VERSION,
            copyright: new Date().getFullYear()
        },

        // Default layout options
        layout: {
            header: true,
            sidebar: true,
            sideOverlay: true,
            footer: true
        },

        settings: {
            colorTheme: '', // 'amethyst', 'city', 'flat', 'modern', 'smooth'
            sidebarLeft: true,
            sidebarMini: false,
            sidebarDark: true,
            sidebarVisibleDesktop: true,
            sidebarVisibleMobile: false,
            sideOverlayVisible: false,
            sideOverlayHoverable: false,
            pageOverlay: true,
            headerFixed: true,
            headerDark: false,
            headerSearch: false,
            headerLoader: false,
            pageLoader: false,
            rtlSupport: false,
            sideTransitions: true,
            mainContent: '' // 'boxed', ''narrow'
        },

        permissions: [],
        user: { username: "", phone: "", email: ""},
    },
    mutations,
    actions,
    getters,
});