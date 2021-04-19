function convertUiPartyInformationToJsonModel(uiPartyGeneralData) {
  return {
    contractCurrency: uiPartyGeneralData.currencyForAllDiscounts,
    defaultTadigCodes: uiPartyGeneralData.tadigCodes.codes,
  };
}

function convertUiThresholdsToJsonModel(uiRateThresholds) {
  return {
    start: uiRateThresholds.threshold,
    fixedPrice: uiRateThresholds.fixedPrice ? uiRateThresholds.fixedPrice : 0,
    linearPrice: uiRateThresholds.linearPrice
      ? uiRateThresholds.linearPrice
      : 0,
  };
}

function convertUiTieredRatePlanToJsonModel(uiNormalRatePlan) {
  return {
    unit: uiNormalRatePlan.unit,
    ratingPlan: {
      kind: uiNormalRatePlan.pricingModel,
      rate: {
        thresholds: uiNormalRatePlan.rate.map(convertUiThresholdsToJsonModel),
      },
    },
  };
}

function convertUiBalancedUnbalancedLinearRatePlanToJsonModel(
  uiBalancedUnbalancedRatePlan,
) {
  return {
    unit: uiBalancedUnbalancedRatePlan.unit,
    ratingPlan: {
      kind: uiBalancedUnbalancedRatePlan.pricingModel,
      balancedRate: {
        linearPrice: uiBalancedUnbalancedRatePlan.balancedRate[0]
          ? convertUiThresholdsToJsonModel(
              uiBalancedUnbalancedRatePlan.balancedRate[0],
            ).linearPrice
          : uiBalancedUnbalancedRatePlan.rate[0],
      },
      unbalancedRate: {
        linearPrice: convertUiThresholdsToJsonModel(
          uiBalancedUnbalancedRatePlan.unbalancedRate[0],
        ).linearPrice,
      },
    },
  };
}

function convertUiFlatRateToJsonModel(uiFlatRatePlan) {
  return {
    unit: uiFlatRatePlan.unit,
    ratingPlan: {
      kind: uiFlatRatePlan.pricingModel,
      rate: {
        fixedPrice: convertUiThresholdsToJsonModel(uiFlatRatePlan.rate[0])
          .fixedPrice,
      },
    },
  };
}

function convertUiLinearRateToJsonModel(uiLinearRatePlan) {
  return {
    unit: uiLinearRatePlan.unit,
    ratingPlan: {
      kind: uiLinearRatePlan.pricingModel,
      rate: {
        linearPrice: convertUiThresholdsToJsonModel(uiLinearRatePlan.rate[0])
          .linearPrice,
      },
    },
  };
}

function convertUiRatePlanToJsonModel(uiRatingPlan) {
  if (
    uiRatingPlan.pricingModel === 'Threshold - back to first' ||
    uiRatingPlan.pricingModel === 'Tiered with Thresholds'
  ) {
    return convertUiTieredRatePlanToJsonModel(uiRatingPlan);
  } else if (
    uiRatingPlan.pricingModel === 'Balanced/Unbalanced (Linear rate)'
  ) {
    return convertUiBalancedUnbalancedLinearRatePlanToJsonModel(uiRatingPlan);
  } else if (uiRatingPlan.pricingModel === 'Flat rate') {
    return convertUiFlatRateToJsonModel(uiRatingPlan);
  } else if (uiRatingPlan.pricingModel === 'Linear rate') {
    return convertUiLinearRateToJsonModel(uiRatingPlan);
  } else if (uiRatingPlan.pricingModel === 'Not Charged') {
    return undefined;
  } else {
    throw Error(
      'Unsupported rate plan model "' + uiRatingPlan.pricingModel + '" passed.',
    );
  }
}

function convertUiServiceToJsonModel(uiService) {
  return {
    service: uiService.name,
    includedInCommitment: uiService.includedInCommitment
      ? uiService.includedInCommitment
      : true,
    usagePricing: convertUiRatePlanToJsonModel(uiService),
    accessPricing: uiService.accessPricingModel
      ? convertUiRatePlanToJsonModel({
          pricingModel: uiService.accessPricingModel,
          unit: uiService.accessPricingUnit,
          rate: uiService.accessPricingRate,
        })
      : undefined,
  };
}

function convertUiServiceGroupToJsonModel(uiServiceGroup) {
  return {
    homeTadigs: uiServiceGroup.homeTadigs.codes,
    visitorTadigs: uiServiceGroup.visitorTadigs.codes,
    services: uiServiceGroup.chosenServices.map(convertUiServiceToJsonModel),
  };
}

function convertUiDiscountsModelsToJsonModel(uiDiscountModels) {
  const model = {
    condition: {
      kind: uiDiscountModels.condition.selectedConditionName,
    },

    serviceGroups: uiDiscountModels.serviceGroups.map(
      convertUiServiceGroupToJsonModel,
    ),
  };

  if (uiDiscountModels.condition.selectedCondition) {
    model.condition.commitment = {
      value: uiDiscountModels.condition.selectedCondition.commitmentValue,
      currency: uiDiscountModels.condition.selectedCondition.currency,
      includingTaxes:
        uiDiscountModels.condition.selectedCondition.includingTaxes,
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
        partyInformation: {
          [userCode]: convertUiPartyInformationToJsonModel(
            uiModel.generalInformation[userCode],
          ),
          [partnerCode]: convertUiPartyInformationToJsonModel(
            uiModel.generalInformation[partnerCode],
          ),
        },
      },
      discounts: {
        [userCode]: convertUiDiscountsModelsToJsonModel(
          uiModel[userCode].discountModels,
        ),
        [partnerCode]: convertUiDiscountsModelsToJsonModel(
          uiModel[partnerCode].discountModels,
        ),
      },
    };

    if (uiModel.generalInformation.prolongationLength) {
      model.framework.term.prolongation =
        uiModel.generalInformation.prolongationLength;
    }

    return model;
  },
};

export default convertModelsModule;
