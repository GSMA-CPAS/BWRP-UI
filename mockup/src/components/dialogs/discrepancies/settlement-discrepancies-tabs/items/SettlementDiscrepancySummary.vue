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
      return [
        {bearer: 'Voice', unit: 'min',own_usage: '16703.125',partner_usage:'16207.138', discrepancy: '495.987',own_calculation_eur: '8351.56', partner_calculation_eur: '8103.569', delta_percentage: '2.969'},
        {bearer: 'SMS', unit: '#',own_usage: '2728.420',partner_usage:'2755.704', discrepancy: '27.284',own_calculation_eur: '1364.210', partner_calculation_eur: '1377.852', delta_percentage: '1.0'},
        {bearer: 'Data', unit: 'MB',own_usage: '334775.750',partner_usage:'334775.750', discrepancy: '-',own_calculation_eur: '167387.875', partner_calculation_eur: '167387.875', delta_percentage: '0'},
      ];
    },
  }
}
</script>

<style scoped>

</style>