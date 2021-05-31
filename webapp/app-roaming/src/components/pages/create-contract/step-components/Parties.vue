<template>
  <div>
    <row
      type="secondary"
      :label="label"
      :labelExtraClasses="labelExtraClasses"
    />
    <v-divider />
    <v-row>
      <v-col class="primary--text text-uppercase font-weight-medium">
        {{ msps.user }}
      </v-col>
      <v-divider vertical />
      <v-col class="primary--text text-uppercase font-weight-medium">
        {{ msps.partner }}
      </v-col>
    </v-row>
  </div>
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
