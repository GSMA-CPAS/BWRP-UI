/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import Vue from 'vue';
import newDocumentModule from './document-submodules/NewDocument';
const {log} = console;
const namespaced = true;
const documentModule = {
  namespaced,
  state: () => ({document: null, signatures: []}),
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
    signDocument({commit, dispatch, rootGetters, getters, rootState, state}) {
      Vue.axios.commonAdapter
        .put(
          // `/signatures/` + state.document.documentId,
          `/signatures/` + state.document.contractId,
          {},
          {
            signing: true,
            withCredentials: true,
          },
        )
        .then((res) => {
          dispatch('app-state/signing', false, {root: true});
          dispatch('getSignatures', state.document.documentId);
        })
        .catch((err) => {
          dispatch('app-state/signing', false, {root: true});
          log(err);
        });
    },
    async getDocument(
      {commit, dispatch, rootGetters, getters, rootState, state},
      referenceId,
    ) {
      await Vue.axios.commonAdapter
        .get(`/documents/${referenceId}`, {withCredentials: true})
        .then((document) => {
          const {
            contractId,
            referenceId,
            creationDate,
            data,
            partnerMsp,
          } = document;
          const documentData = JSON.parse(data);
          commit('UPDATE_DOCUMENT', {
            contractId,
            referenceId,
            creationDate,
            data: documentData.body,
            header: documentData.header,
            partnerMsp,
          });
        })
        .catch((err) => {
          // dispatch(["app-state/loadError"], err);
        });
    },
    async getSignatures(
      {commit, dispatch, rootGetters, getters, rootState, state},
      referenceId,
    ) {
      const {selfMsp, partnerMsp} = state.document;
      const url = '' + `/signatures/${referenceId}/`;
      // const selfMspRequest = Vue.axios.commonAdapter.get(url + selfMsp);
      // const partnerMspRequest = Vue.axios.commonAdapter.get(url + partnerMsp);
      // to temporary fix path. we do not need /all
      // const signatures = Vue.axios.commonAdapter.get(url);
      await Vue.axios.commonAdapter
        // .all([selfMspRequest, partnerMspRequest], {
        .get(url, {
          withCredentials: true,
        })
        .then((data) => {
          commit('UPDATE_SIGNATURES', data);
          dispatch('app-state/setOverlay', false, {root: true});
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async loadData(
      {commit, dispatch, rootGetters, getters, rootState, state},
      referenceId,
    ) {
      await dispatch('getDocument', referenceId);
      await dispatch('getSignatures', referenceId);
    },
  },
  getters: {
    isSigned: (state, getters) => {
      const {selfMsp, partnerMsp} = getters;
      const minSignaturesFromMSP =
        state.document?.header.msps[selfMsp].minSignatures;
      const minSignaturesToMSP =
        state.document?.header.msps[partnerMsp].minSignatures;
      const totalSignatures =
        state.signatures.length > 0 &&
        state.signatures.reduce(
          (acc, curVal) => {
            acc[curVal.from]++;
            return acc;
          },
          {[getters.selfMsp]: 0, [partnerMsp]: 0},
        );
      const isSigned =
        minSignaturesFromMSP <= totalSignatures[selfMsp] &&
        minSignaturesToMSP <= totalSignatures[partnerMsp];
      return isSigned;
    },
    selfMsp: (state, getters, rootState, rootGetters) => {
      const selfMsp = rootGetters['user/organizationMSPID'];
      return selfMsp;
    },
    partnerMsp: (state) => {
      return state.document?.partnerMsp;
    },
    exists: (state) => (key) => {
      return state.document[key] ? true : false;
    },
    parties: (state, getters, rootState, rootGetters) => {
      const selfMsp = rootGetters['user/organizationMSPID'];
      const {partnerMsp} = state.document;
      return [selfMsp, partnerMsp];
    },
    contractId: (state) => {
      return state.document?.contractId;
    },
    creationDate: (state) => {
      return state.document?.creationDate;
    },
  },
  modules: {
    new: newDocumentModule,
  },
};
export default documentModule;
