import axios from 'axios';

import tadigGroups from './workspace/tadig-groups.js';
import tadigCodes from './workspace/tadig-codes.js';

const appAPI = axios.create({
  baseURL: '/api/app-roaming/',
});

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
export {appAPI};
