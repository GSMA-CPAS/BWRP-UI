<template>
  <timeline-item>
    <template #content>

    </template>
    <template #icon>
      <usage-discrepancies/>
    </template>
  </timeline-item>
</template>
<script>
import UploadSettlementVue from "../../../dialogs/UploadUsageReport.vue";
import TimelineItem from "@/components/global-components/TimelineItem";
import UsageDiscrepancies from "@/components/dialogs/discrepancies/UsageDiscrepancies";
export default {
  name: "item-1",
  description: "description",
  button: UploadSettlementVue,
  mixins: [],
  data() {
    return {};
  },
  components: {
    TimelineItem,
    UsageDiscrepancies
  },
  props: {},
  watch: {},
  methods: {},
  computed: {},
  mounted() {},
};
</script>