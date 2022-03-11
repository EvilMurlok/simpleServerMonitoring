import Vue from 'vue'
import Router from 'vue-router'

import vMainWrapper from '../components/v-main-wrapper';
import vLogin from '../components/authorization/v-login';
import vRegister from '../components/authorization/v-register';
import vShowServers from '../components/server/v-show-servers';
import vAddServer from '../components/server/v-add-server';
import vServerItem from '../components/server/v-server-item';

Vue.use(Router);

let router = new Router({
    // mode: "history",
    routes: [
        {
            path: '/',
            name: 'mainWrapper',
            component: vMainWrapper
        },
        {
            path: '/login/',
            name: 'login',
            component: vLogin,
            props: true,
            meta: {
                guest: true
            }
        },
        {
            path: '/register/',
            name: 'register',
            component: vRegister,
            props: true,
            meta: {
                guest: true
            }
        },
        {
            path: '/show-servers/',
            name: 'showServers',
            component: vShowServers,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/view-server/:serverId/',
            name: 'viewServer',
            component: vServerItem,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/add-server/',
            name: 'addServer',
            component: vAddServer,
            meta: {
                requiresAuth: true
            }
        }
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

