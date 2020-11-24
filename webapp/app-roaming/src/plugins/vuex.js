import store from '../store/index';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

Vue.use({
  store,
  install(Vue) {
    Vue.prototype.$store = store;
  },
});
