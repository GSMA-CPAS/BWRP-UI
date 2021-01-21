/* eslint-disable indent */
import {appAPI} from '../workspace';

const namespaced = true;
const withCredentials = true;

const tadigGroupsModule = {
  namespaced,
  state: () => ({groups: [], groupCodes: []}),
  mutations: {
    UPDATE_GROUPS: (state, groups) => {
      state.groups = groups;
    },
    UPDATE_GROUP_CODES: (state, codes) => {
      state.groupCodes = codes;
    },
  },
  actions: {
    async addGroup(
      {commit, dispatch, rootGetters, getters, rootState, state},
      group,
    ) {
      await appAPI
        .post('/tadig/groups', {name: group}, {withCredentials})
        .then((res) => {
          dispatch('loadGroups');
        })
        .catch((e) => {});
    },
    async loadGroups({
      commit,
      dispatch,
      rootGetters,
      getters,
      rootState,
      state,
    }) {
      // TODO:
      await appAPI
        .get('/tadig/groups', {withCredentials})
        .then((groups) => {
          commit('UPDATE_GROUPS', groups.data);
        })
        .catch((e) => {});
    },
    async loadGroupCodes(
      {commit, dispatch, rootGetters, getters, rootState, state},
      id,
    ) {
      await appAPI
        .get(`/tadig/groups/${id}`, {withCredentials})
        .then(({data}) => {
          commit('UPDATE_GROUP_CODES', data);
        })
        .catch((e) => {});
    },
    async addCodes(
      {commit, dispatch, rootGetters, getters, rootState, state},
      {id, codes},
    ) {
      await appAPI
        .post(`/tadig/groups/${id}/codes`, codes, {withCredentials})
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {});
    },
    async removeCodes(
      {commit, dispatch, rootGetters, getters, rootState, state},
      {id, codes},
    ) {
      await appAPI
        .delete(`/tadig/groups/${id}/codes`, {data: codes}, {withCredentials})
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {});
    },
    async deleteGroup(
      {commit, dispatch, rootGetters, getters, rootState, state},
      id,
    ) {
      await appAPI
        .delete(`/tadig/groups/${id}/`)
        .then(({status}) => {
          if (status === 200) {
            dispatch('loadGroups');
          }
        })
        .catch((e) => {});
    },
    async editGroup({
      commit,
      dispatch,
      rootGetters,
      getters,
      rootState,
      state,
    }) {
      // TODO:
      await appAPI
        .get('/tadig/groups', {withCredentials})
        .then((groups) => {
          commit('UPDATE_GROUPS', groups.data);
        })
        .catch((e) => {});
    },
  },

  getters: {},
};
export default tadigGroupsModule;
