<template>
  <timeline-item>
    <template #content>

    </template>
    <template #icon>

      <settlement-report/>
    </template>
  </timeline-item>
</template>

<script>
import TimelineItem from "@/components/global-components/TimelineItem";
import SettlementReport from "@/components/dialogs/SettlementReport";

export default {
  name: "Item-7-SettlementReport",
  components: {
    TimelineItem,
    SettlementReport
  },
}
</script>

<style scoped>

</style>