const {
  // Paths
  BASE_URL: index,
  VUE_APP_PATH_CONTRACTS_OVERVIEW: contracts,
  VUE_APP_PATH_CREATE_CONTRACT: createContract,
  VUE_APP_PATH_CONTRACT_PREVIEW: contractPreview,
  VUE_APP_PATH_CONTRACT_TIMELINE: contractTimeline,
  VUE_APP_PATH_EDIT_WORKSPACE: editWorkspace,
  // CONFIG
  VUE_APP_API_BASE_URL: apiBaseURL,
} = process.env;

const PATHS = Object.freeze({
  index,
  contracts,
  createContract,
  contractPreview,
  contractTimeline, editWorkspace
});

const CONFIG = Object.freeze({
  apiBaseURL,
});
export {PATHS, CONFIG};
