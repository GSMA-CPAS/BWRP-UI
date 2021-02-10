<template>
  <v-col class="striped-column-container">
    <v-row>
      <v-col class="striped-column"><b>{{ modelType }}</b></v-col>
      <v-col class="striped-column">{{ data.unit }}</v-col>
      <v-col class="striped-column"></v-col>
      <v-col class="striped-column"></v-col>
      <v-col class="striped-column"></v-col>
      <v-col class="striped-column"><v-icon v-if="inCommitment" color="primary">
        mdi-checkbox-marked-outline
      </v-icon></v-col>
    </v-row>
    <v-divider />
    <v-row>
      <v-col class="striped-column">Balanced</v-col>
      <v-col class="striped-column"></v-col>
      <v-col class="striped-column">0 ➜ Unlimited </v-col>
      <v-col class="striped-column">{{ Number(data.ratingPlan.balancedRate.fixedPrice || 0).toLocaleString() }}</v-col>
      <v-col class="striped-column">{{ Number(data.ratingPlan.balancedRate.linearPrice || 0).toLocaleString() }}</v-col>
      <v-col class="striped-column"></v-col>
      <!--<v-col>
        <v-icon v-if="revenueCommitment" color="primary"
          >mdi-checkbox-marked-outline</v-icon
        >
      </v-col>-->
    </v-row>
    <v-divider />
    <v-row>
      <v-col class="striped-column">Unbalanced</v-col>
      <v-col class="striped-column"></v-col>
      <v-col class="striped-column">0 ➜ Unlimited </v-col>
      <v-col class="striped-column">{{ Number(data.ratingPlan.unbalancedRate.fixedPrice || 0).toLocaleString() }}</v-col>
      <v-col class="striped-column">{{ Number(data.ratingPlan.unbalancedRate.linearPrice || 0).toLocaleString() }}</v-col>
      <v-col class="striped-column"></v-col>
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
