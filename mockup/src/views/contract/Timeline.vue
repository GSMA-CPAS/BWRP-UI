<template>
  <timeline />
</template>
<script>
import { PATHS } from "../../utils/Enums";
import Timeline from "../../components/pages/contract-timeline/Timeline.vue";
export default {
  name: "timeline-page",
  description: "On this page, the timeline of a contract is displayed.",
  path: PATHS.contractTimeline,
  components: { Timeline },
};
</script>