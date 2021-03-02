const {
  // Paths
  BASE_URL: index,
  VUE_APP_PATH_CONTRACTS_OVERVIEW: contracts,
  VUE_APP_PATH_CREATE_CONTRACT: createContract,
  VUE_APP_PATH_CONTRACT_PREVIEW: contractPreview,
  VUE_APP_PATH_CONTRACT_TIMELINE: contractTimeline,
  VUE_APP_PATH_EDIT_WORKSPACE: editWorkspace,
  // CONFIG
  VUE_APP_CORE_API_BASE_URL: coreBaseUrl,
  VUE_APP_COMMON_ADAPTER_BASE_URL: commonAdapterBaseURL,
  VUE_APP_LOCAL_API_BASE_URL: localApiBaseUrl,
} = process.env;

const PATHS = Object.freeze({
  index,
  contracts,
  createContract,
  contractPreview,
  contractTimeline,
  editWorkspace,
});

const CONFIG = Object.freeze({coreBaseUrl, commonAdapterBaseURL, localApiBaseUrl});
export {PATHS, CONFIG};
