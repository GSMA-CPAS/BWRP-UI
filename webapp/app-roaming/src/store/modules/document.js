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
            signing: true,
            withCredentials: true,
          }
        )
        .then((res) => {
          dispatch("app-state/signing", false, { root: true });
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
            header: documentData.header,
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
    isSigned: (state, getters) => {
      const { fromMSP, toMSP } = getters;
      const minSignaturesFromMSP =
        state.document?.header.msps[fromMSP].minSignatures;
      const minSignaturesToMSP =
        state.document?.header.msps[toMSP].minSignatures;
      const totalSignatures =
        getters.signatures.length > 0 &&
        getters.signatures.reduce(
          (acc, curVal) => {
            acc[curVal.from]++;
            return acc;
          },
          { [getters.fromMSP]: 0, [toMSP]: 0 }
        );
      const isSigned =
        minSignaturesFromMSP <= totalSignatures[fromMSP] &&
        minSignaturesToMSP <= totalSignatures[toMSP];
      return isSigned;
    },
    fromMSP: (state) => {
      return state.document?.fromMSP;
    },
    toMSP: (state) => {
      return state.document?.toMSP;
    },
    exists: (state) => (key) => {
      return state.document[key] ? true : false;
    },
    signatures: (state) => {
      const combinedSignatures = state.signatures?.map((signatures, index) => {
        const response = [];
        for (const key in signatures) {
          response.push(
            {
              signature: signatures[key].signature,
              from: index === 0 ? state.document.fromMSP : state.document.toMSP,
            }
            //   `${signatures[key].signature} from ${
            //   index === 0 ? state.document.fromMSP : state.document.toMSP
            // }`
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
        DECREMENT_STEP(state) {
          state.step--;
        },
        INCREMENT_STEP(state) {
          state.step++;
        },
        SET_STEP(state, step) {
          state.step = step;
        },
        SET_PARTNER: (state, partner) => {
          state.partner = partner;
        },
        READ_JSON: (state, json) => {
          for (const key in json) {
            state[key] = json[key];
          }
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
          const user = rootGetters["user/organizationMSPID"];
          const { partner, fileAsJSON } = payload;
          for (let key in fileAsJSON) {
            if (key === "generalInformation") {
              continue;
            } else {
              Object.entries(fileAsJSON[key]).forEach(
                ([key2, value], index) => {
                  Object.defineProperty(
                    fileAsJSON[key],
                    index === 0 ? user : partner,
                    Object.getOwnPropertyDescriptor(fileAsJSON[key], key2)
                  );
                  if (index === 0) {
                    !(key2 === user) && delete fileAsJSON[key][key2];
                  } else if (index === 1) {
                    !(key2 === partner) && delete fileAsJSON[key][key2];
                  }
                }
              );
            }
          }
          log(fileAsJSON);
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
        setStep(
          { commit, dispatch, rootGetters, getters, rootState, state },
          step
        ) {
          commit("SET_STEP", step);
        },
        async saveContract({
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
