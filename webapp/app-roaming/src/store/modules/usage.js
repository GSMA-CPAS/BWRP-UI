/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import Vue from 'vue';
const {log} = console;
const namespaced = true;

const usageModule = {
  namespaced,
  state: () => ({ownUsage: {}, partnerUsage: {}}),
  mutations: {
    UPDATE_USAGE: (state, usage) => {
        state.ownUsage = usage;
    },
    UPDATE_PARTNER_USAGE: (state, usage) => {
        state.partnerUsage = usage;
    },
  },
  actions: {
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
            referenceId
          } = data;
          if (req.isPartner) {
            commit('UPDATE_PARTNER_USAGE', {
              id: usageId,
              body: body,
              creationDate: creationDate,
              referenceId: referenceId
            });
          } else {
            commit('UPDATE_USAGE', {
              id: usageId,
              state: state,
              body: body,
              creationDate: creationDate,
              referenceId: referenceId
            });
          }
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
    }
  }

};
export default usageModule;
