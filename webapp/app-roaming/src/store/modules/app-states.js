const appStateModule = {
  namespaced: true,
  state: () => ({
    isLoading: false,
    errorResponse: null,
    showError: false,
  }),
  mutations: {
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
    SET_ERROR: (state, error) => {
      state.errorResponse = error;
    },
    SET_ERROR_VISIBILITY: (state, isVisible) => {
      state.showError = isVisible;
    },
  },
  actions: {
    loading({ commit }, isLoading) {
      commit("SET_LOADING", isLoading);
    },
    loadError({ commit, dispatch }, error) {
      commit("SET_ERROR", error);
      dispatch("setErrorVisibility", true);
      commit("SET_LOADING", false);
    },
    setErrorVisibility({ commit }, isVisible) {
      commit("SET_ERROR_VISIBILITY", isVisible);
    },
  },
  getters: {},
};
export default appStateModule;
