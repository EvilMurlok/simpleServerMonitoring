import Vue from 'vue'
import Router from 'vue-router'

import vLogin from '../views/authorization/v-login';
import vRegister from '../views/authorization/v-register';
import vShowServers from '../views/server/v-show-servers';
import vAddServer from '../views/server/v-add-server';
import vServerItem from '../views/server/v-server-item';

import LayoutSimple from '../layouts/variations/Simple';
import LayoutBackend from '../layouts/variations/BackendStarter';


Vue.use(Router);

let router = new Router({
    // mode: "history",
    routes: [
        {
            path: '/login',
            redirect: '/login',
            component: LayoutSimple,
            props: true,
            meta: {
                guest: true
            },
            children: [
                {
                    path: '/login',
                    name: 'login',
                    component: vLogin
                }
            ]
        },
        {
            path: '/register',
            redirect: '/register',
            component: LayoutSimple,
            props: true,
            meta: {
                guest: true
            },
            children: [
                {
                    path: '/register',
                    name: 'register',
                    component: vRegister
                }
            ]
        },
        {
            path: '/show-servers/',
            redirect: '/show-servers',
            component: LayoutBackend,
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: '/show-servers',
                    name: 'showServers',
                    component: vShowServers
                }
            ]
        },
        {
            path: '/view-server/:serverId/',
            redirect: '/view-server/:serverId/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: '/view-server/:serverId/',
                    name: 'viewServer',
                    component: vServerItem
                }
            ]
        },
        {
            path: '/add-server/',
            redirect: '/add-server/',
            component: LayoutBackend,
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: '/add-server/',
                    name: 'addServer',
                    component: vAddServer
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
            next({ name: 'showServers' })
        }
    } else {
        next()
    }
});


export default router;

