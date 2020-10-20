<template>
  <v-card class="pa-2">
    <v-card-title>
      <app-headline title="Contracts" />
      <v-spacer></v-spacer>
      <new-contract-dialog />
    </v-card-title>
    <v-card-text>
      <contracts-table />
    </v-card-text>
  </v-card>
</template>
<script>
import { PATHS } from "../utils/Enums";
import NewContractVue from "../components/dialogs/NewContract.vue";
import ContractsTable from "../components/pages/contracts-overview/ContractsTable.vue";
export default {
  name: "contracts-overview",
  text: "Contracts",
  path: PATHS.contracts,
  description: "Overview page of all Contracts",
  components: { NewContractDialog: NewContractVue, ContractsTable },
};
</script>