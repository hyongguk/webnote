import App from "./App";
import Vue from "vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import axios from "axios";
import VueAxios from "vue-axios";

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin, axios, VueAxios);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
