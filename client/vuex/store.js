import Vue from 'vue'
import Vuex from 'vuex'

import templateGetters from "./getters/templateGetters";
import permissionGetters from "./getters/permissionGetters";
import userGetters from "./getters/userGetters";
import tagGetters from "./getters/tagGetters";
import projectGetters from "./getters/projectGetters";
import serverGetters from "./getters/serverGetters";

import templateMutations from "./mutations/templateMutations";
import permissionMutations from "./mutations/permissionMutations";
import userMutations from "./mutations/userMutations";
import tagMutations from "./mutations/tagMutations";
import projectMutations from "./mutations/projectMutations";
import serverMutations from "./mutations/serverMutations";

import permissionApiRequests from "./actions/permissionApiRequests";
import userActions from "./actions/userActions";
import tagApiRequests from "./actions/tagApiRequests";
import projectApiRequests from "./actions/projectApiRequests";
import serverApiRequests from "./actions/serverApiRequests";

Vue.use(Vuex);

const getters = {...templateGetters, ...permissionGetters, ...userGetters, ...tagGetters, ...projectGetters, ...serverGetters};
const mutations = {...templateMutations, ...permissionMutations, ...userMutations, ...tagMutations, ...projectMutations, ...serverMutations};
const actions = {...permissionApiRequests, ...userActions, ...tagApiRequests, ...projectApiRequests, ...serverApiRequests};


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

        tagsByName: [],
        permissionsByName: [],
        projectsByName: [],
        serversByHostname: [],
        serversByIp: [],
        permissions: [],
        user: { username: "", phone: "", email: ""},
    },
    mutations,
    actions,
    getters,
});