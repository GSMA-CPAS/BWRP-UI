<template>
  <app-dialog width="90vw" title="Settlement" label="View Settlement">
    <template #content>
      <tabs :tabs="tabs" />
    </template>
  </app-dialog>
</template>
<script>
import Tabs from '../global-components/Tabs.vue';
export default {
  components: {
    Tabs,
  },
  name: 'settlement',
  description: 'This is the dialog view for the settlement.',
  computed: {
    tabs() {
      const components = require.context(
          './settlement-tabs/',
          false,
          /(Tab-)\d-\w*\.(vue|js)$/
      );
      const tabs = components.keys().map((x) => {
        const component = components(x).default;
        const {label, name} = component;
        return {key: name, label, component};
      });
      return tabs;
    },
  },
};
</script>
