/* eslint-disable no-unused-vars */
import router from '@/router';
import {PATHS} from '@/utils/Enums';
import Vue from 'vue';
import convertModelsModule from './convert-models';

const {log} = console;
const namespaced = true;

function parseISOString(s) {
  const b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

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
  condition: null,
  serviceGroups: [
    {
      id: 'service-group-0',
      homeTadigs: [],
      visitorTadigs: [],
      chosenServices: [
        {
          id: 'service-0',
          name: null,
          rate: null,
          unit: null,
          balancedRate: null,
          unbalancedRate: null,
          pricingModel: 'Normal',
          accessPricingModel: 'Not Charged',
          accessPricingUnit: null,
          accessPricingRate: null,
        },
      ],
    },
  ]
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

      const loadedJson = {};

      if ( fileAsJSON ) {
        if ( fileAsJSON.generalInformation ) {
          loadedJson.generalInformation = fileAsJSON.generalInformation;

          if ( loadedJson.generalInformation[user] ) {
            loadedJson.generalInformation.userData = loadedJson.generalInformation[user];
            delete loadedJson.generalInformation[user];
          }

          if ( loadedJson.generalInformation[partner] ) {
            loadedJson.generalInformation.partnerData = loadedJson.generalInformation[partner];
            delete loadedJson.generalInformation[partner];
          }
        }

        if ( fileAsJSON[user] ) {
          loadedJson.userData = fileAsJSON[user];
        }

        if ( fileAsJSON[partner] ) {
          loadedJson.partnerData = fileAsJSON[partner];
        }

        if ( loadedJson.generalInformation.startDate ) {
          loadedJson.generalInformation.startDate = parseISOString(loadedJson.generalInformation.startDate);
        }

        if ( loadedJson.generalInformation.endDate ) {
          loadedJson.generalInformation.endDate = parseISOString(loadedJson.generalInformation.endDate);
        }
      }


      commit('READ_JSON', loadedJson);
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
      return new Promise((resolve, reject) => {
        setTimeout(()=>{
          try {
            // const data = getters.deal;
            const data = {
              'header': {
                'version': '1.0',
                'type': 'deal',
                'msps': {}
              },
              'body': getters.deal
            };
            const toMSP = getters.msps.partner;
            const user = getters.msps.user;
            data.header.msps[getters.msps.user] = {minSignatures: 2};
            data.header.msps[toMSP] = {minSignatures: 2};
            data.body = convertModelsModule.convertUiModelToJsonModel(user, toMSP, data.body);
            Vue.axios
                .post(
                    '/documents',
                    {toMSP, data},
                    {withCredentials: true},
                )
                .then((res) => {
                  console.log(
                      `%c Successfully added new deal!`,
                      'color:#5cb85c; font-weight:800',
                  );
                  resolve();
                  commit('resetState');
                  router.push(PATHS.deals);
                })
                .catch((err) => {
                  console.log(err);
                  reject(err);
                  router.push(PATHS.deals);
                });
          } catch (err) {
            reject(err);
          }
        }, 50);
      });
    },
  },
  getters: {
    deal: (state, getters, rootState) => {
      const user = getters.msps.user;
      const {generalInformation, partner, partnerData, userData} = state;
      const {
        userData: gUserData,
        partnerData: gPartnerData,
        ...otherVariables
      } = generalInformation;


      const deal = {
        generalInformation: {
          ...otherVariables,
          [partner]: gPartnerData,
          [user]: gUserData,
        },
        [partner]: partnerData,
        [user]: userData,
      };
      return deal;
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
