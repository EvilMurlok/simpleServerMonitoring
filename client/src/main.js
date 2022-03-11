import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import axios from 'axios'
import Vue from 'vue'
import FlashMessage from '@smartweb/vue-flash-message';

import router from "./router/router";
import store from "../vuex/store";
import App from './App.vue'

Vue.use(FlashMessage);
// Add Axios
Vue.prototype.$http = axios;
Vue.config.productionTip = false

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:4000/';

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

