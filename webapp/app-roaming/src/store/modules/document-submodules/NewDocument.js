/* eslint-disable no-unused-vars */
import router from '@/router';
import {PATHS} from '@/utils/Enums';
import Vue from 'vue';
import convertModelsModule from './convert-models';
import {service} from '@pages/create-contract/step-components/discount-form-components/Service.vue';
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
      state[key].signatures.minSignatures = value;
    },
    updateDiscountModels(state, payload) {
      const {key, data} = payload;
      state[key].discountModels = data;
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
    removeValidation: (state, {key, from, groupIndex, step}) => {
      let index = 0;
      state.validation = [
        ...state.validation
          .filter((val) => key !== val.key)
          .map((val) => {
            if (
              val.step === step &&
              val.from === from &&
              val.groupIndex === groupIndex
            ) {
              const newKey = `Group-${groupIndex} | Service ${index++}-${from}`;
              val.key = newKey;
              val.message = `${newKey} is missing a name and/or a pricing model`;
            }
            return val;
          }),
      ];
    },
    removeValidationsOfGroup(state, {index, from, step}) {
      state.validation = [
        ...state.validation.filter(
          (val) =>
            !(
              val.step === step &&
              val.from === from &&
              val.groupIndex === index
            ),
        ),
      ];
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
    uploadData(state, payload) {
      const {key, data} = payload;
      state[key] = data;
    },
    resetState(state) {
      Object.assign(state, defaultState());
      Object.assign(state.userData.signatures, defaultSignaturesState());
      Object.assign(
        state.userData.discountModels,
        defaultDiscountModelsState(),
      );
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
      try {
        /** @type Array */
        const parties = data?.body.framework.contractParties;
        const user = getters.msps.user;
        const partner = parties.filter((val) => val !== user)[0];

        const headerData = data?.header;
        const userMspIncluded = parties.includes(user);

        const generalInformationMap = {
          item: {
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
          },
          operate: [
            {
              run: function(val) {
                return val ? new Date(val) : null;
              },
              on: 'startDate',
            },
            {
              run: function(val) {
                return val ? new Date(val) : null;
              },
              on: 'endDate',
            },
          ],
        };

        if (userMspIncluded) {
          const discountModelsMap = {
            item: {
              condition: `condition`,
              serviceGroups: 'serviceGroups',
            },
            operate: [
              {
                run: /** @param {Array} services */ function(services) {
                  const mappedServices = services.map(
                    ({homeTadigs, visitorTadigs, services}, index) => ({
                      id: `service-group-${index}`,
                      homeTadigs: {codes: homeTadigs},
                      visitorTadigs: {codes: visitorTadigs},
                      chosenServices: services.map(
                        (
                          {service, usagePricing, includedInCommitment},
                          index,
                        ) => {
                          const mappedService = {
                            id: `service-${index}`,
                            name: service,
                            includedInCommitment,
                            rate: null,
                            unit: null,
                            balancedRate: null,
                            unbalancedRate: null,
                            pricingModel: null,
                            prevDefaultUnit: null,
                            prevDefaultAccessUnit: null,
                            accessPricingModel: null,
                            accessPricingUnit: null,
                            accessPricingRate: null,
                          };
                          if (usagePricing) {
                            const {unit, ratingPlan} = usagePricing;
                            const {
                              rate,
                              balancedRate,
                              unbalancedRate,
                              kind,
                              accessPricingModel,
                            } = ratingPlan;
                            if (rate.thresholds) {
                              mappedService.rate = rate.thresholds.map(
                                ({start, fixedPrice, linearPrice}, i) => ({
                                  tier: `tier-${i}`,
                                  start: start ? start : 0,
                                  linearPrice,
                                  fixedPrice,
                                }),
                              );
                            } else {
                              mappedService.rate = [{...rate}];
                            }
                            mappedService.unit = unit;
                            mappedService.balancedRate = balancedRate;
                            mappedService.unbalancedRate = unbalancedRate;
                            mappedService.pricingModel = kind;
                            mappedService.accessPricingModel = accessPricingModel;
                            mappedService.accessPricingUnit =
                              accessPricingModel?.unit;
                            mappedService.accessPricingRate =
                              accessPricingModel?.rate;
                          }
                          return mappedService;
                        },
                      ),
                    }),
                  );
                  return mappedServices;
                },
                on: 'serviceGroups',
              },
              {
                run: function({kind, commitment}) {
                  return kind
                    ? {
                        selectedConditionName: kind,
                        selectedCondition: commitment,
                      }
                    : null;
                },
                on: 'condition',
              },
            ],
          };
          let userMinSignatures;
          let partnerMinSignatures;

          if (headerData.msps) {
            userMinSignatures = headerData.msps[user].minSignatures;
            partnerMinSignatures = headerData.msps[partner].minSignatures;
          } else {
            userMinSignatures =
              headerData.fromMsp.mspId === user
                ? headerData.fromMsp.minSignatures
                : headerData.toMsp.minSignatures;
            partnerMinSignatures =
              headerData.fromMsp.mspId === partner
                ? headerData.fromMsp.minSignatures
                : headerData.toMsp.minSignatures;
          }

          const mappedGeneralInformation = transform(
            data.body,
            generalInformationMap,
          );

          const mappedUserDiscounts = transform(
            data.body.discounts[user],
            discountModelsMap,
          );

          const mappedPartnerDiscounts = transform(
            data.body.discounts[partner],
            discountModelsMap,
          );

          commit('updateSignatures', {
            key: 'userData',
            value: userMinSignatures,
          });
          commit('updateSignatures', {
            key: 'partnerData',
            value: partnerMinSignatures,
          });
          commit('updateDiscountModels', {
            key: 'userData',
            data: mappedUserDiscounts,
          });
          commit('updateDiscountModels', {
            key: 'partnerData',
            data: mappedPartnerDiscounts,
          });
          commit('uploadData', {
            key: 'generalInformation',
            data: mappedGeneralInformation,
          });
        } else {
          dispatch(
            'app-state/loadError',
            {
              title: 'No matching MSPs',
              code: `${user}s MSP doesn't match imported JSON.`,
            },
            {root: true},
          );

          [
            {
              run: () => null,
              on: 'userData.currencyForAllDiscounts',
            },
            {
              run: () => [],
              on: 'userData.tadigCodes.codes',
            },
            {
              run: () => false,
              on: 'userData.tadigCodes.includeContractParty',
            },
            {
              run: () => null,
              on: 'partnerData.currencyForAllDiscounts',
            },
            {
              run: () => [],
              on: 'partnerData.tadigCodes.codes',
            },
            {
              run: () => false,
              on: 'partnerData.tadigCodes.includeContractParty',
            },
          ].forEach((operation) =>
            generalInformationMap.operate.push(operation),
          );

          const res = transform(data.body, generalInformationMap);
          commit('uploadData', {key: 'generalInformation', data: res});
        }
      } catch (e) {
        log(e);
        dispatch(
          'app-state/loadError',
          {
            title: 'Invalid format',
            code: `Only contract draft model is supported.`,
          },
          {root: true},
        );
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
        setTimeout(async () => {
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
            const data = await dispatch('getContractData');
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
            log(err);
            const error = {
              title: 'Missing values',
              body: errorMessages.length > 0 ? errorMessages : err,
            };
            console.log(err);
            reject(error);
          }
        }, 50);
      });
    },
    getContractData({
      commit,
      dispatch,
      rootGetters,
      getters,
      rootState,
      state,
    }) {
      const {user, partner} = getters.msps;
      const {generalInformation, partnerData, userData} = state;
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

      const convertedContract = {
        header: {
          version: '1.0',
          type: 'contract',
          msps: {
            [user]: {
              minSignatures: userData.signatures.minSignatures,
            },
            [partner]: {
              minSignatures: partnerData.signatures.minSignatures,
            },
          },
        },
        body: convertModelsModule.convertUiModelToJsonModel(
          user,
          partner,
          contract,
        ),
      };
      return convertedContract;
    },
  },
  getters: {
    // contract: (state, getters) => {},
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
