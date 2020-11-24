<template>
  <v-tabs v-model="tab" centered grow>
    <v-tab v-for="{ label, key } in tabs" :key="key" :href="`#${key}`">
      {{ label }}
    </v-tab>
    <v-tab-item
      class="ma-2"
      v-for="{ key, component } in tabs"
      :key="key"
      :value="key"
    >
      <keep-alive>
        <component :is="component"></component>
      </keep-alive>
    </v-tab-item>
  </v-tabs>
</template>
<script>
export default {
  name: 'tabs',
  data() {
    return {
      tab: null,
    };
  },
  props: {
    tabs: {
      type: Array,
      default: () => [
        {label: 'TAB 1', key: 'tab-1'},
        {label: 'TAB 2', key: 'tab-2'},
      ],
    },
  },
};
</script>
