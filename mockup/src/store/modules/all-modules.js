/* eslint-disable no-unused-vars */
import partnersModule from "./partners";
import contractModule from "./contract";
import userModule from "./user";
import appStateModule from "./app-states";

const allModules = {
  contract: contractModule,
  "app-state": appStateModule,
  partners: partnersModule,
  user: userModule,
};
export default allModules;
