<template>
  <fragment>
    <app-dialog title="View Usage Report" label="view usage report">
      <template #content>
        Inbound
<!--        <v-data-table :headers="data.headers" :items="data.outbound.items" >-->
<!--        </v-data-table>Outbound-->
<!--        <v-data-table :headers="data.headers" :items="data.inbound.items" >-->
<!--        </v-data-table>-->
      </template>
    </app-dialog>
  </fragment>
</template>

<script>

import {timelineMixin} from '@/utils/mixins/component-specfic';

export default {
  name: 'UsageReport',
  mixins: [timelineMixin],
  props: {data: Object}
};
</script>

<style scoped>

</style>
