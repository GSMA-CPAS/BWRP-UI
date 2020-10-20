/* eslint-disable no-unused-vars */
import Vue from "vue";

const partnersModule = {
  namespaced: true,
  state: () => [],
  mutations: {
    INIT: (state, payload) => {
      Object.assign(state, payload);
    },
  },
  actions: {
    loadPartners({ commit, dispatch, rootGetters, getters, rootState, state }) {
      Vue.axios
        .get("/network/discovery/msps", { withCredentials: true })
        .then((data) => {
          const parsedData = data;

          const affiliatedOrganization = rootGetters["user/organizationMSPID"];
          const exclude = ["OrdererMSP", "GSMA", affiliatedOrganization];

          const partners = Vue.lodash.difference(parsedData, exclude);

          commit("INIT", partners);
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        });
    },
  },
  getters: {
    list: (state) => {
      return state;
    },
    selected: (state) => (input) => {
      return input;
    },
  },
};
export default partnersModule;
