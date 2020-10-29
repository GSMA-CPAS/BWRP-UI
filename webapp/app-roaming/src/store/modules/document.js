import router from "@/router";
import { PATHS } from "@/utils/Enums";
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
      log(document);
      state.document = document;
    },
    UPDATE_SIGNATURES: (state, signatures) => {
      state.signatures = signatures;
    },
  },
  actions: {
    signDocument({ commit, dispatch, rootGetters, getters, rootState, state }) {
      Vue.axios
        .put(
          `/signatures/` + state.document.documentId,
          {},
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          dispatch("getSignatures");
        })
        .catch((err) => {
          log(err);
        });
    },
    async getDocument({
      commit,
      dispatch,
      rootGetters,
      getters,
      rootState,
      state,
    }) {
      await Vue.axios
        .get(`/documents/${getters.documentID}`, { withCredentials: true })
        .then((document) => {
          const { id, documentId, data, fromMSP, toMSP } = document;
          const documentData = JSON.parse(data);
          commit("UPDATE_DOCUMENT", {
            id,
            documentId,
            data: documentData.body,
            fromMSP,
            toMSP,
          });
        })
        .catch((err) => {
          // dispatch(["app-state/loadError"], err);
        });
    },
    getSignatures({
      commit,
      dispatch,
      rootGetters,
      getters,
      rootState,
      state,
    }) {
      const { fromMSP, toMSP } = state.document;
      const url = "" + `/signatures/${getters.documentID}/`;
      const fromMSPRequest = Vue.axios.get(url + fromMSP);
      const toMSPRequest = Vue.axios.get(url + toMSP);
      Vue.axios
        .all([fromMSPRequest, toMSPRequest], {
          withCredentials: true,
        })
        .then((data) => {
          commit("UPDATE_SIGNATURES", data);
          dispatch("app-state/setOverlay", false, { root: true });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async loadData({
      commit,
      dispatch,
      rootGetters,
      getters,
      rootState,
      state,
    }) {
      await dispatch("getDocument");
      dispatch("getSignatures");
    },
  },
  getters: {
    documentID() {
      return router.currentRoute.params.cid;
    },
    exists: (state) => (key) => {
      return state.document[key] ? true : false;
    },
    signatures: (state) => {
      const combinedSignatures = state.signatures?.map((signatures, index) => {
        const response = [];
        for (const key in signatures) {
          response.push(
            `${signatures[key].signature} from ${
              index === 0 ? state.document.fromMSP : state.document.toMSP
            }`
          );
        }
        return response;
      });

      return Vue.lodash.flatten(combinedSignatures);
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
        async addContract({
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
          };

          await Vue.axios
            .post(
              "/documents",
              { type: "contract", toMSP: partner, data: contract },
              { withCredentials: true }
            )
            .then((res) => {
              console.log(
                `%c Successfully added new contract!`,
                "color:#5cb85c; font-weight:800"
              );
              router.push(PATHS.contracts);
            })
            .catch((err) => {
              console.log(err);
              router.push(PATHS.contracts);
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
        msps: (state, getters, rootState) => {
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
