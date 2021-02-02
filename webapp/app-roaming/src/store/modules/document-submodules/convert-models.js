function convertUiSignaturesToJsonModel(uiSignatures) {
  return uiSignatures.map((x) => {
    return {name: x.name, role: x.role};
  });
}


function convertUiPartyInformationToJsonModel(uiPartyGeneralData) {
  return {
    contractCurrency: uiPartyGeneralData.currencyForAllDiscounts,
    defaultTadigCodes: uiPartyGeneralData.tadigCodes.codes.split(','),
    tadigGroups: {}
  };
}

function convertUiThresholdsToJsonModel(uiRateThresholds) {
  return {
    start: uiRateThresholds.threshold.toString(),
    fixedPrice: uiRateThresholds.fixedPrice,
    linearPrice: uiRateThresholds.linearPrice,
  };
}

function convertUiNormalRatePlanToJsonModel(uiNormalRatePlan) {
  return {
    unit: uiNormalRatePlan.unit,
    ratingPlan: {
      kind: uiNormalRatePlan.pricingModel,
      rate: {
        thresholds: uiNormalRatePlan.rate.map(convertUiThresholdsToJsonModel)
      }
    }
  };
}

function convertUiBalancedUnbalancedRatePlanToJsonModel(uiBalancedUnbalancedRatePlan) {
  return {
    unit: uiBalancedUnbalancedRatePlan.unit,
    ratingPlan: {
      kind: uiBalancedUnbalancedRatePlan.pricingModel,
      balancedRate: {
        thresholds: uiBalancedUnbalancedRatePlan.balancedRate.map(convertUiThresholdsToJsonModel)
      },
      unbalancedRate: {
        thresholds: uiBalancedUnbalancedRatePlan.unbalancedRate.map(convertUiThresholdsToJsonModel)
      }
    }
  };
}

function convertUiRatePlanToJsonModel(uiRatingPlan) {
  if (uiRatingPlan.pricingModel === 'Normal') {
    return convertUiNormalRatePlanToJsonModel(uiRatingPlan);
  } else if (uiRatingPlan.pricingModel === 'Balanced/Unbalanced') {
    return convertUiBalancedUnbalancedRatePlanToJsonModel(uiRatingPlan);
  } else if (uiRatingPlan.pricingModel === 'Not Charged') {
    return undefined;
  } else {
    throw Error('Unsupported rate plan model "' + uiRatingPlan.pricingModel + '" passed.');
  }
}

function convertUiServiceToJsonModel(uiService) {
  return {
    service: uiService.name,
    includedInCommitment: uiService.includedInCommitment,
    usagePricing: convertUiRatePlanToJsonModel(uiService),
    accessPricing: convertUiRatePlanToJsonModel({
      pricingModel: uiService.accessPricingModel,
      unit: uiService.accessPricingUnit,
      rate: uiService.accessPricingRate
    })
  };
}

function convertUiServiceGroupToJsonModel(uiServiceGroup) {
  return {
    homeTadigs: uiServiceGroup.homeTadigs,
    visitorTadigs: uiServiceGroup.visitorTadigs,
    services: uiServiceGroup.chosenServices.map(convertUiServiceToJsonModel),
  };
}

function convertUiDiscountsModelsToJsonModel(uiDiscountModels) {
  const model = {
    condition: {
      kind: uiDiscountModels.condition.selectedConditionName,
    },

    serviceGroups: uiDiscountModels.serviceGroups.map(convertUiServiceGroupToJsonModel)
  };

  if (uiDiscountModels.condition.selectedCondition) {
    model.condition.commitment = {
      value: uiDiscountModels.condition.selectedCondition.commitmentValue,
      currency: uiDiscountModels.condition.selectedCondition.currency,
      includingTaxes: uiDiscountModels.condition.selectedCondition.includingTaxes,
    };
  }

  return model;
}

const convertModelsModule = {
  convertUiModelToJsonModel: (userCode, partnerCode, uiModel) => {
    const model = {
      version: 'gsma-bwr-roaming-v1',

      metadata: {
        name: uiModel.generalInformation.name,
        type: uiModel.generalInformation.type,
        authors: uiModel.generalInformation.authors,
      },

      framework: {
        contractParties: [userCode, partnerCode],
        term: {
          start: uiModel.generalInformation.startDate.toISOString(),
          end: uiModel.generalInformation.endDate.toISOString(),
        },
        payment: {
          taxesIncluded: uiModel.generalInformation.taxesIncluded,
        },
        signers: {
          [userCode]: convertUiSignaturesToJsonModel(uiModel[userCode].signatures),
          [partnerCode]: convertUiSignaturesToJsonModel(uiModel[partnerCode].signatures),
        },
        partyInformation: {
          [userCode]: convertUiPartyInformationToJsonModel(uiModel.generalInformation[userCode]),
          [partnerCode]: convertUiPartyInformationToJsonModel(uiModel.generalInformation[partnerCode]),
        },
      },

      discounts: {
        [userCode]: convertUiDiscountsModelsToJsonModel(uiModel[userCode].discountModels),
        [partnerCode]: convertUiDiscountsModelsToJsonModel(uiModel[partnerCode].discountModels)
      }
    };

    if (uiModel.generalInformation.prolongationLength) {
      model.framework.term.prolongation = uiModel.generalInformation.prolongationLength;
    }

    return model;
  }
};

export default convertModelsModule;
