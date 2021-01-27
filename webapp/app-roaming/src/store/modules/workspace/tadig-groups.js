/* eslint-disable indent */
import Vue from 'vue';

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
      await Vue.axios.local
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
      await Vue.axios.local
        .get('/tadig/groups', {withCredentials})
        .then((groups) => {
          commit('UPDATE_GROUPS', groups);
        })
        .catch((e) => {});
    },
    async loadGroupCodes(
      {commit, dispatch, rootGetters, getters, rootState, state},
      id,
    ) {
      await Vue.axios.local
        .get(`/tadig/groups/${id}`, {withCredentials})
        .then((groupCodes) => {
          commit('UPDATE_GROUP_CODES', groupCodes);
        })
        .catch((e) => {});
    },
    async addCodes(
      {commit, dispatch, rootGetters, getters, rootState, state},
      {id, codes},
    ) {
      await Vue.axios.local
        .post(`/tadig/groups/${id}/codes`, codes, {withCredentials})
        .then((res) => {
          dispatch('loadGroupCodes');
          console.log(res);
        })
        .catch((e) => {});
    },
    async removeCodes(
      {commit, dispatch, rootGetters, getters, rootState, state},
      {id, codes},
    ) {
      await Vue.axios.local
        .delete(`/tadig/groups/${id}/codes`, {data: codes}, {withCredentials})
        .then((res) => {
          dispatch('loadGroupCodes');
          console.log(res);
        })
        .catch((e) => {});
    },
    async deleteGroup(
      {commit, dispatch, rootGetters, getters, rootState, state},
      id,
    ) {
      await Vue.axios.local
        .delete(`/tadig/groups/${id}/`)
        .then(({success}) => {
          if (success) {
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
      await Vue.axios.local
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
