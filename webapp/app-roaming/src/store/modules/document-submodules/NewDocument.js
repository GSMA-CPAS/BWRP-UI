/* eslint-disable no-unused-vars */
import router from '@/router';
import {PATHS} from '@/utils/Enums';
import Vue from 'vue';
import convertModelsModule from './convert-models';
import {service} from '@/components/pages/create-contract/step-components/discount-form-components/Service.vue';
import {transform} from 'node-json-transform';

const log = console.log;
const namespaced = true;

function parseISOString(s) {
  const b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

const defaultState = () => ({
  step: 1,
  validation: [],
  saveAttempt: false,
  partner: null,
  generalInformation: {
    name: null,
    /*   deprecrated:  type: null, */
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

/* deprecated

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
}); */

const defaultSignaturesState = () => ({
  minSignatures: 2,
});
/* Old signature state
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
          ...service,
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
      // Object.assign(state[key].discountModels, value);
      state[key].discountModels = value;
    },
    addValidation: (state, validation) => {
      if (!state.validation.find((val) => validation.key === val.key)) {
        state.validation.push(validation);
      } else {
        state.validation = [
          ...state.validation.filter((val) => validation.key !== val.key),
          validation,
        ];
      }
    },
    updateValidation: (state, {key, isInvalid, validate}) => {
      const newState = state.validation.find((val) => key === val.key);
      if (newState) {
        newState.isInvalid = isInvalid;
        state.validation = [
          ...state.validation.filter((val) => key !== val.key),
          newState,
        ];
      }
    },
    attemptedToSave(state) {
      state.saveAttempt = true;
    },
    SET_STEP(state, step) {
      state.step = step;
    },
    SET_PARTNER: (state, partner) => {
      state.partner = partner;
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
    convertJsonModelToUiModel(
      {commit, dispatch, rootGetters, getters, rootState, state},
      data,
    ) {
      /** @type Array */
      const parties = data?.body.framework.contractParties;
      const user = getters.msps.user;
      const partner = parties.filter((val) => val !== user)[0];

      const userMspIncluded = parties.includes(user);

      const generalInformationMap = {
        name: 'metadata.name',
        startDate: 'framework.term.start',
        endDate: 'framework.term.end',
        prolongationLength: 'framework.term.prolongation',
        taxesIncluded: 'framework.payment.taxesIncluded',
        authors: 'metadata.authors',
        userData: {
          currencyForAllDiscounts: `framework.partyInformation.${user}.contractCurrency`,
          tadigCodes: {
            codes: `framework.partyInformation.${user}.defaultTadigCodes`,
            includeContractParty: `framework.partyInformation.${user}.alsoContractParty`,
          },
        },
        partnerData: {
          currencyForAllDiscounts: `framework.partyInformation.${partner}.contractCurrency`,
          tadigCodes: {
            codes: `framework.partyInformation.${partner}.defaultTadigCodes`,
            includeContractParty: `framework.partyInformation.${partner}.alsoContractParty`,
          },
        },
      };

      if (userMspIncluded) {
        const map = {
          item: {
            ...generalInformationMap,
          },
          operate: [
            {
              run: function(val) {
                return new Date(val);
              },
              on: 'startDate',
            },
            {
              run: function(val) {
                return new Date(val);
              },
              on: 'endDate',
            },
          ],
        };
        const res = transform(data.body, map);
        commit('SAVE_DATA', {key: 'generalInformation', data: res});
      } else {
        dispatch(
          'app-state/loadError',
          {
            title: 'No matching MSPs',
            code: `${user}s MSP doesn't match imported JSON.`,
          },
          {root: true},
        );
        const map = {
          item: {
            ...generalInformationMap,
          },
          defaults: {
            missingData: true,
          },
          operate: [
            {
              run: function(val) {
                return new Date(val);
              },
              on: 'startDate',
            },
            {
              run: function(val) {
                return new Date(val);
              },
              on: 'endDate',
            },
            {
              run: (val) => null,
              on: 'userData.currencyForAllDiscounts',
            },
            {
              run: (val) => [],
              on: 'userData.tadigCodes.codes',
            },
            {
              run: (val) => false,
              on: 'userData.tadigCodes.includeContractParty',
            },
            {
              run: (val) => null,
              on: 'partnerData.currencyForAllDiscounts',
            },
            {
              run: (val) => [],
              on: 'partnerData.tadigCodes.codes',
            },
            {
              run: (val) => false,
              on: 'partnerData.tadigCodes.includeContractParty',
            },
          ],
        };
        const res = transform(data.body, map);
        commit('SAVE_DATA', {key: 'generalInformation', data: res});
      }
    },
    convertUiModelToJsonModel(
      {commit, dispatch, rootGetters, getters, rootState, state},
      payload,
    ) {},
    startContract(
      {commit, dispatch, rootGetters, getters, rootState, state},
      payload,
    ) {
      const user = rootGetters['user/organizationMSPID'];
      const {partner, fileAsJSON} = payload;
      fileAsJSON && dispatch('convertJsonModelToUiModel', fileAsJSON);

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
      const errorMessages = [];
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            state.validation.forEach(
              ({step, from, isInvalid, message, validate}) => {
                if (isInvalid) {
                  errorMessages.push({step, from, message: `${message}`});
                  validate();
                }
              },
            );
            if (errorMessages.length > 0) {
              commit('attemptedToSave');
              throw new Error();
            }
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
            const error = {
              title: 'Missing values',
              body: errorMessages.length > 0 ? errorMessages : err,
            };
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
