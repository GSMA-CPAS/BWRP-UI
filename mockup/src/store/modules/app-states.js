const appStateModule = {
  namespaced: true,
  state: () => ({
    isLoading: false,
    errorMessage: "",
    showErrorMessage: false,
  }),
  mutations: {
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
    SET_MESSAGE_VISIBILITY(state, show) {
      state.showErrorMessage = show;
    },
    SET_ERROR_MESSAGE: (state, message) => {
      state.errorMessage = message;
    },
  },
  actions: {
    loading({ commit }, isLoading) {
      commit("SET_LOADING", isLoading);
    },
    loadError({ commit }, message) {
      commit("SET_ERROR_MESSAGE", message);
      commit("SET_MESSAGE_VISIBILITY", true);
    },
    closeErrorMessage({ commit }) {
      commit("SET_MESSAGE_VISIBILITY", false);
    },
  },
  getters: {},
};
export default appStateModule;
