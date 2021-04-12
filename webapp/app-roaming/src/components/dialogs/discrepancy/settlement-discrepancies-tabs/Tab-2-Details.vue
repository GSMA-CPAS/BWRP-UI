<template>
  <div class="text-center">
    <v-container>
      <v-row>
        <v-spacer/>
        <app-button label="export table" @click="exportToJSON(exportData)"/>
      </v-row>
      <v-data-table :headers="headers"
                    :items="items"
                    :search="search">
        <template v-slot:top>
          <v-text-field
              v-model="search"
              label="Search"
              class="mx-4"
          ></v-text-field>
        </template>
        <template #item="{ item }">
          <tr :class=discrepanciesFlag(item,flagParam)>
            <td> {{item.service}}</td>
            <td> {{item.unit}}</td>
            <td> {{item.own_usage.toFixed(2)}}</td>
            <td> {{item.partner_usage.toFixed(2)}}</td>
            <td> {{item.delta_usage_abs.toFixed(2)}}</td>
            <td> {{item.delta_usage_percent.toFixed(2)}}</td>
            <td> {{item.own_calculation.toFixed(2)}}</td>
            <td> {{item.partner_calculation.toFixed(2)}}</td>
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
        {text: 'Own Calculation', value: 'own_calculation', align: 'center'},
        {text: 'Partner Calculation', value: 'partner_calculation', align: 'center'},
        {text: 'Delta', value: 'delta_calculation_percent', align: 'center'},
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
