<template>
  <v-container fluid >
    <v-card class="pa-2">
      <v-container fluid>
        <v-row align="center">
          <v-col cols="2">
            <v-text-field
                v-model="search"
                label="Search"
                class="mx-4"
            ></v-text-field>
          </v-col>
          <v-col cols="5">

            <v-row justify="center" > Inbound</v-row>
            <v-row><v-divider/></v-row>
          </v-col>
          <v-col cols="5">

            <v-row justify="center"> Outbound</v-row>
            <v-row><v-divider/></v-row>
          </v-col>
        </v-row>
        <v-row class="mt-0 pt-0">
          <v-col cols="12">
            <v-row> <br/></v-row>
            <v-data-table :headers="headers"
                          :items="items"
                          :search="search"
                          hide-default-footer>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'discrepancies-deal-summary',
  description: 'Discrepancies Deal Summary',
  computed: {
    headers() {
      return [
        {text: 'Service', value: 'service', sortable: false, align: 'start'},
        {text: 'Unit', value: 'unit', sortable: false, align: 'center'},
        {text: 'Own Usage', value: 'inbound_own_usage', sortable: false, align: 'center'},
        {text: 'Partner Usage', value: 'inbound_partner_usage', sortable: false, align: 'center'},
        {text: 'Discrepancy', value: 'inbound_discrepancy', sortable: false, align: 'center'},
        {text: 'Own Usage', value: 'outbound_own_usage', sortable: false, align: 'center'},
        {text: 'Partner Usage', value: 'outbound_partner_usage', sortable: false, align: 'center'},
        {text: 'Discrepancy', value: 'outbound_discrepancy', sortable: false, align: 'center'},
      ];
    },
    items() {
      return [
        {service: 'MOC', unit: 'min',inbound_own_usage: '843.39',inbound_partner_usage: '768.64',inbound_discrepancy: '74.75',outbound_own_usage: '575.39',outbound_partner_usage: '592.211',outbound_discrepancy: '16.821'},
        {service: 'MTC', unit: 'min',inbound_own_usage: '14548.910',inbound_partner_usage: '14985.377',inbound_discrepancy: '436.467',outbound_own_usage: '14548.910',outbound_partner_usage: '14548.910',outbound_discrepancy: '-'},
        {service: 'SMS', unit: '#',inbound_own_usage: '2728.420',inbound_partner_usage: '2864.841',inbound_discrepancy: '136.421',outbound_own_usage: '2728.420',outbound_partner_usage: '2755.704',outbound_discrepancy: '27.284'},
        {service: 'Data', unit: 'MB',inbound_own_usage: '334775.750',inbound_partner_usage: '334809.227',inbound_discrepancy: '33.478',outbound_own_usage: '334775.750',outbound_partner_usage: '334775.750',outbound_discrepancy: '-'},
        {service: 'Data', unit: 'IMSIs',inbound_own_usage: '4556.345',inbound_partner_usage: '4647.472',inbound_discrepancy: '91.127',outbound_own_usage: '-',outbound_partner_usage: '-',outbound_discrepancy: '-'},
      ];
    },
  },
  data(){
    return {
      search: ''
    }
  },
  methods: {

  }
};
</script>
