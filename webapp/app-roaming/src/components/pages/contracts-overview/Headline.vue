<template>
  <v-card-title>
    <app-headline title="Contracts" />
    <v-spacer />
    <new-contract-dialog />
  </v-card-title>
</template>
<script>
import NewContractVue from '@dialogs/NewContract.vue';
export default {
  name: 'contracts-headline',
  description: 'Headling of contracts overview.',
  components: {NewContractDialog: NewContractVue},
};
</script>
