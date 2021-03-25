import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

import {
  mdiShieldKey,
  mdiSecurity,
  mdiAccount,
  mdiExitToApp,
  mdiMenuDown,
  mdiAccountSupervisor,
  mdiSim,
  mdiTrashCan
} from '@mdi/js';

const opts = {
  theme: {
    themes: {
      light: {
        primary: process.env.VUE_APP_PRIMARY_COLOR || '#000000',
        secondary: process.env.VUE_APP_SECONDARY_COLOR || '#000000',
        background: process.env.VUE_APP_BACKGROUND_COLOR || '#f9f9f9',
        navigationDrawer: process.env.VUE_APP_NAVIGATION_DRAWER_COLOR || '#ffffff'
      }
    }
  },
  icons: {
    iconfont: 'mdiSvg',
    values: {
      account: mdiAccount,
      logout: mdiExitToApp,
      password: mdiShieldKey,
      security: mdiSecurity,
      menuDown: mdiMenuDown,
      userManagement: mdiAccountSupervisor,
      identityManagement: mdiSim,
      trashCan: mdiTrashCan
    }
  }
};

export default new Vuetify(opts);
