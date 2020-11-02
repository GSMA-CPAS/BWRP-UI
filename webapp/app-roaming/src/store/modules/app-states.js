const appStateModule = {
  namespaced: true,
  state: () => ({
    isLoading: false,
    errorResponse: null,
    showError: false,
    signing: false,
  }),
  mutations: {
    SET_ERROR: (state, error) => {
      state.errorResponse = error;
    },
    SET_ERROR_VISIBILITY: (state, isVisible) => {
      state.showError = isVisible;
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
    SET_SIGNING: (state, signing) => {
      state.signing = signing;
    },
    SET_OVERLAY: (state, showOverlay) => {
      state.showOverlay = showOverlay;
    },
  },
  actions: {
    loadError({ commit, dispatch }, error) {
      commit("SET_ERROR", error);
      dispatch("setErrorVisibility", true);
      commit("SET_LOADING", false);
    },
    loading({ commit }, isLoading) {
      commit("SET_LOADING", isLoading);
    },
    setErrorVisibility({ commit }, isVisible) {
      commit("SET_ERROR_VISIBILITY", isVisible);
    },
    setOverlay({ commit }, showOverlay) {
      commit("SET_OVERLAY", showOverlay);
    },
    signing({ commit }, signing) {
      commit("SET_SIGNING", signing);
    },
  },
  getters: {},
};
export default appStateModule;
