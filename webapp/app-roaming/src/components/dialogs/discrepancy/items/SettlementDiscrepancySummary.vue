<template>
  <v-container fluid>
    <v-card class="pa-2">
      <v-container fluid>
        <v-data-table :headers="headers" :items="items" hide-default-footer>
          <template #item="{item}">
            <tr :class="discrepanciesFlag(item, flagParam)">
              <td>{{ item.service }}</td>
              <td>{{ item.unit }}</td>
              <td>{{ parseValue(item.own_usage) }}</td>
              <td>{{ parseValue(item.partner_usage) }}</td>
              <td>{{ parseValue(item.delta_usage_abs) }}</td>
              <td>{{ parseValue(item.delta_usage_percent) }}</td>
              <td>{{ parseValue(item.own_calculation) }}</td>
              <td>{{ parseValue(item.partner_calculation) }}</td>
              <td>{{ parseValue(item.delta_calculation_percent) }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import {timelineMixin} from '@mixins/component-specfic';

export default {
  name: 'SettlementDiscrepancySummary',
  description: 'Discrepancies Deal Summary',
  props: {
    isHome: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [timelineMixin],
  computed: {
    headers() {
      return [
        {text: 'Bearer', value: 'service', align: 'center'},
        {text: 'Unit', value: 'unit', align: 'center'},
        {text: 'Own Usage', value: 'own_usage', align: 'center'},
        {text: 'Partner Usage', value: 'partner_usage', align: 'center'},
        {text: 'Delta (abs)', value: 'delta_usage_abs', align: 'center'},
        {text: 'Delta (%)', value: 'delta_usage_percent', align: 'center'},
        {text: 'Own Calculation', value: 'own_calculation', align: 'center'},
        {
          text: 'Partner Calculation',
          value: 'partner_calculation',
          align: 'center',
        },
        {
          text: 'Delta (%)',
          value: 'delta_calculation_percent',
          align: 'center',
        },
      ];
    },
    items() {
      if (this.isHome) {
        return this.settlementDiscrepancies.homePerspective[
          'general_information'
        ];
      } else {
        return this.settlementDiscrepancies.partnerPerspective[
          'general_information'
        ];
      }
    },
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
