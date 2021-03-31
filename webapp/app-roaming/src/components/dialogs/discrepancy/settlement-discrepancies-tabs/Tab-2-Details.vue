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
            <td> {{item.own_usage}}</td>
            <td> {{item.partner_usage}}</td>
            <td> {{item.delta_usage_abs}}</td>
            <td> {{item.delta_usage_percent}}</td>
            <td> {{item.own_calculation}}</td>
            <td> {{item.partner_calculation}}</td>
            <td> {{item.delta_calculation_percent}}</td>
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
        {text: 'Service', value: 'service'},
        {text: 'Unit', value: 'unit'},
        {text: 'Own Usage', value: 'own_usage'},
        {text: 'Partner Usage', value: 'partner_usage'},
        {text: 'Delta (abs)', value: 'delta_usage_abs'},
        {text: 'Delta (%)', value: 'delta_usage_percent'},
        {text: 'Own Calculation', value: 'own_calculation'},
        {text: 'Partner Calculation', value: 'partner_calculation'},
        {text: 'Delta', value: 'delta_calculation_percent'},
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
