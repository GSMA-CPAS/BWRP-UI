const components = require.context(".", true, /.*.(vue)$/);
const ALL_VIEWS = components.keys().map((x) => components(x).default);
export { ALL_VIEWS };
