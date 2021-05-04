<template>
  <v-container fluid class="ml-8">
    <v-row>
      <v-col>
        <v-row>
          <strong>Term: </strong>
        </v-row>
        <v-row>
          <span> {{ documentData.framework.term.start }}</span
          ><span class="text-wrap">
            - {{ documentData.framework.term.end }}</span
          >
        </v-row>
        <v-row>
          <p />
        </v-row>
        <v-row>
          <strong>ReferenceId:</strong>
        </v-row>
        <v-row>
          <span class="text-wrap"> {{ referenceId }}</span>
        </v-row>
        <v-row>
          <p />
        </v-row>
        <v-row>
          <strong>Partner: </strong>
        </v-row>
        <v-row>
          <span>{{ isHome ? partnerMsp : selfMsp }} </span>
        </v-row>
      </v-col>
      <v-spacer />
      <v-col class="mr-12">
        <v-row>
          <strong>Own TADIGS: </strong>
        </v-row>
        <v-row>
          <span v-for="(ot, index) in selfTadigs" :key="ot">
            <span v-if="index !== selfTadigs.length - 1"> {{ ot }}, </span>
            <span v-if="index === selfTadigs.length - 1">
              {{ ot }}
            </span>
          </span>
        </v-row>
        <v-row>
          <p />
        </v-row>
        <v-row>
          <strong>Partner TADIGS: </strong>
        </v-row>
        <v-row>
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
