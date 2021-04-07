<template>
  <v-container fluid class="background">
    <v-card class="pa-2">
      <headline />
      <v-card-text>
        <contracts />
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import {PATHS} from '@/utils/Enums';
import Contracts from '@pages/contracts-overview/Table.vue';
import Headline from '@pages/contracts-overview/Headline';
export default {
  name: 'contracts-overview',
  text: 'Contracts',
  path: PATHS.contracts,
  description: 'Overview page of all Contracts',
  components: {Contracts, Headline},
};
</script>
