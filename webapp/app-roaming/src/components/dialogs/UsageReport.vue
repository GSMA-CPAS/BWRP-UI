<template>
  <fragment>
    <app-dialog title="View Usage Report" label="view usage report">
      <template #content>
        <strong>Inbound</strong>
        <v-data-table :headers="headers" :items="inbound" :items-per-page="5">
        </v-data-table>
        <strong>Outbound</strong>
        <v-data-table :headers="headers" :items="outbound" :items-per-page="5">
        </v-data-table>
      </template>
    </app-dialog>
  </fragment>
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
        {text: 'Year/Month', value: 'yearMonth', align: 'center'},
        {text: 'HPMN', value: 'homeTadig', align: 'center'},
        {text: 'VPMN', value: 'visitorTadig', align: 'center'},
        {text: 'Service categorised', value: 'service', align: 'center'},
        {text: 'Value', value: 'usage', align: 'center'},
        {text: 'Units', value: 'units', align: 'center'},
        {text: 'Currency ??', value: 'currency', align: 'center'}
      ];
    },
    inbound() {
      const document = this.$store.state.document;
      if (this.isOwnUsage) {
        return document.usage.body ?
            document.usage.body.inbound : [];
      } else {
        return document.partnerUsage.body ?
            document.partnerUsage.body.inbound : [];
      }
    },
    outbound() {
      const document = this.$store.state.document;
      if (this.isOwnUsage) {
        return document.usage.body ?
            document.usage.body.outbound : [];
      } else {
        return document.partnerUsage.body ?
            document.partnerUsage.body.outbound : [];
      }
    },
  }
};
</script>

<style scoped>

</style>
