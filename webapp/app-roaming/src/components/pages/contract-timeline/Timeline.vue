
<template>
  <v-container v-if="name">
    <app-headline :title="`Contract ${name}`" />
    <v-divider />
    <v-timeline reverse>
      <Item-1-ContractView />
      <Item-2-Signatures />
      <Item-3-ContractState :class="{ 'opacity-0': exists('contract') }" />
      <Item-4-SettlementView :class="{ 'opacity-0': exists('settlement') }" />
      <Item-5-Discrepancies :class="{ 'opacity-0': exists('discrepancies') }" />
      <Item-6-ApproveSettlement
        :class="{ 'opacity-0': exists('discrepancies') }"
      />
    </v-timeline>
  </v-container>
</template>
<script>
import { timelineMixin } from "@/utils/mixins/component-specfic";
import Item1ContractView from "./timeline-items/Item-1-ContractView.vue";
import Item2Signatures from "./timeline-items/Item-2-Signatures.vue";
import Item3ContractState from "./timeline-items/Item-3-ContractState.vue";
import Item4SettlementView from "./timeline-items/Item-4-SettlementView.vue";
import Item5Discrepancies from "./timeline-items/Item-5-Discrepancies.vue";
import Item6ApproveSettlement from "./timeline-items/Item-6-ApproveSettlement.vue";
export default {
  components: {
    Item6ApproveSettlement,
    Item5Discrepancies,
    Item4SettlementView,
    Item3ContractState,
    Item2Signatures,
    Item1ContractView,
  },
  name: "timeline",
  description: "Component: Timeline",
  mixins: [timelineMixin],
  beforeMount() {
    this.loadData();
  },
};
</script>