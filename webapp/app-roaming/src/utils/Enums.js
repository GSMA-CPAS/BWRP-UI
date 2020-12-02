const {
  // Paths
  BASE_URL: index,
  VUE_APP_PATH_DEALS_OVERVIEW: deals,
  VUE_APP_PATH_CREATE_CONTRACT: createContract,
  VUE_APP_PATH_DEAL_PREVIEW: dealPreview,
  VUE_APP_PATH_DEAL_TIMELINE: dealTimeline,
  // CONFIG
  VUE_APP_API_BASE_URL: apiBaseURL,
} = process.env;

const PATHS = Object.freeze({
  index,
  deals,
  createContract,
  dealPreview,
  dealTimeline,
});

const CONFIG = Object.freeze({
  apiBaseURL,
});
export {PATHS, CONFIG};
