/* eslint-disable no-unused-vars */
import Vue from 'vue';
const userModule = {
  namespaced: true,
  state: () => ({identities: []}),
  mutations: {
    SET_USER(state, user) {
      Object.assign(state, user);
    },
    SET_IDENTITIES(state, identities) {
      state.identities = identities;
    },
  },
  actions: {
    // initialize user
    initializeUser({commit, dispatch, rootGetters, getters, rootState, state}) {
      const user = localStorage.getItem('appContext');
      if (user) {
        try {
          commit('SET_USER', JSON.parse(user));
        } catch (error) {
          console.error('Failed to parse user from local storage');
        }
      }
    },
    async loadIdentities({
      commit,
      dispatch,
      rootGetters,
      getters,
      rootState,
      state,
    }) {
      await Vue.axios.core
        .get('/users/self/identities', {
          withCredentials: true,
          loadingSpinner: true,
        })
        .then((data) => {
          commit('SET_IDENTITIES', data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  getters: {
    organizationMSPID: (state) => {
      return state.organization.mspid;
    },
    organizationTitle: (state) => {
      return state.organization.title;
    },
    isAdmin(state) {
      // TODO:
    },
  },
};
export default userModule;
