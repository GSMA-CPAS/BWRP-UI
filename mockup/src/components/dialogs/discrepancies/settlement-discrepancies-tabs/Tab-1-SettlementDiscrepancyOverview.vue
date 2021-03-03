<template>
  <fragment>
    <v-container>
      <deal-overview/>
      <settlement-discrepancy-summary/>
    </v-container>
  </fragment>
</template>
<script>
import DealOverview from "@/components/dialogs/discrepancies/DealOverview";
import SettlementDiscrepancySummary
  from "@/components/dialogs/discrepancies/settlement-discrepancies-tabs/items/SettlementDiscrepancySummary";
export default {
  name: "tab-1",
  label: "General Information",
  description: "description",
  components: {
    DealOverview, SettlementDiscrepancySummary
  },
  computed: {
  },
};
</script>