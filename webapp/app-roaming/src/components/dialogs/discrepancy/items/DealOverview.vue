<template>
  <v-container fluid class="ml-8">
    <v-row>
      <v-col cols="4">
        <v-row>
          <span>Term: {{ documentData.framework.term.start }}</span
          ><span class="text-wrap">
            - {{ documentData.framework.term.end }}</span
          >
        </v-row>
        <v-row>
          <span>ReferenceId:</span
          ><span class="text-wrap"> {{ referenceId }}</span>
        </v-row>
        <v-row>
          <span>Partner: {{ isHome ? partnerMsp : selfMsp }}</span>
        </v-row>
        <v-row>
          <span class="text-wrap">Own TADIGS: </span>
          <span v-for="(ot, index) in selfTadigs" :key="ot">
            <span v-if="index !== selfTadigs.length - 1"> {{ ot }}, </span>
            <span v-if="index === selfTadigs.length - 1">
              {{ ot }}
            </span>
          </span>
        </v-row>
        <v-row>
          <span>Partner TADIGS: </span>
          <span
            class="text-wrap"
            v-for="(pt, index) in partnerTadigs"
            :key="pt"
          >
            <span v-if="index !== partnerTadigs.length - 1"> {{ pt }}, </span>
            <span class="text-wrap" v-if="index === partnerTadigs.length - 1">
              {{ pt }}
            </span>
          </span>
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-spacer />
      </v-col>
      <v-col cols="4">
        <v-row>
          <span>Total revenue commitment: </span>
        </v-row>
        <v-row>
          <span>MOC revenue commitment: </span>
        </v-row>
        <v-row>
          <span>SMS revenue commitment: </span>
        </v-row>
        <v-row>
          <span>Data revenue commitment: </span>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {timelineMixin} from '@mixins/component-specfic';

export default {
  name: 'DealOverview',
  mixins: [timelineMixin],
  props: {isHome: Boolean},
  computed: {
    selfTadigs() {
      if (this.isHome) return this.selfContractTadigs;
      else return this.partnerContractTadigs;
    },
    partnerTadigs() {
      if (this.isHome) return this.partnerContractTadigs;
      else return this.selfContractTadigs;
    },
  },
};
</script>

<style scoped>
</style>
