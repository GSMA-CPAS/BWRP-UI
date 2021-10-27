/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import Vue from 'vue';
const {log} = console;
const namespaced = true;
const defaultSettlementState = () => {
  return {
    loading: false,
    ownSettlementId: null,
    partnerSettlementId: null,
    discrepancies: {},
    settlementStatus: null,
  };
};
const settlementModule = {
  namespaced,
  state: () => defaultSettlementState(),
  mutations: {
    setLoading(state, loading) {
      state.loading = loading;
    },
    RESET_STATE(state) {
      Object.assign(state, defaultSettlementState());
    },
    UPDATE_OWN_SETTLEMENT_ID(state, id) {
      state.ownSettlementId = id;
    },
    UPDATE_PARTNER_SETTLEMENT_ID(state, id) {
      state.partnerSettlementId = id;
    },
    UPDATE_DISCREPANCIES(state, data) {
      state.discrepancies = data;
    },
  },
  actions: {
    async resetData({
      commit,
      dispatch,
      rootGetters,
      getters,
      rootState,
      state,
    }) {
      commit('RESET_STATE');
    },
    async generateSettlements({
      commit,
      dispatch,
      rootGetters,
      getters,
      rootState,
      state,
    }) {
      await dispatch('generateOwnSettlement');
      await dispatch('generatePartnerSettlement');
    },
    async generateOwnSettlement({
      commit,
      dispatch,
      rootGetters,
      getters,
      rootState,
      state,
    }) {
      const contractId = rootGetters['document/contractId'];
      const ownUsageId = rootGetters['usage/ownUsageId'];
      commit('setLoading', true);
      await Vue.axios.commonAdapter
        .put(
          `/usages/` + contractId + '/' + ownUsageId + '/generate/',
          {},
          {
            customLoader: true,
          },
        )
        .then((res) => {
          commit('UPDATE_OWN_SETTLEMENT_ID', res.settlementId);
          dispatch(
            'timelineCache/updateCacheField',
            {
              usageId: ownUsageId,
              field: 'ownSettlementId',
              newValue: res.settlementId,
            },
            {root: true},
          );
          if (state.ownSettlementId && state.partnerSettlementId) {
            dispatch('getSettlementDiscrepancies', contractId);
          }
        })
        .catch((err) => {
          log(err);
        });
      commit('setLoading', false);
    },
    async generatePartnerSettlement({
      commit,
      dispatch,
      rootGetters,
      getters,
      rootState,
      state,
    }) {
      const contractId = rootGetters['document/contractId'];
      const ownUsageId = rootGetters['usage/ownUsageId'];
      const partnerUsageId = rootGetters['usage/partnerUsageId'];
      commit('setLoading', true);
      await Vue.axios.commonAdapter
        .put(
          `/usages/` + contractId + '/' + partnerUsageId + '/generate/',
          {},
          {
            customLoader: true,
          },
        )
        .then((res) => {
          commit('UPDATE_PARTNER_SETTLEMENT_ID', res.settlementId);
          dispatch(
            'timelineCache/updateCacheField',
            {
              usageId: ownUsageId,
              field: 'partnerSettlementId',
              newValue: res.settlementId,
            },
            {root: true},
          );

          if (state.ownSettlementId && state.partnerSettlementId) {
            dispatch('getSettlementDiscrepancies', contractId);
          }
        })
        .catch((err) => {
          log(err);
        });
      commit('setLoading', false);
    },
    async getSettlementDiscrepancies(
      {commit, dispatch, rootGetters, getters, rootState, state},
      contractId,
    ) {
      const ownUsageId = rootGetters['usage/ownUsageId'];
      commit('setLoading', true);
      await Vue.axios.commonAdapter
        .get(
          `/settlements/` +
            contractId +
            '/' +
            state.ownSettlementId +
            '/discrepancy/?partnerSettlementId=' +
            state.partnerSettlementId,
          {
            customLoader: true,
          },
        )
        .then((res) => {
          commit('UPDATE_DISCREPANCIES', res);
          dispatch(
            'timelineCache/updateCacheField',
            {
              usageId: ownUsageId,
              field: 'settlementDiscrepancies',
              newValue: res,
            },
            {root: true},
          );
          dispatch(
            'usage/getUsageSignatures',
            {usageId: ownUsageId},
            {root: true},
          );
        })
        .catch((err) => {
          log(err);
        });
      commit('setLoading', false);
    },
    async rejectDiscrepancies(
      {commit, dispatch, rootGetters, getters, rootState, state},
      req,
    ) {
      const contractId = rootGetters['document/contractId'];
      const ownUsageId = rootGetters['usage/ownUsageId'];
      const partnerUsageId = rootGetters['usage/partnerUsageId'];
      commit('setLoading', true);
      // ownUsage reject
      Vue.axios.commonAdapter
        .put(
          `/usages/` + contractId + '/' + ownUsageId + '/reject/',
          {},
          {
            customLoader: true,
          },
        )
        .then((res) => {})
        .catch((err) => {
          log(err);
        });
      // partnerUsage reject
      Vue.axios.commonAdapter
        .put(
          `/usages/` + contractId + '/' + partnerUsageId + '/reject/',
          {},
          {
            customLoader: true,
          },
        )
        .then((res) => {})
        .catch((err) => {
          log(err);
        });
      // ownSettlement reject
      Vue.axios.commonAdapter
        .put(
          `/settlements/` +
            contractId +
            '/' +
            state.ownSettlementId +
            '/reject/',
          {},
          {
            customLoader: true,
          },
        )
        .then((res) => {})
        .catch((err) => {
          log(err);
        });
      // partnerSettlement reject
      Vue.axios.commonAdapter
        .put(
          `/settlements/` +
            contractId +
            '/' +
            state.partnerSettlementId +
            '/reject/',
          {},
          {
            customLoader: true,
          },
        )
        .then((res) => {})
        .catch((err) => {
          log(err);
        });
      dispatch('usage/resetData', contractId, {root: true});
      dispatch('settlement/resetData', contractId, {root: true});
      dispatch('timelineCache/resetData', contractId, {root: true});
      dispatch('usage/getUsages', contractId, {root: true});
      commit('setLoading', false);
    },
  },
  getters: {
    areSettlementsGenerated: (state) => {
      return (
        state.ownSettlementId &&
        state.partnerSettlementId &&
        state.discrepancies
      );
    },
    areDiscrepanciesCalculated: (state) => {
      return (
        state.discrepancies.homePerspective &&
        state.discrepancies.partnerPerspective
      );
    },
    settlementStatus: (state) => {
      return state.settlementStatus;
    },
    ownSettlementId: (state) => {
      return state.ownSettlementId;
    },
    partnerSettlementId: (state) => {
      return state.partnerSettlementId;
    },
    discrepancies: (state) => {
      return state.discrepancies;
    },
  },
};
export default settlementModule;
