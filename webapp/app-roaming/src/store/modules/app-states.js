const appStateModule = {
  namespaced: true,
  state: () => ({
    isLoading: false,
    errorResponse: null,
    showError: false,
    loadingSpinner: false,
    customLoader: false,
  }),
  mutations: {
    customLoader: (state, loader) => {
      state.customLoader = loader;
    },
    SET_ERROR: (state, error) => {
      state.errorResponse = error;
    },
    SET_ERROR_VISIBILITY: (state, isVisible) => {
      state.showError = isVisible;
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
    SET_LOADING_SPINNER: (state, loadingSpinner) => {
      state.loadingSpinner = loadingSpinner;
    },
    SET_OVERLAY: (state, showOverlay) => {
      state.showOverlay = showOverlay;
    },
  },
  actions: {
    loadError({commit, dispatch}, error) {
      commit('SET_ERROR', error);
      dispatch('setErrorVisibility', true);
      commit('SET_LOADING', false);
    },
    loading({commit}, isLoading) {
      commit('SET_LOADING', isLoading);
    },
    setErrorVisibility({commit}, isVisible) {
      commit('SET_ERROR_VISIBILITY', isVisible);
    },
    setOverlay({commit}, showOverlay) {
      commit('SET_OVERLAY', showOverlay);
    },
    loadingSpinner({commit}, loadingSpinner) {
      commit('SET_LOADING_SPINNER', loadingSpinner);
    },
  },
  getters: {},
};
export default appStateModule;
