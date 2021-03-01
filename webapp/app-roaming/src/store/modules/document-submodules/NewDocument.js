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

const defaultSignaturesState = () => ({
  minSignatures: 2,
});
/* Old state
[
  {
    id: 'signature-0',
    name: null,
    role: null,
  },
]; */

const defaultDiscountModelsState = () => ({
  condition: null,
  serviceGroups: [
    {
      id: 'service-group-0',
      homeTadigs: {codes: []},
      visitorTadigs: {codes: []},
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
  ],
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
      // object: Object.assign(state[key].signatures.minSignatures, value);
      state[key].signatures.minSignatures = value;
    },
    updateDiscountModels(state, payload) {
      const {key, value} = payload;
      Object.assign(state[key].discountModels, value);
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
      Object.assign(
        state.userData.discountModels,
        defaultDiscountModelsState(),
      );
      // Object.assign(state.partnerData.bankDetails, defaultBankDetailsState());
      Object.assign(state.partnerData.signatures, defaultSignaturesState());
      Object.assign(
        state.partnerData.discountModels,
        defaultDiscountModelsState(),
      );
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

      if (fileAsJSON) {
        if (fileAsJSON.generalInformation) {
          loadedJson.generalInformation = fileAsJSON.generalInformation;

          if (loadedJson.generalInformation[user]) {
            loadedJson.generalInformation.userData =
              loadedJson.generalInformation[user];
            delete loadedJson.generalInformation[user];
          }

          if (loadedJson.generalInformation[partner]) {
            loadedJson.generalInformation.partnerData =
              loadedJson.generalInformation[partner];
            delete loadedJson.generalInformation[partner];
          }
        }

        if (fileAsJSON[user]) {
          loadedJson.userData = fileAsJSON[user];
        }

        if (fileAsJSON[partner]) {
          loadedJson.partnerData = fileAsJSON[partner];
        }

        if (loadedJson.generalInformation.startDate) {
          loadedJson.generalInformation.startDate = parseISOString(
            loadedJson.generalInformation.startDate,
          );
        }

        if (loadedJson.generalInformation.endDate) {
          loadedJson.generalInformation.endDate = parseISOString(
            loadedJson.generalInformation.endDate,
          );
        }
      }

      commit('READ_JSON', loadedJson);
      commit('SET_PARTNER', partner);
    },
    setStep(
      {commit, dispatch, rootGetters, getters, rootState, state},
      {index, totalSteps},
    ) {
      if (index === state.step) {
        commit('SET_STEP', totalSteps + 1);
      } else {
        commit('SET_STEP', index);
      }
    },
    saveContract({commit, dispatch, rootGetters, getters, rootState, state}) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const partnerMsp = getters.msps.partner;
            const user = getters.msps.user;

            const data = {
              header: {
                version: '1.0',
                type: 'contract',
                msps: {
                  [user]: {
                    minSignatures: state.userData.signatures.minSignatures,
                  },
                  [partnerMsp]: {
                    minSignatures: state.partnerData.signatures.minSignatures,
                  },
                },
              },
              body: convertModelsModule.convertUiModelToJsonModel(
                user,
                partnerMsp,
                getters.contract,
              ),
            };

            Vue.axios.commonAdapter
              .post('/documents', {partnerMsp, data}, {withCredentials: true})
              .then((res) => {
                log(
                  `%c Successfully added new contract!`,
                  'color:#5cb85c; font-weight:800',
                );
                resolve();
                commit('resetState');
                router.push(PATHS.contracts);
              })
              .catch((err) => {
                log(err);
                // reject(err);
              });
          } catch (err) {
            const error = {title: 'Missing values', body: err};
            reject(error);
          }
        }, 50);
      });
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
          ...otherVariables,
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
