/* eslint-disable no-unused-vars */
import {PATHS, CONTRACT_STATE, DISCREPANCIES_STATUS} from "../../utils/Enums";
import Vue from "vue";
import { v4 as uuidv4 } from "uuid";

const defaultNewContractState = () => {
  return {
    step: 1,
    partner: null,
    generalInformation: null,
    bankDetails: null,
    signatures: null,
    discountModels: null,
    taps: null,
    contractStatus: CONTRACT_STATE.CONTRACT_NOT_SIGNED,
    discrepanciesStatus: DISCREPANCIES_STATUS.UNDEFINED
  };
};

const namespaced = true;
const contractModule = {
  namespaced,
  state: () => ({
    _cid: null,
    generalInformation: {},
    bankDetails: {},
    signatures: [],
    discountModels: {},
    taps: [],
    parties: [],
    contractStatus: CONTRACT_STATE.CONTRACT_NOT_SIGNED,
    discrepanciesStatus: DISCREPANCIES_STATUS.UNDEFINED
  }),
  mutations: {
    LOAD_CONTRACT: (state, contract) => {
      for (const key in contract) {
        const element = contract[key];
        state[key] = element;
      }
    },
    UPGRADE_CONTRACT_STATE: (state) => {
      state.contractStatus++;
    },
    UPLOAD_USAGE_REPORT: (state) => {
      state.contractStatus = CONTRACT_STATE.USAGE_REPORT_UPLOADED;
    },
    ACCEPT_DISCREPANCIES: (state) => {
      state.discrepanciesStatus = DISCREPANCIES_STATUS.ACCEPTED;
    },
    DECLINE_DISCREPANCIES: (state) => {
      state.discrepanciesStatus = DISCREPANCIES_STATUS.DECLINED;
    },
    SEND_USAGE: (state) => {
      state.contractStatus = CONTRACT_STATE.READY_FOR_SETTLEMENT_CALCULATION;
    }

  },
  actions: {
    loadContract(
      { commit, dispatch, rootGetters, getters, rootState, state },
      _cid
    ) {
      //TODO: Connection to API & get real data
      const contract = rootState.contracts.find(
        (contract) => contract._cid === _cid
      );
      commit("LOAD_CONTRACT", contract);
    },
    signContract(
        { commit, dispatch, rootGetters, getters, rootState, state },
        _cid
    ) {
      if(state.contractStatus === CONTRACT_STATE.CONTRACT_NOT_SIGNED){
        commit("UPGRADE_CONTRACT_STATE")
      }
    },
    onUsageReportUploaded(
        { commit, dispatch, rootGetters, getters, rootState, state },
        _cid
    ) {
      if(state.contractStatus < CONTRACT_STATE.CALCULATION_COMPLETED){
        commit("UPLOAD_USAGE_REPORT")
      }
    },
    upgradeContractState(
        { commit, dispatch, rootGetters, getters, rootState, state },
        _cid
    ) {
        commit("UPGRADE_CONTRACT_STATE")
    },
    acceptDiscrepancies(
        { commit, dispatch, rootGetters, getters, rootState, state },
        _cid
    ) {
        commit("ACCEPT_DISCREPANCIES")
    },
    declineDiscrepancies(
        { commit, dispatch, rootGetters, getters, rootState, state },
        _cid
    ) {
      commit("DECLINE_DISCREPANCIES")
    },
    sendUsage(
        { commit, dispatch, rootGetters, getters, rootState, state },
        _cid
    ) {
      commit("SEND_USAGE")
    }
  },
  getters: {
    signatures: (state, getters) => {
      const mspids = getters.partyMspids;
      const signatures = state.signatures;
      return mspids.map((mspid) => signatures[mspid]);
    },
    partyNames: (state) => {
      return state.parties.map(({ name }) => name);
    },
    partyMspids: (state) => {
      return state.parties.map(({ mspid }) => mspid);
    },
    name: (state) => {
      return state.generalInformation.name;
    },
    isSigned: (state) => {
      return state.contractStatus >= CONTRACT_STATE.USAGE_REPORT_NOT_UPLOADED;
    },
    contractState: (state) => {
      return state.contractStatus;
    },
    discrepanciesStatus: (state) => {
      return state.discrepanciesStatus;
    }
  },
  modules: {
    edit: {
      namespaced,
      state: () => ({}),
      mutations: {},
      actions: {},
      getters: {},
      modules: {},
    },
    new: {
      namespaced,
      state: defaultNewContractState(),
      mutations: {
        SET_PARTNER: (state, partner) => {
          state.partner = partner;
        },
        READ_JSON: (state, json) => {
          for (const key in json) {
            state[key] = json[key];
          }
        },
        INCREMENT_STEP(state) {
          state.step++;
        },
        DECREMENT_STEP(state) {
          state.step--;
        },
        SAVE_DATA(state, payload) {
          const { key, data } = payload;
          state[key] = data;
        },
        RESET_STATE(state) {
          Object.assign(state, defaultNewContractState());
        },
      },
      actions: {
        startContract(
          { commit, dispatch, rootGetters, getters, rootState, state },
          payload
        ) {
          const { partner, fileAsJSON } = payload;
          commit("READ_JSON", fileAsJSON);
          commit("SET_PARTNER", rootGetters["partners/selected"](partner));
        },
        nextStep(
          { commit, dispatch, rootGetters, getters, rootState, state },
          payload
        ) {
          commit("INCREMENT_STEP");
          commit("SAVE_DATA", payload);
        },
        previousStep({
          commit,
          dispatch,
          rootGetters,
          getters,
          rootState,
          state,
        }) {
          commit("DECREMENT_STEP");
        },
        addContract({
          commit,
          dispatch,
          rootGetters,
          getters,
          rootState,
          state,
        }) {
          //TODO:
          const _cid = uuidv4();
          const {
            generalInformation,
            bankDetails,
            signatures,
            taps,
            discountModels,
            partner,
          } = state;
          const contract = {
            _cid,
            generalInformation,
            bankDetails,
            signatures,
            discountModels,
            taps,
            parties: [partner, rootState.user],
          };
          const name = generalInformation.name;
          const lastModification = new Date();
          const { mspid, name: partnerName } = partner;
          const netPosition = null;
          const status = "Awaiting Approval";
          const metadata = {
            _cid,
            name,
            lastModification,
            partner: `${partnerName} [${mspid}]`,
            netPosition,
            status,
          };
          commit("ADD_METADATA", metadata, { root: true });
          commit("ADD_CONTRACT", contract, { root: true });
          dispatch("resetState");
        },
        resetState({ commit, dispatch }) {
          commit("RESET_STATE");
        },
      },
      getters: {
        contract: (state) => {
          return state;
        },
        state: (state) => (key) => {
          return state[key];
        },
        partyMspids: (state, getters, rootState) => {
          return { user: rootState.user.mspid, partner: state.partner.mspid };
        },
        partyNames: (state, getters, rootState) => {
          return { user: rootState.user.name, partner: state.partner.name };
        },
      },
      modules: {},
    },
  },
};
export default contractModule;
