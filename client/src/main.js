import App from "./App";
import Vue from "vue";
import VueRouter from "vue-router";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import axios from "axios";
import VueAxios from "vue-axios";
import Login from "./Login.vue";
import Signup from "./Signup.vue";
import Cardlist from "./Cardlist";
//import { router } from "../../server/server";

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin, axios, VueAxios);
Vue.use(VueRouter);
Vue.config.productionTip = false;

//Define route components
//const Login = { template: '<div>login</div>'}

//Define some routes
const routes = [
  { path: "/notes", component: Cardlist },
  { path: "/login", component: Login, props: false },
  { path: "/signup", component: Signup }
];
//Create the router instance
const router = new VueRouter({
  routes
});
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
