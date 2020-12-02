<template>
  <v-card class="pa-2">
    <v-card-title>
      <app-headline title="Deals" />
      <v-spacer></v-spacer>
      <new-contract-dialog />
    </v-card-title>
    <v-card-text>
      <deals />
    </v-card-text>
  </v-card>
</template>
<script>
import {PATHS} from '@/utils/Enums';
import NewContractVue from '@/components/dialogs/NewContract.vue';
import Deals from '@/components/pages/deals-overview/Table.vue';
export default {
  name: 'deals-overview',
  text: 'Deals',
  path: PATHS.deals,
  description: 'Overview page of all Deals',
  components: {NewContractDialog: NewContractVue, Deals},
};
</script>
