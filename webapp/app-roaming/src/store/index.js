/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Vuex from 'vuex';
import allModules from './modules/all-modules';
import metadata from '../../../../mockup/src/assets/dummy/json/metadata.json';

Vue.use(Vuex);

const SERVICE_CONFIGURATION = [
  {name: 'MOC Back Home', unit: 'Min', access: false},
  {name: 'MOC Local', unit: 'Min', access: false},
  {name: 'MOC International', unit: 'Min', access: false},
  {name: 'MOC EU', unit: 'Min', access: false},
  {name: 'MOC EEA', unit: 'Min', access: false},
  {name: 'MOC RoW', unit: 'Min', access: false},
  {name: 'MOC Premium', unit: 'Min', access: false},
  {name: 'MOC Satellite', unit: 'Min', access: false},
  {name: 'MOC Video Telephony', unit: 'Min', access: false},
  {name: 'MOC Special Destinations', unit: 'Min', access: false},
  {name: 'MTC', unit: 'Min', access: false},
  {name: 'SMSMO', unit: 'SMS', access: false},
  {name: 'SMSMT', unit: 'SMS', access: false},
  {name: 'M2M', unit: 'MB', access: false},
  {name: 'NB-IoT', unit: 'MB', access: false},
  {name: 'LTE-M', unit: 'MB', access: false},
  {name: 'VoLTE', unit: 'MB', access: false},
  {name: 'ViLTE', unit: 'MB', access: false},
  {name: 'IMS Signalling', unit: 'MB', access: false},
  {name: 'GPRS', unit: 'MB', access: false},
  {name: 'Network Access', unit: 'IMSI', access: false},
];


export default new Vuex.Store({
  state: {
    // TEST DATA
    metadata,
    serviceConfiguration: SERVICE_CONFIGURATION,
    services: SERVICE_CONFIGURATION.map((x) => x.name),
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
