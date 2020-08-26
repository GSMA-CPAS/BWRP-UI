const components = require.context(
  "./global-components/",
  true,
  /.*.(vue|js)$/
);
const GLOBAL_COMPONENTS = components.keys().map((x) => components(x).default);
export { GLOBAL_COMPONENTS };
