<template>
  <fragment>
    <row type="primary" :label="label" />
    <v-divider />
    <v-row>
      <v-col>
        <row type="primary" :label="msps.user" />
      </v-col>
      <v-divider vertical></v-divider>
      <v-col>
        <row type="primary" :label="msps.partner" />
      </v-col>
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
