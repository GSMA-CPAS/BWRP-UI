<template>
  <v-container fluid >
    <v-card class="pa-2">
      <v-container fluid>
        <v-row align="center mb-0 pb-0">
          <v-col class="pb-0" cols="2">
            <v-text-field
                v-model="search"
                label="Search"
                class="mx-4"
            ></v-text-field>
          </v-col>
          <v-col class="pb-0 pr-0" cols="5">
            <v-row justify="center" > Inbound</v-row>
            <v-row><v-divider/></v-row>
          </v-col>
          <v-col class="pb-0 pl-0" cols="5">
            <v-row justify="center"> Outbound</v-row>
            <v-row><v-divider/></v-row>
          </v-col>
        </v-row>
        <v-row class="mt-0 pt-0">
          <v-col class="pt-0" cols="12">
            <v-data-table :headers="headers"
                          :items="items"
                          :search="search"
                          hide-default-footer>
              <template #item="{ item }">
                <tr>
                  <td> {{item.service}}</td>
                  <td style="border-right: 1px #e5e5e5 solid"> {{item.unit}}</td>
                  <td> {{parseValue(item.inbound_own_usage)}}</td>
                  <td> {{parseValue(item.inbound_partner_usage)}}</td>
                  <td style="border-right: 1px #e5e5e5 solid"> {{parseValue(item.inbound_discrepancy)}}</td>
                  <td> {{parseValue(item.outbound_own_usage)}}</td>
                  <td> {{parseValue(item.outbound_partner_usage)}}</td>
                  <td> {{parseValue(item.outbound_discrepancy)}}</td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';

export default {
  name: 'UsageDiscrepancySummary',
  description: 'Discrepancies Deal Summary',
  mixins: [timelineMixin],
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
    }
  },
  data() {
    return {
      search: '',
      items: this.$store.state.usage.discrepancies.general_information
    };
  },
};
</script>

<style scoped>

</style>
