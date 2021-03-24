/* eslint-disable quote-props */
/* eslint-disable no-unused-vars */
import partnersModule from './partners';
import documentModule from './document';
import userModule from './user';
import appStateModule from './app-states';
import appDetailsModule from './app-details';
import workspaceModule from './workspace';
import usageModule from './usage';
import settlementModule from './settlement';

const allModules = {
  document: documentModule,
  'app-state': appStateModule,
  usage: usageModule,
  settlement: settlementModule,
  partners: partnersModule,
  user: userModule,
  'app-details': appDetailsModule,
  'workspace-config': workspaceModule,
};
export default allModules;
