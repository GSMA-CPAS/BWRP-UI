/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import Vue from 'vue';
const {log} = console;
const namespaced = true;
const defaultSettlementState = () => {
    return {
        ownSettlementId: null,
        partnerSettlementId: null,
        discrepancies: {},
        settlementStatus: null
    };
};
const settlementModule = {
    namespaced,
    state: () => (defaultSettlementState()),
    mutations: {
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
        UPDATE_STATUS(state, data) {
            state.discrepancies = data;
        },
        ACCEPT_DISCREPANCIES: (state) => {
            state.settlementStatus = 'Accepted';
        },
        DECLINE_DISCREPANCIES: (state) => {
            state.settlementStatus = 'Rejected';
        },
    },
    actions: {
        async resetData(
            {commit, dispatch, rootGetters, getters, rootState, state}
        ) {
            commit('RESET_STATE');
        },
        async generateSettlements(
            {commit, dispatch, rootGetters, getters, rootState, state}
        ) {
            await dispatch('generateOwnSettlement');
            await dispatch('generatePartnerSettlement');
        },
        async generateOwnSettlement(
            {commit, dispatch, rootGetters, getters, rootState, state}
        ) {
            const contractId = rootGetters['document/contractId'];
            const ownUsageId = rootGetters['usage/ownUsageId'];
            await Vue.axios.commonAdapter
                .put(
                    `/usages/` + contractId + '/' + ownUsageId + '/generate/'
                )
                .then((res) => {
                    commit('UPDATE_OWN_SETTLEMENT_ID', res.settlementId);
                    dispatch('timelineCache/updateCacheField', {usageId: ownUsageId, field: 'ownSettlementId', newValue: res.settlementId}, {root: true});
                    // commit('UPDATE_STATUS', res.status);
                    if (state.partnerSettlementId) {
                        dispatch('getSettlementDiscrepancies', contractId);
                    }
                })
                .catch((err) => {
                    log(err);
                });
        },
        async generatePartnerSettlement(
            {commit, dispatch, rootGetters, getters, rootState, state}
        ) {
            const contractId = rootGetters['document/contractId'];
            const ownUsageId = rootGetters['usage/ownUsageId'];
            const partnerUsageId = rootGetters['usage/partnerUsageId'];
            await Vue.axios.commonAdapter
                .put(
                    `/usages/` + contractId + '/' + partnerUsageId + '/generate/'
                )
                .then((res) => {
                    commit('UPDATE_PARTNER_SETTLEMENT_ID', res.settlementId);
                    dispatch('timelineCache/updateCacheField', {usageId: ownUsageId, field: 'partnerSettlementId', newValue: res.settlementId}, {root: true});

                    if (state.ownSettlementId) {
                        dispatch('getSettlementDiscrepancies', contractId);
                    }
                })
                .catch((err) => {
                    log(err);
                });
        },
        async getSettlementDiscrepancies(
            {commit, dispatch, rootGetters, getters, rootState, state}, contractId
        ) {
            const ownUsageId = rootGetters['usage/ownUsageId'];
            await Vue.axios.commonAdapter
                .get(
                    `/settlements/` + contractId + '/' + state.ownSettlementId + '/discrepancy/?partnerSettlementId=' + state.partnerSettlementId
                )
                .then((res) => {
                    commit('UPDATE_DISCREPANCIES', res);
                    dispatch('timelineCache/updateCacheField', {usageId: ownUsageId, field: 'settlementDiscrepancies', newValue: res}, {root: true});
                })
                .catch((err) => {
                    log(err);
                });
        },
        acceptDiscrepancies(
            {commit, dispatch, rootGetters, getters, rootState, state}
        ) {
            commit('ACCEPT_DISCREPANCIES');
        },
        declineDiscrepancies(
            {commit, dispatch, rootGetters, getters, rootState, state}
        ) {
            commit('DECLINE_DISCREPANCIES');
        },
    },
    getters: {
        areSettlementsGenerated: (state) => {
            return state.ownSettlementId && state.partnerSettlementId && state.discrepancies;
        },
        areDiscrepanciesCalculated: (state) => {
            return state.discrepancies.homePerspective && state.discrepancies.partnerPerspective;
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
    }
};
export default settlementModule;
