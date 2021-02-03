<template>
  <fragment>
    <row type="primary" :label="label" />
    <v-divider />
    <v-row>
      <row type="primary" :label="msps.user" />
      <v-divider class="ml-1" vertical />
      <row type="primary" :label="msps.partner" />
    </v-row>
  </fragment>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
  name: 'parties-row',
  description: 'description',
  props: {label: String},
  computed: {
    ...mapGetters('document/new', ['msps']),
  },
};
</script>
