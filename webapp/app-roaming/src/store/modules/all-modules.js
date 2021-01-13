/* eslint-disable no-unused-vars */
import partnersModule from './partners';
import documentModule from './document';
import userModule from './user';
import appStateModule from './app-states';
import appDetailsModule from './app-details';

const allModules = {
  'document': documentModule,
  'app-state': appStateModule,
  'partners': partnersModule,
  'user': userModule,
  'app-details': appDetailsModule,
};
export default allModules;
