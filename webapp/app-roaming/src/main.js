import Vue from 'vue';
import App from './App.vue';
import router from './router';
import {vuetify} from './plugins/all-plugins';
import './utils/filters/global-filters';

// register global components
const components = require.context(
    '@/components/global-components/',
    true,
    /.*.(vue|js)$/
);
components.keys().forEach((x) => {
  const component = components(x).default;
  Vue.component(component.name, component);
});

/* !! for DEV purposes !! */
const userString = JSON.stringify({
  user: {username: 'admin', isAdmin: true},
  organization: {mspid: 'DTAG', title: 'Deutsche Telekom'},
});

process.env.NODE_ENV === 'development' &&
  localStorage.setItem('appContext', userString);

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
