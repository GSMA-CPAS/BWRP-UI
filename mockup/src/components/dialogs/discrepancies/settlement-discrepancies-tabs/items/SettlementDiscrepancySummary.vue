<template>
  <v-container fluid >
    <v-card class="pa-2">
      <v-data-table :headers="headers"
                    :items="items"
                    hide-default-footer>
        <template #item="{ item }">
          <tr :class=discrepanciesFlag(item)>
            <td> {{item.bearer}}</td>
            <td> {{item.unit}}</td>
            <td> {{item.own_usage}}</td>
            <td> {{item.partner_usage}}</td>
            <td> {{item.discrepancy}}</td>
            <td> {{item.own_calculation_eur}}</td>
            <td> {{item.partner_calculation_eur}}</td>
            <td> {{item.delta_percentage}}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import {timelineMixin} from "@/utils/mixins/component-specfic";

export default {
  name: "DiscrepancySummary",
  mixins: [timelineMixin],
  props: { isHome: Boolean },
  computed: {
    headers() {
      return [
        {text: 'Bearer', value: 'bearer', align: 'start'},
        {text: 'Unit', value: 'unit', align: 'center'},
        {text: 'Own Usage', value: 'own_usage', align: 'center'},
        {text: 'Partner Usage', value: 'partner_usage', align: 'center'},
        {text: 'Discrepancy', value: 'discrepancy', align: 'center'},
        {text: 'Own calculation (EUR)', value: 'own_calculation_eur', align: 'center'},
        {text: 'Partner calculation (EUR)', value: 'partner_calculation_eur', align: 'center'},
        {text: 'Delta (%)', value: 'delta_percentage', align: 'center'},
      ];
    },
    items() {
      if(this.isHome) {
        return [
          {
            bearer: 'Voice',
            unit: 'min',
            own_usage: '16703.12',
            partner_usage: '16207.13',
            discrepancy: '495.98',
            own_calculation_eur: '8351.56',
            partner_calculation_eur: '8103.56',
            delta_percentage: '2.96'
          },
          {
            bearer: 'SMS',
            unit: '#',
            own_usage: '2728.42',
            partner_usage: '2755.704',
            discrepancy: '27.28',
            own_calculation_eur: '1364.21',
            partner_calculation_eur: '1377.85',
            delta_percentage: '1.0'
          },
          {
            bearer: 'Data',
            unit: 'MB',
            own_usage: '334775.75',
            partner_usage: '334775.75',
            discrepancy: '-',
            own_calculation_eur: '167387.87',
            partner_calculation_eur: '167387.87',
            delta_percentage: '0'
          },
        ];
      } else {
        return [
          {
            bearer: 'Voice',
            unit: 'min',
            own_usage: '8353.12',
            partner_usage: '8107.13',
            discrepancy: '247.01',
            own_calculation_eur: '4153.56',
            partner_calculation_eur: '4051.56',
            delta_percentage: '2.96'
          },
          {
            bearer: 'SMS',
            unit: '#',
            own_usage: '5455.70',
            partner_usage: '5428.42',
            discrepancy: '27.28',
            own_calculation_eur: '2737.85',
            partner_calculation_eur: '2714.21',
            delta_percentage: '1.0'
          },
          {
            bearer: 'Data',
            unit: 'MB',
            own_usage: '224775.75',
            partner_usage: '224775.75',
            discrepancy: '-',
            own_calculation_eur: '117387.87',
            partner_calculation_eur: '117387.87',
            delta_percentage: '0'
          },
        ];
      }
    },
  }
}
</script>

<style scoped>

</style>