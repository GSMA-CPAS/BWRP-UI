
<template>
  <v-container v-if="$store.state.document">
    <!--<app-headline :title="`Contract ${name}`" />
    <v-divider />-->
    <v-timeline>
      <Item-1-ContractView />
      <Item-2-Signatures />
      <Item-3-UploadUsage />
      <Item-4-UsageReport v-if="this.isUsageUploaded" :isOwnUsage="true"/>
      <Item-4-UsageReport v-if="this.isUsageSent" />
      <Item-5-Discrepancies :class="{'opacity-0': exists('discrepancies')}" />
      <Item-6-ApproveSettlement
        :class="{'opacity-0': exists('discrepancies')}"
      />
    </v-timeline>
  </v-container>
</template>
<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';
import Item1ContractView from './timeline-items/Item-1-ContractView.vue';
import Item2Signatures from './timeline-items/Item-2-Signatures.vue';
import Item3UploadUsage from './timeline-items/Item-3-UploadUsage';
import Item4UsageReport from './timeline-items/Item-4-UsageReport';
import Item5Discrepancies from './timeline-items/Item-5-Discrepancies.vue';
import Item6ApproveSettlement from './timeline-items/Item-6-ApproveSettlement.vue';
export default {
  components: {
    Item6ApproveSettlement,
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
