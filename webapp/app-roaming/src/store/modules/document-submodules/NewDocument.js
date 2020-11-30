/* eslint-disable no-unused-vars */
import router from '@/router';
import {PATHS} from '@/utils/Enums';
import Vue from 'vue';

const {log} = console;
const namespaced = true;

const defaultState = () => ({
  step: 1,
  partner: null,
  generalInformation: {
    name: null,
    type: null,
    startDate: null,
    endDate: null,
    prolongationLength: null,
    taxesIncluded: false,
    authors: null,
    userData: {
      currencyForAllDiscounts: null,
      tadigCodes: {codes: null, includeContractParty: false},
    },
    partnerData: {
      currencyForAllDiscounts: null,
      tadigCodes: {codes: null, includeContractParty: false},
    },
  },
});

const defaultBankDetailsState = () => ({
  currency: null,
  contactNameAccounting: null,
  contactPhoneAccounting: null,
  contactEmailAccounting: null,
  contactNameContract: null,
  contactPhoneContract: null,
  contactEmailContract: null,
  iban: null,
  swiftBic: null,
  bankName: null,
  bankAddress: null,
  bankAccountName: null,
});

const defaultSignaturesState = () => [
  {
    id: 'signature-0',
    name: null,
    role: null,
  },
];

const defaultDiscountModelsState = () => ({
  condition: null
});


const newDocumentModule = {
  namespaced,
  state: defaultState(),
  mutations: {
    updateGeneralInformation(state, payload) {
      const {key, value} = payload;
      state.generalInformation[key] = value;
    },
    updateBankDetails(state, payload) {
      const {key, value} = payload;
      Object.assign(state[key].bankDetails, value);
    },
    updateSignatures(state, payload) {
      const {key, value} = payload;
      Object.assign(state[key].signatures, value);
    },
    updateDiscountModels(state, payload) {
      const {key, value} = payload;
      Object.assign(state[key].discountModels, value);
    },
    DECREMENT_STEP(state) {
      state.step--;
    },
    INCREMENT_STEP(state) {
      state.step++;
    },
    SET_STEP(state, step) {
      state.step = step;
    },
    SET_PARTNER: (state, partner) => {
      state.partner = partner;
    },
    READ_JSON: (state, json) => {
      for (const key in json) {
        if (Object.prototype.hasOwnProperty.call(json, key)) {
          state[key] = json[key];
        }
      }
    },
    SAVE_DATA(state, payload) {
      const {key, data} = payload;
      state[key] = data;
    },
    resetState(state) {
      Object.assign(state, defaultState());
      // Object.assign(state.userData.bankDetails, defaultBankDetailsState());
      Object.assign(state.userData.signatures, defaultSignaturesState());
      Object.assign(state.userData.discountModels, defaultDiscountModelsState());
      // Object.assign(state.partnerData.bankDetails, defaultBankDetailsState());
      Object.assign(state.partnerData.signatures, defaultSignaturesState());
      Object.assign(state.partnerData.discountModels, defaultDiscountModelsState());
    },
  },
  actions: {
    startContract(
        {commit, dispatch, rootGetters, getters, rootState, state},
        payload,
    ) {
      const user = rootGetters['user/organizationMSPID'];
      const {partner, fileAsJSON} = payload;
      let index = 0;

      for (const key in fileAsJSON) {
        if (key === 'generalInformation') {
          continue;
        } else {
          Object.defineProperty(
              fileAsJSON,
            index === 0 ? 'userData' : 'partnerData',
            Object.getOwnPropertyDescriptor(fileAsJSON, key),
          );
          if (index === 0) {
            !(key === user) && delete fileAsJSON[key];
          } else if (index === 1) {
            !(key === partner) && delete fileAsJSON[key];
          }
        }
        index++;
      }
      commit('READ_JSON', fileAsJSON);
      commit('SET_PARTNER', partner);
    },
    nextStep({commit, dispatch, rootGetters, getters, rootState, state}) {
      commit('INCREMENT_STEP');
    },
    previousStep({commit, dispatch, rootGetters, getters, rootState, state}) {
      commit('DECREMENT_STEP');
    },
    setStep({commit, dispatch, rootGetters, getters, rootState, state}, step) {
      commit('SET_STEP', step);
    },
    saveContract({
      commit,
      dispatch,
      rootGetters,
      getters,
      rootState,
      state,
    }) {
      setTimeout(()=>{
        const data = getters.contract;
        const toMSP = getters.msps.partner;
        Vue.axios
            .post(
                '/documents',
                {type: 'contract', toMSP, data},
                {withCredentials: true},
            )
            .then((res) => {
              console.log(
                  `%c Successfully added new contract!`,
                  'color:#5cb85c; font-weight:800',
              );
              commit('resetState');
              router.push(PATHS.contracts);
            })
            .catch((err) => {
              console.log(err);
              router.push(PATHS.contracts);
            });
      }, 50);
    },
  },
  getters: {
    contract: (state, getters, rootState) => {
      const user = getters.msps.user;
      const {generalInformation, partner, partnerData, userData} = state;
      const {
        userData: gUserData,
        partnerData: gPartnerData,
        ...otherVariables
      } = generalInformation;


      const contract = {
        generalInformation: {
          otherVariables,
          [partner]: gPartnerData,
          [user]: gUserData,
        },
        [partner]: partnerData,
        [user]: userData,
      };
      return contract;
    },
    msps: (state, getters, rootState) => {
      return {
        user: rootState.user.organization.mspid,
        partner: state.partner,
      };
    },
  },
  modules: {
    partnerData: {
      namespaced,
      state: () => ({
        // bankDetails: defaultBankDetailsState(),
        signatures: defaultSignaturesState(),
        discountModels: defaultDiscountModelsState(),
      }),
    },
    userData: {
      namespaced,
      state: () => ({
        // bankDetails: defaultBankDetailsState(),
        signatures: defaultSignaturesState(),
        discountModels: defaultDiscountModelsState(),
      }),
    },
  },
};
export default newDocumentModule;
