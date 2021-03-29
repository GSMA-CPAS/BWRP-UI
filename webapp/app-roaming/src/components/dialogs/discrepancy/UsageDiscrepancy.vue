<template>
  <fragment>
    <app-dialog width="90vw" outlined title="Usage Discrepancies" label="View usage discrepancies">
      <template #content>
        <tabs :tabs="tabs" />
      </template>
    </app-dialog>
  </fragment>
</template>

<script>

import {timelineMixin} from '@/utils/mixins/component-specfic';
import Tabs from '@/components/global-components/Tabs';

export default {
  name: 'UsageDiscrepancy',
  mixins: [timelineMixin],
  components: {
    Tabs
  },
  computed: {
    tabs() {
      const components = require.context(
          './usage-discrepancy-tabs',
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

<style scoped>

</style>
