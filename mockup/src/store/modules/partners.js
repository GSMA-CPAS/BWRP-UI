const partnersModule = {
  namespaced: true,
  state: () => [
    {
      mspid: "TMUS",
      name: "T-Mobile US",
    },
    {
      mspid: "GSMA",
      name: "GSM Association",
    },
  ],
  mutations: {},
  actions: {},
  getters: {
    list: (state) => {
      return state.map((partner) => `${partner.name} [${partner.mspid}]`);
    },
    selected: (state) => (input) => {
      return state.find(
        (partner) => `${partner.name} [${partner.mspid}]` === input
      );
    },
  },
};
export default partnersModule;
