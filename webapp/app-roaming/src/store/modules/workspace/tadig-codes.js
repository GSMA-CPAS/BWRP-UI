/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import Vue from 'vue';

const namespaced = true;
const withCredentials = true;
const tadigCodesModule = {
  namespaced,
  state: () => ({codes: []}),
  mutations: {
    UPDATE_CODES: (state, codes) => {
      state.codes = codes;
    },
  },
  actions: {
    async addCode(
      {commit, dispatch, rootGetters, getters, rootState, state},
      code,
    ) {
      await Vue.axios.local
        .post('/tadig/codes', code, {withCredentials})
        .then((res) => {
          dispatch('loadCodes');
        })
        .catch((e) => {});
    },
    async loadCodes({
      commit,
      dispatch,
      rootGetters,
      getters,
      rootState,
      state,
    }) {
      await Vue.axios.local
        .get('/tadig/codes', {withCredentials})
        .then((codes) => {
          commit('UPDATE_CODES', codes);
        })
        .catch((e) => {});
    },
    async deleteCode(
      {commit, dispatch, rootGetters, getters, rootState, state},
      id,
    ) {
      await Vue.axios.local
        .delete(`/tadig/codes/${id}/`)
        .then(({success}) => {
          if (success) {
            dispatch('loadCodes');
          }
        })
        .catch((e) => {});
    },
  },
  getters: {
    codes: (state) => {
      return state.codes.map(({code}) => code);
    },
  },
};
export default tadigCodesModule;
