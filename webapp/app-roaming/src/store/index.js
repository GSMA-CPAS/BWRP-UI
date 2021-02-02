/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Vuex from 'vuex';
import allModules from './modules/all-modules';

Vue.use(Vuex);

const SERVICE_CONFIGURATION = {
  'MOC Back Home': {unit: 'Min', access: false},
  'MOC Local': {unit: 'Min', access: false},
  'MOC International': {unit: 'Min', access: false},
  'MOC EU': {unit: 'Min', access: false},
  'MOC EEA': {unit: 'Min', access: false},
  'MOC RoW': {unit: 'Min', access: false},
  'MOC Premium': {unit: 'Min', access: false},
  'MOC Satellite': {unit: 'Min', access: false},
  'MOC Video Telephony': {unit: 'Min', access: false},
  'MOC Special Destinations': {unit: 'Min', access: false},
  'MTC': {unit: 'Min', access: false},
  'SMSMO': {unit: 'SMS', access: false},
  'SMSMT': {unit: 'SMS', access: false},
  'M2M': {unit: 'MB', access: true, accessUnit: 'IMSI'},
  'NB-IoT': {unit: 'MB', access: true, accessUnit: 'IMSI'},
  'LTE-M': {unit: 'MB', access: true, accessUnit: 'IMSI'},
  'VoLTE': {unit: 'MB', access: false},
  'ViLTE': {unit: 'MB', access: false},
  'IMS Signalling': {unit: 'MB', access: false},
  'GPRS': {unit: 'MB', access: false},
  'Network Access': {unit: 'IMSI', access: false},
};

const SERVICE_ORDER = [
  'MOC Back Home',
  'MOC Local',
  'MOC International',
  'MOC EU',
  'MOC EEA',
  'MOC RoW',
  'MOC Premium',
  'MOC Satellite',
  'MOC Video Telephony',
  'MOC Special Destinations',
  'MTC',
  'SMSMO',
  'SMSMT',
  'M2M',
  'NB-IoT',
  'LTE-M',
  'VoLTE',
  'ViLTE',
  'IMS Signalling',
  'GPRS',
  'Network Access',
];

export default new Vuex.Store({
  state: {
    serviceConfiguration: SERVICE_CONFIGURATION,
    services: SERVICE_ORDER,
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
