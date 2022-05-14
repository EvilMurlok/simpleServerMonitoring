import Vue from "vue"
import Router from "vue-router"
import store from "../../vuex/store"

// errors
import vNotFoundPage from "@/views/errors/v-not-found"

// auth
import vLogin from "@/views/authorization/v-login";
import vRegister from "@/views/authorization/v-register";

// project
import vAddProject from "@/views/project/v-create-project";
import vRetrieveProject from "@/views/project/v-retrieve-project"
import vRetrieveProjects from "@/views/project/v-retrieve-projects";
import vRetrieveAvailableUserProjects from "@/views/project/v-retrieve-available-projects"

// servers
import vCreateServer from "@/views/server/v-create-server";
import vRetrieveServer from "@/views/server/v-retrieve-server";
import vRetrieveServers from "@/views/server/v-retrieve-servers";

// tags
import vCreateTag from "@/views/tag/v-create-tag";
import vRetrieveTag from "@/views/tag/v-retrieve-tag";

// permissions
import vRetrieveProjectPermissions from "@/views/permission/v-retrieve-project-permissions";
import vRetrieveCommonPermissions from "@/views/permission/v-retrieve-common-permissions";
import vCreatePermission from "@/views/permission/v-create-permission"

// user
import vRetrieveUser from "@/views/user/v-user-info";

import LayoutSimple from "@/layouts/variations/Simple";
import LayoutBackend from "@/layouts/variations/BackendStarter";
import TestMetric from "@/views/test_views/TestMetric";


Vue.use(Router);

let router = new Router({
    // mode: "history",
    routes: [
        // main
        {
            path: "/",
            redirect: "/login/"
        },

        // errors
        {
            path: "/not-found-page/",
            component: vNotFoundPage,
            children: [
                {
                    path: "/not-found-page/",
                    name: "notFoundPage",
                    component: vNotFoundPage
                }
            ]
        },

        // auth
        {
            path: "/login/",
            component: LayoutSimple,
            meta: {
                guest: true
            },
            children: [
                {
                    path: "/login/",
                    name: "login",
                    component: vLogin
                }
            ]
        },
        {
            path: '/register/',
            component: LayoutSimple,
            meta: {
                guest: true
            },
            children: [
                {
                    path: '/register/',
                    name: 'register',
                    component: vRegister
                }
            ]
        },
        // projects
        {
            path: '/create-project/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true,
            },
            children: [
                {
                    path: '/create-project/',
                    name: 'createProject',
                    component: vAddProject
                }
            ]
        },
        {
            path: '/retrieve-projects/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true,
            },
            children: [
                {
                    path: '/retrieve-projects/',
                    name: 'retrieveProjects',
                    component: vRetrieveProjects
                }
            ]
        },
        {
            path: "/retrieve-available-projects/",
            component: LayoutBackend,
            meta: {
                requiresAuth: true,
            },
            children: [
                {
                    path: "/retrieve-available-projects/",
                    name: "retrieveAvailableProjects",
                    component: vRetrieveAvailableUserProjects
                }
            ]
        },
        {
            path: "/retrieve-project/:projectId/",
            component: LayoutBackend,
            meta: {
                requiresAuth: true,
            },
            children: [
                {
                    path: '/retrieve-project/:projectId/',
                    name: 'retrieveProject',
                    component: vRetrieveProject
                }
            ]
        },

        // servers
        {
            path: '/create-server/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true,
            },
            children: [
                {
                    path: '/create-server/',
                    name: 'createServer',
                    component: vCreateServer
                }
            ]
        },
        {
            path: '/retrieve-servers/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: '/retrieve-servers/',
                    name: 'retrieveServers',
                    component: vRetrieveServers
                }
            ]
        },
        {
            path: '/retrieve-server/:projectId/:serverId/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: '/retrieve-server/:projectId/:serverId/',
                    name: 'retrieveServer',
                    component: vRetrieveServer
                }
            ]
        },

        // tags
        {
            path: '/create-tag/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: '/create-tag/',
                    name: 'createTag',
                    component: vCreateTag
                }
            ]
        },
        {
            path: '/retrieve-tag/:tagId/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: '/retrieve-tag/:tagId/',
                    name: 'retrieveTag',
                    component: vRetrieveTag
                }
            ]
        },

        // permissions
        {
            path: '/retrieve-all-projects-permissions/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true,
            },
            children: [
                {
                    path: '/retrieve-all-projects-permissions/',
                    name: 'retrieveProjectPermissions',
                    component: vRetrieveProjectPermissions
                }
            ]
        },
        {
            path: '/create-permission/:projectId/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true,
            },
            children: [
                {
                    path: '/create-permission/:projectId/',
                    name: 'createPermission',
                    component: vCreatePermission
                }
            ]
        },
        {
            path: '/retrieve-all-common-permissions/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true,
            },
            children: [
                {
                    path: '/retrieve-all-common-permissions/',
                    name: 'retrieveCommonPermissions',
                    component: vRetrieveCommonPermissions
                }
            ]
        },

        //user
        {
            path: '/retrieve-user/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true,
            },
            children: [
                {
                    path: '/retrieve-user/',
                    name: 'retrieveUser',
                    component: vRetrieveUser
                }
            ]
        },
        {
            path: '/button',
            redirect: '/button',
            component: LayoutSimple,
            meta: {
                guest: true
            },
            children: [
                {
                    path: '/button',
                    name: 'testMetric',
                    component: TestMetric
                }
            ]
        },
    ]
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        store.dispatch("GET_PERMISSIONS_FROM_API")
            .then(res => {
                if (res.data) {
                    console.log("Пользователь успешно авторизован!");
                    next();
                    // if we wanna filter some data and stay on the same page we gotta refresh the page!
                    if (from.name === to.name) {
                        router.go(0);
                    }
                }
            })
            .catch(e => {
                router.push({
                    name: "login",
                    params: {
                        messages_data: {type: e.type, messages: e.messages}
                    }
                });
            });
    } else if (to.matched.some(record => record.meta.guest)) {
        if (store.getters.USER.username) {
            next({name: 'retrieveProjects'});
        } else {
            next();
        }
    } else {
        next();
    }
});


export default router;