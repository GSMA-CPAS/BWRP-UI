/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import Vue from 'vue';
const {log} = console;
const namespaced = true;
const defaultSettlementState = () => {
    return {
        ownSettlementId: null,
        partnerSettlementId: null,
        discrepancies: {}
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
            console.log(state);
        },
        UPDATE_PARTNER_SETTLEMENT_ID(state, id) {
            state.partnerSettlementId = id;
            console.log(state);
        },
        UPDATE_DISCREPANCIES(state, data) {
            state.discrepancies = data;
            console.log(state);
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
            const partnerUsageId = rootGetters['usage/partnerUsageId'];
            await Vue.axios.commonAdapter
                .put(
                    `/usages/` + contractId + '/' + partnerUsageId + '/generate/'
                )
                .then((res) => {
                    commit('UPDATE_PARTNER_SETTLEMENT_ID', res.settlementId);
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
            await Vue.axios.commonAdapter
                .get(
                    `/settlements/` + contractId + '/' + state.ownSettlementId + '/discrepancy/?partnerSettlementId=' + state.partnerSettlementId
                )
                .then((res) => {
                    commit('UPDATE_DISCREPANCIES', res);
                })
                .catch((err) => {
                    log(err);
                });
        },
    },
    getters: {
        areSettlementsGenerated: (state) => {
            return state.ownSettlementId && state.partnerSettlementId;
        }
    }
};
export default settlementModule;
