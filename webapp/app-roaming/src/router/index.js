import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// register all routes from view folder
const components = require.context('@/views', true, /.*.(vue)$/);
const routes = components.keys().map((x) => {
  const component = components(x).default;
  const {name, path, text} = component;
  console.log(path);
  return {name, component, path, meta: {text}};
});

// index page redirects to deals overview
routes.push({path: '/', redirect: '/deals'});

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
