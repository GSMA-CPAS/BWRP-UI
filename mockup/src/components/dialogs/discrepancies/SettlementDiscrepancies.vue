<template>
  <app-dialog width="90vw" :title=this.title :label=this.label>
    <template #content>
      <tabs :tabs="tabs" />
    </template>
  </app-dialog>
</template>
<script>
import Tabs from "../../global-components/Tabs.vue";
export default {
  components: {
    Tabs,
  },
  name: "SettlementDiscrepancies",
  description: "This is the dialog to view the settlement.",
  props: { isHome: Boolean },
  computed: {
    tabs() {
      const components = require.context(
        "./settlement-discrepancies-tabs/",
        false,
        /(Tab-)\d-\w*\.(vue|js)$/
      );
      const tabs = components.keys().map((x) => {
        const component = components(x).default;
        const { label, name } = component;
        return { key: name, label, component, isHome:this.isHome };
      });
      return tabs;
    },
  },
  data(){
    return {
      title: this.isHome? 'Settlement Discrepancy - Home Perspective' : 'Settlement Discrepancy - Partner Perspective',
      label: this.isHome? 'View Home Settlement Discrepancy' : 'View Partner Settlement Discrepancy',
    }
  }
};
</script>