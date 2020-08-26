/* eslint-disable no-unused-vars */
import Vue from "vue";
import Vuex from "vuex";
import allModules from "./modules/all-modules";
import contracts from "../assets/dummy/json/contracts.json";
import metadata from "../assets/dummy/json/metadata.json";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // TEST DATA
    metadata,
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
    // TODO: contracts won't be needed since the server will get the needed data, replace accordingly at ContractsTable.vue
    contracts,
  },
  mutations: {
    ADD_METADATA: (state, newEntry) => {
      state.metadata.push(newEntry);
    },
    ADD_CONTRACT: (state, newEntry) => {
      state.contracts.push(newEntry);
    },
    LOAD_METADATA: (state, metadata) => {
      state.metadata = metadata;
    },
  },
  actions: {
    loadMetadata({ commit, dispatch, rootGetters, getters, rootState, state }) {
      //TODO: GET metadata OR contracts & map to format [name,partner,lastModification,netPosition,status]
      Vue.axios.get("/metadata").then(({ data }) => {
        commit("LOAD_METADATA", data);
      });
    },
  },
  modules: allModules,
  getters: {},
});
