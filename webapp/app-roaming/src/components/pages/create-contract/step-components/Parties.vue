<template>
  <fragment>
    <row type="primary" :label="label" :labelExtraClasses="labelExtraClasses"/>
    <v-divider />
    <v-row>
      <row type="primary" :label="msps.user"/>
      <v-divider class="ml-1" vertical />
      <row type="primary" :label="msps.partner"/>
    </v-row>
  </fragment>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
  name: 'parties-row',
  description: 'description',
  props: {label: String, labelExtraClasses: String},
  computed: {
    ...mapGetters('document/new', ['msps']),
  },
};
</script>
