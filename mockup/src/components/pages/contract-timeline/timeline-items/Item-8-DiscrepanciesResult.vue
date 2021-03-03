<template>
  <timeline-item>
    <template #content>

    </template>
    <template #icon>
      <app-button v-if="discrepanciesStatus === DISCREPANCIES_STATUS.ACCEPTED" color="success" outlined disabled label="Accepted"/>
      <app-button v-if="discrepanciesStatus === DISCREPANCIES_STATUS.DECLINED" color="error" outlined disabled label="declined"/>
    </template>
  </timeline-item>
</template>

<script>
import {timelineMixin} from "@/utils/mixins/component-specfic";
import TimelineItem from "@/components/global-components/TimelineItem";

export default {
  name: "Item-8-DiscrepanciesResult",
  mixins: [timelineMixin],
  components:{TimelineItem}
}
</script>

<style scoped>

</style>