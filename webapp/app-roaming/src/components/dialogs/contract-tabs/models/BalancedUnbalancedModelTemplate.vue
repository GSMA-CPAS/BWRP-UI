<template>
  <v-col>
    <v-row>
      <v-col><b>{{ modelType }}</b></v-col>
      <v-col>{{ data.unit }}</v-col>
      <v-col></v-col>
      <v-col></v-col>
      <v-col></v-col>
      <v-col></v-col>
    </v-row>
    <v-divider />
    <v-row
      v-for="({start, fixedPrice, linearPrice}, index) in data.ratingPlan.balancedRate.thresholds"
      :key="`bal-${index}`"
    >
      <v-col>Balanced</v-col>
      <v-col>{{ `Tier ${index + 1}` }}</v-col>
      <v-col>{{ `${start} ➜ ${(index + 1) === data.ratingPlan.balancedRate.thresholds.length ? 'Unlimited' : data.ratingPlan.balancedRate.thresholds[index+1].start}` }}</v-col>
      <v-col>{{ fixedPrice }}</v-col>
      <v-col>{{ linearPrice }}</v-col>
      <v-col></v-col>
      <!--<v-col>
        <v-icon v-if="revenueCommitment" color="primary"
          >mdi-checkbox-marked-outline</v-icon
        >
      </v-col>-->
    </v-row>
    <v-divider />
    <v-row
      v-for="({start, fixedPrice, linearPrice}, index) in data.ratingPlan.unbalancedRate.thresholds"
      :key="`unbal-${index}`"
    >
      <v-col>Unbalanced</v-col>
      <v-col>{{ `Tier ${index + 1}` }}</v-col>
      <v-col>{{ `${start} ➜ ${(index + 1) === data.ratingPlan.unbalancedRate.thresholds.length ? 'Unlimited' : data.ratingPlan.unbalancedRate.thresholds[index+1].start}` }}</v-col>
      <v-col>{{ fixedPrice }}</v-col>
      <v-col>{{ linearPrice }}</v-col>
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
  name: 'balanced-unbalanced-model-template',
  model: 'Balanced Unbalanced Model Template',
  mixins: [discountModelsMixin],
  props: ['modelType']
};
</script>
