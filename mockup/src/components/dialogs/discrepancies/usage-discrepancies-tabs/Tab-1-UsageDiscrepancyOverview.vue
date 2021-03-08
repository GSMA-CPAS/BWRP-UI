<template>
  <fragment class="text-center">
    <deal-overview/>
    <usage-discrepancy-summary/>
  </fragment>
</template>

<script>
import DealOverview from "@/components/dialogs/discrepancies/DealOverview";
import UsageDiscrepancySummary from "@/components/dialogs/discrepancies/usage-discrepancies-tabs/items/UsageDiscrepancySummary";

export default {
  name: "tab-1",
  label: "General Information",
  description: "deal information",
  components: {
    DealOverview,
    UsageDiscrepancySummary
  },
}
</script>

<style scoped>

</style>