<template>
  <timeline-item>
    <template #content>

    </template>
    <template #icon>
      <generate-settlements/>
    </template>
  </timeline-item>
</template>
<script>
import TimelineItem from "@/components/global-components/TimelineItem";
import GenerateSettlements from "@/components/pages/contract-timeline/timeline-items/buttons/GenerateSettlements";
export default {
  name: "item-1",
  description: "description",
  mixins: [],
  data() {
    return {};
  },
  components: {GenerateSettlements, TimelineItem },
  props: {},
  watch: {},
  methods: {},
  computed: {},
  mounted() {},
};
</script>