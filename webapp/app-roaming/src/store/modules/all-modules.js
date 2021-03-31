/* eslint-disable quote-props */
/* eslint-disable no-unused-vars */
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
  user: userModule,
  'app-details': appDetailsModule,
  'workspace-config': workspaceModule,
};
export default allModules;
