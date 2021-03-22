<template>
  <timeline-item>
    <template #content>
      <v-container/>
    </template>
    <template #icon>
      <usage-discrepancy/>
    </template>
  </timeline-item>
</template>
<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';
import UsageDiscrepancy from '@/components/dialogs/discrepancy/UsageDiscrepancy';
export default {
  name: 'item-1',
  description: 'description',
  mixins: [timelineMixin],
  components: {UsageDiscrepancy}
};
</script>
