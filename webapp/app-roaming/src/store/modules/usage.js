/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import Vue from 'vue';

const {log} = console;
const namespaced = true;
const defaultUsageState = () => {
  return {
    ownUsage: {},
    partnerUsage: {},
    discrepancies: {},
    signatures: {}
  };
};

const usageModule = {
  namespaced,
  state: () => (defaultUsageState()),
  mutations: {
    UPDATE_USAGE: (state, usage) => {
      state.ownUsage = usage;
    },
    UPDATE_PARTNER_USAGE: (state, usage) => {
      state.partnerUsage = usage;
    },
    UPDATE_DISCREPANCIES: (state, data) => {
      state.discrepancies = data;
    },
    UPDATE_USAGE_SIGNATURES: (state, data) => {
      state.signatures = data;
    },
    SET_USAGE_AS_APPROVED: (state) => {
      state.ownUsage.tag='APPROVED';
    },
    RESET_STATE(state) {
      Object.assign(state, defaultUsageState());
    },
  },
  actions: {
    async resetData(
        {commit, dispatch, rootGetters, getters, rootState, state}
    ) {
      commit('RESET_STATE');
    },
    async getUsages(
        {commit, dispatch, rootGetters, getters, rootState, state},
        contractId,
    ) {
      const url = `/usages/${contractId}/`;
      await Vue.axios.commonAdapter
          .get(url, {
            withCredentials: true,
          })
          .then((data) => {
            let currentUsage = {};
            if (data[0] && data[0].tag === 'REJECTED') {
              const contractId = rootGetters['document/contractId'];
              dispatch('usage/resetData', contractId, {root: true});
              dispatch('settlement/resetData', contractId, {root: true});
            } else if (data[0]) {
              currentUsage = data.shift();
              commit('UPDATE_USAGE', {
                id: currentUsage.usageId,
                state: currentUsage.state,
                partnerUsageId: currentUsage.partnerUsageId,
                tag: currentUsage.tag
              });
              dispatch('timelineCache/updateCacheField', {usageId: currentUsage.usageId, field: 'usageId', newValue: currentUsage.usageId}, {root: true});
              dispatch('getUsageById', {contractId, usageId: currentUsage.usageId, isPartner: false});
            }
            commit('timelineCache/UPDATE_USAGE_LIST', data.filter( (usage) => {
              return usage.state === 'SENT';
            }), {root: true});
            if (currentUsage.partnerUsageId) {
              commit('UPDATE_PARTNER_USAGE', {
                id: currentUsage.partnerUsageId
              });
              dispatch('timelineCache/updateCacheField', {usageId: currentUsage.usageId, field: 'partnerUsage', newValue: {id: currentUsage.partnerUsageId}}, {root: true});
            }
          })
          .catch((err) => {
            console.log(err);
          });
    },
    async getUsageById(
        {commit, dispatch, rootGetters, getters, rootState, state},
        req
    ) {
      const url = `/usages/${req.contractId}/${req.usageId}`;
      await Vue.axios.commonAdapter
          .get(url, {
            withCredentials: true,
          })
          .then((data) => {
            const {
              usageId,
              state,
              body,
              creationDate,
              referenceId,
              settlementId,
              partnerUsageId,
              tag
            } = data;
            if (req.isPartner) {
              commit('UPDATE_PARTNER_USAGE', {
                id: usageId,
                body: body,
                creationDate: creationDate,
                referenceId: referenceId,
                settlementId: settlementId,
                partnerUsageId: partnerUsageId,
                tag: tag
              });
              if (req.cacheItemId) {
                dispatch('timelineCache/updateCacheField', {usageId: req.cacheItemId, field: 'partnerUsage', newValue: data}, {root: true});
              }
              if (settlementId) {
                commit('settlement/UPDATE_PARTNER_SETTLEMENT_ID', settlementId, {root: true});
                if (req.cacheItemId)dispatch('timelineCache/updateCacheField', {usageId: req.cacheItemId, field: 'partnerSettlementId', newValue: settlementId}, {root: true});
              }
            } else {
              commit('UPDATE_USAGE', {
                id: usageId,
                state: state,
                body: body,
                creationDate: creationDate,
                referenceId: referenceId,
                settlementId: settlementId,
                partnerUsageId: partnerUsageId,
                tag: tag
              });
              dispatch('timelineCache/updateCacheField', {usageId: usageId, field: 'ownUsage', newValue: data}, {root: true});
              if (settlementId) {
                commit('settlement/UPDATE_OWN_SETTLEMENT_ID', settlementId, {root: true});
                dispatch('timelineCache/updateCacheField', {usageId: usageId, field: 'ownSettlementId', newValue: settlementId}, {root: true});
              }
              if (partnerUsageId && !state.partnerUsage?.id) {
                dispatch('getUsageById', {contractId: req.contractId, usageId: partnerUsageId, isPartner: true, cacheItemId: usageId});
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      if (state.ownUsage?.id && state.ownUsage?.state ==='SENT' && state.partnerUsage?.id) {
        dispatch('getUsageDiscrepancies');
      }
    },
    async getUsageDiscrepancies(
        {commit, dispatch, rootGetters, getters, rootState, state},
    ) {
      const contractId = rootGetters['document/contractId'];
      const ownSettlementId = rootGetters['settlement/ownSettlementId'];
      const partnerSettlementId = rootGetters['settlement/partnerSettlementId'];
      const url = `/usages/${contractId}/${state.ownUsage.id}/discrepancy/?partnerUsageId=${state.partnerUsage.id}`;
      await Vue.axios.commonAdapter
          .get(url, {
            withCredentials: true,
          })
          .then((data) => {
            commit('UPDATE_DISCREPANCIES', data);
            dispatch('timelineCache/updateCacheField', {usageId: state.ownUsage.id, field: 'usageDiscrepancies', newValue: data}, {root: true});

            if (ownSettlementId && partnerSettlementId) dispatch('settlement/getSettlementDiscrepancies', contractId, {root: true});
          })
          .catch((err) => {
            console.log(err);
          });
    },
    async uploadUsage({commit, dispatch, rootGetters, getters, rootState, state}, usage) {
      const contractId = rootGetters['document/contractId'];
      const header = {
        'type': 'usage',
        'version': '1.0'
      };
      const body = {'inbound': usage['inbound'], 'outbound': usage['outbound'],
      };
      await Vue.axios.commonAdapter
          .post(
              `/usages/` + contractId, {header: header, body: body}, {withCredentials: true}
          )
          .then((res) => {
            const {
              usageId,
              state,
              body,
              creationDate
            } = res;
            commit('UPDATE_USAGE', {
              id: usageId,
              state: state,
              body: body,
              creationDate: creationDate
            });
            dispatch('timelineCache/updateCacheField', {usageId: usageId, field: 'usageId', newValue: usageId}, {root: true});
            dispatch('timelineCache/updateCacheField', {usageId: usageId, field: 'ownUsage', newValue: res}, {root: true});
          })
          .catch((err) => {
            log(err);
          });
    },
    async sendUsage({commit, dispatch, rootGetters, getters, rootState, state}) {
      const contractId = rootGetters['document/contractId'];
      await Vue.axios.commonAdapter
          .put(
              `/usages/` + contractId + '/' + state.ownUsage.id + '/send/'
          )
          .then((res) => {
            const {
              usageId,
              state,
              body,
              creationDate
            } = res;
            commit('UPDATE_USAGE', {
              id: usageId,
              state: state,
              body: body,
              creationDate: creationDate
            });
            dispatch('timelineCache/updateCacheField', {usageId: usageId, field: 'ownUsage', newValue: res}, {root: true});
            dispatch('getUsageById', {contractId: contractId, usageId: usageId, isPartner: false, cacheItemId: usageId});
          })
          .catch((err) => {
            log(err);
          });
      if (state.partnerUsage?.id) {
        dispatch('getUsageDiscrepancies', this.contractId);
      }
    },
    async getUsageSignatures({commit, dispatch, rootGetters, getters, rootState, state}, id) {
      const contractId = rootGetters['document/contractId'];
      const ownUsageId = getters['ownUsageId'];
      const partnerUsageId = getters['partnerUsageId'];
      const selfMsp = rootGetters['user/organizationMSPID'];
      const partnerMsp = rootGetters['document/partnerMsp'];
      const signatures = [];
      let ownSignature = null;
      let partnerSignature = null;
      await Vue.axios.commonAdapter
          .get(
              `/usages/` + contractId + '/' + ownUsageId + '/signatures/'
          )
          .then((data) => {
            partnerSignature = data.filter((signature) => signature.state === 'SIGNED' && signature.msp === partnerMsp).pop();
            partnerSignature.usageOwner = selfMsp;
            signatures.push(partnerSignature);
          })
          .catch((err) => {
            log(err);
          });
      await Vue.axios.commonAdapter
          .get(
              `/usages/` + contractId + '/' + partnerUsageId + '/signatures/'
          )
          .then((data) => {
            ownSignature = data.filter((signature) => signature.state === 'SIGNED' && signature.msp === selfMsp).pop();
            ownSignature.usageOwner = partnerMsp;
            signatures.push(ownSignature);
          })
          .catch((err) => {
            log(err);
          });
      if (signatures.length === 2) {
        commit('SET_USAGE_AS_APPROVED');
      }
      commit('UPDATE_USAGE_SIGNATURES', signatures);
    },
    async signUsage(
        {commit, dispatch, rootGetters, getters, rootState, state},
        identity,
    ) {
      const contractId = rootGetters['document/contractId'];
      const partnerUsageId = getters['partnerUsageId'];

      Vue.axios.commonAdapter
          .put(
              `/usages/` + contractId +'/'+partnerUsageId+ `/signatures/`,
              {identity: identity},
              {
                loadingSpinner: true,
                withCredentials: true,
              },
          )
          .then((res) => {
            dispatch('getUsageSignatures', contractId);
          })
          .catch((err) => {
            log(err);
          });
    },

  },
  getters: {
    isUsageUploaded: (state) => {
      return state.ownUsage.id;
    },
    isUsageSent: (state) => {
      return state.ownUsage.state === 'SENT';
    },
    isPartnerUsageReceived: (state) => {
      return state.partnerUsage.body;
    },
    areUsagesExchanged: (state) => {
      return state.partnerUsage.body && state.ownUsage.state === 'SENT';
    },
    ownUsageId: (state) => {
      return state.ownUsage?.id;
    },
    partnerUsageId: (state) => {
      return state.partnerUsage?.id;
    },
    ownUsage: (state) => {
      return state.ownUsage;
    },
    partnerUsage: (state) => {
      return state.partnerUsage;
    },
    discrepancies: (state) => {
      return state.discrepancies;
    },
    totalUsageSignatures: (state, getters, rootState, rootGetters) => {
      const selfMsp = rootGetters['user/organizationMSPID'];
      const partnerMsp = rootGetters['document/partnerMsp'];
      return state.signatures?.length > 0
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
    },
    signedBySelf: (state, getters, rootState, rootGetters) => {
      const selfMsp = rootGetters['user/organizationMSPID'];
      const totalUsageSignatures = getters['totalUsageSignatures'];
      return 1 <= totalUsageSignatures[selfMsp];
    },
    isSigned: (state, rootGetters, getters) => {
      const partnerMsp = rootGetters['document/partnerMsp'];
      const totalUsageSignatures = getters['totalUsageSignatures'];
      const signedBySelf = getters['signedBySelf'];
      return signedBySelf && 1 <= totalUsageSignatures[partnerMsp];
    },
  }

};
export default usageModule;
