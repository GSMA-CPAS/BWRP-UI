<template>
  <v-card class="pa-2">
    <v-card-title>
      <app-headline title="Contracts" />
      <v-spacer></v-spacer>
      <new-contract-dialog />
    </v-card-title>
    <v-card-text>
      <contracts />
    </v-card-text>
  </v-card>
</template>
<script>
import {PATHS} from '@/utils/Enums';
import NewContractVue from '@/components/dialogs/NewContract.vue';
import Contracts from '@/components/pages/contracts-overview/Table.vue';
export default {
  name: 'contracts-overview',
  text: 'Contracts',
  path: PATHS.contracts,
  description: 'Overview page of all Contracts',
  components: {NewContractDialog: NewContractVue, Contracts},
};
</script>
