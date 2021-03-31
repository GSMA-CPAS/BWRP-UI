<template>
  <v-container fluid >
    <v-card class="pa-2">
      <v-container fluid>
        <v-data-table
            :headers="headers" :items="items"
          >
          <template #item="{ item }">
            <tr :class=discrepanciesFlag(item,flagParam)>
              <td> {{item.bearer}}</td>
              <td> {{item.unit}}</td>
              <td> {{item.own_usage}}</td>
              <td> {{item.partner_usage}}</td>
              <td> {{item.discrepancy}}</td>
              <td> {{item.own_calculation}}</td>
              <td> {{item.partner_calculation}}</td>
              <td> {{item.delta_calculation_percent}}</td>
            </tr>
          </template>
        </v-data-table>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';

export default {
  name: 'SettlementDiscrepancySummary',
  description: 'Discrepancies Deal Summary',
  props: {
    isHome: {
      type: Boolean,
      default: false
    },
  },
  mixins: [timelineMixin],
  computed: {
    headers() {
      return [
        {text: 'Bearer', value: 'bearer'},
        {text: 'Unit', value: 'unit'},
        {text: 'Own Usage', value: 'own_usage'},
        {text: 'Partner Usage', value: 'partner_usage'},
        {text: 'Discrepancy', value: 'discrepancy'},
        {text: 'Own Calculation', value: 'own_calculation'},
        {text: 'Partner Calculation', value: 'partner_calculation'},
        {text: 'Delta', value: 'delta_calculation_percent'},
      ];
    },
    items() {
      if (this.isHome) {
        return this.settlementDiscrepancies.homePerspective?.general_information;
      } else {
        return this.settlementDiscrepancies.partnerPerspective?.general_information;
      }
    }
  },
  data() {
    return {
      search: '',
      flagParam: 'delta_calculation_percent',
    };
  },
};
</script>

<style scoped>

</style>
