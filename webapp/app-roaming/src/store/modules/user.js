/* eslint-disable no-unused-vars */
const userModule = {
  namespaced: true,
  state: () => ({}),
  mutations: {
    SET_USER(state, user) {
      Object.assign(state, user);
    },
  },
  actions: {
    // initialize user
    initializeUser({
      commit,
      dispatch,
      rootGetters,
      getters,
      rootState,
      state,
    }) {
      const user = localStorage.getItem('appContext');
      if (user) {
        try {
          commit('SET_USER', JSON.parse(user));
        } catch (error) {
          console.error('Failed to parse user from local storage');
        }
      }
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
