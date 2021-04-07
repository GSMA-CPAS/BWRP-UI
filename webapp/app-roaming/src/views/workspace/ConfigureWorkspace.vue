<template>
  <v-container fluid class="background">
    <navigation-drawer @onmenuchange="changeMenu" />
    <workspace-view :menu="menu" />
  </v-container>
</template>
<script>
import {PATHS} from '@/utils/Enums';
import NavigationDrawer from '@pages/configure-workspace/NavigationDrawer.vue';
import View from '@pages/configure-workspace/View.vue';
export default {
  components: {
    WorkspaceView: View,
    NavigationDrawer,
  },
  name: 'configure-workspace',
  text: 'Workspace Configurations',
  description: 'Page on which user can configure the app',
  path: PATHS.editWorkspace,
  data: () => ({menu: 'TadigCodes'}),
  methods: {
    changeMenu(title) {
      this.menu = this.lodash.upperFirst(this.lodash.camelCase(title));
    },
  },
};
</script>
