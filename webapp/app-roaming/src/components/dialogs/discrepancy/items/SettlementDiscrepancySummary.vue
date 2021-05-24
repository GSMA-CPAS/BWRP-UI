<template>
  <v-container fluid >
    <v-card class="pa-2">
      <v-container fluid class="pt-0">
        <v-data-table
            :items="items" hide-default-footer
        >
          <template #header="{ }">
            <thead class="v-data-table-header">
            <tr>
              <th v-for="(h,i) in headers" :key="i" class="text-wrap td-border-style" :rowspan="h.children?1:2" :colspan="h.children?h.children.length:1">
                {{ h.text }}
                <span v-if="h.subText">
                  <br/>
                  {{h.subText}}
                </span>
              </th>
            </tr>
            </thead>
          </template>
          <template #item="{ item }">
            <tr :class=discrepanciesFlag(item,flagParam)>
              <td> {{item.service}}</td>
              <td> {{item.unit}}</td>
              <td> {{parseValue(item.own_usage)}}</td>
              <td> {{parseValue(item.partner_usage)}}</td>
              <td> {{parseValue(item.delta_usage_abs)}}</td>
              <td> {{item.delta_usage_percent.toFixed(2)}}</td>
              <td> {{parseValue(item.own_calculation)}}</td>
              <td> {{parseValue(item.partner_calculation)}}</td>
              <td> {{item.delta_calculation_percent.toFixed(2)}}</td>
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
        {text: 'Bearer', value: 'service', align: 'center'},
        {text: 'Unit', value: 'unit', align: 'center'},
        {text: 'Own Usage', value: 'own_usage', align: 'center'},
        {text: 'Partner Usage', value: 'partner_usage', align: 'center'},
        {text: 'Delta (abs)', value: 'delta_usage_abs', align: 'center'},
        {text: 'Delta (%)', value: 'delta_usage_percent', align: 'center'},
        {text: 'Own Calculation', subText: '(post commitment)', value: 'own_calculation', align: 'center'},
        {text: 'Partner Calculation', subText: '(post commitment)', value: 'partner_calculation', align: 'center'},
        {text: 'Delta (%)', value: 'delta_calculation_percent', align: 'center'},
      ];
    },
    items() {
      if (this.isHome) {
        return this.settlementDiscrepancies.homePerspective['general_information'];
      } else {
        return this.settlementDiscrepancies.partnerPerspective['general_information'];
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
