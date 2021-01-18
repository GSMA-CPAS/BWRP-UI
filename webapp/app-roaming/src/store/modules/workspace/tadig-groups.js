/* eslint-disable indent */
import {appAPI} from '../workspace';

const namespaced = true;
const withCredentials = true;

const tadigGroupsModule = {
  namespaced,
  state: () => ({groups: []}),
  mutations: {
    UPDATE_GROUPS: (state, groups) => {
      state.groups = groups;
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
    async deleteGroup(
      {commit, dispatch, rootGetters, getters, rootState, state},
      id,
    ) {
      await appAPI
        .delete(`/tadig/groups/${id}/`)
        .then()
        .catch((e) => {});
    },
  },

  getters: {},
};
export default tadigGroupsModule;
