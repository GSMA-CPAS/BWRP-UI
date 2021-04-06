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
            <td> {{item.HTMN}}</td>
            <td> {{item.VPMN}}</td>
            <td> {{item.yearMonth}}</td>
            <td> {{item.service}}</td>
            <td> {{item.own_usage.toFixed(2)}}</td>
            <td> {{item.partner_usage.toFixed(2)}}</td>
            <td> {{item.delta_usage_abs.toFixed(2)}}</td>
            <td> {{item.delta_usage_percent.toFixed(2)}}</td>
          </tr>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import AppButton from '@/components/global-components/Button';
import {timelineMixin} from '@/utils/mixins/component-specfic';
export default {
  name: 'tab-2',
  components: {AppButton},
  label: 'Inbound Details',
  description: 'deal details',
  mixins: [timelineMixin],
  computed: {
    headers() {
      return [
        {text: 'HPMN', value: 'HTMN', align: 'center'},
        {text: 'VPMN', value: 'VPMN', align: 'center'},
        {text: 'YearMonth', value: 'yearMonth', align: 'center'},
        {text: 'Service', value: 'service', align: 'center'},
        {text: 'Own usage', value: 'own_usage', align: 'center'},
        {text: 'Partner usage', value: 'partner_usage', align: 'center'},
        {text: 'Delta (abs)', value: 'delta_usage_abs', align: 'center'},
        {text: 'Delta (%)', value: 'delta_usage_percent', align: 'center'},
      ];
    },
    items() {
      return this.usageDiscrepancies.inbound;
    }
  },
  data() {
    return {
      search: '',
      flagParam: 'delta_usage_percent',
      exportData: this.$store.state.usage.discrepancies
    };
  },
};
</script>

<style scoped>
</style>
