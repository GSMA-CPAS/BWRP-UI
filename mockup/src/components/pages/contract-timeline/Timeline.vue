
<template>
  <v-container>
    <app-headline :title="`Contract ${name}`" />
    <v-divider />
    <v-timeline reverse>
      <Item-1-ContractView/>
      <Item-2-Signatures/>
      <Item-3-UsageReport v-if="contractState >= CONTRACT_STATE.USAGE_REPORT_NOT_UPLOADED" :isHome=true />
      <Item-3-UsageReport v-if="contractState >= CONTRACT_STATE.USAGE_REPORT_SENT" :isHome=false />
      <Item-4-UsageDiscrepancies v-if="contractState >= CONTRACT_STATE.READY_FOR_SETTLEMENT_CALCULATION"/>
      <Item-5-GenerateSettlements v-if="contractState >= CONTRACT_STATE.READY_FOR_SETTLEMENT_CALCULATION"/>
      <Item-6-SettlementDiscrepancies v-if="contractState === CONTRACT_STATE.CALCULATION_COMPLETED" :isHome=true />
      <Item-6-SettlementDiscrepancies v-if="contractState === CONTRACT_STATE.CALCULATION_COMPLETED" :isHome=false />
      <Item-7-SettlementReport v-if="contractState === CONTRACT_STATE.CALCULATION_COMPLETED" />
      <Item-8-DiscrepanciesResult v-if="discrepanciesStatus !== DISCREPANCIES_STATUS.UNDEFINED" />
    </v-timeline>
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import Item1ContractView from './timeline-items/Item-1-ContractView.vue';
import Item2Signatures from './timeline-items/Item-2-Signatures.vue';
import Item3UsageReport from './timeline-items/Item-3-UsageReport.vue';
import Item4UsageDiscrepancies from './timeline-items/Item-4-UsageDiscrepancies';
import Item5GenerateSettlements from './timeline-items/Item-5-GenerateSettlements';
import Item6SettlementDiscrepancies from './timeline-items/Item-6-SettlementDiscrepancies';
import Item7SettlementReport from './timeline-items/Item-7-SettlementReport';
import Item8DiscrepanciesResult from './timeline-items/Item-8-DiscrepanciesResult';
import {timelineMixin} from "@/utils/mixins/component-specfic";
import {CONTRACT_STATE} from "@/utils/Enums";
export default {
  components: {
    Item1ContractView,
    Item2Signatures,
    Item3UsageReport,
    Item4UsageDiscrepancies,
    Item5GenerateSettlements,
    Item6SettlementDiscrepancies,
    Item7SettlementReport,
    Item8DiscrepanciesResult
  },
  name: "timeline",
  description: "Component: Timeline",
  props: {},
  watch: {},
  mixins: [timelineMixin],
  methods: {
    ...mapActions("app-state", ["loadError"]),
  },
  data() {
    return {
      CONTRACT_STATE: CONTRACT_STATE
    };
  },
  computed: {
    ...mapGetters("contract", ["name","isSigned"]),
    timelineItemProps() {
      return {
        color: "transparent",
        class: `hide-dot`,
        large: true,
      };
    },
    // timelineItems() {
    //   const timelineItems = require.context(
    //     "./timeline-items/",
    //     true,
    //     /(Item-)\d-*.*.(vue|js)$/
    //   );
    //   return timelineItems.keys().map((x) => timelineItems(x).default);
    // },
  },
  mounted() {},
  beforeMount() {
    const _cid = this.$route.params.cid;
    this.loadContract(_cid);
    // TODO: REDIRECT to 'Couldn't find.... Page' instead
    !this.name && this.loadError(`Couldn't find contract with id '${_cid}'`);
  },
};
</script>