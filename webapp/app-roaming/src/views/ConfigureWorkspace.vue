<template>
  <v-app>
    <navigation-drawer />
    <div>contentfsdf</div>
  </v-app>
</template>
<script>
import {PATHS} from '@/utils/Enums';
import NavigationDrawer from '@/components/pages/configure-workspace/NavigationDrawer.vue';
export default {
  components: {NavigationDrawer},
  name: 'configure-workspace',
  text: 'Workspace Configurations',
  description: 'Page on which user can configure the app',
  path: PATHS.editWorkspace,
};
</script>
