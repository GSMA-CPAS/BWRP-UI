import router from "@/router";
/* eslint-disable no-unused-vars */
import Vue from "vue";
import newDocumentModule from "./document-submodules/NewDocument";
const { log } = console;
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
    new: newDocumentModule,
  },
};
export default documentModule;
