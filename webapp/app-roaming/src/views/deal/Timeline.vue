<template>
  <timeline />
</template>
<script>
import {PATHS} from '@/utils/Enums';
import Timeline from '@/components/pages/deal-timeline/Timeline.vue';
export default {
  name: 'timeline-page',
  text: 'Timeline',
  description: 'On this page, the timeline of a deal is displayed.',
  path: PATHS.dealTimeline,
  components: {
    Timeline,
  },
};
</script>
