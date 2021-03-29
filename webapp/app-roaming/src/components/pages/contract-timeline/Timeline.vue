
<template>
  <v-container v-if="$store.state.document">
    <v-timeline>
      <Item-1-ContractView />
      <Item-2-Signatures />
      <Item-3-UploadUsage />
      <Item-4-UsageReport v-if="this.isUsageUploaded" :isOwnUsage="true"/>
      <Item-4-UsageReport v-if="this.isUsageSent" />
      <Item-5-Discrepancies v-if="this.areUsagesExchanged" />
      <Item-6-GenerateSettlement v-if="this.areUsagesExchanged"/>
      <Item-7-SettlementDiscrepancies v-if="this.areSettlementsGenerated" :isHome="true"/>
      <Item-7-SettlementDiscrepancies v-if="this.areSettlementsGenerated"/>
    </v-timeline>
  </v-container>
</template>
<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';
import Item1ContractView from './timeline-items/Item-1-ContractView.vue';
import Item2Signatures from './timeline-items/Item-2-Signatures.vue';
import Item3UploadUsage from './timeline-items/Item-3-UploadUsage';
import Item4UsageReport from './timeline-items/Item-4-UsageReport';
import Item5Discrepancies from './timeline-items/Item-5-UsageDiscrepancies.vue';
import Item6GenerateSettlement from './timeline-items/Item-6-GenerateSettlement.vue';
import Item7SettlementDiscrepancies from './timeline-items/Item-7-SettlementDiscrepancies.vue';
export default {
  components: {
    Item7SettlementDiscrepancies,
    Item6GenerateSettlement,
    Item5Discrepancies,
    Item4UsageReport,
    Item3UploadUsage,
    Item2Signatures,
    Item1ContractView,
  },
  name: 'timeline',
  description: 'Component: Timeline',
  mixins: [timelineMixin],
  created() {
    this.loadData(this.$route.params.cid);
  },
};
</script>
