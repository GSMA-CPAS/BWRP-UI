<template>
  <v-col>
    <v-row>
      <v-col><b>{{ modelType }}</b></v-col>
      <v-col>{{ data.unit }}</v-col>
      <v-col></v-col>
      <v-col></v-col>
      <v-col></v-col>
      <v-col><v-icon v-if="inCommitment" color="primary">
        mdi-checkbox-marked-outline
      </v-icon></v-col>
    </v-row>
    <v-divider />
    <v-row>
      <v-col>Balanced</v-col>
      <v-col></v-col>
      <v-col>0 ➜ Unlimited </v-col>
      <v-col>{{ Number(data.ratingPlan.balancedRate.fixedPrice || 0).toLocaleString() }}</v-col>
      <v-col>{{ Number(data.ratingPlan.balancedRate.linearPrice || 0).toLocaleString() }}</v-col>
      <v-col></v-col>
      <!--<v-col>
        <v-icon v-if="revenueCommitment" color="primary"
          >mdi-checkbox-marked-outline</v-icon
        >
      </v-col>-->
    </v-row>
    <v-divider />
    <v-row>
      <v-col>Unbalanced</v-col>
      <v-col></v-col>
      <v-col>0 ➜ Unlimited </v-col>
      <v-col>{{ Number(data.ratingPlan.unbalancedRate.fixedPrice || 0).toLocaleString() }}</v-col>
      <v-col>{{ Number(data.ratingPlan.unbalancedRate.linearPrice || 0).toLocaleString() }}</v-col>
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
  props: ['modelType', 'inCommitment']
};
</script>
