<template>
  <div>
    <v-container>
      <deal-overview :isHome="isHome"/>
      <settlement-discrepancy-summary :isHome="isHome"/>
    </v-container>
  </div>
</template>
<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';
import DealOverview from '@/components/dialogs/discrepancy/items/DealOverview';
import SettlementDiscrepancySummary from '@/components/dialogs/discrepancy/items/SettlementDiscrepancySummary';
export default {
  name: 'tab-1',
  label: 'General Information',
  description:
    'In this tab the general information of a settlement is displayed. The tab is found in the contract timeline when clicking on \'View Settlement\'',
  mixins: [timelineMixin],
  props: {isHome: Boolean},
  components: {
    DealOverview, SettlementDiscrepancySummary
  },
};
</script>
