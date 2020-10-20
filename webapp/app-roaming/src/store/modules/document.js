/* eslint-disable no-unused-vars */
import Vue from "vue";
const { log } = console;
const defaultNewContractState = () => {
  return {
    step: 1,
    partner: null,
    generalInformation: null,
    bankDetails: null,
    signatures: null,
    discountModels: null,
    taps: null,
  };
};

const namespaced = true;
const documentModule = {
  namespaced,
  state: () => ({ document: null, signatures: null }),
  mutations: {
    UPDATE_DOCUMENT: (state, document) => {
      state.document = document;
    },
    UPDATE_SIGNATURES: (state, signatures) => {
      state.signatures = signatures;
    },
  },
  actions: {
    signDocument({ commit, dispatch, rootGetters, getters, rootState, state }) {
      // console.log(rootState.user);
      console.log(state);
      Vue.axios
        .put(
          `/signatures/` + state.document.documentId,
          {},
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          log(res);
        })
        .catch((err) => {
          log(err);
        });
    },
    loadData(
      { commit, dispatch, rootGetters, getters, rootState, state },
      dID
    ) {
      //TODO: Connection to API & get real data
      Vue.axios
        .get(`/documents/${dID}`, { withCredentials: true })
        .then((data) => {
          const documentData = JSON.parse(data.data);
          commit("UPDATE_DOCUMENT", {
            id: data.id,
            documentId: data.documentId,
            data: documentData.body.data
          });
        })
        .catch((err) => {
          // dispatch(["app-state/loadError"], err);
        });
      Vue.axios
        .get(`/signatures/${dID}/${rootState.user.organization.mspid}`, {
          withCredentials: true,
        })
        .then((data) => {
          commit("UPDATE_SIGNATURES", data);
          log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  getters: {
    exists: (state) => (key) => {
      return state.document[key] ? true : false;
    },
    signatures: (state) => {
      const signatures = [];
      for (const key in state.signatures) {
        const signature = state.signatures[key].signature;
        signatures.push(signature);
      }
      return signatures.length > 1 ? signatures : null;
    },
    parties: (state) => {
      const { fromMSP, toMSP } = state.document;
      return [fromMSP, toMSP];
    },
    name: (state) => {
      return state.document?.id;
    },
  },
  modules: {
    new: {
      namespaced,
      state: defaultNewContractState(),
      mutations: {
        SET_PARTNER: (state, partner) => {
          state.partner = partner;
        },
        READ_JSON: (state, json) => {
          for (const key in json) {
            state[key] = json[key];
          }
        },
        INCREMENT_STEP(state) {
          state.step++;
        },
        DECREMENT_STEP(state) {
          state.step--;
        },
        SAVE_DATA(state, payload) {
          const { key, data } = payload;
          state[key] = data;
        },
        RESET_STATE(state) {
          Object.assign(state, defaultNewContractState());
        },
      },
      actions: {
        startContract(
          { commit, dispatch, rootGetters, getters, rootState, state },
          payload
        ) {
          const { partner, fileAsJSON } = payload;
          commit("READ_JSON", fileAsJSON);
          commit("SET_PARTNER", partner);
        },
        nextStep(
          { commit, dispatch, rootGetters, getters, rootState, state },
          payload
        ) {
          commit("INCREMENT_STEP");
          commit("SAVE_DATA", payload);
        },
        previousStep({
          commit,
          dispatch,
          rootGetters,
          getters,
          rootState,
          state,
        }) {
          commit("DECREMENT_STEP");
        },
        addContract({
          commit,
          dispatch,
          rootGetters,
          getters,
          rootState,
          state,
        }) {
          //TODO:
          const {
            generalInformation,
            bankDetails,
            signatures,
            taps,
            discountModels,
            partner,
          } = state;
          const contract = {
            generalInformation,
            bankDetails,
            signatures,
            discountModels,
            taps,
            parties: [partner, rootState.user],
          };

          Vue.axios
            .post(
              "/documents",
              { type: 'contract', toMSP: partner, data: contract },
              { withCredentials: true }
            )
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
          dispatch("resetState");
        },
        resetState({ commit, dispatch }) {
          commit("RESET_STATE");
        },
      },
      getters: {
        contract: (state) => {
          return state;
        },
        state: (state) => (key) => {
          return state[key];
        },
        partyMspids: (state, getters, rootState) => {
          return { user: rootState.user.mspid, partner: state.partner.mspid };
        },
        partyNames: (state, getters, rootState) => {
          return {
            user: rootState.user.organization.mspid,
            partner: state.partner,
          };
        },
      },
      modules: {},
    },
  },
};
export default documentModule;
