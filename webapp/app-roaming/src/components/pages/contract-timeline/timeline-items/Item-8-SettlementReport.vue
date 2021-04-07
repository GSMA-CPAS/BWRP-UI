<template>
  <timeline-item>
    <template #content>
      <v-container />
    </template>
    <template #icon>
      <settlement-report v-if="areDiscrepanciesCalculated" />
    </template>
  </timeline-item>
</template>

<script>
import TimelineItem from '@/components/global-components/TimelineItem';
import SettlementReport from '@dialogs/SettlementReport';
import {timelineMixin} from '@mixins/component-specfic';

export default {
  name: 'Item-7-SettlementReport',
  components: {
    TimelineItem,
    SettlementReport,
  },
  mixins: [timelineMixin],
};
</script>

<style scoped>
</style>
