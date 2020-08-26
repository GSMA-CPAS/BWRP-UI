/* eslint-disable no-unused-vars */
const userModule = {
  namespaced: true,
  state: () => ({
    mspid: "DTAG",
    name: "Deutsche Telekom AG",
    //   canSignDocument: false
  }),
  mutations: {
    login(state) {
      //TODO:
    },
  },
  actions: {
    //TODO:
    login(context) {},
  },
  getters: {
    mspid: (state) => {
      return state.mspid;
    },
    name: (state) => {
      return state.mspid;
    },
    isAdmin(state) {
      //TODO:
    },
  },
};
export default userModule;
