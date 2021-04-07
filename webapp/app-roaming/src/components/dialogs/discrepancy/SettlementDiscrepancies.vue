<template>
  <app-dialog width="90vw" :title="title" :label=label>
    <template #content>
      <tabs :tabs="tabs" />
    </template>
  </app-dialog>
</template>
<script>
import Tabs from '../../global-components/Tabs.vue';
import {timelineMixin} from '@/utils/mixins/component-specfic';
export default {
  components: {
    Tabs,
  },
  name: 'settlement-discrepancies',
  description: 'This is the dialog view for the settlement.',
  mixins: [timelineMixin],
  props: {
    isHome: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      label: this.isHome? 'view home settlement discrepancy':'view partner settlement discrepancy',
      title: this.isHome? 'Settlement Discrepancy - Home Perspective':'Settlement Discrepancy - Partner Perspective'
    };
  },
  computed: {
    tabs() {
      const components = require.context(
          './settlement-discrepancies-tabs/',
          false,
          /(Tab-)\d-\w*\.(vue|js)$/
      );
      const tabs = components.keys().map((x) => {
        const component = components(x).default;
        const {label, name} = component;
        return {key: name, label, component, isHome: this.isHome};
      });
      return tabs;
    },
  },
};
</script>
