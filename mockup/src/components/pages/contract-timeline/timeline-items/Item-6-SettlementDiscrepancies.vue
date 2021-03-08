<template>
  <timeline-item>
    <template #content>
      <v-card color="#fafafa">
        <v-card-text>
          <div>SETTLEMENT GENERATED on {date}</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <ul/>
          <settlement-discrepancies :isHome="isHome"/>
        </v-card-actions>
      </v-card>
    </template>
    <template #icon>
      <v-icon color="primary" x-large>mdi-check-circle-outline</v-icon>
    </template>
  </timeline-item>
</template>
<script>
import ApproveVue from "./buttons/Approve.vue";
import {timelineMixin} from "@/utils/mixins/component-specfic";
import TimelineItem from "@/components/global-components/TimelineItem";
import SettlementDiscrepancies from "@/components/dialogs/discrepancies/SettlementDiscrepancies";
export default {
  name: "item-1",
  button: ApproveVue,
  description: "description",
  mixins: [timelineMixin],
  data() {
    return { active: false };
  },
  components: {TimelineItem, SettlementDiscrepancies},
  props: { isHome: Boolean },
  watch: {},
  methods: {},
  computed: {},
  mounted() {},
};
</script>