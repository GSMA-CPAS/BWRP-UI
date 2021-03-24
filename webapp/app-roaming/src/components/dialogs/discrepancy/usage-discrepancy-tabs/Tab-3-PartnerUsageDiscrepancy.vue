<template>
  <fragment class="text-center">
    <v-container>
      <v-row>
        <v-spacer/>
        <app-button class="-1" label="export table"/>
      </v-row>
      <v-data-table :headers="headers"
                    :items="items">
        <template v-slot:top>
          <v-text-field
              v-model="search"
              label="Search"
              class="mx-4"
          ></v-text-field>
        </template>
        <template #item="{ item }">
          <tr :class=discrepanciesFlag(item)>
            <td> {{item.HTMN}}</td>
            <td> {{item.VPMN}}</td>
            <td> {{item.yearMonth}}</td>
            <td> {{item.service}}</td>
            <td> {{item.own_usage}}</td>
            <td> {{item.partner_usage}}</td>
            <td> {{item.delta_usage_abs}}</td>
            <td> {{item.delta_usage_percent}}</td>
          </tr>
        </template>
      </v-data-table>
    </v-container>
  </fragment>
</template>

<script>
import AppButton from '@/components/global-components/Button';
import {timelineMixin} from '@/utils/mixins/component-specfic';
export default {
  name: 'tab-3',
  components: {AppButton},
  label: 'Outbound Details',
  description: 'deal details',
  mixins: [timelineMixin],
  computed: {
    headers() {
      return [
        {text: 'HPMN', value: 'HTMN'},
        {text: 'VPMN', value: 'VPMN'},
        {text: 'yearMonth', value: 'yearMonth'},
        {text: 'Service', value: 'service'},
        {text: 'Own usage', value: 'own_usage'},
        {text: 'Partner usage', value: 'partner_usage'},
        {text: 'Delta (abs)', value: 'delta_usage_abs'},
        {text: 'Delta (%)', value: 'delta_usage_percent'},
      ];
    }
  },
  data() {
    return {
      search: '',
      items: this.$store.state.usage.discrepancies.outbound
    };
  },
  methods: {

  }
};
</script>
