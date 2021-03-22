<template>
  <fragment class="text-center">
    <deal-overview/>
  </fragment>
</template>

<script>

import DealOverview from '@/components/dialogs/discrepancy/items/DealOverview';

export default {
  name: 'tab-1',
  label: 'General Information',
  description: 'deal information',
  components: {
    DealOverview,
  },
};
</script>

<style scoped>

</style>
