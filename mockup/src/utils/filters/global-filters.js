import Vue from "vue";
import { parseDate } from "../Utils";

Vue.filter("camelCase", (s) => {
  return Vue._.camelCase(s);
});
Vue.filter("kebabCase", (s) => {
  return Vue._.kebabCase(s);
});
Vue.filter("lowerCase", (s) => {
  return Vue._.lowerCase(s);
});
Vue.filter("snakeCase", (s) => {
  return Vue._.snakeCase(s);
});
Vue.filter("startCase", (s) => {
  return Vue._.startCase(s);
});
Vue.filter("upperCase", (s) => {
  return Vue._.upperCase(s);
});
Vue.filter("skipKeys", (obj, keysToSkip) => {
  let result = {};
  for (let key in obj) {
    if (keysToSkip.some((skipKey) => skipKey === key)) continue;
    result[key] = obj[key];
  }
  return result;
});
Vue.filter("isNil", (value) => {
  return Vue._.isNil(value) ? "N/A" : value;
});
Vue.filter("appendCurrency", (value, currency) => {
  return value + currency;
});
Vue.filter("print", (val) => {
  console.log(val);
  return val;
});
Vue.filter("parseDate", (val) => {
  return parseDate(val);
});
