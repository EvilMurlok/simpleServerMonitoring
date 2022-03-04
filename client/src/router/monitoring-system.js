/*
 * Starter Router
 */

// Vue and Vue Router
import Vue from 'vue'
import Router from 'vue-router'

// Main layouts
import LayoutBackend from '@/layouts/variations/BackendStarter.vue'
import LayoutSimple from '@/layouts/variations/Simple.vue'

// Register Vue Router
Vue.use(Router)

// Login Page
const Login = () => import("@/views/monitoring-system/Login.vue")
// Register Page
const Register = () => import("@/views/monitoring-system/Register.vue")
// My-servers Page
const MyServers = () => import("@/views/monitoring-system/MyServers.vue")
// Add-server Page
const AddServer = () => import("@/views/monitoring-system/AddServer.vue")
// Server-info Page
const ServerInfo = () => import("@/views/monitoring-system/ServerInfo.vue")


// Router Configuration
export default new Router({
  linkActiveClass: 'active',
  linkExactActiveClass: '',
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/login',
      redirect: '/login',
      component: LayoutSimple,
      children: [
        {
          path: '/login',
          name: 'Login',
          component: Login
        }
      ]
    },
    {
      path: '/register',
      redirect: '/register',
      component: LayoutSimple,
      children: [
        {
          path: '/register',
          name: 'Register',
          component: Register
        }
      ]
    },
    {
      path: '/my-servers',
      redirect: '/my-servers',
      component: LayoutBackend,
      children: [
        {
          path: '/my-servers',
          name: 'MyServers',
          component: MyServers
        }
      ]
    },
    {
      path: '/add-server',
      redirect: '/add-server',
      component: LayoutBackend,
      children: [
        {
          path: '/add-server',
          name: 'AddServer',
          component: AddServer
        }
      ]
    },
    {
      path: '/my-servers/:id',
      redirect: '/my-servers/:id',
      component: LayoutBackend,
      children: [
        {
          path: '/my-servers/:id',
          name: 'ServerInfo',
          component: ServerInfo
        }
      ]
    },
  ]
})
