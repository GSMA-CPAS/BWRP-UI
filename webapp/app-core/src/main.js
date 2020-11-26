import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import Axios from 'axios';
import router from './router';

import titleMixin from './utils/mixins/page-title';
Vue.mixin(titleMixin);

import Modal from '@/components/dialog/Plugin';
Vue.use(Modal);

Vue.config.productionTip = false;

// HTTP

Vue.prototype.$http = Axios;
Vue.prototype.$http.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('appContext');
    location.href = '/login';
  }
  throw error;
});
/*
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
if (csrfToken) {
    Vue.prototype.$http.defaults.headers.common['X-CSRF-Token'] = csrfToken;
}
*/

// POST MESSAGE

const eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
const messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';
const event = window[eventMethod];
event(messageEvent, function(e) {
  if (e.data === 'unauthorized' || e.message === 'unauthorized') {
    localStorage.removeItem('appContext');
    location.href = '/login';
  }
});

// ROUTER

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (localStorage.getItem('appContext') == null) {
      next({
        path: '/login',
        params: {nextUrl: to.fullPath}
      });
    } else {
      const appContext = JSON.parse(localStorage.getItem('appContext'));
      if (to.matched.some((record) => record.meta.isAdmin)) {
        if (appContext.user.isAdmin) {
          next();
        } else {
          next({
            path: '/'
          });
        }
      } else {
        next();
      }
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    next();
  }
});

new Vue({
  vuetify,
  router,
  render: (h) => h(App)
}).$mount('#app');
