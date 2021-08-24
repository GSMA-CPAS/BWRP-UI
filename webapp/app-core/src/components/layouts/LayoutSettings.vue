<template>
  <v-main>
    <v-navigation-drawer :color="$vuetify.theme.themes['light'].navigationDrawer" permanent app clipped>
      <v-list>
        <v-list-item to="/settings/users">
          <v-list-item-icon>
            <v-icon>{{ $vuetify.icons.values.userManagement }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>User Management</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/settings/identities">
          <v-list-item-icon>
            <v-icon>{{ $vuetify.icons.values.identityManagement }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Identity Management</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-footer outlined>
          <v-spacer />
          <div>v{{version}}</div>
        </v-footer>
      </template>
    </v-navigation-drawer>
    <app-header/>
    <v-container fill-height fluid v-if="loading">
      <v-row no-gutters align="center" justify="center">
        <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
      </v-row>
    </v-container>
    <slot v-else/>
  </v-main>
</template>

<script>

import AppHeader from '@/components/AppHeader';

export default {

  name: 'Layout',

  data() {
    return {
      version: process.env.VUE_APP_VERSION
    };
  },

  props: {
    navbar: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: true,
    },
  },

  components: {
    AppHeader,
  },
};

</script>
