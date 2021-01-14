<template>
  <v-navigation-drawer app permanent clipped>
    <v-list dense>
      <v-list-item v-for="item in items" :key="item.title" link>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <app-footer />
    </template>
  </v-navigation-drawer>
</template>
<script>
import AppFooter from '@/components/other/Footer.vue';
export default {
  data() {
    return {
      items: [{title: 'TADIG Codes'}, {title: 'TADIG Groups'}],
      mini: true,
    };
  },

  components: {
    AppFooter,
  },
};
</script>
