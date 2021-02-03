/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import tadigGroups from './workspace/tadig-groups.js';
import tadigCodes from './workspace/tadig-codes.js';

const namespaced = true;
const workspaceModule = {
  namespaced,
  state: () => ({}),
  mutations: {},
  actions: {},
  getters: {},
  modules: {'tadig-groups': tadigGroups, 'tadig-codes': tadigCodes},
};
export default workspaceModule;
