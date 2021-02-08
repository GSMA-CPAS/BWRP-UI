/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Vuex from 'vuex';
import allModules from './modules/all-modules';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // TEST DATA
    documents: [],
    services: [
      'MOC Back Home',
      'MOC Local',
      'MTC',
      'SMS MO',
      'M2M',
      'NB-IoT',
      'LTE-M',
      'VoLTE',
      'DATA',
    ],
  },
  mutations: {
    LOAD_DOCUMENTS: (state, documents) => {
      state.documents = documents;
    },
  },
  actions: {
    setup({commit, dispatch, rootGetters, getters, rootState, state}) {
      for (const key in Vue.axios) {
        if (Object.hasOwnProperty.call(Vue.axios, key)) {
          const {request, response} = Vue.axios[key].interceptors;
          request.use(
              (config) => {
                const {method, baseURL, url, signing} = config;
                console.log(
                    `%c Made ${method} request to ${baseURL + url}`,
                    'color:green; font-weight:800',
                );
              signing ?
                dispatch('app-state/signing', true) :
                dispatch('app-state/loading', true);
              return config;
              },
              (error) => {
                dispatch('app-state/loadError', {
                  title: error.statusText,
                  body: `Status code ${error.status}`,
                });
                return Promise.reject(error);
              },
          );
          response.use(
              (response) => {
                dispatch('app-state/loading', false);
                try {
                  return JSON.parse(response.data);
                } catch {
                  return response.data;
                }
              },
              (error) => {
                if (error.response?.status === 401) {
                  parent.postMessage('unauthorized', '*');
                }
                dispatch('app-state/loadError', {
                  title: error.response.statusText,
                  body: `Status code ${error.response.status}`,
                });
                return Promise.reject(error);
              },
          );
        }
      }

      dispatch('user/initializeUser');
      dispatch('loadDocuments');
    },
    loadDocuments({commit, dispatch, rootGetters, getters, rootState, state}) {
      Vue.axios.commonAdapter
          .get('/documents', {withCredentials: true})
          .then((res) => {
            console.log(res);
            commit('LOAD_DOCUMENTS', res);
          })
          .catch((err) => {
            console.log(err);
          });
    },
  },
  modules: allModules,
  getters: {},
});
