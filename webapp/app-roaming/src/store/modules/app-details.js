const namespaced = true;
const appDetailsModule = {
  namespaced,
  state: () => ({}),
  mutations: {},
  actions: {},
  getters: {
    version: () => {
      return 'v.' + process.env.PACKAGE_VERSION;
    },
  },
};
export default appDetailsModule;
