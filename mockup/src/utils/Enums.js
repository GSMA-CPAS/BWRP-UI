const {
  // Paths
  BASE_URL: index,
  VUE_APP_PATH_CONTRACTS_OVERVIEW: contracts,
  VUE_APP_PATH_CREATE_CONTRACT: createContract,
  VUE_APP_PATH_CONTRACT_PREVIEW: contractPreview,
  VUE_APP_PATH_CONTRACT_TIMELINE: contractTimeline,
  // CONFIG
  VUE_APP_API_BASE_URL: apiBaseURL,
} = process.env;

const PATHS = Object.freeze({
  index,
  contracts,
  createContract,
  contractPreview,
  contractTimeline,
});

const CONFIG = Object.freeze({
  apiBaseURL,
});

const CONTRACT_STATE = Object.freeze({
  CONTRACT_NOT_SIGNED:0,
  USAGE_REPORT_NOT_UPLOADED:1,
  USAGE_REPORT_UPLOADED:2,
  USAGE_REPORT_SENT:3,
  WAITING_FOR_PARTNER_USAGE_REPORT:4,
  READY_FOR_SETTLEMENT_CALCULATION:5,
  CALCULATION_COMPLETED:6,
})

const DISCREPANCIES_STATUS = Object.freeze({
  UNDEFINED:0,
  ACCEPTED:1,
  DECLINED:2,
})

export { PATHS, CONFIG, CONTRACT_STATE, DISCREPANCIES_STATUS};
