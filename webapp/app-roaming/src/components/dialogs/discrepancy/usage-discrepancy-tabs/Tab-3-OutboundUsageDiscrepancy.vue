<template>
  <div class="text-center">
    <v-container>
      <v-row>
        <v-spacer />
        <app-button
          class="-1"
          label="export table"
          @click="exportToJSON(exportData)"
        />
      </v-row>
      <v-data-table :headers="headers" :items="items">
        <template v-slot:top>
          <v-text-field
            v-model="search"
            label="Search"
            class="mx-4"
          ></v-text-field>
        </template>
        <template #item="{item}">
          <tr :class="discrepanciesFlag(item, flagParam)">
            <td>{{ item.HTMN }}</td>
            <td>{{ item.VPMN }}</td>
            <td>{{ item.yearMonth }}</td>
            <td>{{ item.service }}</td>
            <td>{{ parseValue(item.own_usage) }}</td>
            <td>{{ parseValue(item.partner_usage) }}</td>
            <td>{{ parseValue(item.delta_usage_abs) }}</td>
            <td>{{ item.delta_usage_percent.toFixed(2) }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import AppButton from '@/components/global-components/Button';
import {timelineMixin} from '@mixins/component-specfic';
export default {
  name: 'tab-3',
  components: {AppButton},
  label: 'Outbound Details',
  description: 'deal details',
  mixins: [timelineMixin],
  computed: {
    headers() {
      return [
        {text: 'HPMN', value: 'HTMN', align: 'center'},
        {text: 'VPMN', value: 'VPMN', align: 'center'},
        {text: 'yearMonth', value: 'yearMonth', align: 'center'},
        {text: 'Service', value: 'service', align: 'center'},
        {text: 'Own usage', value: 'own_usage', align: 'center'},
        {text: 'Partner usage', value: 'partner_usage', align: 'center'},
        {text: 'Delta (abs)', value: 'delta_usage_abs', align: 'center'},
        {text: 'Delta (%)', value: 'delta_usage_percent', align: 'center'},
      ];
    },
    items() {
      return this.usageDiscrepancies.outbound;
    },
  },
  data() {
    return {
      search: '',
      flagParam: 'delta_usage_percent',
      exportData: this.$store.state.usage.discrepancies,
    };
  },
  methods: {},
};
</script>
