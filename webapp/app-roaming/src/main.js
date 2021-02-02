import Vue from 'vue';
import App from './App.vue';
import router from './router';
import {vuetify} from './plugins/all-plugins';
import VCurrencyField from 'v-currency-field';
import './utils/filtersÅ/global-filters';

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

Vue.use(VCurrencyField, {
  decimalLength: {min: 0, max: 5},
  autoDecimalMode: true,
  min: null,
  max: null,
  defaultValue: 0,
  valueAsInteger: false,
  allowNegative: true
});

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
