<template>
  <timeline-item>
    <template #content>
      <v-container/>
    </template>
    <template #icon>

      <settlement-report :currentTimeline="currentTimeline" v-if="areDiscrepanciesCalculated"/>
    </template>
  </timeline-item>
</template>

<script>
import TimelineItem from '@/components/global-components/TimelineItem';
import SettlementReport from '@/components/dialogs/SettlementReport';
import {timelineMixin} from '@/utils/mixins/component-specfic';

export default {
  name: 'Item-7-SettlementReport',
  components: {
    TimelineItem,
    SettlementReport
  },
  mixins: [timelineMixin],
  props: {
    currentTimeline: {
      type: Boolean,
      default: true
    }
  },
};
</script>

<style scoped>

</style>
