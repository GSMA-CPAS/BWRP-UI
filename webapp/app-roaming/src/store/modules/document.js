/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import Vue from 'vue';
import newDocumentModule from './document-submodules/NewDocument';
const {log} = console;
const namespaced = true;
const documentModule = {
  namespaced,
  state: () => ({rawData: null, document: null, signatures: [], usage: {usageId: null, usageState: null}, partnerUsage: {id: null}}),
  mutations: {
    UPDATE_RAW_DATA: (state, rawData) => {
      state.rawData = rawData;
    },
    UPDATE_DOCUMENT: (state, document) => {
      log(document);
      state.document = document;
    },
    UPDATE_SIGNATURES: (state, signatures) => {
      state.signatures = signatures;
    },
    UPDATE_USAGE: (state, usage) => {
      state.usage = usage;
    },
    UPDATE_PARTNER_USAGE: (state, partnerUsage) => {
      state.partnerUsage = partnerUsage;
    },
  },
  actions: {
    async signDocument({commit, dispatch, rootGetters, getters, rootState, state}, identity) {
      Vue.axios.commonAdapter
        .put(
          // `/signatures/` + state.document.documentId,
          `/signatures/` + state.document.contractId,
          {'identity': identity},
          {
            signing: true,
            withCredentials: true,
          },
        )
        .then((res) => {
          dispatch('app-state/signing', false, {root: true});
          dispatch('getSignatures', state.document.contractId);
        })
        .catch((err) => {
          dispatch('app-state/signing', false, {root: true});
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
    async getUsages(
      {commit, dispatch, rootGetters, getters, rootState, state},
      contractId,
    ) {
      const url = '' + `/usages/${contractId}/`;
      await Vue.axios.commonAdapter
          .get(url, {
            withCredentials: true,
          })
          .then((data) => {
            // TODO: usage should be overwritten by comA, for now taking latest usage uploaded
            if (data[0]) {
              const {
                usageId,
                state
              } = data[0];
              commit('UPDATE_USAGE', {
                usageId: usageId,
                usageState: state
              });
            } else {
              commit('UPDATE_USAGE', {
                usageId: null,
                usageState: null
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
    },
    async uploadUsage({commit, dispatch, rootGetters, getters, rootState, state}, usage) {
      const header = {
        'type': 'usage',
        'version': '1.0'
      };
      const body = {
        'inbound': usage['inbound'],
        'outbound': usage['outbound'],
      };
      await Vue.axios.commonAdapter
          .post(
              `/usages/` + state.document.contractId, {header: header, body: body}, {withCredentials: true}
          )
          .then((res) => {
            const {
              usageId,
              state
            } = res;
            commit('UPDATE_USAGE', {
              usageId: usageId,
              usageState: state
            });
          })
          .catch((err) => {
            log(err);
          });
    },
    async sendUsage({commit, dispatch, rootGetters, getters, rootState, state}) {
      console.log('uga');
      await Vue.axios.commonAdapter
          .put(
              `/usages/` + state.document.contractId + '/' + state.usage.usageId + '/send/'
          )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            log(err);
          });
    },
    async loadData(
      {commit, dispatch, rootGetters, getters, rootState, state},
      contractId,
    ) {
      await dispatch('getDocument', contractId);
      await dispatch('getSignatures', contractId);
      await dispatch('getUsages', contractId);
    },
  },
  getters: {
    minSignaturesSelf: (state, getters) => {
      return state.document?.header.msps[getters.selfMsp].minSignatures;
    },
    minSignaturesPartner: (state, getters) => {
      return state.document?.header.msps[getters.partnerMsp].minSignatures;
    },
    isSigned: (state, getters) => {
      const {
        selfMsp,
        totalSignatures,
        partnerMsp,
        minSignaturesSelf,
        minSignaturesPartner,
      } = getters;
      const isSigned =
        minSignaturesSelf <= totalSignatures[selfMsp] &&
        minSignaturesPartner <= totalSignatures[partnerMsp];
      return isSigned;
    },
    isUsageUploaded: (state, getters) => {
      console.log(state.usage);
      return state.usage.usageId;
    },
    isUsageSent: (state, getters) => {
      console.log(state.usage);
      return state.usage.usageState === 'SENT';
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
