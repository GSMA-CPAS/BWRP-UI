<template>
  <app-dialog width="90vw" title="Contract" label="View contract">
    <template #content>
      <tabs :tabs="tabs" />
    </template>
  </app-dialog>
</template>
<script>
import Tabs from "../global-components/Tabs.vue";
export default {
  components: {
    Tabs,
  },
  name: "contract",
  description: "This is the dialog view the contract.",
  computed: {
    tabs() {
      const components = require.context(
        "./contract-tabs",
        false,
        /(Tab-)\d-\w*\.(vue|js)$/
      );
      const tabs = components.keys().map((x) => {
        const component = components(x).default;
        const { label, name } = component;
        return { key: name, label, component };
      });
      return tabs;
    },
  },
};
</script>