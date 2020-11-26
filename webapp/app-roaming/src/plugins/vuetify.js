import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify);
const {
  VUE_APP_DARK_COLOR: dark,
  VUE_APP_LIGHT_COLOR: light,
  VUE_APP_PROGRESS_COLOR: progress,
} = process.env;
export default new Vuetify({
  icons: {
    iconfont: 'mdi', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
  theme: {
    themes: {
      light: {
        primary: process.env.VUE_APP_PRIMARY_COLOR || '#000000',
        secondary: process.env.VUE_APP_SECONDARY_COLOR || '#000000',
        background: process.env.VUE_APP_BACKGROUND_COLOR || '#f9f9f9',
        dark,
        light,
        progress,
      },
    },
  },
});
