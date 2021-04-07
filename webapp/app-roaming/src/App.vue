<template>
  <v-app>
    <error-overlay />
    <breadcrumb />
    <v-main class="background">
      <loading-spinner :isLoading="isLoading" />
      <router-view v-show="!isLoading" />
    </v-main>
  </v-app>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import Breadcrumb from './components/navigation/Breadcrumb.vue';
import {appStateMixin} from '@mixins/component-specfic';
import ErrorOverlay from '@components/ErrorOverlay.vue';
import LoadingSpinner from '@components/LoadingSpinner.vue';

export default {
  components: {
    ErrorOverlay,
    Breadcrumb,
    LoadingSpinner,
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
  created() {
    this.setup();
  },
};
</script>
<style lang="scss">
@import './styles/app.scss';
</style>
