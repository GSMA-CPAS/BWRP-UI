<template>
  <v-app>
    <error-overlay />
    <breadcrumb />
    <v-main class="background">
      <v-container fill-height fluid v-if="isLoading">
        <v-row no-gutters align="center" justify="center">
          <v-progress-circular :size="50" color="primary" indeterminate />
        </v-row>
      </v-container>
      <router-view v-show="!isLoading" />
    </v-main>
  </v-app>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import Breadcrumb from './components/navigation/Breadcrumb.vue';
import ErrorOverlay from './components/other/ErrorOverlay.vue';
import {appStateMixin} from '@/utils/mixins/component-specfic';

export default {
  components: {
    ErrorOverlay,
    Breadcrumb,
  },
  name: 'app',
  mixins: [appStateMixin],
  methods: {
    ...mapActions(['setup', 'loadDocuments']),
  },
  computed: {
    ...mapState(['user']),
  },
  watch: {
    async $route(to, from) {
      if (from.name === 'create-page') {
        await this.loadDocuments();
      }
    },
  },
  async created() {
    await this.setup();
  },
};
</script>
<style lang="scss">
@import './styles/app.scss';
</style>
