/* eslint-disable quote-props */
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
  MTC: {unit: 'Min', access: false},
  SMSMO: {unit: 'SMS', access: false},
  SMSMT: {unit: 'SMS', access: false},
  M2M: {unit: 'MB', access: true, accessUnit: 'IMSI'},
  'NB-IoT': {unit: 'MB', access: true, accessUnit: 'IMSI'},
  'LTE-M': {unit: 'MB', access: true, accessUnit: 'IMSI'},
  VoLTE: {unit: 'MB', access: false},
  ViLTE: {unit: 'MB', access: false},
  'IMS Signalling': {unit: 'MB', access: false},
  GPRS: {unit: 'MB', access: false},
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
    documents: [],
    partners: [],
    serviceConfiguration: SERVICE_CONFIGURATION,
    services: SERVICE_ORDER,
  },
  mutations: {
    LOAD_DOCUMENTS: (state, documents) => {
      state.documents = documents;
    },
    SET_PARTNERS: (state, partners) => {
      state.partners = partners;
    },
  },
  actions: {
    setup({commit, dispatch, rootGetters, getters, rootState, state}) {
      const csrfToken = parent?.document
        ?.querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');
      for (const key in Vue.axios) {
        if (Object.hasOwnProperty.call(Vue.axios, key)) {
          if (csrfToken) {
            Vue.axios[key].defaults.headers.common['X-CSRF-Token'] = csrfToken;
          }
          const {request, response} = Vue.axios[key].interceptors;
          request.use(
            (config) => {
              const {
                method,
                baseURL,
                url,
                loadingSpinner,
                customLoader = false,
              } = config;
              console.log(
                `%c Made ${method} request to ${baseURL + url}`,
                'color:green; font-weight:800',
              );
              commit('app-state/setDocumentLoading', true);
              if (!customLoader) {
                loadingSpinner
                  ? dispatch('app-state/loadingSpinner', true)
                  : dispatch('app-state/loading', true);
              }
              return config;
            },
            (error) => {
              dispatch('app-state/loadError', {
                title: error.statusText,
                code: `Status code ${error.status}`,
              });
              return Promise.reject(error);
            },
          );
          response.use(
            (response) => {
              commit('app-state/setDocumentLoading', false);
              dispatch('app-state/loading', false);
              dispatch('app-state/loadingSpinner', false);
              try {
                return JSON.parse(response.data);
              } catch {
                return response.data;
              }
            },
            (error) => {
              commit('app-state/setDocumentLoading', false);
              if (error.response?.status === 401) {
                parent.postMessage('unauthorized', '*');
              }
              let errorMessage =
                'The application has encountered an unknown error';
              if (error.response?.data) {
                errorMessage = error.response.data.message;
              } else {
                if (error.message) {
                  errorMessage = error.message;
                }
              }
              dispatch('app-state/loadError', {
                title: 'Oops! Something went wrong!',
                code: errorMessage,
              });
              dispatch('app-state/loadingSpinner', false);
              return Promise.reject(error);
            },
          );
        }
      }

      dispatch('user/initializeUser');
      dispatch('loadDocuments');
    },
    async loadDocuments({
      commit,
      dispatch,
      rootGetters,
      getters,
      rootState,
      state,
    }) {
      await Vue.axios.commonAdapter
        .get('/documents', {withCredentials: true})
        .then((res) => {
          commit('LOAD_DOCUMENTS', res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async loadPartners({
      commit,
      dispatch,
      rootGetters,
      getters,
      rootState,
      state,
    }) {
      if (state.partners.length === 0) {
        await Vue.axios.commonAdapter
          .get('/discovery/msps', {withCredentials: true, loadingSpinner: true})
          .then((data) => {
            const parsedData = data;
            const affiliatedOrganization =
              rootGetters['user/organizationMSPID'];
            const exclude = ['OrdererMSP', 'GSMA', affiliatedOrganization];

            const partners = Vue.lodash.difference(parsedData, exclude);

            commit('SET_PARTNERS', partners);
          })
          .catch(function(error) {
            // TODO: handle error
            console.log(error);
          });
      }
    },
  },
  modules: allModules,
  getters: {},
});
