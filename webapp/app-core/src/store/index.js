import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  actions: {
    appContext: (context) => {
      return new Promise((resolve, reject) => {
        try {
          const appContext = JSON.parse(localStorage.getItem('appContext'));
          if (appContext) {
            resolve(appContext);
          } else {
            reject(new Error('Failed to get appContext'));
          }
        } catch (error) {
          reject(error);
        }
      });
    }
  }
});
