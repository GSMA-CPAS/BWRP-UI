<template>
  <v-navigation-drawer app permanent clipped>
    <v-list dense>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        @click="onMenuChange(item)"
      >
        <v-list-item-icon>
          <v-icon>mdi-{{ item.icon }}</v-icon>
        </v-list-item-icon>
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
      items: [
        {title: 'TADIG Codes', icon: 'alpha-t'},
        {title: 'TADIG Groups', icon: 'alpha-t-circle-outline'},
      ],
    };
  },
  methods: {
    onMenuChange(i) {
      this.$emit('onmenuchange', i.title);
    },
  },
  components: {
    AppFooter,
  },
};
</script>
