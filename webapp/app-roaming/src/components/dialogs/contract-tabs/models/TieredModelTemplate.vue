<template>
  <v-col>
    <v-row>
      <v-col><b>{{ modelType }}</b></v-col>
      <v-col>{{ data.unit }}</v-col>
      <v-col>{{data.ratingPlan.kind}}</v-col>
      <v-col></v-col>
      <v-col></v-col>
      <v-col><v-icon v-if="inCommitment" color="primary">
        mdi-checkbox-marked-outline
      </v-icon></v-col>
    </v-row>
    <v-divider />
    <v-row
      v-for="({start, fixedPrice, linearPrice}, index) in data.ratingPlan.rate.thresholds"
      :key="index"
    >
      <v-col>Normal</v-col>
      <v-col>{{ `Tier ${index + 1}` }}</v-col>
      <v-col>{{ `${start} ➜ ${(index + 1) === data.ratingPlan.rate.thresholds.length ? 'Unlimited' : data.ratingPlan.rate.thresholds[index+1].start}` }}</v-col>
      <v-col>{{ Number(fixedPrice || 0).toLocaleString() }}</v-col>
      <v-col>{{ Number(linearPrice || 0).toLocaleString() }}</v-col>
      <v-col></v-col>
      <!--<v-col>
        <v-icon v-if="revenueCommitment" color="primary"
          >mdi-checkbox-marked-outline</v-icon
        >
      </v-col>-->
    </v-row>
  </v-col>
</template>

<script>
import {discountModelsMixin} from '@/utils/mixins/component-specfic';
export default {
  name: 'tiered-model-template',
  label: 'Tiered Model Template',
  mixins: [discountModelsMixin],
  props: ['modelType', 'inCommitment']
};
</script>
