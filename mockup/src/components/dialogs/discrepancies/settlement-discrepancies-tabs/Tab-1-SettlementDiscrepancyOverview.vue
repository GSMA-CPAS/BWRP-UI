<template>
  <fragment>
    <v-container>
      <deal-overview :isHome="isHome"/>
      <settlement-discrepancy-summary :isHome="isHome"/>
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
  props: { isHome: Boolean },
  computed: {
  },
};
</script>