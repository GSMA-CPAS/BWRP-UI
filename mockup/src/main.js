import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { vuetify } from "./plugins/all-plugins";
import { GLOBAL_COMPONENTS } from "./components/global-components";
import "./utils/filters/global-filters";

// register global components
GLOBAL_COMPONENTS.forEach((c) => {
  Vue.component(c.name, c);
});

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
