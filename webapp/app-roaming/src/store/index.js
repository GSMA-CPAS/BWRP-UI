/* eslint-disable no-unused-vars */
import Vue from "vue";
import Vuex from "vuex";
import allModules from "./modules/all-modules";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // TEST DATA
    documents: [],
    services: [
      "MOC",
      "MOC Local",
      "MOC Back Home",
      "MOC EU/EEA",
      "MOC RoW",
      "MOC Premium/Satellite",
      "MOC Special Destinations",
      "MTC",
      "SMS",
      "Data",
    ],
  },
  mutations: {
    LOAD_DOCUMENTS: (state, documents) => {
      state.documents = documents;
    },
  },
  actions: {
    setup({ commit, dispatch, rootGetters, getters, rootState, state }) {
      const { request, response } = Vue.axios.interceptors;
      request.use(
        (config) => {
          const { method, baseURL, url } = config;
          console.log(
            `%c Made ${method} request to ${baseURL + url}`,
            "color:green; font-weight:800"
          );
          dispatch("app-state/loading", true);
          return config;
        },
        (error) => {
          dispatch("app-state/loadError", error);
          return Promise.reject(error);
        }
      );
      response.use(
        (response) => {
          dispatch("app-state/loading", false);
          try {
            return JSON.parse(response.data);
          } catch {
            return response.data;
          }
        },
        (error) => {
          if (error.response?.status === 401) {
            parent.postMessage("unauthorized", "*");
          }
          dispatch("app-state/loadError", error.response);
          return Promise.reject(error);
        }
      );

      dispatch("user/initializeUser");
      dispatch("loadDocuments");
    },
    loadDocuments({
      commit,
      dispatch,
      rootGetters,
      getters,
      rootState,
      state,
    }) {
      Vue.axios
        .get("/documents", { withCredentials: true })
        .then((res) => {
          commit("LOAD_DOCUMENTS", res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  modules: allModules,
  getters: {},
});
