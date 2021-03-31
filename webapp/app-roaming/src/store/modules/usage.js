/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import Vue from 'vue';
const {log} = console;
const namespaced = true;
const defaultUsageState = () => {
  return {
    ownUsage: {},
    partnerUsage: {},
    discrepancies: {}
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
          // TODO: usage should be overwritten by comA, for now taking latest usage uploaded
          const {
            usageId,
            state
          } = data[0]? data[0] : {};
          commit('UPDATE_USAGE', {
            id: usageId,
            state: state
          });
        })
        .catch((err) => {
          console.log(err);
        });
      if (state.ownUsage.id) {
        await dispatch('getUsageById', {contractId, usageId: state.ownUsage.id, isPartner: false});
      }
    },
    async getPartnerUsage(
        {commit, dispatch, rootGetters, getters, rootState, state},
        contractId,
    ) {
      const url = `/usages/${contractId}/?states=RECEIVED`;
      await Vue.axios.commonAdapter
        .get(url, {
            withCredentials: true,
        })
        .then((data) => {
          // TODO: usage should be overwritten by comA, for now taking latest usage uploaded
          const {
            usageId,
            referenceId
          } = data[0]? data[0] : {};
          commit('UPDATE_PARTNER_USAGE', {
            id: usageId,
            referenceId: referenceId
          });
        })
        .catch((err) => {
            console.log(err);
        });
      if (state.partnerUsage.id) {
          await dispatch('getUsageById', {contractId, usageId: state.partnerUsage.id, isPartner: true});
      }
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
            settlementId
          } = data;
          if (req.isPartner) {
            commit('UPDATE_PARTNER_USAGE', {
              id: usageId,
              body: body,
              creationDate: creationDate,
              referenceId: referenceId,
              settlementId: settlementId
            });
            if (settlementId) {
              commit('settlement/UPDATE_PARTNER_SETTLEMENT_ID', settlementId, {root: true});
            }
          } else {
            commit('UPDATE_USAGE', {
              id: usageId,
              state: state,
              body: body,
              creationDate: creationDate,
              referenceId: referenceId,
              settlementId: settlementId
            });
            if (settlementId) {
              commit('settlement/UPDATE_OWN_SETTLEMENT_ID', settlementId, {root: true});
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
      const url = `/usages/${contractId}/${state.ownUsage.id}/discrepancy/?partnerUsageId=${state.partnerUsage.id}`;
      await Vue.axios.commonAdapter
        .get(url, {
            withCredentials: true,
        })
        .then((data) => {
          commit('UPDATE_DISCREPANCIES', data);
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
        })
        .catch((err) => {
            log(err);
        });
      if (state.partnerUsage?.id) {
        dispatch('getUsageDiscrepancies', this.contractId);
      }
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
  }

};
export default usageModule;