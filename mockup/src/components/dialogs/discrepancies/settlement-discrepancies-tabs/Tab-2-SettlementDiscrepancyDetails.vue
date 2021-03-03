<template>
  <fragment class="text-center">
    <v-container>
      <v-row>
        <v-spacer/>
        <app-button label="export table"/>
      </v-row>
      <v-data-table :headers="headers"
                    :items="items"
                    :search="search"
                    hide-default-footer>
        <template v-slot:top>
          <v-text-field
              v-model="search"
              label="Search"
              class="mx-4"
          ></v-text-field>
        </template>
        <template #item="{ item }">
          <tr :class=discrepanciesFlag(item)>
            <td> {{item.service}}</td>
            <td> {{item.unit}}</td>
            <td> {{item.own_usage}}</td>
            <td> {{item.partner_usage}}</td>
            <td> {{item.delta_abs}}</td>
            <td> {{item.delta_usage_percentage}}</td>
            <td> {{item.own_calculation}}</td>
            <td> {{item.partner_calculation}}</td>
            <td> {{item.delta_percentage}}</td>
          </tr>
        </template>
      </v-data-table>
    </v-container>
  </fragment>
</template>
<script>
import {timelineMixin} from "@/utils/mixins/component-specfic";

export default {
  name: "tab-2",
  label: "Discrepancy Details",
  description: "description",
  mixins: [timelineMixin],
  data(){
    return {
      search: ''
    }
  },
  computed: {
    headers() {
      return [
        {text: 'Service', value: 'service', align: 'center'},
        {text: 'Unit', value: 'unit', align: 'center'},
        {text: 'Own usage', value: 'own_usage', align: 'center'},
        {text: 'Partner usage', value: 'partner_usage', align: 'center'},
        {text: 'Delta (abs)', value: 'delta_abs', align: 'center'},
        {text: 'Delta (%)', value: 'delta_usage_percentage', align: 'center'},
        {text: 'Own calculation', value: 'own_calculation', align: 'center'},
        {text: 'Partner calculation', value: 'partner_calculation', align: 'center'},
        {text: 'Delta (%)', value: 'delta_percentage', align: 'center'},
      ];
    },
    items() {
      return [
        {service: 'MOC Back Home',unit:'min' , own_usage: '6503.125',partner_usage:'6207.138', delta_abs: '295.987', delta_usage_percentage: '16',own_calculation: '9754.68', partner_calculation: '9310.707', delta_percentage: '4.55'},
        {service: 'MOC Local',unit:'min' , own_usage: '2728.42',partner_usage:'2755.704', delta_abs: '27.284', delta_usage_percentage: '1.0',own_calculation: '4092.63', partner_calculation: '4133.55', delta_percentage: '1.0'},
        {service: 'MOC International',unit:'min' , own_usage: '7471.58',partner_usage:'7244.296', delta_abs: '227.284', delta_usage_percentage: '3.04',own_calculation: '11207.37', partner_calculation: '10866.444', delta_percentage: '3.04'},
        {service: 'SMSMO',unit:'SMS' , own_usage: '1255.00',partner_usage:'1350.00', delta_abs: '95.00', delta_usage_percentage: '7.57',own_calculation: '627.50', partner_calculation: '675.00', delta_percentage: '7.57'},
        {service: 'SMSMT',unit:'SMS' , own_usage: '1473.42',partner_usage:'1405.704', delta_abs: '67.716', delta_usage_percentage: '4.59',own_calculation: '736.71', partner_calculation: '702.85', delta_percentage: '4.59'},
        {service: 'VoLTE',unit:'MB' , own_usage: '334775.750',partner_usage:'334775.750', delta_abs: '0.0', delta_usage_percentage: '0',own_calculation: '167387.875', partner_calculation: '167387.875', delta_percentage: '0.0'},
      ];
    },
  }
};
</script>