<template>
  <v-container fluid class="ml-8">
    <v-row>
      <v-col cols="4">
        <v-row>
          <span>Term: {{ documentData.framework.term.start }} - {{ documentData.framework.term.end }}</span>
        </v-row>
        <v-row>
          <span>ID: {{ contractId }}</span>
        </v-row>
        <v-row>
          <span>Partner: {{partnerMsp}}</span>
        </v-row>
        <v-row>
          <span>Own TADIGS: </span>
          <span v-for="(ot,index) in selfContractTadigs" :key="ot">
            <span v-if="index !== selfContractTadigs.length - 1">
               {{ot}},
            </span>
            <span v-if="index === selfContractTadigs.length - 1">
               {{ot}}
            </span>
          </span>
        </v-row>
        <v-row>
          <span>Partner TADIGS: </span>
          <span v-for="(pt,index) in partnerContractTadigs" :key="pt">
            <span v-if="index !== partnerContractTadigs.length - 1">
               {{pt}},
            </span>
            <span v-if="index === partnerContractTadigs.length - 1">
               {{pt}}
            </span>
          </span>
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-spacer/>

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
import {timelineMixin} from '@/utils/mixins/component-specfic';

export default {
  name: 'DealOverview',
  mixins: [timelineMixin],
};
</script>

<style scoped>

</style>
