import Vue from 'vue'
import Router from 'vue-router'

import vLogin from '@/views/authorization/v-login';
import vRegister from '@/views/authorization/v-register';

import vAddProject from '@/views/project/v-create-project';
import vRetrieveProject from '@/views/project/v-retrieve-project'
import vRetrieveProjects from '@/views/project/v-retrieve-projects';

import vCreateServer from '@/views/server/v-create-server';
import vRetrieveServer from '@/views/server/v-retrieve-server';
import vRetrieveServers from '@/views/server/v-retrieve-servers';

import vRetrieveUser from "@/views/user/v-user-info";

import LayoutSimple from '@/layouts/variations/Simple';
import LayoutBackend from '@/layouts/variations/BackendStarter';
import TestMetric from "@/views/test_views/TestMetric";


Vue.use(Router);

let router = new Router({
    // mode: "history",
    routes: [
        // auth
        {
            path: '/',
            redirect: '/login/'
        },
        {
            path: '/login/',
            component: LayoutSimple,
            props: true,
            meta: {
                guest: true
            },
            children: [
                {
                    path: '/login/',
                    name: 'login',
                    component: vLogin
                }
            ]
        },
        {
            path: '/register/',
            component: LayoutSimple,
            props: true,
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
                requiresAuth: true
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
                requiresAuth: true
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
            path: '/retrieve-project/:projectId/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true
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
                requiresAuth: true
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


        //user
        {
            path: '/retrieve-user/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true
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
            props: true,
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
        if (localStorage.getItem('isLoggedIn') == null) {
            next({
                path: '/login/',
                params: { nextUrl: to.fullPath }
            });
        } else {
            next();
        }
    } else if (to.matched.some(record => record.meta.guest)) {
        if (localStorage.getItem('isLoggedIn') == null) {
            next()
        } else {
            next({ name: 'retrieveProjects' })
        }
    } else {
        next()
    }
});


export default router;

