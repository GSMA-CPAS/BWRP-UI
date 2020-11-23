<template>
  <fragment>
    <v-row v-if="single" align="baseline" class="font-weight-medium">
      <v-col cols="2" />
      <v-divider vertical></v-divider>
      <v-col>
        <v-row class="primary--text text-uppercase">
          <v-col>{{ parties[currentParty] }}</v-col>
          <v-col class="text-center" cols="2">
            <app-button
              label="Switch Party"
              outlined
              @button-pressed="switchPartner"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="{label, key} in subRowLabels" :key="key">{{
            label
          }}</v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="3" />
      <v-divider vertical></v-divider>
      <fragment v-for="(name, index) in parties" :key="name">
        <v-col>
          <row type="primary" :label="name" />
        </v-col>
        <v-divider v-if="index === 0" vertical></v-divider>
      </fragment>
    </v-row>
    <v-divider />
  </fragment>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
  name: 'parties-header',
  description: 'description',
  computed: {...mapGetters('document', ['parties'])},
  data() {
    return {currentParty: 0};
  },
  props: {single: Boolean, subRowLabels: Array},
  methods: {
    switchPartner() {
      this.currentParty = this.currentParty === 0 ? 1 : 0;
      this.$emit('party-switch', this.currentParty);
    },
  },
};
</script>
