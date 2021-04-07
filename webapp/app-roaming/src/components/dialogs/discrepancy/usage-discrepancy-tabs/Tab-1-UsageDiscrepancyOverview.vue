<template>
  <div class="text-center">
    <deal-overview :isHome="true"/>
    <usage-discrepancy-summary/>
  </div>
</template>
<script>

import DealOverview from '@/components/dialogs/discrepancy/items/DealOverview';
import UsageDiscrepancySummary from '@/components/dialogs/discrepancy/items/UsageDiscrepancySummary';

export default {
  name: 'tab-1',
  label: 'General Information',
  description: 'deal information',
  components: {
    UsageDiscrepancySummary,
    DealOverview,
  },
};
</script>

<style scoped>

</style>
