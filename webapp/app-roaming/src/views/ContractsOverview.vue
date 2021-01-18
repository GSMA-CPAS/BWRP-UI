<template>
  <v-card class="pa-2">
    <headline />
    <v-card-text>
      <contracts />
    </v-card-text>
  </v-card>
</template>
<script>
import {PATHS} from '@/utils/Enums';
import Contracts from '@/components/pages/contracts-overview/Table.vue';
import Headline from '@/components/pages/contracts-overview/Headline';
export default {
  name: 'contracts-overview',
  text: 'Contracts',
  path: PATHS.contracts,
  description: 'Overview page of all Contracts',
  components: {Contracts, Headline},
};
</script>
