<template>
  <div>
    <app-dialog title="View Usage Report" label="view usage report">
      <template #content>
        <strong>Inbound</strong>
        <v-data-table :headers="headers" :items="inbound" :items-per-page="5">
          <template #item="{ item }">
            <tr>
              <td> {{item.yearMonth}}</td>
              <td> {{item.homeTadig}}</td>
              <td> {{item.visitorTadig}}</td>
              <td> {{item.service}}</td>
              <td> {{item.usage}}</td>
              <td> {{item.units}}</td>
              <td> {{item.charges?item.charges:0}}</td>
              <td> {{item.currency}}</td>
            </tr>
          </template>
        </v-data-table>
        <strong>Outbound</strong>
        <v-data-table :headers="headers" :items="outbound" :items-per-page="5">
          <template #item="{ item }">
            <tr>
              <td> {{item.yearMonth}}</td>
              <td> {{item.homeTadig}}</td>
              <td> {{item.visitorTadig}}</td>
              <td> {{item.service}}</td>
              <td> {{item.usage}}</td>
              <td> {{item.units}}</td>
              <td> {{item.charges?item.charges:0}}</td>
              <td> {{item.currency}}</td>
            </tr>
          </template>
        </v-data-table>
      </template>
    </app-dialog>
  </div>
</template>

<script>

import {timelineMixin} from '@/utils/mixins/component-specfic';

export default {
  name: 'UsageReport',
  mixins: [timelineMixin],
  props: {
    isOwnUsage: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    headers() {
      return [
        {text: 'Year/Month', value: 'yearMonth'},
        {text: 'HPMN', value: 'homeTadig'},
        {text: 'VPMN', value: 'visitorTadig'},
        {text: 'Service categorised', value: 'service'},
        {text: 'Usage', value: 'usage'},
        {text: 'Units', value: 'units'},
        {text: 'Charges', value: 'charges'},
        {text: 'Currency', value: 'currency'}
      ];
    },
    inbound() {
      const usage = this.$store.state.usage;
      if (this.isOwnUsage) {
        return usage.ownUsage.body ?
            usage.ownUsage.body.inbound : [];
      } else {
        return usage.partnerUsage.body ?
            usage.partnerUsage.body.inbound : [];
      }
    },
    outbound() {
      const usage = this.$store.state.usage;
      if (this.isOwnUsage) {
        return usage.ownUsage.body ?
            usage.ownUsage.body.outbound : [];
      } else {
        return usage.partnerUsage.body ?
            usage.partnerUsage.body.outbound : [];
      }
    },
  }
};
</script>

<style scoped>

</style>
