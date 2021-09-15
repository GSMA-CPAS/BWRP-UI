/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import Vue from 'vue';
const {log} = console;
const namespaced = true;
const defaultTimelineCacheState = () => {
  return {
    currentTimeline: null,
    timelineHistory: {},
    rejectedUsages: [],
    rejectedUsagesIds: [],
  };
};
const timelineCache = {
  namespaced,
  state: () => defaultTimelineCacheState(),
  mutations: {
    RESET_STATE(state) {
      Object.assign(state, defaultTimelineCacheState());
    },
    UPDATE_USAGE_LIST(state, usages) {
      state.rejectedUsages = usages.reverse();
      state.rejectedUsages.forEach((usage) => {
        state.rejectedUsagesIds.push(usage.usageId);
      });
    },
    UPDATE_CURRENT_TIMELINE_CACHE_FIELD(state, {usageId, field, newValue}) {
      state.currentTimeline[field] = newValue;
    },
    UPDATE_TIMELINE_HISTORY_CACHE_FIELD(state, {usageId, field, newValue}) {
      state.timelineHistory[usageId][field] = newValue;
    },
    CREATE_NEW_TIMELINE_HISTORY_CACHE_ITEM(state, usageId) {
      state.timelineHistory[usageId] = {};
    },
    CREATE_NEW_CURRENT_TIMELINE_CACHE_ITEM(state) {
      state.currentTimeline = {};
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
    async loadDataFromCache(
      {commit, dispatch, rootGetters, getters, rootState, state},
      id,
    ) {
      const contractId = rootGetters['document/contractId'];

      dispatch('usage/resetData', contractId, {root: true});
      dispatch('settlement/resetData', contractId, {root: true});
      if (state.timelineHistory[id]) {
        await dispatch('loadTimelineData', state.timelineHistory[id]);
      } else if (!id) {
        console.log('New contract');
      } else {
        await dispatch(
          'usage/getUsageById',
          {contractId, usageId: id, isPartner: false},
          {root: true},
        );
      }
    },
    async updateCacheField(
      {commit, dispatch, rootGetters, getters, rootState, state},
      {usageId, field, newValue},
    ) {
      if (state.rejectedUsagesIds.includes(usageId)) {
        if (!state.timelineHistory[usageId]) {
          commit('CREATE_NEW_TIMELINE_HISTORY_CACHE_ITEM', usageId);
        }
        commit('UPDATE_TIMELINE_HISTORY_CACHE_FIELD', {
          usageId,
          field,
          newValue,
        });
      } else if (
        state.currentTimeline?.usageId === usageId ||
        !state.currentTimeline
      ) {
        if (!state.currentTimeline) {
          commit('CREATE_NEW_CURRENT_TIMELINE_CACHE_ITEM');
        }
        commit('UPDATE_CURRENT_TIMELINE_CACHE_FIELD', {
          usageId,
          field,
          newValue,
        });
      }
    },
    async loadTimelineData(
      {commit, dispatch, rootGetters, getters, rootState, state},
      item,
    ) {
      commit('usage/UPDATE_USAGE', item.ownUsage, {root: true});
      commit('usage/UPDATE_PARTNER_USAGE', item.partnerUsage, {root: true});
      commit('usage/UPDATE_DISCREPANCIES', item.usageDiscrepancies, {
        root: true,
      });
      commit('settlement/UPDATE_OWN_SETTLEMENT_ID', item.ownSettlementId, {
        root: true,
      });
      commit(
        'settlement/UPDATE_PARTNER_SETTLEMENT_ID',
        item.partnerSettlementId,
        {root: true},
      );
      commit('settlement/UPDATE_DISCREPANCIES', item.settlementDiscrepancies, {
        root: true,
      });
    },
  },
  getters: {
    usageIds: (state) => {
      return state.rejectedUsages;
    },
    currentUsageId: (state) => {
      return state.currentTimeline?.usageId;
    },
  },
};
export default timelineCache;
