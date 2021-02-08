<template>
  <v-col>
    <v-row>
      <v-col><b>{{ modelType }}</b></v-col>
      <v-col>{{ data.unit }}</v-col>
      <v-col>0 ➜ Unlimited </v-col>
      <v-col>{{ Number(data.ratingPlan.rate.fixedPrice || 0).toLocaleString() }}</v-col>
      <v-col>{{ Number(data.ratingPlan.rate.linearPrice || 0).toLocaleString() }}</v-col>
      <v-col><v-icon v-if="inCommitment" color="primary">
        mdi-checkbox-marked-outline
      </v-icon></v-col>
    </v-row>
  </v-col>
</template>

<script>
import {discountModelsMixin} from '@/utils/mixins/component-specfic';
export default {
  name: 'simple-model-template',
  label: 'Simple Model Template',
  mixins: [discountModelsMixin],
  props: ['modelType', 'inCommitment']
};
</script>
