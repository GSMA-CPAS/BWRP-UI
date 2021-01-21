/* eslint-disable indent */
import {appAPI} from '../workspace';

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
      await appAPI
        .post('/tadig/codes', {code}, {withCredentials})
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
      await appAPI
        .get('/tadig/codes', {withCredentials})
        .then((codes) => {
          commit('UPDATE_CODES', codes.data);
        })
        .catch((e) => {});
    },
    async deleteCode(
      {commit, dispatch, rootGetters, getters, rootState, state},
      id,
    ) {
      await appAPI
        .delete(`/tadig/codes/${id}/`)
        .then(({status}) => {
          if (status === 200) {
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
