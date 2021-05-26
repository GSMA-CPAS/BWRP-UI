<template>
  <div class="text-center">
    <v-container class="pt-0">
      <v-row>
        <v-spacer/>
        <app-button label="export table" @click="exportToJSON(exportData)"/>
      </v-row>
      <v-data-table
                    :items="items"
                    :search="search">
        <template v-slot:top>
          <v-text-field
              v-model="search"
              label="Search"
              class="mx-4"
          ></v-text-field>
        </template>
        <template #header="{ }">
          <thead class="v-data-table-header">
          <tr>
            <th v-for="(h,i) in headers" :key="i" class="text-center td-border-style" :rowspan="h.children?1:2" :colspan="h.children?h.children.length:1">
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
  </div>
</template>
<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';

export default {
  name: 'tab-2',
  label: 'Details',
  mixins: [timelineMixin],
  components: {
  },
  props: {
    isHome: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    headers() {
      return [
        {text: 'Service', value: 'service', align: 'center'},
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
        return this.settlementDiscrepancies.homePerspective.details;
      } else {
        return this.settlementDiscrepancies.partnerPerspective.details;
      }
    }
  },
  data() {
    return {
      search: '',
      flagParam: 'delta_calculation_percent',
      exportData: this.$store.state.settlement.discrepancies
    };
  },
};
</script>
