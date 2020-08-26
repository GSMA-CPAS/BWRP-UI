import Vue from "vue";
import VueRouter from "vue-router";
import { ALL_VIEWS } from "../views/all-views";

Vue.use(VueRouter);

// all routes
const routes = ALL_VIEWS.map((view) => ({
  name: view.name,
  component: view,
  path: view.path,
}));

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
