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
        primary: process.env.VUE_APP_COLOR_PRIMARY || '#000000',
        secondary: process.env.VUE_APP_COLOR_SECONDARY || '#000000',
        background: process.env.VUE_APP_COLOR_BACKGROUND || '#f9f9f9',
        navigationDrawer: process.env.VUE_APP_COLOR_NAVIGATION_DRAWER || '#ffffff'
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
