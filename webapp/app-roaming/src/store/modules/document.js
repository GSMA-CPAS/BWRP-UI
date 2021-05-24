/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import Vue from 'vue';
import newDocumentModule from './document-submodules/NewDocument';
const {log} = console;
const namespaced = true;
const documentModule = {
  namespaced,
  state: () => ({rawData: null, document: null, signatures: []}),
  mutations: {
    UPDATE_RAW_DATA: (state, rawData) => {
      state.rawData = rawData;
    },
    UPDATE_DOCUMENT: (state, document) => {
      state.document = document;
    },
    UPDATE_SIGNATURES: (state, signatures) => {
      state.signatures = signatures;
    },
  },
  actions: {
    async signDocument(
      {commit, dispatch, rootGetters, getters, rootState, state},
      identity,
    ) {
      Vue.axios.commonAdapter
        .put(
          `/signatures/` + state.document.contractId,
          {identity: identity},
          {
            loadingSpinner: true,
            withCredentials: true,
          },
        )
        .then((res) => {
          dispatch('getSignatures', state.document.contractId);
        })
        .catch((err) => {
          log(err);
        });
    },
    async getDocument(
      {commit, dispatch, rootGetters, getters, rootState, state},
      contractId,
    ) {
      await Vue.axios.commonAdapter
        .get(`/documents/${contractId}`, {withCredentials: true})
        .then((document) => {
          const {
            contractId,
            referenceId,
            blockchainRef,
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
            blockchainRef,
          });
        })
        .catch((err) => {
          dispatch(['app-state/loadError'], err);
        });
      await Vue.axios.commonAdapter
        .get(`/documents/${contractId}/?format=RAW`, {withCredentials: true})
        .then((document) => {
          commit('UPDATE_RAW_DATA', document);
        })
        .catch((err) => {
          dispatch(['app-state/loadError'], err);
        });
    },
    async getSignatures(
      {commit, dispatch, rootGetters, getters, rootState, state},
      contractId,
    ) {
      const {selfMsp, partnerMsp} = state.document;
      const url = '' + `/signatures/${contractId}/`;
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
      contractId,
    ) {
      await dispatch('usage/resetData', contractId, {root: true});
      await dispatch('timelineCache/resetData', contractId, {root: true});
      await dispatch('settlement/resetData', contractId, {root: true});
      await dispatch('getDocument', contractId);
      await dispatch('usage/getUsages', contractId, {root: true});
      await dispatch('getSignatures', contractId);
    },
  },
  getters: {
    minSignaturesSelf: (state, getters) => {
      return state.document?.header.msps[getters.selfMsp].minSignatures;
    },
    minSignaturesPartner: (state, getters) => {
      return state.document?.header.msps[getters.partnerMsp].minSignatures;
    },
    signedBySelf: (state, getters) => {
      const {selfMsp, totalSignatures, minSignaturesSelf} = getters;
      const isSigned = minSignaturesSelf <= totalSignatures[selfMsp];
      return isSigned;
    },
    isSigned: (state, getters) => {
      const {
        totalSignatures,
        partnerMsp,
        minSignaturesPartner,
        signedBySelf,
      } = getters;
      const isSigned =
        signedBySelf && minSignaturesPartner <= totalSignatures[partnerMsp];
      return isSigned;
    },
    totalSignatures: (state, getters) => {
      const {selfMsp, partnerMsp} = getters;
      const totalSignatures =
        state.signatures?.length > 0
          ? state.signatures?.reduce(
              (acc, {msp, state}) => {
                if (msp === selfMsp && state === 'SIGNED') {
                  acc[selfMsp]++;
                } else if (msp === partnerMsp && state === 'SIGNED') {
                  acc[partnerMsp]++;
                }
                return acc;
              },
              {
                [selfMsp]: 0,
                [partnerMsp]: 0,
              },
            )
          : {
              [selfMsp]: 0,
              [partnerMsp]: 0,
            };
      return totalSignatures;
    },
    selfMsp: (state, getters, rootState, rootGetters) => {
      const selfMsp = rootGetters['user/organizationMSPID'];
      return selfMsp;
    },
    partnerMsp: (state) => {
      return state.document?.partnerMsp;
    },
    selfContractTadigs: (state, getters, rootState, rootGetters) => {
      const selfMsp = rootGetters['user/organizationMSPID'];
      return state.document.data.framework.partyInformation[selfMsp].defaultTadigCodes;
    },
    partnerContractTadigs: (state) => {
      return state.document.data.framework.partyInformation[state.document?.partnerMsp].defaultTadigCodes;
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
